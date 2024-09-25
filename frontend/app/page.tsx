import Head from 'next/head';
import Image from 'next/image';
import { Inter, DM_Sans } from 'next/font/google';
import styles from './index.module.css';
import Link from 'next/link';
import { BarChart, Battery, Cog, FileText, UserCheck, Scale, Clock, Target, Zap } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });
const dm_sans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] });

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
          <Link href="/login" className={styles.textButton}>Candidates</Link>
          <Link href="/signup" className={styles.button}>Companies</Link>
        </div>
      </div>

      <div className={`flex flex-col items-center justify-center text-center px-4 py-20 ${dm_sans.className} relative z-10`}>
        <h1 className={`text-5xl md:text-6xl font-medium text-gray-800 mb-6 mt-12 ${styles.gradientText}`} style={{ lineHeight: '1.2' }}>
            Hiring Intelligence for your Enterprise
        </h1>
        <p className="text-xl font-medium text-gray-600 mb-12 max-w-3xl">
          Lucence automates recruiting by offering customizable <span className={styles.highlightedText}>AI-led interviews & screening</span> for any role. Save time, reduce costs and hire top talent effortlessly.
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

      {/* Updated Features Section */}
      <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
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
      </div>


      {/* New Customizable Interviews Section */}
      <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
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
      </div>

      {/* New Analytics Section */}
      <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center">
          <div className="md:w-1/2 md:pl-8 mb-8 md:mb-0">
            <h2 className="text-4xl font-medium mb-4">Comprehensive Analytics</h2>
            <p className="text-xl text-gray-600 mb-6">
              Gain valuable insights into your hiring process with our detailed analytics. Track candidate performance, identify top talent, and make data-driven decisions to improve your recruitment strategy.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className={styles.graphicPlaceholder}>
              {/* Replace this with your actual graphic */}
              <Image src="/placeholder-image.jpg" alt="Analytics Dashboard" width={500} height={300} />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      {/* <div className="py-10"></div> */}

      {/* Updated CTA section */}
      <div className={`py-20 px-4 bg-white ${dm_sans.className}`}>
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


          
          {/* New heading, engaging subtitle, and buttons */}
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