# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List, Optional, Dict, Any
# import random
# import math
# from collections import deque
# from queue import PriorityQueue
# import networkx as nx

# # Import the Node class from your game.py
# class Node:
#     def __init__(self, word, parent=None, actions=None, heuristic_cost=0, path_cost=0):
#         self.word = word
#         self.parent = parent
#         self.actions = actions if actions is not None else []
#         self.heuristic_cost = heuristic_cost
#         self.path_cost = path_cost

# app = FastAPI()

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, replace with your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load word dictionary
# with open("words_alpha.txt", "r") as file:
#     WORDS_LIST = file.read().split("\n")

# # Game logic functions (copied from your game.py)
# def ValidWord(input, wordsList):
#     for word in wordsList:
#         if input == word:
#             return True
#     return False

# def compare(input, similar):
#     if len(input) != len(similar):
#         return False
    
#     transformationCount = 0 
#     for i in range(len(input)):
#         if(input[i] != similar[i]):
#             transformationCount+=1
    
#     if transformationCount==1:
#         return True
#     return False

# def addAllTransformations(currentWord, endWord, wordsList, graph):
#     for word in wordsList:
#         if compare(currentWord, word):
#             cost = 1
#             heuristicCost = getHeuristic(word, endWord)
#             if word not in graph:
#                 graph[word] = Node(word, currentWord, [], heuristicCost)
            
#             if word not in [action[0] for action in graph[currentWord].actions]:
#                 graph[currentWord].actions.append((word, cost))

# def buildGraph(startWord, endWord, wordsList, depthLimit): 
#     heuristicCost = getHeuristic(startWord, endWord)
#     graph = {startWord: Node(startWord, None, [], heuristicCost, 0)}
#     queue = deque([(startWord, 0)]) 
#     explored = []

#     while queue:
#         currentWord, currentDepth = queue.popleft()
        
#         if currentDepth > depthLimit:
#             return None
        
#         if currentWord not in explored:
#             if currentWord not in graph:
#                 graph[currentWord] = Node(currentWord, None)
                
#             addAllTransformations(currentWord, endWord, wordsList, graph)
        
#             for action, cost in graph[currentWord].actions:
#                 if action not in explored:
#                     queue.append((action, currentDepth + 1))
                
#             explored.append(currentWord)
            
#         if endWord in explored:
#             return graph
            
#     return graph

# def pathExists(startWord, endWord, graph):
#     explored = set()
#     queue = deque([startWord])
#     while queue:
#         word = queue.popleft()
#         if word == endWord:
#             return True
#         explored.add(word)
        
#         for action, cost in graph[word].actions:
#             if action not in explored:
#                 explored.add(action)
#                 queue.append(action)
                
#     return False

# def getHeuristic(word, goalWord):
#     transformationCount = 0 
    
#     for i in range(len(word)):
#         if(word[i] != goalWord[i]):
#             transformationCount+=1
            
#     return transformationCount

# def actionSequence(graph, goalState, initialState):
#     solution = [goalState]
#     currentParent = graph[goalState].parent
#     while currentParent is not initialState:
#         solution.append(currentParent)
#         currentParent = graph[currentParent].parent
#     solution.reverse()
#     return solution

# def findMin(frontier):
#     minPathCost = math.inf
#     node = ''
#     for i in frontier:
#         if minPathCost > frontier[i][1]:
#             minPathCost = frontier[i][1]
#             node = i
#     return node

# def UCS(startWord, endWord, graph):
#     if startWord in graph and endWord in graph:
#         initialState = startWord
#         goalState = endWord

#         frontier = {}
#         explored = []

#         frontier[initialState] = (None, 0)

#         while frontier:
#             currentNode = findMin(frontier)
#             del frontier[currentNode]

#             if graph[currentNode].word == goalState:
#                 return actionSequence(graph, goalState, initialState)

#             explored.append(currentNode)
#             for action in graph[currentNode].actions:
#                 currentCost = action[1] + graph[currentNode].path_cost

#                 if action[0] not in frontier and action[0] not in explored:
#                     graph[action[0]].parent = currentNode
#                     graph[action[0]].path_cost = currentCost
#                     frontier[action[0]] = (graph[action[0]].parent, graph[action[0]].path_cost)
#                 elif action[0] in frontier:
#                     if frontier[action[0]][1] < currentCost:
#                         graph[action[0]].parent = frontier[action[0]][0]
#                         graph[action[0]].path_cost = frontier[action[0]][1]
#                     else:
#                         frontier[action[0]] = (currentNode, currentCost)
#                         graph[action[0]].parent = currentNode
#                         graph[action[0]].path_cost = currentCost

