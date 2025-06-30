'use client';

import { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, GoogleAuthProvider} from 'firebase/auth';
import Navbar from '@/component/navbar';
import useLenis from '../hooks/useLenis' ;
import Footer from '@/component/footer'

export default function LandingPage() {

  // useLenis()

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
          <div className="w-full py-4 mt-18 flex flex-col ">
            <h3 className='funnel-regular sm:text-[7vh] text-[1.8rem] flex justify-center items-center text-[#010100]'>When silence feels heavy,</h3>
            <h4 className='funnel-regular sm:text-[7vh] text-[1.8rem] flex justify-center items-center text-[#6a6b6b]'>Vynk opens</h4>
            <h4 className='funnel-regular sm:text-[7vh] text-[1.8rem] flex justify-center items-center text-[#010100]'>for the quiet hearts.</h4>
          </div>

          {/* video */}
          <div className="relative w-full h-[50vh] sm:h-[80vh] overflow-hidden">
          <video
              className="w-full h-full scale-280 sm:scale-150 transform "
              src="video_assests/mainvid.mp4"
              autoPlay
              muted
              loop
              playsInline
            ></video>
            <button onClick={() => handleGoogleSignIn()} className='sm:px-6 px-3 sm:py-[0.8vw] py-[0.5rem] flex justify-center items-center gap-3 text-white absolute funnel-regular  text-[0.9rem] sm:text-[1.2vw] backdrop-blur-md bg-[#0259ff]/40 border hover:bg-[#0259ff]/40 hover:text-black/90  border-white/20 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none'>
              Unlock for free <img src="/images_assests/lock.png" className='w-auto h-6' alt="" />
            </button>
          </div>

          {/* how it works */}
          <div id="How It Works" className="py-4 bg-cover w-full flex flex-col justify-between sm:px-0 px-8 gap-8 items-center">
            <div className="text-[#8069c0] font-semibold rounded-full px-10 border-[0.1rem] border-[#8069c0] py-2">How to use</div>
            <div className="grid relative sm:grid-cols-2 grid-cols-1 gap-6 sm:h-screen h-full w-full sm:w-[100vh]">
              <div className="p-6 bg-[#e2edfe] rounded-lg text-center flex flex-col justify-start items-center">
                <div className="text-[#2a66c5] inline-block sm:text-[1vw] text-[0.8rem] my-2 funnel-regular rounded-full px-4 border-[0.1rem] border-[#2a66c5] py-[0.1rem]">Join During the Hour</div>
                <h3 className='funnel-regular text-black/80 font-semibold sm:text-[1.2vw] text-[0.9rem] mt-2'>Vynk doesn’t stay open all the time.</h3>
                <ul className='funnel-regular list-disc list-outside flex flex-col gap-2 text-black/60 sm:text-[1.1vw] text-[0.8rem] leading-[1.1rem] sm:leading-[1.3vw] max-w-50 text-justify mt-3'>
                  <li>Open the app during the one-hour slot. [6 PM IST]</li>
                  <li>Type and share your thought — anything on your mind.</li>
                </ul>
              </div>
              <div className="bg-[#fceee4] p-6 rounded-lg text-center flex flex-col items-center justify-start">
                <div className="text-[#d98e52] inline-block sm:text-[1vw] text-[0.8rem] my-2 funnel-regular rounded-full px-4 border-[0.1rem] border-[#d98e52] py-[0.1rem]">AI Connects You Instantly</div>
                <h3 className='funnel-regular text-black/80 font-semibold sm:text-[1.2vw] text-[0.9rem] mt-2'>Get matched with someone thinking like you</h3>
                <ul className='funnel-regular flex flex-col gap-2 list-disc list-outside text-black/60 sm:text-[1.1vw] text-[0.8rem] leading-[1.1rem] sm:leading-[1.3vw] max-w-50 text-justify mt-3'>
                  <li>Our personalized AI reads your thought in real time.</li>
                  <li>It finds someone else, somewhere in the world, with a similar vibe.</li>
                  <li>You’re both moved to a private, encrypted chat or video room.</li>
                </ul>
              </div>
              <div className="bg-[#efe6fa] p-6 rounded-lg text-center flex flex-col items-center justify-start"><div className="text-[#7942ef] inline-block sm:text-[1vw] text-[0.8rem] my-2 funnel-regular rounded-full px-4 border-[0.1rem] border-[#7942ef] py-[0.1rem]">Converse Anonymously</div>
                <h3 className='funnel-regular text-black/80 font-semibold sm:text-[1.2vw] text-[0.9rem] mt-2'>Talk without filters or fear</h3>
                <ul className='funnel-regular flex flex-col gap-2 text-black/60 sm:text-[1.1vw] text-[0.8rem] leading-[1.1rem] sm:leading-[1.3vw] max-w-50 text-justify mt-3 list-disc'>
                  <li>No names, no bios, no history.</li>
                  <li>Say what you mean. Listen deeply.</li>
                  <li>If you both vibe, you can choose to connect permanently.</li>
                </ul>
              </div>
              <div className="bg-[#1c082c]/80 p-6 rounded-lg text-center flex flex-col items-center justify-start"><div className="text-[#af99c3] inline-block sm:text-[1vw] text-[0.8rem] my-2 funnel-regular rounded-full px-4 border-[0.1rem] border-[#af99c3] py-[0.1rem]">Session Ends</div>
                <h3 className='funnel-regular text-white/80 font-semibold sm:text-[1.2vw] text-[0.9rem] mt-2'>When the hour ends, the door closes</h3>
                <ul className='funnel-regular text-[#b8a4cb] sm:text-[1.1vw] text-[0.8rem] leading-[1.1rem] sm:leading-[1.3vw] max-w-50 text-justify mt-3 list-disc flex flex-col gap-2'>
                  <li>Chats vanish unless both agreed to stay connected.</li>
                  <li>No data stored. No follow-up unless both want it.</li>
                  <li>Come back tomorrow for a new wave of minds.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* features */}
          <div className="w-full mt-40 sm:h-[50vw] flex flex-col gap-4 sm:px-22 px-4">
             <section className='w-full flex sm:flex-row flex-col sm:gap-3 gap-8 sm:h-1/2 '>
                <div className='sm:w-[44%] w-full p-[0.12rem] bg-[linear-gradient(178deg,_rgba(162,229,162,1)_15%,_rgba(252,252,252,1)_74%)] rounded-xl'>
                  <div className="w-full h-full bg-white rounded-xl">
                    <div className="w-full h-full sm:py-0 py-4 flex flex-col justify-end items-center sm:gap-4 gap-8 rounded-xl bg-[linear-gradient(158deg,_rgba(162,229,162,0.49)_15%,_rgba(252,252,252,1)_38%)]">
                      <div className="w-full sm:h-[10vw] sm:text-[1.1vw] text-[0.8rem] funnel-regular flex flex-col justify-center items-center text-black">
                        <section><button onClick={() => handleGoogleSignIn()} className='bg-[#0359fe] hover:bg-[#0359fe]/80 transform hover:-translate-y-[0.1rem] text-white px-4 rounded-2xl py-1'>Share one</button> <span>thought</span></section>
                        <h4>See what happens</h4>
                      </div>
                      <div className="w-full sm:h-[8vw] sm:text-[1.1vw] text-[0.8rem] funnel-regular text-black px-4">
                        <h4 className='mb-[0.2rem] '>Why It Matters</h4>
                        <p className='leading-none sm:text-[1vw] text-[#565657] text-justify'>Social media is loud. But Vynk is quiet <br />
                        It connects you with one person who gets it.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='sm:w-[33%] w-full p-[0.12rem] bg-[linear-gradient(197deg,_rgba(196,153,213,1)_12%,_rgba(252,252,252,1)_68%)] rounded-xl'>
                   <div className="bg-white rounded-xl w-full h-full">
                    <div className=" z-10 sm:py-0 py-4 w-full h-full flex flex-col justify-end sm:gap-4 gap-12 items-center bg-[linear-gradient(197deg,_rgba(244,226,253,1)_42%,_rgba(252,252,252,1)_68%)] rounded-xl ">
                      <div className="w-full sm:text-[1.2vw] text-[0.8rem] sm:h-[10vw] funnel-regular  flex justify-center items-center gap-3 text-black">
                        <img className='w-8 h-8' src="/images_assests/thoughts.png" alt="" />
                        <section className='flex flex-col items-start justify-center leading-none'>
                          <h4>12000+</h4>
                          <p className=' text-[#565657]'>Thoughts Shared</p>
                        </section>
                      </div>
                      <div className="w-full sm:h-[8vw] sm:text-[1.1vw] text-[0.8rem] funnel-regular  text-black px-4">
                          <h4 className='mb-[0.2rem] '>Why It Matters</h4>
                          <p className='leading-none sm:text-[1vw] text-[0.8rem] text-[#565657] text-justify'>These aren’t just thoughts — they’re moments of truth, captured in time,</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='sm:w-[22%] w-full p-[0.12rem] bg-[linear-gradient(202deg,_rgba(156,175,224,1)_42%,_rgba(252,252,252,1)_68%)] rounded-xl'>
                  <div className="bg-white rounded-xl w-full h-full">
                    <div className="z-10 sm:py-0 py-4 w-full h-full flex flex-col justify-end sm:gap-4 gap-8 items-center bg-[linear-gradient(195deg,_rgba(196,197,255,1)_12%,_rgba(252,252,252,1)_42%)] rounded-xl ">
                      <div className="w-full sm:h-[10vw] sm:py-0 py-4 funnel-regular  flex justify-center items-center gap-3 text-black">
                        <img className='w-12 h-12' src="/images_assests/browser.png" alt="" />
                      </div>
                      <div className="w-full sm:text-[1.1vw] text-[0.8rem] sm:h-[8vw] funnel-regular  text-black px-4">
                        <h4 className='sm:text-[1.1vw] mb-[0.2rem] '>Global</h4>
                        <p className='sm:text-[1vw] leading-none text-[#565657]'>Global connection through shared thought.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section >
              <section className='w-full p-[0.12rem] text-[1.2vw] sm:h-1/2 bg-[linear-gradient(317deg,_rgba(241,246,162,1)_0%,_rgba(214,163,157,1)_88%)] rounded-xl'>
                  <div className="bg-white rounded-xl w-full h-full">
                    <div className="z-10 w-full h-full flex sm:flex-row flex-col gap-4 bg-[linear-gradient(90deg,_rgba(253,222,224,1)_2%,_rgba(250,242,242,1)_33%,_rgba(251,244,230,1)_70%,_rgba(253,254,181,1)_100%)] rounded-xl ">
                      <div className="sm:w-1/2 w-full sm:h-full p-4 flex sm:gap-0 flex-col  gap-4 justify-between text-black funnel-regular leading-none ">
                        <div className="sm:w-[65%] w-full bg-white rounded-xl self-center sm:mt-10 flex gap-2 items-center px-4 py-2 border-2 border-[#565a5a]/20">
                          <img className='w-8 h-8' src="/images_assests/clock.png" alt="" />
                          <section className='flex flex-col items-start justify-center gap-[0.2rem] '>
                            <h3 className='sm:text-[1vw] text-[0.7rem] text-black funnel-regular '>Don’t miss this.</h3>
                            <p className='sm:text-[0.9vw] text-[0.6rem] text-[#565657] funnel-regular '>Others are already inside.</p>
                          </section>
                          <div className="bg-[#b8ffc9] w-20 h-6 rounded-full ml-8 flex gap-1 p-[0.1rem] items-center ">
                            <img className='h-full w-auto bg-white rounded-full' src="/images_assests/check.png" alt="" />
                            <span className='sm:text-[0.7vw] text-[0.6rem] text-[#128d3d]'>Avaliable</span>
                          </div>
                        </div>
                        <section>
                          <h4 className='sm:text-[1.2vw] text-[0.8rem]'>Vynk, doesn’t run 24/7.</h4>
                          <p className='sm:text-[1vw] text-[0.7rem] text-[#565657] leading-[1rem] mt-2  sm:mt-3'>The window doesn’t stay open forever. <br /> You either show up… or miss the chance to be part of something real.</p>
                        </section>
                        <button onClick={() => window.open("https://mail.google.com/mail/?view=cm&to=vivek1314gurjar@gmail.com")}
                         className='w-30 h-10 hover:bg-[#0359fe]/80 transform hover:-translate-y-[0.1rem] sm:text-[1vw] text-[0.9rem] flex justify-center items-center bg-[#0359fe] text-white px-4 rounded-lg py-1'>Feedback</button>
                      </div>
                      <div className="sm:w-1/2 w-full sm:h-full flex flex-col justify-center items-center gap-6 sm:gap-4">
                        <div className="px-4 py-1 flex justify-center items-center bg-white rounded-full border-2 border-[#565a5a]/20">
                          <span className='text-black funnel-regular text-[0.9rem]'>Our Desktop app ✨</span>
                        </div>

                        <img className='sm:w-[28vw] w-full transform translate-x-[0.8rem] h-auto' src="/images_assests/mockup.png" alt="" />
                      </div>
                    </div>
                  </div>
                  
              </section>
          </div>

          {/* poetic lines */}
          <div className="w-full pl-4 sm:pl-28 mt-40 sm:mt-30  sm:mb-20">
            <h6 className='sm:text-[3.4vh] sm:text-left text-center text-[1.2rem] funnel-regular font-bold text-[#c0c1c0]'>One hour a day. Real people. Real thoughts.</h6>
            <h6 className='sm:text-[3.4vh] sm:text-left text-center text-[1.2rem] funnel-regular font-bold text-black'>Vynk gives you one hour a day to match with real minds</h6>
            <h6 className='sm:text-[3.4vh] sm:text-left text-center text-[1.2rem] funnel-regular font-bold text-[#c0c1c0]'> share real thoughts, and actually feel something.</h6>
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
          <div id="about-vynk" className="relative w-full h-[125vh] sm:h-[100vh] overflow-hidden ">
          <video
              className="w-full h-full scale-400 sm:scale-110 overflow-hidden"
              src="video_assests/ringmp4.mp4"
              autoPlay
              muted
              loop
              playsInline
            >
            </video>
            <div className="absolute top-1/2 left-1/2 flex justify-center items-center w-[15rem] sm:w-[15rem] transform -translate-x-1/2 -translate-y-1/2 loading-lazy ">
            <h6 className="relative text-justify funnel-regular text-[#a55b4d] border-2 border-black/50 p-3 rounded-xl w-full text-[1rem] sm:text-[1vw] leading-[1.1rem]">
              <img className='absolute -top-[2.2vh] right-0 w-auto h-[4vh]' src="/images_assests/left-quote.png" alt="" />
                Vynk is just a space for your thoughts.
                You don’t need likes. You don’t need to perform.
                Sometimes, a thought just needs a place to land —
                somewhere real, where someone else might be feeling it too.
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
            <Footer/>
          </footer>
      </main>
    );
  }   