import assemblyai as aai
import pyaudio
import numpy as np
import threading
import time

aai.settings.api_key = ""

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

audio_buffer = []
is_recording = False
should_exit = False

def toggle_recording():
    global is_recording
    is_recording = not is_recording
    if is_recording:
        print("Recording started. Press Enter to stop.")
    else:
        print("Recording stopped. Transcribing...")
        transcribe_audio()

def transcribe_audio():
    if not audio_buffer:
        print("No audio recorded.")
        return

    audio_data = np.concatenate(audio_buffer)
    audio_bytes = audio_data.tobytes()

    def on_open(session_opened: aai.RealtimeSessionOpened):
        print("Session ID:", session_opened.session_id)

    def on_data(transcript: aai.RealtimeTranscript):
        if isinstance(transcript, aai.RealtimeFinalTranscript):
            print("Transcription:", transcript.text)

    def on_error(error: aai.RealtimeError):
        print("An error occurred:", error)

    def on_close():
        print("Transcription complete.")

    transcriber = aai.RealtimeTranscriber(
        sample_rate=RATE,
        on_data=on_data,
        on_error=on_error,
        on_open=on_open,
        on_close=on_close,
    )

    transcriber.connect()
    transcriber.stream(audio_bytes)
    transcriber.close()

    # Clear the buffer after transcription
    audio_buffer.clear()

def audio_callback(in_data, frame_count, time_info, status):
    if is_recording:
        audio_buffer.append(np.frombuffer(in_data, dtype=np.int16))
    return (in_data, pyaudio.paContinue)

def main():
    global should_exit

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK,
                    stream_callback=audio_callback)

    stream.start_stream()

    print("Press Enter to start/stop recording. Type 'quit' to exit.")

    while not should_exit:
        user_input = input()
        if user_input.lower() == 'quit':
            should_exit = True
        else:
            toggle_recording()

    stream.stop_stream()
    stream.close()
    p.terminate()

if __name__ == "__main__":
    main()