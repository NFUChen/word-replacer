from typing import Literal, Any, Iterable
from dataclasses import dataclass

@dataclass
class Typography:
    type: Literal["regular", "warning"]
    content: str
    replacements: list[str]

    def to_dict(self) -> dict[str, str]:
        if self.__dict__["type"] == "regular":
            self.__dict__.pop("replacements")


        return self.__dict__

class Encoder:
    def __init__(self, raw_string: str, illegal_words_with_suggestions: dict[str, list[str]]) -> None:
        self.raw_string = raw_string
        self.illegal_words_with_suggesions = illegal_words_with_suggestions
    
    def _replace_words(self, target: str,words: Iterable[str]) -> str:
        for word in words:
            target = target.replace(word, f"|{word}|")
        return target

    def encode(self) -> dict[str, Any]:
        encoded_string = self._replace_words(self.raw_string, self.illegal_words_with_suggesions.keys())
        encoded_string_list = [word for word in  encoded_string.split("|") if word != ""]
        encoded_json = []
        for word in encoded_string_list:
            replacements = (self.illegal_words_with_suggesions[word] 
            if word in self.illegal_words_with_suggesions.keys() else []
            )
            _type = "regular" if len(replacements) == 0 else "warning"
            encoded_json.append(Typography(_type, word, replacements).to_dict())
        return {
            "raw_string": self.raw_string,
            "encoded_json": encoded_json
        }
    
    
import json

if __name__ == "__main__":
    sentences = [
        "換膚換膚是一種改變外貌的方式，透過換膚，我們能夠改變外貌，同時也為自己帶來新的生活體驗。 換膚是一個可以改變外貌的選擇，透過換膚，我們可以重新塑造自己的外貌形象。 透過換膚，我們可以改變外貌，換膚不僅是改變外貌的方式，更是一種自我轉變的過程。"
    ]
    target = {
        "換膚": ["容膚", "換皮膚"],
        "外貌": ["美貌"]
    }
    for sentence in sentences:
        print(Encoder(sentence, target).encode())
    # print(Encoder(sentence, substrings).suggestions)


