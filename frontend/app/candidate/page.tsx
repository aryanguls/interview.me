"use client"

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Change this import  
import styles from './Candidate.module.css';
import { FileText, Upload, Loader, Check } from 'lucide-react';

export default function Candidate() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
  
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
        handleUpload(event.target.files[0]);
      }
    };
  
    const handleUpload = async (fileToUpload: File) => {
      setUploadStatus('uploading');
  
      // Simulating file upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      setUploadStatus('success');
  
      // Wait for a moment to show the success state before redirecting
      setTimeout(() => {
        // Redirect to Google SSO sign-up page
        // Replace this URL with the actual Google SSO sign-up URL for your application
        router.push('https://accounts.google.com/signup');
      }, 1000);
    };
  
    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };
  
    const getButtonIcon = () => {
      switch (uploadStatus) {
        case 'uploading':
          return <Loader className={`${styles.uploadButtonIcon} ${styles.spin}`} size={20} />;
        case 'success':
          return <Check className={styles.uploadButtonIcon} size={20} />;
        default:
          return <Upload className={styles.uploadButtonIcon} size={20} />;
      }
    };
  
    return (
      <main className={styles.container}>
        <nav className={styles.navbar}>
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
          <div className={styles.backButtonContainer}>
            <Link href="/" className={styles.backButton}>
              Back
            </Link>
          </div>
        </nav>
        <div className={styles.contentContainer}>
          <div className={styles.uploadBox}>
            <FileText className={styles.uploadIcon} />
            <h2 className={styles.uploadTitle}>Create Your Interview</h2>
            <p className={styles.uploadSubtitle}>Upload your resume and provide job details to start the interview.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx"
            />
            <button 
            className={styles.uploadButton} 
            onClick={triggerFileInput}
            >
            {getButtonIcon()}
            Upload resume
            </button>
            <div className={styles.fileNameContainer}>
            {file && <p className={styles.fileName}>{file.name}</p>}
            </div>
          </div>
        </div>
      </main>
    );
  }