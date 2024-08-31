from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import time
from eleven_labs_tts import text_to_speech_stream
import threading
import pygame
import io
import json
import base64

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize conversation history
conversation_history = []

# Initialize pygame mixer
pygame.mixer.init()

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

        # Generate and play audio in a separate thread
        threading.Thread(target=generate_and_play_audio, args=(interviewer_message,)).start()

        return jsonify({
            "response": interviewer_message,
            "audio_url": f"/stream_audio/{len(conversation_history) - 1}"
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

        def generate():
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI interviewer conducting a job interview."},
                    *conversation_history
                ],
                stream=True
            )

            full_response = ""
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield f"data: {json.dumps({'type': 'text', 'content': content})}\n\n"

            conversation_history.append({"role": "assistant", "content": full_response})

            # Generate audio for the full response
            audio_stream = text_to_speech_stream(full_response)
            for audio_chunk in audio_stream:
                yield f"data: {json.dumps({'type': 'audio', 'content': base64.b64encode(audio_chunk).decode('utf-8')})}\n\n"

            # Send an 'end' event to signal that all data has been sent
            yield f"data: {json.dumps({'type': 'end'})}\n\n"

        return Response(generate(), mimetype="text/event-stream")

    except Exception as e:
        app.logger.error(f"Error in process_response: {str(e)}")
        return jsonify({"error": "Failed to process response. Please try again."}), 500

@app.route('/stream_audio/<int:message_index>', methods=['GET'])
def stream_audio(message_index):
    try:
        message = conversation_history[message_index]
        if message['role'] != 'assistant':
            return jsonify({"error": "Invalid message index"}), 400

        audio_stream = text_to_speech_stream(message['content'])

        def generate():
            for chunk in audio_stream:
                yield chunk

        return Response(generate(), mimetype="audio/mpeg")

    except Exception as e:
        app.logger.error(f"Error in stream_audio: {str(e)}")
        return jsonify({"error": "Failed to stream audio. Please try again."}), 500

def generate_and_play_audio(text):
    try:
        audio_stream = text_to_speech_stream(text)
        
        # Collect all audio data
        audio_data = io.BytesIO()
        for chunk in audio_stream:
            audio_data.write(chunk)
        
        audio_data.seek(0)
        
        # Play audio using pygame
        pygame.mixer.music.load(audio_data)
        pygame.mixer.music.play()
        
        # Wait for the audio to finish playing
        while pygame.mixer.music.get_busy():
            pygame.time.Clock().tick(10)
        
    except Exception as e:
        app.logger.error(f"Error generating or playing audio: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)