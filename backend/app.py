from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
from eleven_labs_tts import text_to_speech_stream
import json
import base64

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for now, adjust in production

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize conversation history
conversation_history = []

@app.route('/')
def home():
    return "Hello from Flask!"

@app.route('/start_interview', methods=['POST', 'OPTIONS'])
def start_interview():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI interviewer conducting a job interview."},
                {"role": "user", "content": "Start the interview with a greeting and a question."}
            ]
        )

        interviewer_message = completion.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": interviewer_message})

        # Generate audio data
        audio_stream = text_to_speech_stream(interviewer_message)
        audio_data = b''.join(audio_stream)
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return jsonify({
            "response": interviewer_message,
            "audio_data": audio_base64
        })
    except Exception as e:
        app.logger.error(f"Error in start_interview: {str(e)}")
        return jsonify({"error": "Failed to start interview. Please try again."}), 500

@app.route('/process_response', methods=['POST', 'OPTIONS'])
def process_response():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        interviewee_response = request.json.get('input')
        if not interviewee_response:
            return jsonify({"error": "No input provided"}), 400

        conversation_history.append({"role": "user", "content": interviewee_response})

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI interviewer conducting a job interview."},
                *conversation_history
            ]
        )

        interviewer_message = completion.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": interviewer_message})

        # Generate audio data
        audio_stream = text_to_speech_stream(interviewer_message)
        audio_data = b''.join(audio_stream)
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')

        return jsonify({
            "response": interviewer_message,
            "audio_data": audio_base64
        })

    except Exception as e:
        app.logger.error(f"Error in process_response: {str(e)}")
        return jsonify({"error": "Failed to process response. Please try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)