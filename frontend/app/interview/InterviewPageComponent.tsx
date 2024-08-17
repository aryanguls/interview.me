"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import styles from './interview.module.css';

export default function InterviewPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [interviewerTranscript, setInterviewerTranscript] = useState<string[]>([]);

  const handleEndInterview = () => {
    router.push('/app');
  };

  useEffect(() => {
    setIsCameraReady(true);
    const demoTranscript = [
      "Hello, welcome to the interview.",
      "Can you tell me about yourself?",
      "What are your strengths and weaknesses?",
    ];
    setInterviewerTranscript(demoTranscript);
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
          <button 
            className={styles.endInterviewButton}
            onClick={handleEndInterview}
          >
            End Interview
          </button>
        </header>
        
        <main className={styles.main}>
          <div className={styles.interviewContent}>
            <div className={styles.interviewerSection}>
              <div className={styles.interviewerFace}>
                <p className={styles.aiInterviewerLabel}>AI Interviewer</p>
                <Image
                  src="/api/placeholder/300/300"
                  alt="AI Interviewer"
                  width={300}
                  height={300}
                />
              </div>
              <div className={styles.transcriptBox}>
                {interviewerTranscript.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
            <div className={styles.candidateSection}>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}