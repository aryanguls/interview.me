import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component from Next.js
import styles from './login.module.css';

export default function Signup() {
  return (
    <>
      <main className={styles.container}>
        <div className={styles.backButtonContainer}>
            <Link href="/" className={styles.backButton}>
                Back
            </Link>
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Login</h1>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <input type="email" id="email" name="email" placeholder="Email" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <input type="password" id="password" name="password" placeholder="Password" className={styles.input} />
            </div>
            <button type="submit" className={styles.continueButton}>Continue</button>
          </form>
          <div className={styles.divider}>
            {/* <span className={styles.line}></span> */}
            <span className={styles.or}>or</span>
            {/* <span className={styles.line}></span> */}
          </div>
          <div className={styles.socialButtons}>
            <button className={styles.socialButton}>
              <Image src="/icons8-google-logo.svg" alt="Google Logo" width={24} height={24} className={styles.icon} />
              Continue with Google
            </button>
            <button className={styles.socialButton}>
              <Image src="/icons8-apple-logo.svg" alt="Apple Logo" width={24} height={24} className={styles.icon} />
              Continue with Apple
            </button>
            {/* <button className={styles.socialButton}>
              <Image src="/icons8-facebook-logo.svg" alt="Facebook Logo" width={24} height={24} className={styles.icon} />
              Continue with Facebook
            </button> */}
            <div className={styles.loginText}>
                Don't have an account? <Link href="/signup" className={styles.loginTextHighlight}>Sign up</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
