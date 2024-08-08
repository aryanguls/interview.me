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
        <div className={styles.mockInterviewWrapper}>
          <button className={styles.addButton}>Start New Interview</button>
          <div className={styles.mockInterviewContainer}>
            <div className={styles.mockInterviewHeader}>
              <h2 className={styles.mockInterviewTitle}>Mock Interviews</h2>
              <p className={styles.mockInterviewSubtitle}>Practice your interview skills with our AI-powered mock interviews.</p>
            </div>
            <div className={styles.tabsContainer}>
              <button className={`${styles.tabButton} ${styles.active}`}>All</button>
              <button className={styles.tabButton}>Completed</button>
              <button className={styles.tabButton}>In Progress</button>
              <button className={styles.tabButton}>Scheduled</button>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Interview Type</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className={styles.placeholderCell}>
                    <Image
                      src="/placeholder-image.png"
                      alt="Placeholder"
                      width={200}
                      height={200}
                      layout="responsive"
                    />
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
        </div>
      </main>
    </div>
  );
}