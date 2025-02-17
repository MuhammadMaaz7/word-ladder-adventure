from node import Node


#To Check if the word exists in the dictionary
def ValidWord(input,words):
    for word in words:
        if(input == word):
            # print("Word exists in Dictionary")
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
    
    # 1. If word is valid, then make a Node and add it to the graph
    # 2. add parent, actions to the node
    for word in words:
        if compare(currentWord,word):
            graph[word] = Node(word,currentWord,[])
            parent = graph[word].parent
            graph[parent].actions.append(word)

    
def main():
     #Extracting All the words from txt file
    file = open("words_alpha.txt", "r" )
    data = file.read()
    words = data.split("\n")
    
    startWord,endWord = userInput(words)
    
    graph = {}
    graph[startWord] = Node(startWord,None,[])
    addAllTransformations(startWord,words,graph)
    
    print(graph.items())
    

main()