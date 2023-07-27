

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

    def _is_naming_conflict(self, illegal_word: str) -> bool:
        return self.db.find_one(self._create_query(illegal_word)) is not None
    
    def rename_illegal_word(self, illegal_word: str, new_illegal_word: str) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            raise ValueError(f"危險字詞 {illegal_word} 不存在")
        
        if self._is_naming_conflict(new_illegal_word):
            raise ValueError(f"危險字詞 {new_illegal_word} 已存在")
        
        existing_word_dict["illegal_word"] = new_illegal_word
        self.db.update_one(self._create_query(illegal_word), {"$set": existing_word_dict})
    
    def update_suggestions(self,illegal_word: str, suggestions: list[str]) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            raise ValueError(f"危險字詞 {illegal_word} 不存在")
        
        existing_word_dict["suggestions"] = suggestions
        if self._is_contains_duplicates(suggestions):
            suggestion = suggestions[len(suggestions) - 1]
            raise ValueError(f"建議字詞 {suggestion} 已存在")

        self.db.update_one(self._create_query(illegal_word), {"$set": existing_word_dict})

    def add_word_with_suggestions(self, illegal_word: str, suggestions: list[str]) -> None:
        if self.db.find_one(self._create_query(illegal_word)):
            raise ValueError(f"危險字詞 {illegal_word} 已存在")
        
        new_word = {
            "illegal_word": illegal_word, 
            "suggestions": suggestions
        }
        
        self.db.insert_one(new_word)
    
    def remove_illegal_words(self, illegal_words: list[str]) -> None:
        for word in illegal_words:
            self.db.delete_one(self._create_query(word))

    def remove_word(self, illegal_word: str, word: str) -> None:
        existing_word_dict:dict[str, str | list[str]] = self.db.find_one(self._create_query(illegal_word))
        if not existing_word_dict:
            raise ValueError(f"危險字詞 {illegal_word} 不存在")
         
        suggestions: list[str] = existing_word_dict["suggestions"]
        if word not in suggestions:
            raise ValueError(f"建議字詞 {word} 不是危險字詞 {illegal_word} 的選項")
        
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
            raise ValueError(f"危險字詞 {illegal_word} 不存在")
        return suggestions

    def get_all_words_with_suggesions(self) -> list[dict[str, str | list[str]]]:
        docs = []
        for doc in self.db.find():
            doc["id"] = str(doc.pop("_id"))
            docs.append(doc)

        return docs
    def get_all_words_as_key_with_suggesions(self) -> dict[str, list[str]]:
        return {doc["illegal_word"]: doc["suggestions"] for doc in self.db.find()}
        
    
    def get_all_illegal_words(self) -> list[str]:
        all_words = [
            illegal_word["illegal_word"] for illegal_word in list(self.db.find())
        ]
        if len(all_words) == 0:
            raise ValueError("尚無危險字詞")

        return all_words
    
db_manager = DataBaseManager()

if __name__ == "__main__":
    # db_manager.add_word("外貌", "煥膚")
    print(db_manager.get_all_words_with_suggesions())
    db_manager.remove_word("外貌", "煥膚")
    print(db_manager.get_all_words_with_suggesions())