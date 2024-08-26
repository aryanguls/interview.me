from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import time

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    print("Home route accessed")
    return "Hello from Flask!"

@app.route('/test', methods=['GET'])
def test():
    print("Test route accessed")
    return jsonify({"message": "Flask server is running!"})

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
    print("Flask server has stopped.")