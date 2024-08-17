"use client";

import Image from 'next/image';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import { Inter, DM_Sans } from 'next/font/google';
import styles from './interview.module.css';
import { Mic, MicOff, Camera, CameraOff, MessageSquare, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function InterviewPage() {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsCameraReady(true);
    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Microphone access granted
        console.log('Microphone access granted');
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }, []);

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Here you would typically implement the actual mic toggling logic
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.srcObject = isCameraOn ? null : webcamRef.current.stream;
    }
  };

  const endCall = () => {
    router.push('/app');
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
              {isCameraReady && isCameraOn && (
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
                />
              )}
              <div className={styles.interviewerFace}>
                <Image
                  src="/interviewer.png"
                  alt="AI Interviewer"
                  width={200}
                  height={200}
                />
                <p className={styles.aiInterviewerLabel}>AI Interviewer</p>
              </div>
              <div className={styles.intervieweeName}>
                <p>Aryan Gulati</p>
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