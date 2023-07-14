from typing import Any
class History:
    def __init__(self) -> None:
        self.undo = []
        self.redo = []
    
    def add_action(self, action: Any) -> None:
        self.undo.append(action)
        self.redo = []

    def undo(self) -> Any:
        if len(self.undo) == 0:
            raise ValueError("No actions to undo")

        action = self.undo.pop()
        self.redo.append(action)

        return action

    def redo(self) -> Any:
        if len(self.redo) == 0:
            raise ValueError("No actions to redo")

        action = self.redo.pop()
        self.undo.append(action)

        return action

        