import Link from 'next/link';
import styles from './Candidate.module.css';
import { FileText, Upload } from 'lucide-react';

export default function Candidate() {
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
          <button className={styles.uploadButton}>
            <Upload className={styles.uploadButtonIcon} size={20} />
            Upload resume
          </button>
        </div>
      </div>
    </main>
  );
}