# def Astar(startWord, endWord, graph):
#     if startWord in graph and endWord in graph:
#         initialState = startWord
#         goalState = endWord

#         frontier = {}
#         explored = {}

#         frontier[initialState] = (None, graph[initialState].heuristic_cost)

#         while frontier:
#             currentNode = findMin(frontier)
#             del frontier[currentNode]

#             if graph[currentNode].word == goalState:
#                 return actionSequence(graph, goalState, initialState)

#             # calculating total cost
#             currentCost = graph[currentNode].path_cost
#             heuristicCost = graph[currentNode].heuristic_cost
#             explored[currentNode] = (graph[currentNode].parent, heuristicCost + currentCost)

#             # Explore child nodes for cost
#             for child in graph[currentNode].actions:
#                 currentCost = child[1] + graph[currentNode].path_cost
#                 heuristicCost = graph[child[0]].heuristic_cost

#                 # if already looked at or initial state or cost lesser than current, continue
#                 if child[0] in explored:
#                     if graph[child[0]].parent == currentNode or child[0] == initialState or \
#                         explored[child[0]][1] <= currentCost + heuristicCost:
#                         continue

#                 # if not in frontier - add to it
#                 if child[0] not in frontier:
#                     graph[child[0]].parent = currentNode
#                     graph[child[0]].path_cost = currentCost
#                     frontier[child[0]] = (graph[child[0]].parent, currentCost + heuristicCost)

#                 # if in frontier - check cost
#                 else:
#                     #if cost is lesser - update graph with frontier
#                     if frontier[child[0]][1] < currentCost + heuristicCost:
#                         graph[child[0]].parent = frontier[child[0]][0]
#                         graph[child[0]].path_cost = frontier[child[0]][1] - heuristicCost

#                     # if cost is higher - update graph with current cost
#                     else:
#                         frontier[child[0]] = (currentNode, currentCost + heuristicCost)
#                         graph[child[0]].parent = frontier[child[0]][0]
#                         graph[child[0]].path_cost = currentCost

# def GBFS(startWord, endWord, graph):
#     currentNode = graph[startWord]
#     queue = PriorityQueue()
#     explored = set()
#     queue.put((currentNode.heuristic_cost, currentNode.word, []))
    
#     while not queue.empty():
#         heuristic, currentWord, path = queue.get()
        
#         if currentWord == endWord:
#             return path
        
#         if currentWord in explored:
#             continue
        
#         explored.add(currentWord)
        
#         for action, _ in graph[currentWord].actions:
#             if action not in explored:
#                 queue.put((graph[action].heuristic_cost, action, path + [action]))
                    
#     return None

# def calculateScore(movesTaken, optimalMoves, hintsUsed):
#     maxScore = 100
#     penaltyPerExtraMove = 10
#     penaltyPerHint = 5
#     extraMoves = max(0, movesTaken - optimalMoves)
#     score = max(0, maxScore - (extraMoves * penaltyPerExtraMove) - (hintsUsed * penaltyPerHint))
    
#     return score

# # API Models
# class GameStartRequest(BaseModel):
#     gameMode: str
#     gameType: str
#     startWord: Optional[str] = None
#     endWord: Optional[str] = None

# class MoveRequest(BaseModel):
#     currentWord: str
#     nextWord: str
#     endWord: str

# class HintRequest(BaseModel):
#     currentWord: str
#     endWord: str
#     algorithm: str

# class GameResponse(BaseModel):
#     startWord: str
#     endWord: str
#     movesLimit: int
#     validMoves: List[str]
#     bannedWords: List[str]
#     optimalMoves: int

# class MoveResponse(BaseModel):
#     validMoves: List[str]
#     score: Optional[int] = None

# class HintResponse(BaseModel):
#     hint: str

# # Game data store (in-memory for simplicity)
# game_graphs = {}

# # Word pair collections for different difficulty levels
# BEGINNER_WORDS = [("cat", "dog"), ("lead", "gold"), ("ruby", "code"), ("warm", "cold"), ("cap", "mop"),
#                  ("line","cake"), ("head","tail"), ("star","moon"), ("book","read"), ("pen","ink")]

