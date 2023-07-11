def search_substring(string: str, substring: str) -> list[int]:
    searched = []
    for idx in range(len(string) - len(substring) + 1):
        if string[idx:idx + len(substring)] == substring:
            searched.append(idx)
    return searched

            
import uuid
def encode(string: str, substrings: set[str]) -> str:
    temp_encoded_word = string
    id_lookup = {}
    for substring in substrings:
        comma_separated = temp_encoded_word.replace(substring, f"|{substring}|")
        word_list = comma_separated.split("|", -1)
        for idx,word in enumerate(word_list):
            if word == substring:
                unique_id = str(uuid.uuid4())[:8]
                word_list[idx] = f"{unique_id}"
                id_lookup[unique_id] = {"word_replaced": substring}
        temp_encoded_word = "".join(word_list)
    result = {
        "source": string,
        "encoded": temp_encoded_word,
        "ids": id_lookup
    }
    for _id in id_lookup:
        id_index = temp_encoded_word.index(_id)
        result["ids"][_id]["index"] = id_index

    return result
import json

if __name__ == "__main__":
    sentences = [
        "透過換膚，我們可以改變外貌，換膚不僅是改變外貌的方式，更是一種自我轉變的過程。",
        "換膚是一個可以改變外貌的選擇，透過換膚，我們可以重新塑造自己的外貌形象。",
        "換膚是一種改變外貌的方式，透過換膚，我們能夠改變外貌，同時也為自己帶來新的生活體驗。"

    ]
    substrings = ["換膚", "外貌"]
    for sentence in sentences:
        print(json.dumps(
            encode(sentence, substrings), indent= 4, ensure_ascii=False
        ))
    