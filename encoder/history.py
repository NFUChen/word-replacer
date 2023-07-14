from typing import Any
class History:
    def __init__(self) -> None:
        self._undo = []
        self._redo = []
    
    def add_action(self, action: Any) -> None:
        self._undo.append(action)
        self._redo = []

    def undo(self) -> Any:
        if len(self._undo) == 0:
            raise ValueError("No actions to undo")

        action = self._undo.pop()
        self._redo.append(action)

        return action

    def redo(self) -> Any:
        if len(self._redo) == 0:
            raise ValueError("No actions to redo")

        action = self._redo.pop()
        self._undo.append(action)

        return action

        