# INTERMEDIATE_WORDS = [("stone","money"), ("ladder","better"), ("cross","river"), ("wheat","bread"), 
#                       ("apple","mango"), ("blue","pink"), ("work","team"), ("drink","eight")]

# ADVANCED_WORDS = BEGINNER_WORDS + INTERMEDIATE_WORDS

# # API Endpoints
# @app.post("/api/start-game", response_model=GameResponse)
# async def start_game(request: GameStartRequest):
#     startWord = ""
#     endWord = ""
#     movesLimit = 10
#     bannedWords = []
    
#     # Set game parameters based on mode
#     if request.gameType == "challenge":
#         if request.gameMode == "beginner":
#             startWord, endWord = random.choice(BEGINNER_WORDS)
#             movesLimit = 5
#         elif request.gameMode == "intermediate":
#             startWord, endWord = random.choice(INTERMEDIATE_WORDS)
#             movesLimit = 7
#         elif request.gameMode == "advanced":
#             startWord, endWord = random.choice(ADVANCED_WORDS)
#             movesLimit = 10
#     else:
#         # Custom words
#         if not request.startWord or not request.endWord:
#             raise HTTPException(status_code=400, detail="Start and end words are required for custom game")
        
#         startWord = request.startWord
#         endWord = request.endWord
        
#         # Validate words
#         if not ValidWord(startWord, WORDS_LIST) or not ValidWord(endWord, WORDS_LIST):
#             raise HTTPException(status_code=400, detail="Invalid words. Both must exist in the dictionary")
        
#         if len(startWord) != len(endWord):
#             raise HTTPException(status_code=400, detail="Start and end words must be the same length")
        
#         if startWord == endWord:
#             raise HTTPException(status_code=400, detail="Start and end words cannot be the same")
        
#         movesLimit = 10
    
#     # Filter dictionary to words of the same length
#     filtered_dict = [word for word in WORDS_LIST if len(word) == len(startWord)]
    
#     # For advanced mode, create banned words
#     if request.gameMode == "advanced":
#         filtered_dict_without_start_end = [word for word in filtered_dict if word not in [startWord, endWord]]
#         bannedWords = random.sample(filtered_dict_without_start_end, k=len(filtered_dict_without_start_end) // 6)
#         filtered_dict = [word for word in filtered_dict if word not in bannedWords] + [startWord, endWord]
    
#     # Build the graph
#     graph = buildGraph(startWord, endWord, filtered_dict, 5)
    
#     if graph is None or not pathExists(startWord, endWord, graph):
#         raise HTTPException(status_code=400, detail="No valid path exists between these words")
    
#     # Store the graph for future use
#     game_graphs[f"{startWord}-{endWord}"] = graph
    
#     # Get valid moves from the start word
#     valid_moves = [action[0] for action in graph[startWord].actions]
    
#     # Calculate optimal moves
#     optimal_path = Astar(startWord, endWord, graph)
#     optimal_moves = len(optimal_path) if optimal_path else 0
    
#     return GameResponse(
#         startWord=startWord,
#         endWord=endWord,
#         movesLimit=movesLimit,
#         validMoves=valid_moves,
#         bannedWords=bannedWords,
#         optimalMoves=optimal_moves
#     )

# @app.post("/api/make-move", response_model=MoveResponse)
# async def make_move(request: MoveRequest):
#     graph_key = f"{request.currentWord}-{request.endWord}"
    
#     # If graph doesn't exist, create it
#     if graph_key not in game_graphs:
#         filtered_dict = [word for word in WORDS_LIST if len(word) == len(request.currentWord)]
#         graph = buildGraph(request.currentWord, request.endWord, filtered_dict, 5)
        
#         if graph is None:
#             raise HTTPException(status_code=400, detail="Failed to build game graph")
        
#         game_graphs[graph_key] = graph
    
#     graph = game_graphs[graph_key]
    
#     # Validate the move
#     if request.nextWord not in [action[0] for action in graph[request.currentWord].actions]:
#         raise HTTPException(status_code=400, detail="Invalid move")
    
#     # Get valid moves from the new position
#     valid_moves = []
#     if request.nextWord != request.endWord:
#         # Ensure the next word has actions
#         if request.nextWord not in graph or not graph[request.nextWord].actions:
#             addAllTransformations(request.nextWord, request.endWord, graph.keys(), graph)
        
