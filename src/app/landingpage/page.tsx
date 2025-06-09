'use client';

import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, GoogleAuthProvider} from 'firebase/auth';
import Navbar from '@/component/navbar';


export default function LandingPage() {


  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [rotatecard , setRotateCard] = useState(false);
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
      <main className='relative  w-full bg-[#fefffe] pt-2 overflow-hidden'>
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
          <div className="sm:h-[45vw] h-[150vh] w-full flex px-4 flex-col gap-6 pb-10">
            <h3 className='text-black funnel-regular text-[2rem] sm:text-[6vh] '>How It Works</h3>
            <section className='flex flex-col sm:flex-row justify-between items-center w-full h-full gap-10 sm:gap-2'>
              <div className="flex flex-col gap-2 h-full overflow-hidden bg-[#7a76764c] bg-opacity-60 w-full sm:w-1/3 rounded-lg  p-4">
                {/* <div className="absolute rounded-lg inset-0 bg-[#7a76764c] bg-opacity-40"></div> */}
                <h4 className='text-black funnel-light z-10 text-[2.5vh]'>Type What's On Your Mind </h4>
                <span className='text-[#6a6b6b] funnel-light z-10 text-[0.9rem] sm:text-[1.2vw] leading-none'>Just a thought. A feeling. A moment that’s real, right — now.</span>
                <img className='flex-1 mt-10 sm:mt-20  w-full  rounded-xl bg-cover object-cover overflow-hidden transition-shadow duration-300 
         shadow-[8px_8px_15px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.2)] 
         hover:shadow-[12px_12px_25px_rgba(0,0,0,0.5),6px_6px_15px_rgba(0,0,0,0.3)]' src="https://i.pinimg.com/736x/3e/92/af/3e92afb0995876e766651597cc2d76bf.jpg" alt="" />
              </div>
              <div className="flex flex-col gap-2 h-full overflow-hidden w-full bg-[#7a76764c] bg-opacity-60  sm:w-1/3 rounded-lg p-4">
                {/* <div className="absolute rounded-lg inset-0 bg-[#7a76764c] bg-opacity-40"></div> */}
                <h4 className='text-black funnel-light text-[2.5vh]'>Get Matched Instantly</h4>
                <span className='text-[#6a6b6b] funnel-light text-[0.9rem] sm:text-[1.2vw] leading-none'>Vynk finds someone whose mind aligns with yours — no bios, just thoughts.</span>
                <img className='flex-1 mt-10 sm:mt-20 w-full rounded-xl bg-cover object-cover overflow-hidden transition-shadow duration-300 
         shadow-[8px_8px_15px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.2)] 
         hover:shadow-[12px_12px_25px_rgba(0,0,0,0.5),6px_6px_15px_rgba(0,0,0,0.3)]' src="https://i.pinimg.com/736x/20/19/3e/20193e6033affe104635c8a437a06598.jpg"  alt="" />
              </div>
              <div className="flex flex-col gap-3 h-full overflow-hidden w-full sm:w-1/3 rounded-lg bg-[#7a76764c] bg-opacity-60  p-4">
                {/* <div className="absolute rounded-lg inset-0 bg-[#7a76764c] bg-opacity-40"></div> */}
                <h4 className='text-black funnel-light text-[2.5vh]'>Chat in Real Time</h4>
                <span className='text-[#6a6b6b] funnel-light text-[0.9rem] sm:text-[1.2vw] leading-none'>Talk anonymously. Think together. Or move on — your space, your pace.</span>
                 <img className='flex-1 mt-10 sm:mt-20  w-full rounded-xl bg-cover object-cover overflow-hidden transition-shadow duration-300 
         shadow-[8px_8px_15px_rgba(0,0,0,0.3),4px_4px_8px_rgba(0,0,0,0.2)] 
         hover:shadow-[12px_12px_25px_rgba(0,0,0,0.5),6px_6px_15px_rgba(0,0,0,0.3)]' src="https://i.pinimg.com/736x/91/63/15/9163157d9fbb782336aef00bc75e11a5.jpg" alt="" />
              </div>
            </section>
          </div>

          {/* features */}
          <div className="w-full px-4 mt-40 h-[140vh] sm:h-full">
            <h2 className='text-black text-[6vh] mb-4 funnel-regular'>Features</h2>
          <div className="grid grid-cols-2 grid-rows-6 sm:grid-cols-6 sm:grid-rows-2 gap-4 h-full w-full ">
            {
              ['Matchmaking', 'Thought Sharing', 'Real-Time Chat', 'Mood-Based Aliases', 'Anonymity Layers', 'Smart Input', 'Anonymity', 'History Log', 'Context Control', 'Wait Experience', 'Session Replay', 'AI Matching'].map((feature, index) => (
                <div key={index}  className={`bg-[#eeefef] perspective transition-transform duration-700 transform-style-preserve-3d group hover:rotate-y-180 rounded-lg flex flex-col justify-center items-center funnel-regular text-[#010100] py-20 ${index % 2 === 0 ? 'text-[#010100]' : 'text-[#535353]'}`}>
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
          <div className="w-full pl-4 sm:pl-28 mt-40 sm:mt-30  sm:mb-20">
            <h6 className='sm:text-[3vh] sm:text-left text-center text-[1.2rem] funnel-regular font-bold text-[#c0c1c0]'>Every thought hums with a frequency.</h6>
            <h6 className='sm:text-[3vh] sm:text-left text-center text-[1.2rem] funnel-regular font-bold text-black'>You’re not alone in yours.</h6>
            <h6 className='sm:text-[3vh] sm:text-left text-center text-[1.2rem] funnel-regular font-bold text-[#c0c1c0]'>Vynk helps you find the ones that match.</h6>
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
          <div className="relative w-full h-[125vh] sm:h-[100vh] overflow-hidden ">
          <video
              className="w-full h-full scale-400 sm:scale-110 overflow-hidden"
              src="video_assests/ringmp4.mp4"
              autoPlay
              muted
              loop
              playsInline
            >
            </video>
            <div className="absolute top-1/2 left-1/2 flex justify-center items-center w-[15rem] sm:w-[14rem] transform -translate-x-1/2 -translate-y-1/2 loading-lazy ">
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
          <div className="relative w-full h-[8rem] sm:my-10 sm:h-[12rem] overflow-hidden ">
          <video
              className="w-full h-full scale-180 sm:scale-160"
              src="video_assests/capsule.mp4"
              autoPlay
              muted
              loop
              playsInline
            >
            </video>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
            <section className="relative min-h-screen flex items-center justify-center">
              <h1 className="sm:text-4xl text-[1.8rem] funnel-regular text-transparent bg-clip-text bg-gradient-to-r mix-blend-exclusion from-black/80 to-black/70">
                Beyond filters
              </h1>
            </section>
            </div>
          </div>

          {/* footer  */}
          <footer className='sm:pt-4 sm:px-4 px-1 '>
            <div className="sm:flex sm:justify-between sm:pt-10 sm:px-10 px-8 py-8 sm:rounded-t-3xl rounded-t-[1.4rem] w-full bg-[linear-gradient(158deg,_rgba(18,18,20,1)_17%,_rgba(120,28,35,1)_87%)]">
              <div className="">
                <span className='sm:text-[2.5vw] text-[1.2rem] funnel-regular'>Sync minds in real time ,</span><br />
                <span className='sm:text-[2.5vw] text-[1.2rem] funnel-regular'>or miss the moment</span><br />
                <span className='block mt-20 text-[2rem] funnel-semibold leading-0'>VYNK</span><br />
                <span className='inline mt-0 text-[12px] funnel-semibold'>© 2025 all rights reserved</span>
              </div>

              <div className="">
                <div className="flex sm:justify-start justify-between sm:items-start items-center sm:px-8 sm:gap-30 ">
                <div className="w-[50%] ">
                  <h4 className='mt-10 sm:mt-0 text-[1.3rem] funnel-regular text-[#a09797fa]  '>Explore</h4>
                  <ul className='mt-2'>
                    <li className='funnel-regular text-sm mt-2'><a href="/about">About Vynk</a></li>
                    <li className='funnel-regular text-sm mt-2'><a href="/how-it-works">How It Works</a></li>
                    <li className='funnel-regular text-sm mt-2'><a href="/blog">Blog / Updates</a></li>
                    <li className='funnel-regular text-sm mt-2'><a href="/careers">Careers</a></li>
                    <li className='funnel-regular text-sm mt-2'><a href="/contact">Contact Us</a></li>
                  </ul>
                </div>
                <div className="w-[50%]">
                  <h4 className='mt-10 sm:mt-0 text-[1.3rem] text-right sm:text-left text-[#a09797fa] funnel-regular'>Support</h4>
                  <ul className='mt-2'>
                    <li className='funnel-regular text-sm mt-2 text-right sm:text-left'><a href="/about">Help Center</a></li>
                    <li className='funnel-regular text-sm mt-2 text-right sm:text-left'><a href="/how-it-works">Discord</a></li>
                    <li className='funnel-regular text-sm mt-2 text-right sm:text-left'><a href="/blog">Privacy Policy</a></li>
                    <li className='funnel-regular text-sm mt-2 text-right sm:text-left whitespace-nowrap'><a href="/careers">Terms of Service</a></li>
                    <li className='funnel-regular text-sm mt-2 text-right sm:text-left'><a href="/contact">FAQ</a></li>
                  </ul>
                </div>
              </div>
                <hr className='mt-10 mx-auto border-[#a09797fa]' />
              </div>
            </div>
          </footer>
      </main>
    );
  }   