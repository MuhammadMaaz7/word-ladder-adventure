from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from word_ladder.models import GameStartRequest, MoveRequest, HintRequest, GameResponse, MoveResponse, HintResponse
from word_ladder.graph import buildGraph, pathExists, addAllTransformations, precompute_transformations
from word_ladder.algorithms import UCS, GBFS, Astar, hintSequence
from word_ladder.utils import ValidWord, calculateScore
from functools import lru_cache
from uuid import uuid4
import random
import logging

# Add logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Add this near the top of the file (with other utility functions)
@lru_cache(maxsize=100)
def get_cached_transformations(word_length: int):
    """Cache transformations by word length"""
    filtered_words = [word for word in WORDS_LIST if len(word) == word_length]
    return precompute_transformations(filtered_words)


app = FastAPI()

# Configure CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://word-ladder-adventure-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load word dictionary
with open("words_alpha.txt", "r") as file:
    WORDS_LIST = set(file.read().splitlines())

# Game data store (in-memory for simplicity)
game_graphs = {}
active_sessions = {}

# Word pair collections for different difficulty levels
BEGINNER_WORDS = [("cat", "dog"), ("lead", "gold"), ("ruby", "code"), ("warm", "cold"), ("cap", "mop"),
                 ("line","cake"), ("head","tail"), ("star","moon"), ("book","read"), ("pen","ink")]

INTERMEDIATE_WORDS = [("stone","money"), ("ladder","better"), ("cross","river"), ("wheat","bread"), 
                      ("apple","mango"), ("blue","pink"), ("work","team"), ("drink","eight")]

# INTERMEDIATE_WORDS = [("blue","pink")]

ADVANCED_WORDS = BEGINNER_WORDS + INTERMEDIATE_WORDS

# Cache size can be adjusted based on memory constraints
@lru_cache(maxsize=100)
def get_cached_graph(startWord: str, endWord: str, word_length: int) -> dict:
    """Cache graphs based on start/end words and word length"""
    filtered_dict = [word for word in WORDS_LIST if len(word) == word_length]
    logger.info(f"Building graph for {startWord}->{endWord}")
    return buildGraph(startWord, endWord, filtered_dict, 5)

# app.get("/")
# async def health_check():
#     return JSONResponse(content={"message": "The Word Ladder API is running!"})

@app.get("/")
def home():
    return {"message": "Word Ladder API is up"}


@app.post("/api/start-game", response_model=GameResponse)
async def start_game(request: GameStartRequest):
    # Validate game type
    if request.gameType not in ["challenge", "custom"]:
        raise HTTPException(status_code=400, detail="Invalid game type")

    # Initialize variables
    startWord = ""
    endWord = ""
    movesLimit = 10
    bannedWords = []
    
    
    # Set game parameters
    if request.gameType == "challenge":
        word_pairs = []
        if request.gameMode == "beginner":
            word_pairs = BEGINNER_WORDS.copy()
            movesLimit = 5
        elif request.gameMode == "intermediate":
            word_pairs = INTERMEDIATE_WORDS.copy()
            movesLimit = 7
        elif request.gameMode == "advanced":
            word_pairs = ADVANCED_WORDS.copy()
            movesLimit = 10
        else:
            raise HTTPException(status_code=400, detail="Invalid game mode")
        
        # Try up to 5 different word pairs to find one with a valid path
        max_attempts = 5
        attempts = 0
        graph = None
        
        while attempts < max_attempts and word_pairs:
            startWord, endWord = random.choice(word_pairs)
            word_pairs.remove((startWord, endWord))  # Remove this pair so we don't try it again
            
            # Filter dictionary
            filtered_dict = [word for word in WORDS_LIST if len(word) == len(startWord)]
            
            # Build or retrieve cached graph
            graph = get_cached_graph(startWord, endWord, len(startWord))
            if graph is not None and pathExists(startWord, endWord, graph):
                break
            attempts += 1
            graph = None
        
        if graph is None:
            raise HTTPException(status_code=400, detail="Could not find a valid word pair after multiple attempts")
    else:  # Custom game
        if not request.startWord or not request.endWord:
            raise HTTPException(status_code=400, detail="Start and end words required")
        
        startWord = request.startWord.lower()
        endWord = request.endWord.lower()
        
        # Validation
        if not ValidWord(startWord, WORDS_LIST) or not ValidWord(endWord, WORDS_LIST):
            raise HTTPException(status_code=400, detail="Invalid words in dictionary")
        if len(startWord) != len(endWord):
            raise HTTPException(status_code=400, detail="Word lengths must match")
        if startWord == endWord:
            raise HTTPException(status_code=400, detail="Start and end words must differ")

    # Filter dictionary
    filtered_dict = [word for word in WORDS_LIST if len(word) == len(startWord)]
    
    # Advanced mode banned words
    if request.gameMode == "advanced":
        filtered_dict_without_start_end = [w for w in filtered_dict if w not in [startWord, endWord]]
        bannedWords = random.sample(filtered_dict_without_start_end, k=min(10, len(filtered_dict_without_start_end)))
        filtered_dict = [w for w in filtered_dict if w not in bannedWords] + [startWord, endWord]

    # Build or retrieve cached graph
    graph = get_cached_graph(startWord, endWord, len(startWord))
    if graph is None or not pathExists(startWord, endWord, graph):
        raise HTTPException(status_code=400, detail="No valid path exists")

    # Calculate optimal path
    optimal_path = Astar(startWord, endWord, graph)
    optimal_moves = len(optimal_path) - 1 if optimal_path else 0  # Subtract 1 for steps (not nodes)

    # Create session
    session_id = str(uuid4())
    active_sessions[session_id] = {
        "start_word": startWord,
        "end_word": endWord,
        "current_word": startWord,
        "moves_used": 0,
        "hints_used": 0,
        "banned_words": bannedWords,
        "optimal_moves": optimal_moves
    }

    return GameResponse(
        startWord=startWord,
        endWord=endWord,
        movesLimit=movesLimit,
        validMoves=[action[0] for action in graph[startWord].actions],
        bannedWords=bannedWords,
        optimalMoves=optimal_moves,
        sessionId=session_id,  # Must match exactly with model field name
        optimalPath=optimal_path
    )
    
