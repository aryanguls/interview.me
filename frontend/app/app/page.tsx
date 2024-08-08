import Image from 'next/image';
import Link from 'next/link';
import styles from './app.module.css';

export default function AppPage() {
  return (
    <div className={styles.container}>
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
            <button className={`${styles.tabButton} ${styles.active}`}>All</button>
            <button className={styles.tabButton}>Completed</button>
            <button className={styles.tabButton}>Scheduled</button>
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
                <th>INTERVIEW TYPE</th>
                <th>STATUS</th>
                <th>SCORE</th>
                <th>DATE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className={styles.placeholderCell}>
                  <Image
                    src="/placeholder-image.png"
                    alt="Placeholder"
                    width={400}
                    height={200}
                    layout="responsive"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}