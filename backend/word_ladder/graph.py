from collections import deque
from .models import Node
from .utils import compare, getHeuristic
from collections import defaultdict

def buildGraph(startWord, endWord, wordsList, depthLimit):
    transformations = precompute_transformations(wordsList)
    heuristicCost = getHeuristic(startWord, endWord)
    graph = {startWord: Node(startWord, None, [], heuristicCost, 0)}
    queue = deque([(startWord, 0)]) 
    explored = []

    while queue:
        currentWord, currentDepth = queue.popleft()
        
        if currentDepth > depthLimit:
            return None
        
        if currentWord not in explored:
            if currentWord not in graph:
                graph[currentWord] = Node(currentWord, None)
                
            addAllTransformations(currentWord, endWord, wordsList, graph, transformations)
        
            for action, cost in graph[currentWord].actions:
                if action not in explored:
                    queue.append((action, currentDepth + 1))
                
            explored.append(currentWord)
            
        if endWord in explored:
            return graph
            
    return graph

def pathExists(startWord, endWord, graph):
    explored = set()
    queue = deque([startWord])
    while queue:
        word = queue.popleft()
        if word == endWord:
            return True
        explored.add(word)
        
        for action, cost in graph[word].actions:
            if action not in explored:
                explored.add(action)
                queue.append(action)
                
    return False

def precompute_transformations(words_list):
    transformations = defaultdict(list)
    for word in words_list:
        for i in range(len(word)):
            pattern = word[:i] + "_" + word[i+1:]
            transformations[pattern].append(word)
    return transformations

def addAllTransformations(currentWord, endWord, wordsList, graph, transformations):
    for i in range(len(currentWord)):
        pattern = currentWord[:i] + "_" + currentWord[i+1:]
        for word in transformations[pattern]:
            if word != currentWord and word in wordsList:
                cost = 1
                heuristicCost = getHeuristic(word, endWord)
                if word not in graph:
                    graph[word] = Node(word, currentWord, [], heuristicCost)
                if word not in [action[0] for action in graph[currentWord].actions]:
                    graph[currentWord].actions.append((word, cost))
