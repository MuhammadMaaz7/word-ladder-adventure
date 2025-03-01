from node import Node
from collections import deque
from queue import PriorityQueue
import math

#To Check if the word exists in the dictionary
def ValidWord(input,wordsList):
    for word in wordsList:
        if(input == word):
            return True
    
    return False
        
#To check if the new word is made by 1 letter transformation
def compare(input,similar):
    if len(input) != len(similar):
        return False
    
    transformationCount = 0 
    for i in range(len(input)):
        if(input[i] != similar[i]):
            transformationCount+=1
    
    if transformationCount==1:
        return True
    return False

def userInput(wordsList):
    startWord = input("Enter start word: ")
    while True:
        if ValidWord(startWord,wordsList) != True:
            print("Word does not exist in Dictionary")
            startWord = input("Enter a valid start word: ")
        else:
            break

    endWord = input("Enter end word: ")
    while True:
        if startWord == endWord:
            print("Start and End word cannot be same.")
            endWord = input("Enter a valid end word: ")
        elif len(startWord) != len(endWord):
            print("Start and End word must be of same length.")
            endWord = input("Enter a valid end word: ")
        elif ValidWord(endWord,wordsList) == False:
            print("Word does not exist in Dictionary")
            endWord = input("Enter a valid end word: ")
        else:
            break

    return startWord,endWord

# To add all the possible transformations from a word
def addAllTransformations(currentWord,endWord,wordsList,graph):
    for word in wordsList:
        if compare(currentWord,word):
            
            cost = 1
            heuristicCost = getHeuristic(word,endWord)
            # print("Current Word: ", word, "Heuristic: ",heuristicCost)
            #Adding word if it does not exist
            if word not in graph:
                graph[word] = Node(word,currentWord,[],heuristicCost)
            
            if word not in graph[currentWord].actions:
                graph[currentWord].actions.append((word, cost)) 
            # or
            # if not any(action[0] == word for action in graph[currentWord].actions):
            #     graph[currentWord].actions.append((word, cost))

def buildGraph(startWord,endWord, wordsList, depthLimit): 
    heuristicCost = getHeuristic(startWord,endWord)
    graph = {startWord : Node(startWord,None,[],heuristicCost,0)}
    queue = deque([(startWord,0)]) 
    explored = []

    while queue:
        currentWord, currentDepth = queue.popleft()
        
        if currentDepth > depthLimit:
            return None
        
        if currentWord not in explored:
            if currentWord not in graph:
                graph[currentWord] = Node(currentWord,None)
                
            addAllTransformations(currentWord,endWord,wordsList,graph)
        
            for action,cost  in graph[currentWord].actions:
                if action not in explored:
                    queue.append((action, currentDepth + 1))
                
            explored.append(currentWord)
            
        if endWord in explored:
            return graph
            
    return graph

def pathExists(startWord,endWord,graph):
    explored = set()
    queue = deque([startWord])
    while queue:
        word = queue.popleft()
        if word == endWord:
            return True
        explored.add(word)
        
        for action,cost in graph[word].actions:
            if action not in explored:
                explored.add(action)
                queue.append(action)
                
    return False

def actionSequence(graph, goalState,initialState):
    solution = [goalState]
    currentParent = graph[goalState].parent
    while currentParent is not initialState:
        # print("ParentNode", currentParent)
        solution.append(currentParent)
        currentParent = graph[currentParent].parent
    solution.reverse()
    return solution

def findMin(frontier):
    minPathCost = math.inf
    node = ''
    for i in frontier:
        if minPathCost > frontier[i][1]:
            minPathCost = frontier[i][1]
            node = i
    # print("Returning ",node," from FindMin")
    return node

def UCS(startWord,endWord,graph):

    if startWord in graph and endWord in graph:
        initialState = startWord
        goalState = endWord

        frontier = {}
        explored = []

        frontier[initialState] = (None,0)

        while frontier:
            currentNode = findMin(frontier)
            del frontier[currentNode]

            if graph[currentNode].word == goalState:
                return actionSequence(graph,goalState,initialState)

            explored.append(currentNode)
            for action in graph[currentNode].actions:
                currentCost = action[1] + graph[currentNode].path_cost

                if action[0] not in frontier and action[0] not in explored:
                    graph[action[0]].parent = currentNode
                    graph[action[0]].path_cost = currentCost
                    frontier[action[0]]=(graph[action[0]].parent, graph[action[0]].path_cost)
                elif action[0] in frontier:
                    if frontier[action[0]][1]<currentCost:
                        graph[action[0]].parent = frontier[action[0]][0]
                        graph[action[0]].path_cost = frontier[action[0]][1]
                    else:
                        frontier[action[0]] = (currentNode, currentCost)
                        graph[action[0]].parent=currentNode
                        graph[action[0]].path_cost = currentCost

