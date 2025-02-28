from node import Node
from collections import deque


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

#To add all the possible transformations from a word
def addAllTransformations(currentWord, wordsList,graph):
    for word in wordsList:
        if compare(currentWord,word):
            
            #Adding word if it does not exist
            if word not in graph:
                graph[word] = Node(word,currentWord,[])
            
            if word not in graph[currentWord].actions:
                graph[currentWord].actions.append(word)

def buildGraph(startWord,endWord, wordsList, depthLimit):     
    graph = {startWord : Node(startWord,None,[])}
    queue = deque([(startWord,0)]) 
    explored = []

    
    while queue:
        currentWord, currentDepth = queue.popleft()
        
        if currentDepth > depthLimit:
            return None
        
        if currentWord not in explored:
            if currentWord not in graph:
                graph[currentWord] = Node(currentWord,None)
                
            addAllTransformations(currentWord,wordsList,graph)
        
            for action in graph[currentWord].actions:
                if action not in explored:
                    queue.append((action, currentDepth + 1))
                
            explored.append(currentWord)
            
        if endWord in explored:
            return graph
            
    return graph

def pathExists(startWord,endWord,graph):
    Explored = set()
    queue = deque([startWord])
    while queue:
        word = queue.popleft()
        if word == endWord:
            return True
        Explored.add(word)
        for action in graph[word].actions:
            if action not in Explored:
                Explored.add(action)
                queue.append(action)
                
    return False
        
def playManualGame(startWord,endWord,graph):
    currentNode = graph[startWord]
    moves = 0
    path = []
    
    while currentNode.word != endWord:
        if currentNode.actions == []:
            addAllTransformations(currentNode.word,graph.keys(),graph)
        print(f"Current Word: {currentNode.word}, Actions: {currentNode.actions}")
        nextWord = input("Enter the next word: ")
        while nextWord not in currentNode.actions:
            nextWord = input("Invalid Word, Enter Again:")
        
        path.append(nextWord)
        moves+=1
        currentNode = graph[nextWord]
        
        if currentNode.word == endWord:
            print("Congratulations, You won, Score: ",moves)
            print("Path: ",path)
            return True

def printGraph(graph):
    for word, node in graph.items():
        print(f"Word: {word}, Parent: {node.parent}, Actions: {node.actions}")
        
def main():
    file = open("words_alpha.txt", "r" )
    wordsList = file.read().split("\n")
    file.close()
    
    # update the depth limit here__________
    depthLimit = 2
    
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
    
    playManualGame(startWord,endWord,graph)
  
main()
