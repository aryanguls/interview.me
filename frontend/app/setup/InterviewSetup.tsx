"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Webcam from 'react-webcam';
import styles from './setup.module.css';
import { Camera, MicOff } from 'lucide-react'; // Import icons
import { useCamera } from '../CameraContext';

const InterviewSetup = () => {
  const { isCameraOn, setIsCameraOn } = useCamera();
  const router = useRouter();

  const handleStartInterview = () => {
    router.push('/interview');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlemishes}></div>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <Link href="/dashboard" className={styles.logoLink}>
            <div className={styles.logoContainer}>
              <Image
                src="/logo (1).png"
                alt="Lucence Logo"
                width={40}
                height={40}
              />
            </div>
          </Link>
          <Link href="/dashboard" className={styles.backLink}>Back</Link>
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
              onUserMedia={() => setIsCameraOn(true)}
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