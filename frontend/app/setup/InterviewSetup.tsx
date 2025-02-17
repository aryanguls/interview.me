"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Webcam from 'react-webcam';
import styles from './setup.module.css';

const NUM_AUDIO_LEVELS = 4;

const InterviewSetup = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const router = useRouter();
  const [audioLevels, setAudioLevels] = useState(Array(NUM_AUDIO_LEVELS).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        mediaStream = stream;
        setStream(stream);
        setIsCameraOn(true);
        setupAudioAnalyser(stream);
      })
      .catch(error => {
        console.error("Error accessing media devices:", error);
        setIsCameraOn(false);
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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

  const handleStartInterview = () => {
    router.push('/interview');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <video
            src="/Animation - 1727914209042 - black.webm"
            width={60}
            height={60}
            className={styles.logo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <Link href="/dashboard" className={styles.backButtonContainer}>
          <img
            src="/log-out.png"
            alt="Back"
            width={24}
            height={24}
            className={styles.backIcon}
          />
        </Link>
      </header>
        
        <main className={styles.main}>
          <div className={styles.videoPreviewContainer}>
            <div className={`${styles.blackScreen} ${isCameraOn ? styles.fadeOut : ''}`}></div>
            <Webcam
              audio={false}
              videoConstraints={{
                facingMode: "user"
              }}
              className={`${styles.videoPreview} ${isCameraOn ? styles.fadeIn : ''}`}
            />
            <div className={styles.nameOverlay}>Aryan Gulati</div>
            <div className={styles.audioIndicator}>
              {audioLevels.map((level, index) => (
                <div 
                  key={index} 
                  className={`${styles.audioBar} ${level > 0 ? styles.active : ''}`}
                />
              ))}
            </div>
          </div>
          <div className={styles.setupInfo}>
            <h2 className={styles.setupTitle}>Ready to Join?</h2>
            <div className={styles.interviewer}>
              <Image
                src="/computer.png"
                alt="Interviewer"
                width={60}
                height={60}
                className={styles.interviewerImage}
              />
              <p className={styles.interviewerName}>Lucence is in the call</p>
            </div>
            <button 
              className={styles.startButton}
              onClick={handleStartInterview}
            >
              Start Interview
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewSetup;