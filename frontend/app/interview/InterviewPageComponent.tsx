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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    if (!interviewStarted) {
      setIsInterviewerTyping(true);
      startInterview();
    }
  }, [interviewStarted]);

  const startInterview = async () => {
    try {
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

      setTranscriptMessages([{
        text: data.response,
        speaker: 'interviewer',
        timestamp: new Date()
      }]);

      setIsInterviewerTyping(false);
      setInterviewStarted(true);
    } catch (error) {
      console.error("Error in interview process:", error);
      setError("Failed to start interview. Please try again.");
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

  const sendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const intervieweeMessage: TranscriptMessage = {
        text: inputMessage,
        speaker: 'interviewee',
        timestamp: new Date()
      };
      setTranscriptMessages(prev => [...prev, intervieweeMessage]);
      setInputMessage('');

      setIsInterviewerTyping(true);

      try {
        const response = await fetch(`${backendUrl}/process_response`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ input: inputMessage }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const interviewerMessage: TranscriptMessage = {
          text: data.response,
          speaker: 'interviewer',
          timestamp: new Date()
        };
        setTranscriptMessages(prev => [...prev, interviewerMessage]);
        setIsInterviewerTyping(false);
      } catch (error) {
        console.error("Error processing response:", error);
        setTranscriptMessages(prev => [
          ...prev,
          {
            text: "I'm sorry, there was an error processing your response. Please try again.",
            speaker: 'interviewer',
            timestamp: new Date()
          }
        ]);
        setIsInterviewerTyping(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

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
                  <p>{message.text}</p>
                  <span className={styles.transcriptTime}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {isInterviewerTyping && (
                <div className={`${styles.transcriptBubble} ${styles.interviewerBubble} ${styles.typingBubble}`}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={transcriptEndRef} />
            </div>
            <div className={styles.messageInputContainer}>
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                className={styles.messageInput}
              />
              <button onClick={sendMessage} className={styles.sendButton}>
                <Send size={18} color="black" />
              </button>
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
            <button className={styles.controlButton} onClick={toggleMessagePopup}>
              <MessageSquare />
            </button>
            <button className={`${styles.controlButton} ${styles.endCallButton}`} onClick={endCall}>
              <PhoneOff />
            </button>
          </div>
          <div className={styles.spacer}></div>
        </div>
  
        {showMessagePopup && (
          <>
            <div className={styles.overlay} onClick={toggleMessagePopup}></div>
            <div className={styles.messagePopup}>
              <div className={styles.messagePopupHeader}>
                <button onClick={toggleMessagePopup} className={styles.minimizeButton}>
                  <ChevronDown size={18} />
                </button>
                <h3 className={styles.chatHeading}>Chat</h3>
              </div>
              <div className={styles.messageList}>
                {chatMessages.map((message, index) => (
                  <div key={index} className={styles.messageBubble}>
                    {message.text}
                    <div className={styles.messageTime}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
              <div className={styles.messageInputWrapper}>
                <div className={styles.messageInputContainer}>
                  <textarea
                    value={chatInputMessage}
                    onChange={handleChatInputChange}
                    onKeyPress={handleChatKeyPress}
                    placeholder="Type a message..."
                    className={styles.messageInput}
                    rows={2}
                  />
                  <button onClick={sendChatMessage} className={styles.sendButton}>
                    <Send size={18} color="black" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}