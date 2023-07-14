
from flask import Flask, request
import json
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
            }
        except Exception as error:
            return {
                "data": None,
                "error": str(error)
            }, 500  # Return JSON response with error message and status code 500
    return decorated

@app.route("/")
def index():
    return f"[{host}] Welcom to encoder server"

@app.route("/encode", methods=["POST"])
def encode():
    json_data = request.get_json()
    words = db_manager.get_all_illegal_words()
    if len(words) == 0:
        return "No illegal words", 404
    
    encoded = Encoder(json_data["source"], words).encode()
    history.add_action(encoded)
    
    return encoded, 200
@app.route("/add_word", methods=["POST"])
@handle_server_errors
def add_word():
    json_data = request.get_json()
    illegal_word = json_data["illegal_word"]
    word = json_data["word"]
    db_manager.add_word(
        illegal_word=illegal_word,
        word=word
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
    return json.dumps(suggestions,default=str)

@app.route("/all_words_with_suggesions")
@handle_server_errors
def get_all_words_with_suggesions():
    return json.dumps(db_manager.get_all_words_with_suggesions(),default=str)


@app.routre("/undo")
@handle_server_errors
def undo():
    return history.undo()

@app.routre("/redo")
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