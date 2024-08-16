import React, { useState, useRef, useEffect } from 'react';
import styles from './modal.module.css';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInterviewModal({ isOpen, onClose }: CreateInterviewModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobLink, setJobLink] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2 className={styles.modalTitle}>Create Your Interview</h2>
        <p className={styles.modalSubtitle}>Upload your resume and provide job details to start a new mock interview with our AI-Powered Interviewer.</p>
        
        <section className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Resume</h3>
          <label htmlFor="resumeUpload" className={styles.uploadButton}>
            Upload Resume
          </label>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            style={{ display: 'none' }}
          />
          {resumeFile && <p className={styles.fileName}>File uploaded: {resumeFile.name}</p>}
        </section>

        <section className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Job Specifics</h3>
          <div className={styles.dropdowns}>
            <select className={styles.dropdown}>
              <option value="">Select Company</option>
              {/* Add company options here */}
            </select>
            <select className={styles.dropdown}>
              <option value="">Select Role</option>
              {/* Add role options here */}
            </select>
          </div>
          
          <div className={styles.orSeparator}>
            <span>OR</span>
          </div>
          
          <input 
            type="text" 
            placeholder="Paste job listing link here" 
            className={styles.linkInput}
            value={jobLink}
            onChange={(e) => setJobLink(e.target.value)}
          />
        </section>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.createButton}>Create Interview</button>
        </div>
      </div>
    </div>
  );
}