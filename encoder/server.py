
from flask import Flask, request
from flask_cors import CORS
import functools
import socket
from encoder import Encoder
from database_manager import db_manager
from history import History


history = History()
app = Flask(__name__)
CORS(app)
host = socket.gethostname()

def handle_server_errors(func):
    @functools.wraps(func)
    def decorated(*args, **kwargs):
        try:
            return {
                "data": func(*args, **kwargs),
                "error": None
            }, 200
        except Exception as error:
            return {
                "data": None,
                "error": str(error)
            }, 200
    return decorated

@app.route("/")
def index():
    return f"[{host}] Welcom to encoder server"

@app.route("/encode", methods=["POST"])
@handle_server_errors
def encode():
    json_data = request.get_json()
    words_with_suggestions = db_manager.get_all_words_as_key_with_suggesions()
    
    
    encoded = Encoder(json_data["source"], words_with_suggestions).encode()
    history.add_action(encoded)
    
    return encoded
@app.route("/add_word_with_suggestions", methods=["POST"])
@handle_server_errors
def add_word_with_suggestions():
    json_data = request.get_json()
    illegal_word = json_data["illegal_word"]
    suggestions = json_data["suggestions"]
    db_manager.add_word_with_suggestions(
        illegal_word=illegal_word,
        suggestions=suggestions
    )

    return "OK"

@app.route("/remove_word", methods=["POST"])
@handle_server_errors
def remove_word():
    json_data = request.get_json()
    illegal_word = json_data["illegal_word"]
    word = json_data["word"]
    db_manager.remove_word(
        illegal_word=illegal_word,
        word=word
    )

    return "OK"

@app.route("/suggestions", methods=["POST"])
@handle_server_errors
def get_suggestions():
    json_data = request.get_json()
    illegal_word = json_data["illegal_word"]
    suggestions = db_manager.get_suggestions(illegal_word=illegal_word)
    return suggestions

@app.route("/all_words_with_suggesions")
@handle_server_errors
def get_all_words_with_suggesions():
    return db_manager.get_all_words_with_suggesions()

@app.route("/remove_illegal_words", methods=["POST"])
@handle_server_errors
def remove_illegal_word() -> None:
    json_data = request.get_json()
    illegal_word = json_data["illegal_words"]
    db_manager.remove_illegal_words(illegal_word)

    return "OK"

@app.route("/rename_illegal_word", methods=["POST"])
@handle_server_errors
def update_illegal_word() -> None:
    json_data = request.get_json()
    illegal_word = json_data["illegal_word"]
    new_illegal_word = json_data["new_illegal_word"]
    db_manager.rename_illegal_word(illegal_word, new_illegal_word)

    return "OK"

@app.route("/update_suggestions", methods=["POST"])
@handle_server_errors
def update_suggestions() -> None:
    json_data = request.get_json()
    illegal_word = json_data["illegal_word"]
    suggestions = json_data["suggestions"]
    db_manager.update_suggestions(illegal_word, suggestions)

    return "OK"


@app.route("/undo")
@handle_server_errors
def undo():
    return history.undo()

@app.route("/redo")
@handle_server_errors
def redo():
    return history.redo()


@app.route("/help")
def help():
    usage = f"""
[{host}]
API Usage:
    - GET /: Get the welcome message

    - POST /encode:
    - Method: POST
    - Parameters:
        - source (string): The source text to be encoded
"""
    return usage, 200