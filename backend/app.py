import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from io import BytesIO
from typing import IO
from elevenlabs import VoiceSettings
from elevenlabs.client import ElevenLabs
import json
import base64
import PyPDF2
import docx
import assemblyai as aai

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": "*"}})

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

aai.settings.api_key = os.getenv('ASSEMBLYAI_API_KEY')

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY environment variable not set")
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

def text_to_speech_stream(text: str) -> IO[bytes]:
    response = elevenlabs_client.text_to_speech.convert(
        voice_id="pNInz6obpgDQGcFmaJgB",  # Adam pre-made voice
        optimize_streaming_latency="0",
        output_format="mp3_22050_32",
        text=text,
        model_id="eleven_turbo_v2",
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
        ),
    )
    audio_stream = BytesIO()
    for chunk in response:
        if chunk:
            audio_stream.write(chunk)
    audio_stream.seek(0)
    return audio_stream

# Initialize conversation history
conversation_history = []

# Initialize interview context
interview_context = {
    "resume_text": "",
    "company": "",
    "role": ""
}

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file):
    doc = docx.Document(file)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

@app.route('/upload_resume', methods=['POST', 'OPTIONS'])
def upload_resume():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)

    if 'resume' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        try:
            if file.filename.lower().endswith('.pdf'):
                resume_text = extract_text_from_pdf(file)
            elif file.filename.lower().endswith('.docx'):
                resume_text = extract_text_from_docx(file)
            else:
                return jsonify({"error": "Unsupported file format"}), 400
            
            interview_context["resume_text"] = resume_text
            interview_context["company"] = request.form.get('company', '')
            interview_context["role"] = request.form.get('role', '')
            
            return jsonify({"message": "Resume uploaded successfully"}), 200
        except Exception as e:
            app.logger.error(f"Error processing resume: {str(e)}")
            return jsonify({"error": "Failed to process resume"}), 500
            
@app.route('/')
def home():
    return "Hello from Flask!"

@app.route('/start_interview', methods=['POST', 'OPTIONS'])
def start_interview():
    if request.method == 'OPTIONS':
        # Explicitly allow the origin
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)

    try:
        context = f"""You are an AI interviewer conducting a concise job interview for {interview_context['company']} for the role of {interview_context['role']}.
        The candidate's resume contains the following information:
        {interview_context['resume_text']}
        
        Please start the interview with a brief greeting and a relevant, focused question based on the candidate's resume and the job role. Keep your responses short and to the point."""

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
                {"role": "user", "content": "Start the interview with a brief greeting and a concise question."}
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
        # Explicitly allow the origin
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)

    try:
        interviewee_response = request.json.get('input')
        if not interviewee_response:
            return jsonify({"error": "No input provided"}), 400

        conversation_history.append({"role": "user", "content": interviewee_response})

        context = f"""You are an AI interviewer conducting a concise job interview for {interview_context['company']} for the role of {interview_context['role']}.
        The candidate's resume contains the following information:
        {interview_context['resume_text']}
        
        Please continue the interview based on the candidate's responses and the job role. Keep your questions and responses brief and focused. Aim for no more than 2-3 sentences per response."""

        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": context},
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

@app.route('/transcribe_and_process', methods=['POST', 'OPTIONS'])
def transcribe_and_process():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)

    try:
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']
        
        # Save the audio file temporarily
        temp_audio_path = "temp_audio.webm"
        audio_file.save(temp_audio_path)

        # Transcribe using AssemblyAI
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(temp_audio_path)

        # Remove the temporary file
        os.remove(temp_audio_path)

        if transcript.error:
            return jsonify({"error": f"Transcription failed: {transcript.error}"}), 500

        transcription_text = transcript.text

        return jsonify({
            "transcription": transcription_text
        })

    except Exception as e:
        app.logger.error(f"Error in transcribe_and_process: {str(e)}")
        return jsonify({"error": "Failed to transcribe and process audio. Please try again."}), 500
        
if __name__ == '__main__':
    app.run(debug=True)