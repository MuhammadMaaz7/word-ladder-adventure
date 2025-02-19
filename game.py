from node import Node
from collections import deque


#To Check if the word exists in the dictionary
def ValidWord(input,words):
    for word in words:
        if(input == word):
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

#To check if the new word is made by 1 letter transformation
def compare(input,similar):
    if len(input) != len(similar):
        return False
    
    transformationCount = 0 
    for i in range(len(input)):
        if(input[i] != similar[i]):
            transformationCount+=1
    
    return transformationCount

#To add all the possible transformations from a word
def addAllTransformations(currentWord, words,graph):
    #print("Adding Tranformations for ",currentWord)
    for word in words:
        if compare(currentWord,word) == 1:
            
            #Adding word if it does not exist
            if word not in graph:
                graph[word] = Node(word,currentWord,[])
            
            # if graph[word].parent != None:
            #     parent = graph[word].parent
                
            # if word already exists in its actions then dont add it again
            if word not in graph[currentWord].actions:
                graph[currentWord].actions.append(word)
            
def buildGraph(startWord,endWord, words):     
    graph ={startWord : Node(startWord,None)}
    queue = deque([startWord]) 
    explored = []

    while queue:
        currentWord = queue.popleft()
        #print("Popping ",currentWord)
        if currentWord not in explored:
            addAllTransformations(currentWord,words,graph)
        
            for action in graph[currentWord].actions:
                # if action not in graph:

                #if compare(endWord,action) < len(endWord): #money stone
                    queue.append(action)
                # if not queue:
                #     print("Queue is empty at ",currentWord)
                    
                # if action == endWord:
                #     print("End word found----------Exiting")
                #     return graph
            
            explored.append(currentWord)
        

        if endWord in explored:
            print("Explored ",explored)
            return graph

    return graph
        
def printGraph(graph):
    for word, node in graph.items():
        print(f"Word: {word}, Parent: {node.parent}, Actions: {node.actions}")
        print("---------------")
        
def main():
     #Extracting All the words from txt file
    file = open("words_alpha.txt", "r" )
    data = file.read()
    words = data.split("\n")
    
    #User Input
    # startWord,endWord = userInput(words)
    startWord = "cat"
    endWord = "bit"
    
    #Creating Graph
    graph = buildGraph(startWord,endWord,words)
    
    printGraph(graph)
    
    
    # currentNode = graph[startWord]
    # while (currentNode.word != endWord): 
    #     if currentNode.actions == []:
    #         addAllTransformations(currentNode.word,words,graph)
    #         print(graph.items())
    #     else:
    #         for action in currentNode.actions:    
    #             print("Node: ", currentNode.word, " action: ",action)  
    #             addAllTransformations(action,words,graph)
    #             for action in currentNode.actions:
    #                 print("Node: ", currentNode.word, " action: ",action)
    #                 addAllTransformations(action,words,graph)
    #                 print(graph.items())
    #                 currentNode = graph[currentNode.actions[action]]

                

  

main()


# 1. Graph from start word to end word
# 2. consists of all paths from start to end
# 3. Words(Nodes) should not be repeated (If a word(node) exists in graph it shouldnt be added again)
# 4. Each node should have parent and actions
# 5. Parent of a node cannot be updated
# 6. Both Nodes should have action of eachother, meaning its possible to go from a cat -> bat, and also bat -> cat

