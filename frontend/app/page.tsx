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
    <main className={`${styles.container} ${inter.className} min-h-screen bg-white relative overflow-hidden`}>
      {/* Centered color blemishes */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-[600px] h-[600px]">
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 bottom-0 left-1/4 w-2/3 h-2/3 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

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

      <div className="flex flex-col items-center justify-center text-center px-4 py-20 relative z-10">
        <h1 className="text-5xl md:text-6xl font-medium text-gray-800 mb-6 mt-12">
          Preview your Interview with us.
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Lucence uses AI to simulate real interviews for any job. Get personalized feedback, build confidence, accelerate your career.
        </p>
        <Link href="/app" className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-700 transition-all duration-400 ease-in-out mt-7">
          Take Your First Interview →
        </Link>
      </div>

      {/* Space for future product screenshot */}
      <div className="mt-20"></div>
    </main>
  );
}