
{
    "換膚": ["煥膚", "喚膚"], 
    "消脂": ["輕脂", "告別囤積"]
}
import uuid
from typing import Literal, Any
from dataclasses import dataclass

@dataclass
class Typography:
    type: Literal["regular", "warning"]
    content: str

    def to_dict(self) -> dict[str, str]:
        return self.__dict__

sentences = [
    "最新科技讓人類實現換膚的夢想，讓人可以在短短幾小時內改變外貌。",
    "換膚手術的崛起帶來了許多個人身份的困惑，因為透過換膚, 現在人們可以輕鬆地改變自己的外貌。",
    "換膚技術的突破不僅在美容界引起轟動，也為了影視和劇院製作提供了更大的自由度，讓演員可以迅速轉換角色形象。"
]

class Encoder:
    def __init__(self, raw_string: str, illegal_words: list[str]) -> None:
        self.raw_string = raw_string
        self.illegal_words = illegal_words

    def encode(self) -> dict[str, Any]:
        temp_encoded_word = self.raw_string
        id_lookup = {}
        for substring in self.illegal_words:
            comma_separated = temp_encoded_word.replace(substring, f"||{substring}||")
            word_list = comma_separated.split("||", -1)
            for idx,word in enumerate(word_list):
                if word == substring:
                    unique_id = str(uuid.uuid4())[:8]
                    word_list[idx] = f"|{unique_id}|"
                    id_lookup[unique_id] = {"word_replaced": substring}
            temp_encoded_word = "".join(word_list)
        typographies = []
        for word in temp_encoded_word.split("|"):
            if len(word) == 0:
                continue
            _type = "warning" if word in id_lookup else "regular"
            actual_word = id_lookup[word]["word_replaced"] if _type == "warning" else word
            
            typographies.append(Typography(_type,actual_word).to_dict())
        
        result = {
            "source": self.raw_string,
            "encoded_json": typographies
        }
        return result
    
import json

if __name__ == "__main__":
    sentences = [
        # "透過換膚，我們可以改變外貌，換膚不僅是改變外貌的方式，更是一種自我轉變的過程。",
        # "換膚是一個可以改變外貌的選擇，透過換膚，我們可以重新塑造自己的外貌形象。 透過換膚，我們可以改變外貌，換膚不僅是改變外貌的方式，更是一種自我轉變的過程。",
        "換膚是一種改變外貌的方式，透過換膚，我們能夠改變外貌，同時也為自己帶來新的生活體驗。 換膚是一個可以改變外貌的選擇，透過換膚，我們可以重新塑造自己的外貌形象。 透過換膚，我們可以改變外貌，換膚不僅是改變外貌的方式，更是一種自我轉變的過程。"

    ]
    substrings = ["換膚", "外貌"]
    for sentence in sentences:
        print(json.dumps(
            Encoder(sentence, substrings).encode(), indent= 4, ensure_ascii=False
        ))


