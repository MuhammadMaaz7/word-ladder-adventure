class Node:
    def __init__(self,word,parent=None,actions=[]):
        self.word = word
        self.parent=parent
        self.actions=actions    
        
    def __str__(self):
        return f"Node(word={self.word}, parent={self.parent}, actions={self.actions})"

    def __repr__(self):
        return self.__str__()