"use client";

import Image from 'next/image';
import Webcam from 'react-webcam';
import { useEffect, useRef, useState } from 'react';
import { DM_Sans } from 'next/font/google';
import styles from './interview.module.css';
import { Mic, MicOff, Camera, CameraOff, MessageSquare, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCamera } from '../CameraContext';

const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function InterviewPage() {
  const webcamRef = useRef<Webcam>(null);
  const { stream, isCameraOn, setIsCameraOn } = useCamera();
  const [isMicOn, setIsMicOn] = useState(true);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (stream) {
      setIsStreamReady(true);
    }
  }, [stream]);

  useEffect(() => {
    if (webcamRef.current && webcamRef.current.video && stream) {
      webcamRef.current.video.srcObject = stream;
    }
  }, [stream]);

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