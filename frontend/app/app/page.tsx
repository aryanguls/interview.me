'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect, MouseEvent } from 'react';
import styles from './app.module.css';
import CreateInterviewModal from './CreateInterviewModal';

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

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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


  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlemishes}></div>
      <div className={`${styles.contentWrapper} ${isModalOpen ? styles.blurred : ''}`}>
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
          <div className={styles.controlsContainer}>
            <div className={styles.tabsContainer}>
              {['All', 'Completed', 'Scheduled'].map((tab) => (
                <button 
                  key={tab}
                  className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button 
              className={styles.addButton} 
              onClick={() => setIsModalOpen(true)}
            >
              Start New Interview
            </button>
          </div>
          <div className={styles.mockInterviewContainer}>
            <div className={styles.mockInterviewHeader}>
              <h2 className={styles.mockInterviewTitle}>Mock Interviews</h2>
              <p className={styles.mockInterviewSubtitle}>Practice your interview skills with our AI-powered mock interviews.</p>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>COMPANY</th>
                  <th>ROLE</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>SCORE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className={styles.placeholderCell}>
                    <div className={styles.placeholderContent}>
                      <Image
                        src="/placeholder.png"
                        alt="Placeholder"
                        width={200}
                        height={200}
                        className={styles.placeholderImage}
                      />
                      {/* <p className={styles.noInterviewsText}>No interviews scheduled yet</p> */}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={styles.pagination}>
              <span>Showing <strong>0</strong> of <strong>0</strong> interviews</span>
              <div>
                <button disabled>Prev</button>
                <button disabled>Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CreateInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}