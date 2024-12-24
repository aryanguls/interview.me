import Head from 'next/head';
import Image from 'next/image';
import { Inter, DM_Sans, Gloria_Hallelujah, Playfair_Display, Pacifico} from 'next/font/google';
import styles from './index.module.css';
import Link from 'next/link';
import { BarChart, Battery, Cog, FileText, UserCheck, Scale, Clock, Target, Zap } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });
const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });
const playfair_display = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });
const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'] });

export default function Home() {
  return (
    <main className={`${styles.container} ${inter.className} min-h-screen bg-white relative overflow-hidden`}>
      <div className={styles.backgroundGradient}></div>

      <div className={styles.header}>
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
        <div className={styles.buttonContainer}>
          <Link href="mailto:hello@lucence.ai" className={styles.textButton}>Contact</Link>
          <Link href="/dashboard" className={styles.button} target="_blank" rel="noopener noreferrer">Candidates</Link>
        </div>
      </div>

      <div className={`${styles.heroSection} ${dm_sans.className}`}>
        <div className={styles.heroContent}>
          <h1 className={`text-6xl md:text-6xl font-medium mb-6`} style={{ lineHeight: '1.1' }}>
            <span className={pacifico.className}>Preview your Interview</span>, with Lucence.
          </h1>
          <p className="text-xl font-medium text-gray-600 mb-12 max-w-2xl">
          Lucence automates recruitment prep by offering completely AI-led mock interviews for candidates. Practice to ace your next role effortlessly.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="/dashboard" className={`${styles.actionButton} ${styles.primaryButton}`}>
              Prepare for Interviews →
            </Link>
            <Link href="mailto:hello@lucence.ai" className={`${styles.actionButton} ${styles.secondaryButton}`}>
              Get to know more
            </Link>
          </div>
        </div>
        <div className={styles.heroGraphic}>
          <video
            src="/Audio_Wave.webm" 
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </main>
  );
}