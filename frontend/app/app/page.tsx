import Head from 'next/head';
import Image from 'next/image';
import { Inter, Lora, Cedarville_Cursive, Concert_One } from 'next/font/google';
import styles from './app.module.css';
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
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/contact" className={styles.textButton}>Contact</Link>
          <Link href="/login" className={styles.textButton}>Login</Link>
          <Link href="/signup" className={styles.button}>Get Started</Link>
        </div>
      </div>
    </main>
  );
}
