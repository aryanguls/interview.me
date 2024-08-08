'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './app.module.css';

export default function AppPage() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <div className={styles.container}>
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
          <div className={styles.accountContainer}>
            <Link href="/account" className={styles.accountButton}>
              <Image
                src="/placeholder-user.jpg"
                alt="User"
                width={40}
                height={40}
                className={styles.userIcon}
              />
            </Link>
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
            <button className={styles.addButton}>Start New Interview</button>
          </div>
          <div className={styles.mockInterviewContainer}>
            <div className={styles.mockInterviewHeader}>
              <h2 className={styles.mockInterviewTitle}>Mock Interviews</h2>
              <p className={styles.mockInterviewSubtitle}>Practice your interview skills with our AI-powered mock interviews.</p>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>COMPANY</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>SCORE</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className={styles.placeholderCell}>
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
              <span>Showing 0 of 0 interviews</span>
              <div>
                <button disabled>Prev</button>
                <button disabled>Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}