def Astar(startWord,endWord,graph):
    if startWord in graph and endWord in graph:
        initialState = startWord
        goalState = endWord

        frontier = {}
        explored = {}

        frontier[initialState]=(None, graph[initialState].heuristic_cost)

        while frontier:
            currentNode = findMin(frontier)
            del frontier[currentNode]

            if graph[currentNode].word == goalState:
                return actionSequence(graph, goalState, initialState)

            # calculating total cost
            currentCost = graph[currentNode].path_cost
            heuristicCost = graph[currentNode].heuristic_cost
            explored[currentNode]=(graph[currentNode].parent, heuristicCost+currentCost)

            # Explore child nodes for cost
            for child in graph[currentNode].actions:
                currentCost=child[1] + graph[currentNode].path_cost
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
                        graph[child[0]].parent=frontier[child[0]][0]
                        graph[child[0]].path_cost=frontier[child[0]][1] - heuristicCost

                    # if cost is higher - update graph with current cost
                    else:
                        frontier[child[0]]=(currentNode, currentCost + heuristicCost)
                        graph[child[0]].parent=frontier[child[0]][0]
                        graph[child[0]].path_cost=currentCost

def getHeuristic(word,goalWord):
    transformationCount = 0 
    
    for i in range(len(word)):
        if(word[i] != goalWord[i]):
            transformationCount+=1
    
    # transformationCount = len(word) - sum(1 for a, b in zip(word, goalWord) if a == b)
            
    return transformationCount

def GBFS(startWord,endWord,graph):

    currentNode = graph[startWord]
    queue = PriorityQueue()
    explored = set()
    queue.put((currentNode.heuristic_cost, currentNode.word, []))
    
    
    while not queue.empty():
        heuristic, currentWord, path = queue.get()
        
        if currentWord == endWord:
            print(path)
            return path
        
        if currentWord in explored:
            continue
        
        explored.add(currentWord)
        
        # print(f"Current Word: {currentWord}, Actions: {graph[currentWord].actions}, Heuristic_Cost: {graph[currentWord].heuristic_cost}")
        
        for action, _ in graph[currentWord].actions:
            if action not in explored:
                queue.put((graph[action].heuristic_cost, action, path + [action]))
                    
    return None

def printGraph(graph):
    for word, node in graph.items():
        print(f"Word: {word}, Parent: {node.parent}, Actions: {node.actions}")

def instructions():
    print("Welcome to the World Ladder Adventure🦕")
   
def playGame(startWord, endWord, graph):
    if startWord not in graph:
        print(f"Error: Start word '{startWord}' not found in graph!")
        return False
    
    currentNode = graph[startWord]
    moves = 0
    path = []

    while currentNode.word != endWord:
        # Add transformations if no actions exist
        if not currentNode.actions:
            addAllTransformations(currentNode.word, endWord, graph.keys(), graph)
            currentNode = graph[currentNode.word]  # Update node after adding actions

        nextWord = input("Enter the next word or type '1' to get a hint: ").strip()
        
        valid_words = {word for word, _ in currentNode.actions}
        while True:
            if nextWord == '1':
                break
            elif nextWord in valid_words:
                break
            else:
                nextWord = input("Invalid Word, Enter another word or type '1' to get a hint: ").strip()
                
        

        while nextWord.lower() == '1':
            print("Choose an algorithm to get hint")
            print("1. UCS")
            print("2. GBFS")
            print("3. A*")
            algo = input("Enter Algorithm No.: ").strip()

            hintPath = []
            if algo == "1":
                hintPath = UCS(currentNode.word, endWord, graph)
            elif algo == "2":
                hintPath = GBFS(currentNode.word, endWord, graph)
            elif algo == "3":
                hintPath = Astar(currentNode.word, endWord, graph)
            else:
                print("Invalid algorithm choice! Try again.")
                continue

            if hintPath:
                print("Hint: ", hintPath[0])
            else:
                print("No valid path found!")
            
            nextWord = input("Enter the next word: ")
            valid_words = {word for word, _ in currentNode.actions}
            while nextWord not in valid_words:
                nextWord = input("Invalid Word, Enter another word: ").strip()
            
        # Move to the next word
        path.append(nextWord)
        moves += 1
        currentNode = graph[nextWord]

    print("Congratulations, You won! 🎉 Score: ", moves)
    print("Path: ", path)
    return True
        
def main():
    instructions()
    file = open("words_alpha.txt", "r" )
    wordsList = file.read().split("\n")
    file.close()
    
    depthLimit = 5
    
    while True:
        startWord,endWord = userInput(wordsList)
        
        dictionary = [word for word in wordsList if len(word) == len(startWord)]

        graph = buildGraph(startWord,endWord,dictionary,depthLimit)
    
        if graph is None:
            print("Depth limit reached and still end word not found.")
            continue

        if pathExists(startWord,endWord,graph) == False :
            print("No path exists between these words")
            continue
        
        break
    
    
    playGame(startWord,endWord,graph)
    # GBFS(startWord,endWord,graph)
  
main()
