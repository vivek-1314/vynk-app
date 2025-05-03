'use client';

import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, GoogleAuthProvider} from 'firebase/auth';
import Navbar from '@/component/navbar';


export default function LandingPage() {


  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const vynkFeatures = [
    { id: 0, description: 'Real-time AI-based matching of users based on thought embeddings.' },
    { id: 1, description: 'Users express current thoughts to initiate anonymous interactions.' },
    { id: 2, description: 'Instant 1:1 messaging after a match using Stream Chat integration.' },
    { id: 3, description: 'Temporary usernames like “Calm Fox” or “Curious Owl” for anonymous identity.' },
    { id: 4, description: 'Conversations begin anonymous with optional mutual identity reveal.' },
    { id: 5, description: 'AI-enhanced text input suggestions and thought reframes.' },
    { id: 6, description: 'Core to Vynk—no resumes, no profiles, just thoughts.' },
    { id: 7, description: 'Vibe Log records key insights and summaries from past drifts.' },
    { id: 8, description: '“Vibe Radius” lets users define how broad or niche their matching should be.' },
    { id: 9, description: 'Fallback experience with Echo Mode, ambient visuals, and retry prompts.' },
    { id: 10, description: 'Users can revisit previous shared sessions or solo reflections.' },
    { id: 11, description: 'Uses sentence-transformer embeddings for contextual similarity matching.' }
  ];
  
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          router.push('/');
          setTimeout(() => {
            setChecking(false);
          }, 2000);
        } else {
          setChecking(false);
        }
      });
  
      return () => unsubscribe();
    }, [router]);

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

  if (checking) {
    return <div className="flex h-screen w-full justify-center items-center">LOADING.....😊🙏</div>; 
  }
  
    return(
      <main className='relative  w-full bg-[#fefffe] pt-2 pb-2 overflow-hidden'>
          <Navbar/>

          {/* main heading text */}
          <div className="w-full py-4 mt-30 flex flex-col ">
            <h3 className='funnel-regular sm:text-[8vh] text-[1.8rem] flex justify-center items-center text-[#010100]'>No bios. No noise.</h3>
            <h4 className='funnel-regular sm:text-[8vh] text-[1.8rem] flex justify-center items-center text-[#6a6b6b]'>Just you, your mind, and</h4>
            <h4 className='funnel-regular sm:text-[8vh] text-[1.8rem] flex justify-center items-center text-[#010100]'>someone who gets it."</h4>
          </div>

          {/* video */}
          <div className="relative w-full h-[50vh] sm:h-[80vh] overflow-hidden">
          <video
              className="w-full h-full scale-280 sm:scale-120 transform  sm:-translate-y-[5rem]"
              src="video_assests/mainvid.mp4"
              autoPlay
              muted
              loop
              playsInline
            ></video>
            <button onClick={() => handleGoogleSignIn()} className='absolute funnel-regular text-[1.2rem] sm:text-[1.5vw] backdrop-blur-md bg-white/10 border hover:bg-white/70  border-white/20 rounded-full px-3 py-3 top-1/2 left-1/2 transform -translate-x-1/2  sm:-translate-y-[7rem] -translate-y-[2rem] text-black focus:outline-none'>Unlock</button>
          </div>

          {/* how it works */}
          <div className=" sm:h-[45vw] h-[150vh] w-full flex px-4 flex-col gap-6 pb-10">
            <h3 className='text-black funnel-regular text-[2rem] sm:text-[6vh] '>How It Works</h3>
            <section className='flex flex-col sm:flex-row justify-between items-center w-full h-full gap-2'>
              <div className="h-full w-full sm:w-1/3 rounded-lg bg-[url('https://i.pinimg.com/736x/d1/a6/95/d1a695e235b5fa08d657dd6253eb45d8.jpg')] bg-cover object-cover bg-opacity-50  p-4">
                <h4 className='text-black funnel-light text-[2.5vh]'>Type What's On Your Mind </h4>
                <span className='text-[#6a6b6b] funnel-light text-[0.9rem] sm:text-[1.2vw] leading-none'>Just a thought. A feeling. A moment that’s real, right — now.</span>
              </div>
              <div className="h-full w-full sm:w-1/3 rounded-lg bg-[url('https://i.pinimg.com/736x/3f/d1/d0/3fd1d0e36fac91096427175bf89dd9f2.jpg')] bg-cover object-cover  p-4">
                <h4 className='text-black funnel-light text-[2.5vh]'>Get Matched Instantly</h4>
                <span className='text-[#6a6b6b] funnel-light text-[0.9rem] sm:text-[1.2vw] leading-none'>Vynk finds someone whose mind aligns with yours — no bios, just thoughts.</span>
              </div>
              <div className="h-full w-full sm:w-1/3 rounded-lg bg-[url('https://i.pinimg.com/736x/57/01/88/57018805b1c89f10b90f271fe1c5a1ca.jpg')] bg-cover objrct-cover  p-4">
                <h4 className='text-black funnel-light text-[2.5vh]'>Chat in Real Time</h4>
                <span className='text-[#6a6b6b] funnel-light text-[0.9rem] sm:text-[1.2vw] leading-none'>Talk anonymously. Think together. Or move on — your space, your pace.</span>
              </div>
            </section>
          </div>

          {/* features */}
          <div className="w-full px-4 mt-6">
            <h2 className='text-black text-[6vh] mb-4 funnel-regular'>Features</h2>
          <div className="grid grid-cols-2 grid-rows-6 sm:grid-cols-6 sm:grid-rows-2 gap-4 h-full w-full ">
            {
              ['Matchmaking', 'Thought Sharing', 'Real-Time Chat', 'Mood-Based Aliases', 'Anonymity Layers', 'Smart Input', 'Anonymity', 'History Log', 'Context Control', 'Wait Experience', 'Session Replay', 'AI Matching'].map((feature, index) => (
                <div key={index} className={`bg-[#eeefef] perspective transition-transform duration-700 transform-style-preserve-3d group hover:rotate-y-180 rounded-lg flex flex-col justify-center items-center funnel-regular text-[#010100] py-20 ${index % 2 === 0 ? 'text-[#010100]' : 'text-[#535353]'}`}>
                  <span>{feature}</span>
                  <img className='w-6 h-6' src={`images_assests/icon${index===6? 5 :index + 1}.png`} alt="" />
                  <div className="absolute p-4 text-[0.9rem] w-full h-full backface-hidden funnel-regular bg-gray-200 text-black rounded-xl shadow-xl transform rotate-y-180 flex items-center justify-center">
                    {
                      vynkFeatures[index].description
                    }
                  </div>
                </div> 
                ))
            }
          </div>
          </div>

          {/* poetic lines */}
          <div className="w-full pl-4 sm:pl-28 mt-15 sm:mt-30  sm:mb-20">
            <h6 className='sm:text-[3vh] text-[1.2rem] funnel-regular font-bold text-[#c0c1c0]'>Every thought hums with a frequency.</h6>
            <h6 className='sm:text-[3vh] text-[1.2rem] funnel-regular font-bold text-black'>You’re not alone in yours.</h6>
            <h6 className='sm:text-[3vh] text-[1.2rem] funnel-regular font-bold text-[#c0c1c0]'>Vynk helps you find the ones that match.</h6>
          </div>

          {/* video */}
          <div className="relative h-[80vh] w-full overflow-hidden z-10">
          <video
              className="absolute inset-0 top-1/2 transform -translate-y-1/2 left-1/2  -translate-x-1/2 h-full"
              src="video_assests/mainvid2.mp4"
              autoPlay
              muted
              loop
              playsInline
            ></video>
            <span className='absolute funnel-regular text-[#565353b8] stroke-2  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[3.6rem] '>V-YNK</span>
          </div>

          {/* poetic line */}
          <div className="w-full sm:pr-28 sm:mt-30 pr-4 mb-20 flex items-end flex-col">
            <section className='flex sm:items-start items-end flex-col'>
            <h6 className='text-[1.2rem] sm:text-[3.4vh]  funnel-regular font-bold text-[#c0c1c0]'>You think.</h6>
            <h6 className='text-[1.2rem] sm:text-[3.4vh] funnel-regular font-bold text-black'>Someone else feels it too.</h6>
            <h6 className='text-[1.2rem] sm:text-[3.4vh] funnel-regular font-bold text-[#c0c1c0]'>Vynk makes the connection.</h6>
            </section>
          </div>

          {/* ring video */}
          <div className="relative w-full h-[125vh] sm:h-[100vh]  sm:overflow-hidden ">
          <video
              className="w-full h-full scale-400 sm:scale-110"
              src="video_assests/ringmp4.mp4"
              autoPlay
              muted
              loop
              playsInline
            >
            </video>
            <div className="absolute top-1/2 left-1/2 flex justify-center items-center w-[14rem] transform -translate-x-1/2 -translate-y-1/2 loading-lazy ">
            <h6 className="funnel-regular text-black w-full text-[1rem] sm:text-[1.1vw] leading-relaxed">
                Vynk is a space for thoughts.<br />
                Not every thought needs a like.<br />
                Some just need to land.<br />
                Somewhere soft.<br />
                Somewhere seen.<br />
                Vynk doesn’t care who you are —<br />
                only what’s on your mind.<br />
                And who else is thinking it too.
              </h6>
            </div>
          </div>

          {/* capsule */}
          <div className="relative w-full h-[26rem]   overflow-hidden ">
          <video
              className="w-full h-full scale-130 sm:scale-120"
              src="video_assests/capsule.mp4"
              autoPlay
              muted
              loop
              playsInline
            >
            </video>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
            <section className="relative min-h-screen flex items-center justify-center">
              <h1 className="sm:text-5xl text-[1.8rem] funnel-regular text-transparent bg-clip-text bg-gradient-to-r mix-blend-exclusion from-black/80 to-black/70">
                Beyond filters
              </h1>
            </section>
            </div>
          </div>
      </main>
    );
  }   