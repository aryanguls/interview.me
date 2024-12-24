"use client"
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FileText, Upload, Loader, Check } from 'lucide-react';
import styles from './Candidate.module.css';

export default function NewDashboard() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [interviewType, setInterviewType] = useState('resume');
  const [interviewLength, setInterviewLength] = useState('');
  const fileInputRef = useRef(null);

  const companies = ['Google', 'Meta (Facebook)', 'Tesla', 'Airbnb', 'Shopify', 'Amazon', 'Apple', 'Microsoft'];
  const roles = ['Software Engineer', 'Product Manager', 'Data Scientist', 'UX Designer', 'Research Scientist', 'Machine Learning Engineer', 'AI Engineer'];

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
      setUploadStatus('success');
    }
  };

  const handleSubmit = async () => {
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('company', selectedCompany);
    formData.append('role', selectedRole);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload_resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        window.location.href = '/setup';
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadStatus('error');
    }
  };

  const renderStep1 = () => (
    <div className={styles.contentContainer}>
      <div className={styles.uploadBox}>
        <FileText className={styles.uploadIcon} />
        <h2 className={styles.uploadTitle}>Create Your Interview</h2>
        <p className={styles.uploadSubtitle}>Upload your resume to start the interview process.</p>
        
        <div className={styles.inputContainer}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx"
          />
          {!resumeFile ? (
            <button 
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className={styles.uploadButtonIcon} />
              Upload Resume
            </button>
          ) : (
            <button 
              className={styles.detailsButton}
              onClick={() => setStep(2)}
            >
              <Check className={styles.uploadButtonIcon} />
              Enter Details
            </button>
          )}
          {resumeFile && <p className={styles.fileName}>{resumeFile.name}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.contentContainer}>
      <div className={styles.uploadBox}>
        <h2 className={styles.uploadTitle}>Interview Setup</h2>
        <p className={styles.uploadSubtitle}>Configure your interview preferences.</p>

        <div className={styles.horizontalInputs}>
          <select 
            className={styles.dropdown}
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies.map((company) => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          <select 
            className={styles.dropdown}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role *</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className={styles.horizontalInputs}>
          <select 
            className={styles.dropdown}
            value={interviewLength}
            onChange={(e) => setInterviewLength(e.target.value)}
          >
            <option value="">Select Interview Length *</option>
            <option value="20">20 mins</option>
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">60 mins</option>
          </select>

          <select 
            className={styles.dropdown}
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
          >
            <option value="resume">Resume Review</option>
            <option value="behavioral" disabled>Behavioral (Coming Soon)</option>
            <option value="technical" disabled>Technical (Coming Soon)</option>
          </select>
        </div>

        <div className={styles.bottomActions}>
          <button 
            className={styles.startButton} 
            onClick={handleSubmit}
            disabled={!selectedCompany || !selectedRole || !interviewLength}
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );

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
            <img
              src="/log-out.png"
              alt="Back"
              width={24}
              height={24}
              className={styles.backIcon}
            />
          </Link>
        </div>
      </nav>
      {step === 1 ? renderStep1() : renderStep2()}
    </main>
  );
}