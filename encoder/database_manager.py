

import pymongo

class DataBaseManager:
    def __init__(self) -> None:
        self.client = pymongo.MongoClient("mongodb://db:27017/")
        self.db = self.client["suggestions"]["suggestions"]

    def _is_contains_duplicates(self, suggestions: list[str]) -> bool:
        return len(suggestions) != len(set(suggestions))

    def _create_query(self, illegal_word: str) -> dict[str, str]:
        return {
            "illegal_word": illegal_word
        }
    
    def rename_illegal_word(self, illegal_word: str, new_illegal_word: str) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            raise ValueError(f"{illegal_word} is not in database")
        
        existing_word_dict["illegal_word"] = new_illegal_word
        self.db.update_one(self._create_query(illegal_word), {"$set": existing_word_dict})
    
    def update_suggestions(self,illegal_word: str, suggestions: list[str]) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            raise ValueError(f"{illegal_word} is not in database")
        
        existing_word_dict["suggestions"] = suggestions
        if self._is_contains_duplicates(suggestions):
            raise ValueError(f"{suggestions} contains duplicates")

        self.db.update_one(self._create_query(illegal_word), {"$set": existing_word_dict})

    def add_word(self, illegal_word: str, word: str) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            init_word = {
                "illegal_word": illegal_word,
                "suggestions": [word]
            }
            self.db.insert_one(init_word)
            print(f"init word with {init_word} in db")
            return
        suggestions: list[str] = existing_word_dict["suggestions"]
        if word in suggestions:
            raise ValueError(f"{word} is already in {illegal_word} suggestions")
        
        suggestions.append(word)
        updated = {
            "illegal_word": illegal_word, 
            "suggestions": suggestions
        }
        
        self.db.update_one(self._create_query(illegal_word), {"$set": updated})
    
    def remove_illegal_words(self, illegal_words: list[str]) -> None:
        for word in illegal_words:
            self.db.delete_one(self._create_query(word))

    def remove_word(self, illegal_word: str, word: str) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            raise ValueError(f"{illegal_word} is not in database")
         
        suggestions: list[str] = existing_word_dict["suggestions"]
        if word not in suggestions:
            raise ValueError(f"{word} is not in {illegal_word} suggestions")
        
        suggestions.remove(word)
        updated = {
            "illegal_word": illegal_word, 
            "suggestions": suggestions
        }
        if len(suggestions) == 0:
            self.db.delete_one(self._create_query(illegal_word))

        self.db.update_one(self._create_query(illegal_word), {"$set": updated})

    def get_suggestions(self, illegal_word: str) -> dict[str, str | list[str]]:
        suggestions = self.db.find_one(self._create_query(illegal_word))
        if not suggestions:
            raise ValueError(f"{illegal_word} is not in database")
        return suggestions

    def get_all_words_with_suggesions(self) -> list[dict[str, str | list[str]]]:
        docs = []
        for doc in self.db.find():
            doc["id"] = str(doc.pop("_id"))
            docs.append(doc)

        return docs
    
    def get_all_illegal_words(self) -> list[str]:
        return [
            illegal_word["illegal_word"] for illegal_word in list(self.db.find())
        ]
    
db_manager = DataBaseManager()

if __name__ == "__main__":
    # db_manager.add_word("外貌", "煥膚")
    print(db_manager.get_all_words_with_suggesions())
    db_manager.remove_word("外貌", "煥膚")
    print(db_manager.get_all_words_with_suggesions())