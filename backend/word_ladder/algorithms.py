import math
from .models import Node
from queue import PriorityQueue

# def actionSequence(graph, goalState, initialState):
#     solution = [goalState]
#     currentParent = graph[goalState].parent
#     while currentParent is not initialState:
#         solution.append(currentParent)
#         currentParent = graph[currentParent].parent
#     solution.reverse()
#     return solution

def actionSequence(graph, goalState, initialState):
    solution = [goalState]
    currentParent = graph[goalState].parent
    while currentParent is not None and currentParent != initialState:
        solution.append(currentParent)
        currentParent = graph[currentParent].parent
    solution.append(initialState)  # Force include initial state
    solution.reverse()
    return solution

def hintSequence(graph, goalState, initialState):
    solution = [goalState]
    currentParent = graph[goalState].parent
    while currentParent is not None and currentParent != initialState:
        solution.append(currentParent)
        currentParent = graph[currentParent].parent
    solution.reverse()
    # return solution[1:] if len(solution) > 1 else []  # Exclude initial state
    return solution

def findMin(frontier):
    minPathCost = math.inf
    node = ''
    for i in frontier:
        if minPathCost > frontier[i][1]:
            minPathCost = frontier[i][1]
            node = i
    return node

def UCS(startWord, endWord, graph):
    if startWord not in graph or endWord not in graph:
        return None
        
    frontier = PriorityQueue()
    explored = set()
    graph[startWord].path_cost = 0
    frontier.put((0, startWord))
    
    while not frontier.empty():
        currentCost, currentNode = frontier.get()
        
        if currentNode == endWord:
            return actionSequence(graph, endWord, startWord)
            
        if currentNode in explored:
            continue
            
        explored.add(currentNode)
        
        for action, cost in graph[currentNode].actions:
            new_cost = currentCost + cost
            if action not in explored:
                if action not in [item[1] for item in frontier.queue]:
                    graph[action].parent = currentNode
                    graph[action].path_cost = new_cost
                    frontier.put((new_cost, action))
                elif new_cost < graph[action].path_cost:
                    # Update priority if better path found
                    graph[action].parent = currentNode
                    graph[action].path_cost = new_cost
                    # Need to update priority in queue
                    temp_queue = []
                    while not frontier.empty():
                        cost, word = frontier.get()
                        if word == action:
                            cost = new_cost
                        temp_queue.append((cost, word))
                    for item in temp_queue:
                        frontier.put(item)
                        
def Astar(startWord, endWord, graph):
    if startWord in graph and endWord in graph:
        initialState = startWord
        goalState = endWord

        frontier = {}
        explored = {}

        frontier[initialState] = (None, graph[initialState].heuristic_cost)

        while frontier:
            currentNode = findMin(frontier)
            del frontier[currentNode]

            if graph[currentNode].word == goalState:
                return actionSequence(graph, goalState, initialState)

            # calculating total cost
            currentCost = graph[currentNode].path_cost
            heuristicCost = graph[currentNode].heuristic_cost
            explored[currentNode] = (graph[currentNode].parent, heuristicCost + currentCost)

            # Explore child nodes for cost
            for child in graph[currentNode].actions:
                currentCost = child[1] + graph[currentNode].path_cost
                heuristicCost = graph[child[0]].heuristic_cost

                # if already looked at or initial state or cost lesser than current, continue
                if child[0] in explored:
                    if graph[child[0]].parent == currentNode or child[0] == initialState or \
                        explored[child[0]][1] <= currentCost + heuristicCost:
                        continue

                # if not in frontier - add to it
                if child[0] not in frontier:
                    graph[child[0]].parent = currentNode
                    graph[child[0]].path_cost = currentCost
                    frontier[child[0]] = (graph[child[0]].parent, currentCost + heuristicCost)

                # if in frontier - check cost
                else:
                    #if cost is lesser - update graph with frontier
                    if frontier[child[0]][1] < currentCost + heuristicCost:
                        graph[child[0]].parent = frontier[child[0]][0]
                        graph[child[0]].path_cost = frontier[child[0]][1] - heuristicCost

                    # if cost is higher - update graph with current cost
                    else:
                        frontier[child[0]] = (currentNode, currentCost + heuristicCost)
                        graph[child[0]].parent = frontier[child[0]][0]
                        graph[child[0]].path_cost = currentCost

def GBFS(startWord, endWord, graph):
    currentNode = graph[startWord]
    queue = PriorityQueue()
    explored = set()
    queue.put((currentNode.heuristic_cost, currentNode.word, []))
    
    while not queue.empty():
        heuristic, currentWord, path = queue.get()
        
        if currentWord == endWord:
            return path
        
        if currentWord in explored:
            continue
        
        explored.add(currentWord)
        
        for action, _ in graph[currentWord].actions:
            if action not in explored:
                queue.put((graph[action].heuristic_cost, action, path + [action]))
                    
    return None