import Head from 'next/head';
import Image from 'next/image';
import { Inter, Lora, Cedarville_Cursive, Concert_One } from 'next/font/google';
import styles from './index.module.css';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const lora = Lora({ subsets: ["latin"] });
const cedarville_cursive = Cedarville_Cursive({ subsets: ["latin"], weight: "400" });
const concert_one = Concert_One({ subsets: ['latin'], weight: '400' });

export default function Home() {
  return (
    <main className={`${styles.container} ${inter.className}`}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo (1).png"
            alt="Logo"
            width={40}
            height={40}
            className={styles.logo}
            priority
          />
          <span className={`${styles.companyName} ${inter.className}`}>Lucence</span>
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/login" className={styles.textButton}>Login</Link>
          <Link href="/signup" className={styles.button}>Get Started</Link>
        </div>
      </div>
      <div className={styles.banner}>
        Your AI-Native Job Interview Coach
      </div>
      <p className={styles.description}>
        Lucence offers AI-driven, personalized mock interviews tailored to your target role and company. Practice, receive instant feedback, and boost your confidence to land your dream job.
      </p>
      <div className={styles.buttonGroup}>
        <Link href="/first-interview" className={styles.mainButton}>Take Your First Interview</Link>
        <Link href="/know-more" className={styles.secondaryButton}>Know More</Link>
      </div>
    </main>
  );
}
