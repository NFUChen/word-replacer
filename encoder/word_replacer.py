'''
{
    "source": "換膚是一種改變外貌的方式，透過換膚，我們能夠改變外貌，同時也為自己帶來新的生活體驗。",
    "encoded": "|976816d7|是一種改變|10a57c9c|的方式，透過|17aa2e43|，我們能夠改變|9af60e66|，同時也為自己帶來新的生活體驗。",
    "encoded_json": [
        {
            "type": "warning",
            "content": "換膚",
            "content_id": "976816d7"
        },
        {
            "type": "regular",
            "content": "是一種改變",
            "content_id": null
        },
        {
            "type": "warning",
            "content": "外貌",
            "content_id": "10a57c9c"
        },
        {
            "type": "regular",
            "content": "的方式，透過",
            "content_id": null
        },
        {
            "type": "warning",
            "content": "換膚",
            "content_id": "17aa2e43"
        },
        {
            "type": "regular",
            "content": "，我們能夠改變",
            "content_id": null
        },
        {
            "type": "warning",
            "content": "外貌",
            "content_id": "9af60e66"
        },
        {
            "type": "regular",
            "content": "，同時也為自己帶來新的生活體驗。",
            "content_id": null
        }
    ]
}
'''

class WordReplacer:
    def __init__(self, encoded: dict[str, str | dict[str, str]]) -> None:
        self.encoded = encoded
