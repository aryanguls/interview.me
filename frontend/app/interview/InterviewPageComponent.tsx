"use client";

import Image from 'next/image';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import { DM_Sans } from 'next/font/google';
import styles from './interview.module.css';
import { Mic, MicOff, Camera, CameraOff, MessageSquare, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

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

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        setStream(mediaStream);
        setIsStreamReady(true);
        setupAudioAnalyser(mediaStream);
      })
      .catch(error => {
        console.error("Error accessing media devices:", error);
      });

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
      webcamRef.current.video.srcObject = stream;
    }
  }, [stream]);

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

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
      }
    }
  };

  const endCall = () => {
    router.push('/dashboard');
  };

  const toggleMessagePopup = () => {
    setShowMessagePopup(!showMessagePopup);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <main className={styles.main}>
          <div className={styles.interviewContainer}>
            <div className={styles.videoSection}>
              {isStreamReady && (
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
                />
              )}
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
              {/* Transcript content will be added here */}
            </div>
          </div>
        </main>
        
        <div className={styles.controlsBar}>
          <div className={`${styles.interviewType} ${dm_sans.className}`}>
            <p>11:59 PM | Software Engineer Interview</p>
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
              <p>Message window placeholder</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}