def ValidWord(input, wordsList):
    return input in wordsList

def compare(input, similar):
    if len(input) != len(similar):
        return False
    
    transformationCount = sum(1 for a, b in zip(input, similar) if a != b)
    
    return transformationCount == 1

def getHeuristic(word, goalWord):
    return sum(1 for a, b in zip(word, goalWord) if a != b)

def calculateScore(movesTaken, optimalMoves, hintsUsed):
    maxScore = 100
    penaltyPerExtraMove = 10
    penaltyPerHint = 5
    extraMoves = max(0, movesTaken - optimalMoves)
    score = max(0, maxScore - (extraMoves * penaltyPerExtraMove) - (hintsUsed * penaltyPerHint))
    
    return score