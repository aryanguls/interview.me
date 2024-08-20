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

@app.route('/process_audio', methods=['POST'])
def process_audio():
    print("Process audio route accessed")
    print("Request headers:", request.headers)
    print("Request data:", request.get_data())
    
    try:
        audio_data = request.json['audio_data']
        
        # Convert audio data to numpy array
        audio_array = np.array(audio_data)
        
        # Simple silence detection
        threshold = 0.01
        is_silent = np.max(np.abs(audio_array)) < threshold
        
        if is_silent:
            # If silent, return empty text
            return jsonify({'text': ''})
        else:
            # If not silent, return a placeholder text
            return jsonify({'text': f"Transcribed text at {time.time()}"})
    except Exception as e:
        print("Error processing request:", str(e))
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True)
    print("Flask server has stopped.")