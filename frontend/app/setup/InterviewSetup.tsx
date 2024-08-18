"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Webcam from 'react-webcam';
import styles from './setup.module.css';

interface AccountDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

function AccountDropdown({ isOpen, onClose }: AccountDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdownMenu}>
      <Link href="/account" className={styles.dropdownItem} onClick={onClose}>Account</Link>
      <Link href="/settings" className={styles.dropdownItem} onClick={onClose}>Settings</Link>
      <Link href="/signup" className={styles.dropdownItem} onClick={onClose}>Sign Up</Link>
    </div>
  );
}

const InterviewSetup = () => {
  const [stage, setStage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    };
  }, []);

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
          <div className={styles.accountContainer} ref={dropdownRef}>
            <button 
              className={styles.accountButton}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Image
                src="/placeholder-user.jpg"
                alt="User"
                width={40}
                height={40}
                className={styles.userIcon}
              />
            </button>
            <AccountDropdown 
              isOpen={isDropdownOpen} 
              onClose={() => setIsDropdownOpen(false)}
            />
          </div>
        </header>
        
        <main className={styles.main}>
          <div className={styles.videoPreviewContainer}>
            <Webcam
              audio={false}
              height={480}
              width={640}
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user"
              }}
              className={styles.videoPreview}
            />
          </div>
          <div className={styles.setupInfo}>
            <div className={styles.progressBar}>
              {stages.map((s, index) => (
                <div 
                  key={index} 
                  className={`${styles.stage} ${index <= stage ? styles.active : ''}`}
                >
                  <div className={styles.stageIndicator}>{index + 1}</div>
                  <div className={styles.stageText}>{s}</div>
                </div>
              ))}
            </div>
            {isReady && (
              <button className={styles.startButton} onClick={handleStartInterview}>
                Start Interview
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewSetup;