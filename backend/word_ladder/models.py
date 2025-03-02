from pydantic import BaseModel
from typing import List, Optional

class Node:
    def __init__(self, word, parent=None, actions=None, heuristic_cost=0, path_cost=0):
        self.word = word
        self.parent = parent
        self.actions = actions if actions is not None else []
        self.heuristic_cost = heuristic_cost
        self.path_cost = path_cost

class GameStartRequest(BaseModel):
    gameMode: str
    gameType: str
    startWord: Optional[str] = None
    endWord: Optional[str] = None

class MoveRequest(BaseModel):
    currentWord: str
    nextWord: str
    endWord: str

class HintRequest(BaseModel):
    currentWord: str
    endWord: str
    algorithm: str

class GameResponse(BaseModel):
    startWord: str
    endWord: str
    movesLimit: int
    validMoves: List[str]
    bannedWords: List[str]
    optimalMoves: int

class MoveResponse(BaseModel):
    validMoves: List[str]
    score: Optional[int] = None

class HintResponse(BaseModel):
    hint: str