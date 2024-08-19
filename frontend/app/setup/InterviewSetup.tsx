"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Webcam from 'react-webcam';
import styles from './setup.module.css';
import { Camera, MicOff } from 'lucide-react'; // Import icons

const InterviewSetup = () => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const router = useRouter();

  const handleStartInterview = () => {
    router.push('/interview');
  };

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
          <Link href="/app" className={styles.backLink}>Back</Link>
        </header>
        
        <main className={styles.main}>
          <div className={styles.videoPreviewContainer}>
            <div className={`${styles.blackScreen} ${isCameraReady ? styles.fadeOut : ''}`}></div>
            <Webcam
              audio={false}
              videoConstraints={{
                facingMode: "user"
              }}
              className={`${styles.videoPreview} ${isCameraReady ? styles.fadeIn : ''}`}
              onUserMedia={() => setIsCameraReady(true)}
            />
            <div className={styles.nameOverlay}>Aryan Gulati</div>
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