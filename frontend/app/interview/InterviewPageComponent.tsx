"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import styles from './interview.module.css';
import { Mic, MicOff, Camera, CameraOff, MessageSquare, PhoneOff, Send, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

interface TranscriptMessage {
  text: string;
  speaker: 'interviewer' | 'interviewee';
  timestamp: Date;
  isLoading?: boolean;
}

interface Message {
  text: string;
  timestamp: Date;
}

const AudioIndicator = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className={`${styles.interviewerAudioIndicator} ${isPlaying ? styles.playing : ''}`}>
    <div className={styles.bar}></div>
    <div className={styles.bar}></div>
    <div className={styles.bar}></div>
  </div>
);

export default function InterviewPage() {
  const webcamRef = useRef<Webcam>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [audioLevels, setAudioLevels] = useState([0, 0, 0, 0]);
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<TranscriptMessage[]>([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInterviewerTyping, setIsInterviewerTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInputMessage, setChatInputMessage] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [greetingDisplayed, setGreetingDisplayed] = useState(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isResponseActive, setIsResponseActive] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

  let isPlaying = false;

  const playAudio = (audioData: string): Promise<void> => {
    return new Promise((resolve) => {
      if (isAudioPlaying) {
        console.log("Audio already playing, skipping.");
        resolve();
        return;
      }
      setIsAudioPlaying(true);

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const arrayBuffer = base64ToArrayBuffer(audioData);
      audioContext.decodeAudioData(arrayBuffer, (buffer) => {
        const source = audioContext.createBufferSource();
        audioSourceRef.current = source;
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          setIsAudioPlaying(false);
          audioSourceRef.current = null;
          resolve();
        };
        source.start(0);
      });
    });
  };


  const interviewStartedRef = useRef(false);

  useEffect(() => {
    if (!interviewStartedRef.current) {
      interviewStartedRef.current = true;
      startInterview();
    }
  }, []);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // const playAudioStream = async (url: string) => {
  //   if (!audioContextRef.current) return;

  //   try {
  //     const response = await fetch(url);
  //     const arrayBuffer = await response.arrayBuffer();
  //     const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

  //     const source = audioContextRef.current.createBufferSource();
  //     source.buffer = audioBuffer;
  //     source.connect(audioContextRef.current.destination);
      
  //     setIsAudioPlaying(true);
  //     source.start(0);

  //     source.onended = () => {
  //       setIsAudioPlaying(false);
  //     };
  //   } catch (error) {
  //     console.error("Error playing audio:", error);
  //     setIsAudioPlaying(false);
  //   }
  // };

  const startInterview = async () => {
    try {
      setTranscriptMessages([{
        text: "👋",
        speaker: 'interviewer',
        timestamp: new Date()
      }]);

      setIsInterviewerTyping(true);
      const response = await fetch(`${backendUrl}/start_interview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to start interview');
      }
      const data = await response.json();
  
      setTranscriptMessages(prev => [...prev, {
        text: data.response,
        speaker: 'interviewer',
        timestamp: new Date()
      }]);
      setIsInterviewerTyping(false);
      setGreetingDisplayed(true);
  
      // Keep the button disabled until audio finishes playing
      setIsButtonDisabled(true);
      
      setTimeout(() => {
        playAudio(data.audio_data).then(() => {
          setIsButtonDisabled(false);
        });
      }, 1000);
  
      setInterviewStarted(true);
    } catch (error) {
      console.error("Error in interview process:", error);
      setError("Failed to start interview. Please try again.");
      setIsInterviewerTyping(false);
    }
  };

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptMessages]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch company and role from localStorage or state management solution
    const storedCompany = localStorage.getItem('selectedCompany') || '';
    const storedRole = localStorage.getItem('selectedRole') || '';
    setCompanyName(storedCompany);
    setRoleName(storedRole);
  }, []);

  const setupMediaStream = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setIsStreamReady(true);
      setupAudioAnalyser(mediaStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }, []);

  useEffect(() => {
    setupMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video && stream) {
      webcamRef.current.video.srcObject = isCameraOn ? stream : null;
    }
  }, [stream, isCameraOn]);

  const setupAudioAnalyser = (stream: MediaStream) => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 32;

    const updateAudioLevel = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = Math.min(average / 128, 1);

        setAudioLevels([
          normalizedLevel > 0.25 ? 1 : 0,
          normalizedLevel > 0.5 ? 1 : 0,
          normalizedLevel > 0.75 ? 1 : 0,
          normalizedLevel > 0.9 ? 1 : 0
        ]);
      }
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
  };

  const toggleCamera = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  }, [stream, isCameraOn]);

  const endCall = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsAudioPlaying(false);
    router.push('/dashboard');
  };

  const renderOverlay = () => {
    if (!isMicOn && !isCameraOn) {
      return (
        <div className={styles.deviceOffOverlay}>
          <div className={styles.iconContainer}>
            <MicOff size={48} />
            <CameraOff size={48} />
          </div>
          <p>Mic and Camera are off</p>
        </div>
      );
    } else if (!isMicOn) {
      return (
        <div className={styles.deviceOffOverlay}>
          <MicOff size={48} />
          <p>Mic is off</p>
        </div>
      );
    } else if (!isCameraOn) {
      return (
        <div className={styles.deviceOffOverlay}>
          <CameraOff size={48} />
          <p>Camera is off</p>
        </div>
      );
    }
    return null;
  };

  const toggleMessagePopup = () => {
    setShowMessagePopup(!showMessagePopup);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const sendMessage = async (message: string) => {
    setIsInterviewerTyping(true);

    try {
      const response = await fetch(`${backendUrl}/process_response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      setIsInterviewerTyping(false);
      setTranscriptMessages(prev => [
        ...prev,
        {
          text: data.response,
          speaker: 'interviewer',
          timestamp: new Date()
        }
      ]);

      await playAudio(data.audio_data);
      setIsButtonDisabled(false);

    } catch (error) {
      console.error("Error processing response:", error);
      setIsInterviewerTyping(false);
      setTranscriptMessages(prev => [
        ...prev,
        {
          text: "I'm sorry, there was an error processing your response. Please try again.",
          speaker: 'interviewer',
          timestamp: new Date()
        }
      ]);
      setIsButtonDisabled(false);
    }
  };
  
  // Helper function to convert base64 to Uint8Array
  // const base64ToUint8Array = (base64: string) => {
  //   const binaryString = window.atob(base64);
  //   const len = binaryString.length;
  //   const bytes = new Uint8Array(len);
  //   for (let i = 0; i < len; i++) {
  //     bytes[i] = binaryString.charCodeAt(i);
  //   }
  //   return bytes;
  // };

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter') {
  //     sendMessage();
  //   }
  // };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendChatMessage = () => {
    if (chatInputMessage.trim() !== '') {
      const newMessage: Message = {
        text: chatInputMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatInputMessage('');
    }
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInputMessage(e.target.value);
  };

  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const startRecording = useCallback(() => {
    if (stream) {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [stream]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch(`${backendUrl}/transcribe_and_process`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to transcribe and process audio');
          }

          const data = await response.json();
          
          setTranscriptMessages(prev => {
            const updatedMessages = [...prev];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage.speaker === 'interviewee' && lastMessage.isLoading) {
              lastMessage.text = data.transcription;
              lastMessage.isLoading = false;
            }
            return updatedMessages;
          });

          await sendMessage(data.transcription);
        } catch (error) {
          console.error("Error processing audio:", error);
          setError("Failed to process audio. Please try again.");
        }
      };
    }
  }, [isRecording, sendMessage]);

  const handleResponseButton = () => {
    if (!isResponseActive) {
      startResponse();
    } else {
      stopResponse();
    }
  };

  const startResponse = () => {
    setIsResponseActive(true);
    setTranscriptMessages(prev => [...prev, {
      text: '',
      speaker: 'interviewee',
      timestamp: new Date(),
      isLoading: true
    }]);
    startRecording();
  };

  const stopResponse = () => {
    setIsResponseActive(false);
    stopRecording();
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <main className={styles.main}>
          <div className={styles.interviewContainer}>
            <div className={styles.videoSection}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user"
                }}
                className={styles.camera}
                mirrored
                forceScreenshotSourceSize
              />
              {!isCameraOn && <div className={styles.cameraOff}></div>}
              {renderOverlay()}
              <div className={styles.interviewerFace}>
                <div className={styles.logoContainer}>
                  <Image
                    src="/computer.png"
                    alt="Lucence Logo"
                    width={60}
                    height={60}
                    className={styles.logo}
                  />
                  <p className={styles.logoText}>Lucence</p>
                </div>
                <AudioIndicator isPlaying={isAudioPlaying} />
              </div>
              <div className={styles.intervieweeName}>
                <p>Aryan Gulati</p>
              </div>
              <div className={styles.audioIndicator}>
                {audioLevels.map((level, index) => (
                  <div 
                    key={index} 
                    className={`${styles.audioBar} ${level > 0 ? styles.active : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.transcriptContainer}>
            <div className={styles.transcriptHeader}>
              <h3 className={styles.transcriptTitle}>Live Transcript</h3>
            </div>
            <div className={styles.transcriptBox}>
              {transcriptMessages.map((message, index) => (
                <div 
                  key={index} 
                  className={`${styles.transcriptBubble} ${
                    message.speaker === 'interviewer' ? styles.interviewerBubble : styles.intervieweeBubble
                  }`}
                >
                  {message.isLoading ? (
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              ))}
              {isInterviewerTyping && (
                <div className={`${styles.transcriptBubble} ${styles.interviewerBubble}`}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </main>
  
        <div className={styles.controlsBar}>
          <div className={`${styles.interviewType} ${dm_sans.className}`}>
            <p>{currentTime} | {companyName} {roleName} Interview</p>
          </div>
          <div className={styles.controlButtons}>
            <button className={styles.controlButton} onClick={toggleMic}>
              {isMicOn ? <Mic /> : <MicOff />}
            </button>
            <button className={styles.controlButton} onClick={toggleCamera}>
              {isCameraOn ? <Camera /> : <CameraOff />}
            </button>
            <button className={`${styles.controlButton} ${styles.endCallButton}`} onClick={endCall}>
              <PhoneOff />
            </button>
          </div>
          <div className={styles.responseButtonContainer}>
            <button
              className={`${styles.responseButton} ${isResponseActive ? styles.stopResponse : styles.startResponse}`}
              onClick={handleResponseButton}
              disabled={isButtonDisabled}
            >
              {isResponseActive ? 'Stop Response' : 'Start Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}