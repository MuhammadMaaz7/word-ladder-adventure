class Node:
    def __init__(self,state,parent,actions):
        self.state = state
        self.parent=parent
        self.actions=actions
        
    def __str__(self):
        return f"Node(word={self.state}, parent={self.parent}, actions={self.actions})"

    def __repr__(self):
        return self.__str__()