from node import Node
file = open("words_alpha.txt", "r" )
data = file.read()
words = data.split("\n") #Extracting All the words from txt
# print(words)

# a = Node("a",None,[])
# print(a.state)

def ValidWord(input):
    for word in words:
        if(input == word):
            print("Word is Valid. Word exists in Dictionary")
            return True
    
    return False
        
def compare(input,similar):
    transformationCount = 0 
    for i in range(len(input)):
        if(input[i] != similar[i]):
            transformationCount+=1
    
    if transformationCount==1:
        print(similar)
        return True
    return False



while True:
    inputWord = input("Enter your word: ")
    if ValidWord(inputWord) == True:
        break

dictionary = []

for word in words:
    if(len(word) == len(inputWord)):
        dictionary.append(word)

for word in dictionary:
     compare(inputWord,word) 
        
    