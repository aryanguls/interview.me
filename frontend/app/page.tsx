import Head from 'next/head';
import Image from 'next/image';
import { Inter, DM_Sans } from 'next/font/google';
import styles from './index.module.css';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });
const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

export default function Home() {
  return (
    <main className={`${styles.container} ${inter.className} min-h-screen bg-white relative overflow-hidden`}>
      {/* New background gradient */}
      <div className={styles.backgroundGradient}></div>

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

      <div className={`flex flex-col items-center justify-center text-center px-4 py-20 ${dm_sans.className} relative z-10`}>
        <h1 className="text-5xl md:text-6xl font-medium text-gray-800 mb-6 mt-12">
          Revolutionize Hiring with <span className={styles.highlightedText}>AI Interviews.</span>
        </h1>
        <p className="text-xl font-medium text-gray-600 mb-12 max-w-3xl">
          Lucence automates recruiting by offering customizable AI-led interviews & screening for any role. Save time, reduce costs and find top talent effortlessly.
        </p>
        <div className="flex space-x-4 relative z-20">
          <Link href="/demo" className={`${styles.actionButton} ${styles.primaryButton}`}>
            Request a Demo
          </Link>
          <Link href="/dashboard" className={`${styles.actionButton} ${styles.secondaryButton}`}>
            Try a Mock Interview →
          </Link>
        </div>
      </div>

      {/* Added graphic */}
      <div className={`mt-20 flex justify-center ${styles.graphicContainer}`}>
        <div className={styles.gradientBackground}></div>
        <img
          src="/Graphic.png"
          alt="Product Screenshot"
          className={styles.graphic}
        />
      </div>

      {/* Updated Footer Layout */}
      <footer className={`${styles.footer} ${dm_sans.className}`}>
        <hr className={styles.footerLine} />
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <div className={styles.logoAndName}>
              <Image
                src="/logo (1).png"
                alt="Lucence Logo"
                width={28}
                height={28}
                className={styles.footerLogo}
              />
              <h2 className={styles.footerTitle}>Lucence</h2>
            </div>
            <p className={styles.footerTagline}>
              Conversational AI Lab building products<br />to empower enterprise workflows.
            </p>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.socialIcons}>
              <Link href="#" className={styles.socialIcon}><Image src="/twitter.png" alt="Twitter" width={24} height={24} /></Link>
              <Link href="#" className={styles.socialIcon}><Image src="/linkedin-logo.png" alt="LinkedIn" width={24} height={24} /></Link>
              <Link href="#" className={styles.socialIcon}><Image src="/github.png" alt="GitHub" width={24} height={24} /></Link>
              <Link href="#" className={styles.socialIcon}><Image src="/email.png" alt="Email" width={24} height={24} /></Link>
            </div>
            <p className={styles.footerBottom}>© 2024 Lucence Inc. Made with ❤️ in the Bay Area.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}