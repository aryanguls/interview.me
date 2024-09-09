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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

  const resetState = () => {
    setStep(1);
    setResumeFile(null);
    setJobLink('');
    setInterviewLength('');
    setSelectedCompany('');
    setSelectedRole('');
    setInterviewType('resume');
    setScheduleType('now');
    setDate('');
    setTime('');
    setTimeZone('');
    setErrors({});
  };
  
  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!resumeFile) newErrors.resume = 'Resume is required';
    if (!selectedRole && !jobLink) {
      newErrors.role = 'Role is required';
      newErrors.jobListing = 'Enter job listing OR select role above';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!interviewLength) newErrors.interviewLength = 'Interview length is required';
    if (scheduleType === 'later') {
      if (!date) newErrors.date = 'Date is required';
      if (!time) newErrors.time = 'Time is required';
      if (!timeZone) newErrors.timeZone = 'Time zone is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

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
      resetState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setResumeFile(event.target.files[0]);
      setErrors((prev) => ({ ...prev, resume: '' }));
    }
  };

  const handleCreateInterview = async () => {
    if (validateStep2()) {
      if (!resumeFile || !selectedRole) {
        alert('Please upload a resume and select a role.');
        return;
      }

      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('company', selectedCompany);
      formData.append('role', selectedRole);

      try {
        const response = await fetch(`${backendUrl}/upload_resume`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          localStorage.setItem('selectedCompany', selectedCompany);
          localStorage.setItem('selectedRole', selectedRole);
          localStorage.setItem('interviewType', interviewType);
          localStorage.setItem('scheduleType', scheduleType);
          router.push('/setup');
        } else {
          alert('Failed to upload resume. Please try again.');
        }
      } catch (error) {
        console.error('Error uploading resume:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const renderStep1 = () => (
    <div className={`${styles.stepContent} ${step === 1 ? styles.active : ''}`}>
      <section className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Resume</h3>
        <div className={styles.inputContainer}>
          <label 
            htmlFor="resumeUpload" 
            className={`${styles.uploadButton} ${errors.resume ? styles.error : ''}`}
          >
            Upload Resume *
          </label>
          <input
            type="file"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            style={{ display: 'none' }}
            required
          />
          {resumeFile && <p className={styles.fileName}>File uploaded: {resumeFile.name}</p>}
          {errors.resume && <p className={styles.errorText}>{errors.resume}</p>}
        </div>
      </section>

      <section className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Job Specifics</h3>
        <div className={styles.dropdowns}>
          <div className={styles.inputContainer}>
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
          </div>
          <div className={styles.inputContainer}>
            <select 
              className={`${styles.dropdown} ${errors.role ? styles.error : ''}`}
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setErrors((prev) => ({ ...prev, role: '', jobListing: '' }));
              }}
            >
              <option value="">Select Role *</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <p className={styles.errorText}>{errors.role}</p>}
          </div>
        </div>
        
        <div className={styles.orSeparator}>
          <span>OR</span>
        </div>
        
        <div className={styles.inputContainer}>
          <input 
            type="text" 
            placeholder="Paste job listing link here *" 
            className={`${styles.linkInput} ${errors.jobListing ? styles.error : ''}`}
            value={jobLink}
            onChange={(e) => {
              setJobLink(e.target.value);
              setErrors((prev) => ({ ...prev, role: '', jobListing: '' }));
            }}
          />
          {errors.jobListing && <p className={styles.errorText}>{errors.jobListing}</p>}
        </div>
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
            className={`${styles.toggleButton} ${styles.disabled}`}
            disabled
          >
            Behavioral
          </button>
          <button
            className={`${styles.toggleButton} ${styles.disabled}`}
            disabled
          >
            Technical
          </button>
        </div>
      </section>

      <section className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Interview Length</h3>
        <select 
          className={`${styles.dropdown} ${errors.interviewLength ? styles.error : ''}`}
          value={interviewLength}
          onChange={(e) => {
            setInterviewLength(e.target.value);
            setErrors((prev) => ({ ...prev, interviewLength: '' }));
          }}
          required
        >
          <option value="">Select Interview Length *</option>
          <option value="20">20 mins</option>
          <option value="30">30 mins</option>
          <option value="45">45 mins</option>
          <option value="60">60 mins</option>
        </select>
        {errors.interviewLength && <p className={styles.errorText}>{errors.interviewLength}</p>}
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
                className={`${styles.dateInput} ${errors.date ? styles.error : ''}`}
                placeholder="mm/dd/yyyy"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrors((prev) => ({ ...prev, date: '' }));
                }}
                required
              />
              <select
                className={`${styles.timeInput} ${errors.time ? styles.error : ''}`}
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setErrors((prev) => ({ ...prev, time: '' }));
                }}
                required
              >
                <option value="">Select your time *</option>
                {/* Add time options here */}
              </select>
            </div>
            <select
              className={`${styles.timeZoneInput} ${errors.timeZone ? styles.error : ''}`}
              value={timeZone}
              onChange={(e) => {
                setTimeZone(e.target.value);
                setErrors((prev) => ({ ...prev, timeZone: '' }));
              }}
              required
            >
              <option value="">Time Zone *</option>
              {/* Add time zone options here */}
            </select>
            {(errors.date || errors.time || errors.timeZone) && (
              <p className={styles.errorText}>Please fill in all required fields for scheduling.</p>
            )}
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
              <button className={styles.nextButton} onClick={handleNextStep}>Next</button>
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