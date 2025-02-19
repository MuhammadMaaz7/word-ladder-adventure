from node import Node
from collections import deque


#To Check if the word exists in the dictionary
def ValidWord(input,words):
    for word in words:
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


def userInput(words):
    startWord = input("Enter start word: ")
    while True:
        if ValidWord(startWord,words) != True:
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
        elif ValidWord(endWord,words) == False:
            print("Word does not exist in Dictionary")
            endWord = input("Enter a valid end word: ")
        else:
            break

    return startWord,endWord

#To add all the possible transformations from a word
def addAllTransformations(currentWord, words,graph):
    for word in words:
        if compare(currentWord,word):
            
            #Adding word if it does not exist
            if word not in graph:
                graph[word] = Node(word,currentWord,[])
            
            if word not in graph[currentWord].actions:
                graph[currentWord].actions.append(word)
            
def buildGraph(startWord,endWord, words):     
    graph ={startWord : Node(startWord,None)}
    queue = deque([startWord]) 
    explored = []

    
    while queue:
        currentWord = queue.popleft()
        if currentWord not in explored:
            addAllTransformations(currentWord,words,graph)
        
            for action in graph[currentWord].actions:
                queue.append(action)
                
            
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
     #Extracting All the words from txt file
    file = open("words_alpha.txt", "r" )
    data = file.read()
    words = data.split("\n")
    dictionary = []
    
    #User Input
    
    
    startWord,endWord = userInput(words)
    
    for word in words:
        if len(word) == len(startWord):
            dictionary.append(word)
    
    #Creating Graph
    graph = buildGraph(startWord,endWord,dictionary)
    
    # printGraph(graph)
    
    while pathExists(startWord,endWord,graph) == False:
        print("No path exists between these words")
        startWord,endWord = userInput(words)
        
        for word in words:
            if len(word) == len(startWord):
                dictionary.append(word)
    
        
        graph = buildGraph(startWord,endWord,dictionary)
    playManualGame(startWord,endWord,graph)
  
main()


# 1. Graph from start word to end word
# 2. consists of all paths from start to end
# 3. Words(Nodes) should not be repeated (If a word(node) exists in graph it shouldnt be added again)
# 4. Each node should have parent and actions
# 5. Parent of a node cannot be updated
# 6. Both Nodes should have action of eachother, meaning its possible to go from a cat -> bat, and also bat -> cat