#         valid_moves = [action[0] for action in graph[request.nextWord].actions]
    
#     # Calculate score if the game is won
#     score = None
#     if request.nextWord == request.endWord:
#         # For simplicity, we're assuming 0 hints used here
#         # In a real implementation, you'd track hints used per game
#         optimal_path = Astar(request.currentWord, request.endWord, graph)
#         optimal_moves = len(optimal_path) if optimal_path else 0
#         score = calculateScore(1, optimal_moves, 0)  # 1 move from current to end
    
#     return MoveResponse(
#         validMoves=valid_moves,
#         score=score
#     )

# @app.post("/api/hint", response_model=HintResponse)
# async def get_hint(request: HintRequest):
#     graph_key = f"{request.currentWord}-{request.endWord}"
    
#     # If graph doesn't exist, create it
#     if graph_key not in game_graphs:
#         filtered_dict = [word for word in WORDS_LIST if len(word) == len(request.currentWord)]
#         graph = buildGraph(request.currentWord, request.endWord, filtered_dict, 5)
        
#         if graph is None:
#             raise HTTPException(status_code=400, detail="Failed to build game graph")
        
#         game_graphs[graph_key] = graph
    
#     graph = game_graphs[graph_key]
    
#     # Get hint based on selected algorithm
#     hint_path = None
#     if request.algorithm == "ucs":
#         hint_path = UCS(request.currentWord, request.endWord, graph)
#     elif request.algorithm == "gbfs":
#         hint_path = GBFS(request.currentWord, request.endWord, graph)
#     elif request.algorithm == "astar":
#         hint_path = Astar(request.currentWord, request.endWord, graph)
#     else:
#         raise HTTPException(status_code=400, detail="Invalid algorithm")
    
#     if not hint_path or len(hint_path) == 0:
#         raise HTTPException(status_code=400, detail="No hint available")
    
#     return HintResponse(hint=hint_path[0])

# # Run the server
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from word_ladder.models import GameStartRequest, MoveRequest, HintRequest, GameResponse, MoveResponse, HintResponse
from word_ladder.graph import buildGraph, pathExists, addAllTransformations
from word_ladder.algorithms import UCS, GBFS, Astar
from word_ladder.utils import ValidWord, calculateScore
import random

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load word dictionary
with open("words_alpha.txt", "r") as file:
    WORDS_LIST = set(file.read().splitlines())

# Game data store (in-memory for simplicity)
game_graphs = {}

# Word pair collections for different difficulty levels
BEGINNER_WORDS = [("cat", "dog"), ("lead", "gold"), ("ruby", "code"), ("warm", "cold"), ("cap", "mop"),
                 ("line","cake"), ("head","tail"), ("star","moon"), ("book","read"), ("pen","ink")]

INTERMEDIATE_WORDS = [("stone","money"), ("ladder","better"), ("cross","river"), ("wheat","bread"), 
                      ("apple","mango"), ("blue","pink"), ("work","team"), ("drink","eight")]

ADVANCED_WORDS = BEGINNER_WORDS + INTERMEDIATE_WORDS

