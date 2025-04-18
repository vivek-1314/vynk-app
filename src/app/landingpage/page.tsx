'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, GoogleAuthProvider} from 'firebase/auth';


export default function LandingPage() {

  const [src, setSrc] = useState('/video_assests/bkg.mp4');
  const [loop, setLoop] = useState(false);

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await setPersistence(auth, browserLocalPersistence); 
      const result = await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };


    return(
      <main className="w-full h-[100vh] flex flex-col items-start justify-between overflow-hidden relative">
          <video
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
        src={src}
        autoPlay
        muted
        playsInline
        loop={loop}
        preload="auto"
        onEnded={() => {
          if (!loop) {
            setSrc('/video_assests/bkg2loop.mp4');
            setLoop(true);
          }
        }}
      />

      <div className="w-full mt-26 px-4 flex flex-col items-start justify-center">
        {
          ["SHARE " ,"THOUGHTS" , "NOT" , "RESUMES"].map((text , index) => {
            return (
              <div key={index}  className='overflow-hidden'>
              <motion.div
              initial={index!==1 && { y: 80, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 5.5,   
                ease: "easeOut"
              }}
              className={`text-[5.8rem] tracking-tighter leading-20 font3 text-center`}>
                {text}
              </motion.div>
              </div>
            )
          })
        }
      </div>

      <hr className=" my-9 border-t border-gray-300 opacity-50 w-full" />

      <div onClick={handleGoogleSignIn}  className="group place-i w-80 h-20 bg-[#232a5a] ml-5 mb-2 rounded-lg flex justify-between items-end p-2">
        <span className='uppercase font4 text-sm'>get started</span>
        <section className='bg-white p-[0.2rem] rounded-full transition-transform duration-300  group-hover:rotate-55'>
          <img className='w-[0.6rem] h-auto' src="/images_assests/up-arrow.png" alt="arrow" />
        </section>
      </div>

      </main>
    );
  }   