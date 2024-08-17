"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import styles from './interview.module.css';
import { Mic, Camera, MessageSquare, PhoneOff } from 'lucide-react';

export default function InterviewPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    setIsCameraReady(true);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlemishes}></div>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo (1).png"
              alt="Lucence Logo"
              width={40}
              height={40}
            />
          </div>
        </header>
        
        <main className={styles.main}>
          <div className={styles.interviewContainer}>
            <div className={styles.videoSection}>
              {isCameraReady && (
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
                <p className={styles.aiInterviewerLabel}>AI Interviewer</p>
                <Image
                  src="/Screenshot 2024-08-16 at 5.22.53 PM.png"
                  alt="AI Interviewer"
                  width={200}
                  height={200}
                />
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
        
        <div className={styles.controlsBarWrapper}>
          <div className={styles.controlsBar}>
            <button className={styles.controlButton}><Mic /></button>
            <button className={styles.controlButton}><Camera /></button>
            <button className={styles.controlButton}><MessageSquare /></button>
            <button className={`${styles.controlButton} ${styles.endCallButton}`}><PhoneOff /></button>
          </div>
        </div>
      </div>
    </div>
  );
}