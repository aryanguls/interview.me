"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Webcam from 'react-webcam';
import styles from './setup.module.css';

const InterviewSetup = () => {
  const [stage, setStage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const stages = [
    "Reading your resume",
    "Preparing questions for your role",
    "Finding you an interviewer"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage < 2) {
        setStage(stage + 1);
      } else {
        setIsReady(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [stage]);

  const handleStartInterview = () => {
    if (isReady) {
      router.push('/interview');
    }
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
            <Webcam
              audio={false}
              height={480}
              width={720}
              videoConstraints={{
                width: 720,
                height: 480,
                facingMode: "user"
              }}
              className={styles.videoPreview}
            />
          </div>
          <div className={styles.setupInfo}>
            <h2 className={styles.setupTitle}>Ready to Join?</h2>
            <div className={styles.progressBar}>
              {stages.map((s, index) => (
                <div 
                  key={index} 
                  className={`${styles.stage} ${index <= stage ? styles.active : ''}`}
                >
                  <div className={styles.stageIndicator}>
                    <span className={styles.stageNumber}>{index + 1}</span>
                  </div>
                  <div className={styles.stageText}>{s}</div>
                </div>
              ))}
            </div>
            <button 
              className={`${styles.startButton} ${!isReady ? styles.disabled : ''}`} 
              onClick={handleStartInterview}
              disabled={!isReady}
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