@app.post("/api/start-game", response_model=GameResponse)
async def start_game(request: GameStartRequest):
    startWord = ""
    endWord = ""
    movesLimit = 10
    bannedWords = []
    
    # Set game parameters based on mode
    if request.gameType == "challenge":
        if request.gameMode == "beginner":
            startWord, endWord = random.choice(BEGINNER_WORDS)
            movesLimit = 5
        elif request.gameMode == "intermediate":
            startWord, endWord = random.choice(INTERMEDIATE_WORDS)
            movesLimit = 7
        elif request.gameMode == "advanced":
            startWord, endWord = random.choice(ADVANCED_WORDS)
            movesLimit = 10
    else:
        # Custom words
        if not request.startWord or not request.endWord:
            raise HTTPException(status_code=400, detail="Start and end words are required for custom game")
        
        startWord = request.startWord
        endWord = request.endWord
        
        # Validate words
        if not ValidWord(startWord, WORDS_LIST) or not ValidWord(endWord, WORDS_LIST):
            raise HTTPException(status_code=400, detail="Invalid words. Both must exist in the dictionary")
        
        if len(startWord) != len(endWord):
            raise HTTPException(status_code=400, detail="Start and end words must be the same length")
        
        if startWord == endWord:
            raise HTTPException(status_code=400, detail="Start and end words cannot be the same")
        
        movesLimit = 10
    
    # Filter dictionary to words of the same length
    filtered_dict = [word for word in WORDS_LIST if len(word) == len(startWord)]
    
    # For advanced mode, create banned words
    if request.gameMode == "advanced":
        filtered_dict_without_start_end = [word for word in filtered_dict if word not in [startWord, endWord]]
        bannedWords = random.sample(filtered_dict_without_start_end, k=len(filtered_dict_without_start_end) // 6)
        filtered_dict = [word for word in filtered_dict if word not in bannedWords] + [startWord, endWord]
    
    # Build the graph
    graph = buildGraph(startWord, endWord, filtered_dict, 5)
    
    if graph is None or not pathExists(startWord, endWord, graph):
        raise HTTPException(status_code=400, detail="No valid path exists between these words")
    
    # Store the graph for future use
    game_graphs[f"{startWord}-{endWord}"] = graph
    
    # Get valid moves from the start word
    valid_moves = [action[0] for action in graph[startWord].actions]
    
    # Calculate optimal moves
    optimal_path = Astar(startWord, endWord, graph)
    optimal_moves = len(optimal_path) if optimal_path else 0
    
    return GameResponse(
        startWord=startWord,
        endWord=endWord,
        movesLimit=movesLimit,
        validMoves=valid_moves,
        bannedWords=bannedWords,
        optimalMoves=optimal_moves
    )

@app.post("/api/make-move", response_model=MoveResponse)
async def make_move(request: MoveRequest):
    graph_key = f"{request.currentWord}-{request.endWord}"
    
    # If graph doesn't exist, create it
    if graph_key not in game_graphs:
        filtered_dict = [word for word in WORDS_LIST if len(word) == len(request.currentWord)]
        graph = buildGraph(request.currentWord, request.endWord, filtered_dict, 5)
        
        if graph is None:
            raise HTTPException(status_code=400, detail="Failed to build game graph")
        
        game_graphs[graph_key] = graph
    
    graph = game_graphs[graph_key]
    
    # Validate the move
    if request.nextWord not in [action[0] for action in graph[request.currentWord].actions]:
        raise HTTPException(status_code=400, detail="Invalid move")
    
    # Get valid moves from the new position
    valid_moves = []
    if request.nextWord != request.endWord:
        # Ensure the next word has actions
        if request.nextWord not in graph or not graph[request.nextWord].actions:
            addAllTransformations(request.nextWord, request.endWord, graph.keys(), graph)
        
        valid_moves = [action[0] for action in graph[request.nextWord].actions]
    
    # Calculate score if the game is won
    score = None
    if request.nextWord == request.endWord:
        # For simplicity, we're assuming 0 hints used here
        # In a real implementation, you'd track hints used per game
        optimal_path = Astar(request.currentWord, request.endWord, graph)
        optimal_moves = len(optimal_path) if optimal_path else 0
        score = calculateScore(1, optimal_moves, 0)  # 1 move from current to end
    
    return MoveResponse(
        validMoves=valid_moves,
        score=score
    )

@app.post("/api/hint", response_model=HintResponse)
async def get_hint(request: HintRequest):
    graph_key = f"{request.currentWord}-{request.endWord}"
    
    # If graph doesn't exist, create it
    if graph_key not in game_graphs:
        filtered_dict = [word for word in WORDS_LIST if len(word) == len(request.currentWord)]
        graph = buildGraph(request.currentWord, request.endWord, filtered_dict, 5)
        
        if graph is None:
            raise HTTPException(status_code=400, detail="Failed to build game graph")
        
        game_graphs[graph_key] = graph
    
    graph = game_graphs[graph_key]
    
    # Get hint based on selected algorithm
    hint_path = None
    if request.algorithm == "ucs":
        hint_path = UCS(request.currentWord, request.endWord, graph)
    elif request.algorithm == "gbfs":
        hint_path = GBFS(request.currentWord, request.endWord, graph)
    elif request.algorithm == "astar":
        hint_path = Astar(request.currentWord, request.endWord, graph)
    else:
        raise HTTPException(status_code=400, detail="Invalid algorithm")
    
    if not hint_path or len(hint_path) == 0:
        raise HTTPException(status_code=400, detail="No hint available")
    
    return HintResponse(hint=hint_path[0])

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    