@app.post("/api/make-move", response_model=MoveResponse)
async def make_move(request: MoveRequest):
    # Validate session
    if not request.session_id or request.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[request.session_id]
    
    # Validate current word
    if request.currentWord != session["current_word"]:
        raise HTTPException(
            status_code=400,
            detail="Your current word doesn't match the game state. Please refresh the page."
        )

    # Check if next word is same as current word
    if request.nextWord == session["current_word"]:
        raise HTTPException(
            status_code=400,
            detail="You can't stay on the same word. Please change one letter to form a new valid word."
        )

    # Get or build graph
    # Get or build graph and transformations
    graph_key = f"{session['start_word']}-{session['end_word']}"
    if graph_key not in game_graphs:
        filtered_dict = [w for w in WORDS_LIST if len(w) == len(session['start_word'])]
        transformations = precompute_transformations(filtered_dict)
        graph = buildGraph(session['start_word'], session['end_word'], filtered_dict, 5)
        if not graph:
            raise HTTPException(status_code=500, detail="Game error - please start a new game")
        game_graphs[graph_key] = (graph, transformations)  # Store both graph and transformations
    else:
        graph, transformations = game_graphs[graph_key]


    # Validate word exists in dictionary
    if request.nextWord not in WORDS_LIST:
        raise HTTPException(
            status_code=400,
            detail=f"'{request.nextWord}' is not a valid English word. Please try again."
        )

    # Validate move is valid transformation
    valid_moves = [action[0] for action in graph[session["current_word"]].actions]
    if request.nextWord not in valid_moves:
        # Check if word length matches
        if len(request.nextWord) != len(session["current_word"]):
            detail = "Word length must stay the same. Please change exactly one letter."
        else:
            # Count how many letters differ
            diff_count = sum(1 for a, b in zip(request.nextWord, session["current_word"]) if a != b)
            if diff_count > 1:
                detail = "You can only change one letter at a time. Please try again."
            else:
                detail = f"'{request.nextWord}' isn't a valid transformation. Valid moves change one letter to form another word."
        
        raise HTTPException(
            status_code=400,
            detail=detail
        )

    # Update session
    session["moves_used"] += 1
    session["current_word"] = request.nextWord

    # Prepare response
    response_data = {"validMoves": []}
    
    # Check for win condition
    if request.nextWord == session["end_word"]:
        response_data["score"] = calculateScore(
            session["moves_used"],
            session["optimal_moves"],
            session["hints_used"]
        )
    else:
        # Get next valid moves
        if request.nextWord not in graph or not graph[request.nextWord].actions:
            filtered_words = [w for w in WORDS_LIST if len(w) == len(request.nextWord)]
            transformations = get_cached_transformations(len(request.nextWord))
            addAllTransformations(
                request.nextWord,
                session["end_word"],
                filtered_words,
                graph,
                transformations
            )

        response_data["validMoves"] = [action[0] for action in graph[request.nextWord].actions]

    return MoveResponse(**response_data)

@app.post("/api/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    # Validate session
    if not request.session_id or request.session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[request.session_id]
    
    # Validate current word
    if request.currentWord != session["current_word"]:
        raise HTTPException(status_code=400, detail="Current word doesn't match session")

    # Get graph - modified to handle the tuple storage
    graph_key = f"{session['start_word']}-{session['end_word']}"
    if graph_key not in game_graphs:
        filtered_dict = [w for w in WORDS_LIST if len(w) == len(session['start_word'])]
        transformations = precompute_transformations(filtered_dict)
        graph = buildGraph(session['start_word'], session['end_word'], filtered_dict, 5)
        if not graph:
            raise HTTPException(status_code=500, detail="Failed to build game graph")
        game_graphs[graph_key] = (graph, transformations)
    else:
        graph, _ = game_graphs[graph_key]  # Unpack the tuple, ignore transformations for hints

    # Track hint usage
    session["hints_used"] += 1

    # Get hint path
    hint_path = None
    try:
        if request.algorithm == "ucs":
            path = UCS(request.currentWord, session["end_word"], graph)
            hint_path = hintSequence(graph, session["end_word"], request.currentWord) if path else None
        elif request.algorithm == "gbfs":
            hint_path = GBFS(request.currentWord, session["end_word"], graph)
        elif request.algorithm == "astar":
            path = Astar(request.currentWord, session["end_word"], graph)
            hint_path = hintSequence(graph, session["end_word"], request.currentWord) if path else None
        else:
            raise HTTPException(status_code=400, detail="Invalid algorithm")
    except Exception as e:
        logger.error(f"Hint generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Hint generation failed")

    if not hint_path:
        raise HTTPException(status_code=404, detail="No hint available")

    return HintResponse(
        hint=hint_path[0] if hint_path else request.currentWord,  # Fallback to current word if no hint
        remainingSteps=len(hint_path)
    )
        
# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    