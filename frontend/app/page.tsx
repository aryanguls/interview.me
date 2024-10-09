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
  const features = [
    { 
      icon: <UserCheck size={24} />,
      title: "AI-Powered Interviews", 
      description: "Conduct fair and consistent interviews using advanced AI technology."
    },
    { 
      icon: <Cog size={24} />,
      title: "Customizable Questions", 
      description: "Tailor interview questions to match your specific role requirements."
    },
    { 
      icon: <BarChart size={24} />,
      title: "Comprehensive Analytics", 
      description: "Gain valuable insights with detailed candidate performance reports."
    },
    { 
      icon: <Clock size={24} />,
      title: "Time-Saving Automation", 
      description: "Streamline your hiring process and reduce time-to-hire significantly."
    },
    { 
      icon: <Target size={24} />,
      title: "Precision Matching", 
      description: "Find candidates that precisely match your job requirements and company culture."
    },
    { 
      icon: <Zap size={24} />,
      title: "Instant Feedback", 
      description: "Provide immediate feedback to candidates, enhancing their experience."
    },
  ];

  return (
    <main className={`${styles.container} ${inter.className} min-h-screen bg-white relative overflow-hidden`}>
      {/* New background gradient */}
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
          <Link href="/candidate" className={styles.textButton}>Candidates</Link>
          <Link href="https://calendly.com/lucence-ai/30min" className={styles.button} target="_blank" rel="noopener noreferrer">Companies</Link>
        </div>
      </div>

      <div className={`${styles.heroSection} ${dm_sans.className}`}>
        <div className={styles.heroContent}>
          <h1 className={`text-6xl md:text-7xl font-medium mb-6`} style={{ lineHeight: '1.1' }}>
            <span className={pacifico.className}>Smart Interviews</span>, Smarter Hires.
          </h1>
          <p className="text-xl font-medium text-gray-600 mb-12 max-w-2xl">
          Lucence automates recruiting by offering customizable AI-led interviews & screening for any role. Save time, reduce costs and hire top talent effortlessly.
          </p>
          <div className={styles.buttonGroup}>
            <Link href="https://calendly.com/lucence-ai/30min" className={`${styles.actionButton} ${styles.primaryButton}`}>
              Book a Demo
            </Link>
            <Link href="/candidate" className={`${styles.actionButton} ${styles.secondaryButton}`}>
              Try a Mock Interview →
            </Link>
          </div>
        </div>
        <div className={styles.heroGraphic}>
          <video
            src="/Audio_Wave.webm"  // Replace with your actual WebM file name
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>

      {/* Added graphic */}
      {/* <div className={`mt-20 flex justify-center ${styles.graphicContainer}`}>
        <div className={styles.gradientBackground}></div>
        <img
          src="/Graphic.png"
          alt="Product Screenshot"
          className={styles.graphic}
        />
      </div> */}

      {/* Updated Features Section */}
      {/* <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-medium text-center mb-4">Supercharge your hiring process</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            With Lucence, you can streamline your recruitment and find top talent efficiently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 flex flex-col items-start">
                <div className="bg-gray-100 p-3 rounded-full mb-4 self-start">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}


      {/* New Customizable Interviews Section */}
      {/* <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-4xl font-medium mb-4">Customizable AI Interviews</h2>
            <p className="text-xl text-gray-600 mb-6">
              Connect to your internal question base, order interview flow, integrate role-based tasks and more.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className={styles.customInterviewGraphicContainer}>
              <div className={styles.customInterviewGradientBackground}></div>
              <div className={styles.graphicPlaceholder}>
                <Image 
                  src="/Custom_Interviews.png" 
                  alt="Customizable Interviews" 
                  width={500} 
                  height={400} 
                  layout="intrinsic"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* New Analytics Section */}
      {/* <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 md:pl-8 mb-8 md:mb-0">
            <h2 className="text-4xl font-medium mb-4">Comprehensive Analytics</h2>
            <p className="text-xl text-gray-600 mb-6">
              Gain valuable insights into your hiring process with our detailed analytics. Track candidate performance, identify top talent, and make data-driven decisions to improve your recruitment strategy.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className={styles.graphicPlaceholder}>
              <Image src="/placeholder-image.jpg" alt="Analytics Dashboard" width={500} height={300} />
            </div>
          </div>
        </div>
      </div> */}

      {/* Spacer */}
      {/* <div className="py-10"></div> */}

      {/* Updated CTA section */}
      {/* <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className={`text-4xl font-medium mb-4`}>
            Seamlessly integrates with existing workflows
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Screen more candidates, faster & hire better. Without lifting a finger.
          </p>
          <div className={`flex justify-center ${styles.workflowGraphicContainer}`}>
            <div className={styles.workflowGradientBackground}></div>
            <div className={styles.ctaGraphic}>
              <img
                src="/Workflow_Graphic.png"
                alt="Workflow Graphic"
                className="max-w-full h-auto relative z-10"
              />
            </div>
          </div>

          <h2 className={`text-4xl font-medium mb-4 mt-16 ${styles.gradientText}`}>
            Smarter hiring starts here.
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Still sifting through resumes manually? Join the AI revolution in hiring.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/demo" className={`${styles.actionButton} ${styles.primaryButton}`}>
              Request a Demo
            </Link>
            <Link href="/dashboard" className={`${styles.actionButton} ${styles.secondaryButton}`}>
              Try a Mock Interview →
            </Link>
          </div>
        </div>
      </div> */}

      {/* Updated Footer Layout */}
      {/* <footer className={`${styles.footer} ${dm_sans.className}`}>
        <hr className={styles.footerLine} />
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <div className={styles.logoAndName}>
              <video
                src="/Animation - 1727914209042 - black.webm"
                width={38}
                height={38}
                className={styles.footerLogo}
                autoPlay
                loop
                muted
                playsInline
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
      </footer> */}
    </main>
  );
}