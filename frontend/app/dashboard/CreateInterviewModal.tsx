import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './modal.module.css';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const companies = ['Google', 'Meta (Facebook)', 'Tesla', 'Airbnb', 'Shopify', 'Amazon', 'Apple', 'Microsoft'];
const roles = ['Product Management', 'Software Engineer', 'Data Scientist', 'UX Designer', 'Marketing Manager'];

export default function CreateInterviewModal({ isOpen, onClose }: CreateInterviewModalProps) {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobLink, setJobLink] = useState('');
  const [interviewLength, setInterviewLength] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [interviewType, setInterviewType] = useState('resume');
  const [scheduleType, setScheduleType] = useState('now');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
    }
  };

  const handleCreateInterview = () => {
    localStorage.setItem('selectedCompany', selectedCompany);
    localStorage.setItem('selectedRole', selectedRole);
    localStorage.setItem('interviewType', interviewType);
    localStorage.setItem('scheduleType', scheduleType);
    router.push('/setup');
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const renderStep1 = () => (
    <div className={`${styles.stepContent} ${step === 1 ? styles.active : ''}`}>
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
          <select 
            className={styles.dropdown}
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>{company}</option>
            ))}
          </select>
          <select 
            className={styles.dropdown}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map((role, index) => (
              <option key={index} value={role}>{role}</option>
            ))}
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
    </div>
  );

  const renderStep2 = () => (
    <div className={`${styles.stepContent} ${step === 2 ? styles.active : ''}`}>
      <section className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Preparation Type</h3>
        <div className={styles.interviewTypeToggle}>
          <button
            className={`${styles.toggleButton} ${interviewType === 'resume' ? styles.active : ''}`}
            onClick={() => setInterviewType('resume')}
          >
            Resume
          </button>
          <button
            className={`${styles.toggleButton} ${interviewType === 'behavioral' ? styles.active : ''}`}
            onClick={() => setInterviewType('behavioral')}
          >
            Behavioral
          </button>
          <button
            className={`${styles.toggleButton} ${interviewType === 'technical' ? styles.active : ''}`}
            onClick={() => setInterviewType('technical')}
          >
            Technical
          </button>
        </div>
      </section>

      <section className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Interview Length</h3>
        <select 
          className={styles.dropdown}
          value={interviewLength}
          onChange={(e) => setInterviewLength(e.target.value)}
        >
          <option value="">Select Interview Length</option>
          <option value="20">20 mins</option>
          <option value="30">30 mins</option>
          <option value="45">45 mins</option>
          <option value="60">60 mins</option>
        </select>
      </section>

      <section className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Schedule Interview</h3>
        <div className={styles.scheduleTypeToggle}>
          <button
            className={`${styles.toggleButton} ${scheduleType === 'now' ? styles.active : ''}`}
            onClick={() => setScheduleType('now')}
          >
            Now
          </button>
          <button
            className={`${styles.toggleButton} ${scheduleType === 'later' ? styles.active : ''}`}
            onClick={() => setScheduleType('later')}
          >
            Later
          </button>
        </div>
        {scheduleType === 'later' && (
          <div className={styles.scheduleLaterInputs}>
            <div className={styles.dateTimeContainer}>
              <input
                type="date"
                className={styles.dateInput}
                placeholder="mm/dd/yyyy"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <select
                className={styles.timeInput}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">Select your time</option>
                {/* Add time options here */}
              </select>
            </div>
            <select
              className={styles.timeZoneInput}
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
            >
              <option value="">Time Zone</option>
              {/* Add time zone options here */}
            </select>
          </div>
        )}
      </section>
    </div>
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <h2 className={styles.modalTitle}>Create Your Interview</h2>
        <p className={styles.modalSubtitle}>Upload your resume and provide job details to start a new mock interview with our AI-Powered Interviewer.</p>
        
        <div className={styles.stepsContainer}>
          {renderStep1()}
          {renderStep2()}
        </div>

        <div className={styles.modalActions}>
          {step === 1 ? (
            <>
              <button className={styles.cancelButton} onClick={handleClose}>Cancel</button>
              <button className={styles.nextButton} onClick={() => setStep(2)}>Next</button>
            </>
          ) : (
            <>
              <button className={styles.backButton} onClick={() => setStep(1)}>Back</button>
              <button className={styles.createButton} onClick={handleCreateInterview}>Create Interview</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}