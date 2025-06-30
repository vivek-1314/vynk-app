'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import useSocket  from '../component/serverconnect'
import { motion } from "framer-motion";
import { getCountdownString } from "@/utils/countdown";
import Logo from '@/component/logo'

export default function HomePage() {

  interface Thought {
  values: number[];  
  metadata: {
    userId: string;   
    thought: string;  
    socketId: string; 
  };
}
  interface MatchFoundPayload {
    yourThought: Thought;
    matchedWith: Thought;
  }


  const [userId, setUserId] = useState<string | null>(null); 
  const [thought, setThought] = useState<string>("");
  const [Resultpanelopen , setResultPanelOpen] = useState(false);
  const [matchStatus, setMatchStatus] = useState<string>(""); 
  const [matchedData, setMatchedData] = useState<any>(null); 
  const [username, setUsername] = useState<string>("");
  const [newusername , setnewusername] = useState<string>("") ;

  const liveThoughts = [
  "I wish I knew if I’m growing or just drifting.",
  "Is it possible to miss a version of yourself you never met?",
  "No one talks about how heavy silence can get.",
  "I’m learning that not all closure comes with words."
];
  
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const socketref = useSocket();
  
  const sendThought = async (userId: string, text: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/thoughts`, { userId, text });
      const thought = res.data.thought;

      socketref.current!.emit("refresh");

      socketref.current!.emit("join_pool", thought);

      socketref.current!.on("waiting_for_match", () => {
        console.log("Waiting for match...");
        setTimeout(() => {
          console.log("Match Not Found");
          socketref.current!.emit("refresh");
          setMatchStatus("No match Found");
          console.log("panel text changed")
          setTimeout(() => {
            setResultPanelOpen(false);
            console.log("closing panel")
            setMatchStatus("") ;
          }, 2000);
        }, 90000);
      });

      socketref.current!.on("match_found", async (data : MatchFoundPayload) => {
        console.log("Match found!", data);
        setMatchStatus("Match found! 🤝 Redirecting to your connection...");
        setMatchedData(data);
      
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/token`, {
            userId: userId,
          });
      
          const token = response.data.token;
      
          const { StreamChat } = await import('stream-chat');
          const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
      
          await chatClient.connectUser(
            {
              id: userId!,
              name: "Anonymous", 
            },
            token
          );
          console.log("Connected to Stream Chat" , token);
  
          const channelRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/channel`, {
            userId,
            partnerId: data.matchedWith.metadata.userId, 
          });
          
          const { channelId } = channelRes.data;
          console.log(channelRes.status ,"Channel ID:", channelId);
  
          // Now you can use that `channelId` to watch the channel:
          const channel = chatClient.channel('messaging', channelId, {
            members: [userId!, data.matchedWith.metadata.userId],
          });
          
          await channel.watch(); // Optional: Fetch messages, etc.
          console.log("Joined channel", channelId);
  
          window.location.href = `/chatpage?channelId=${channelId}&userId=${userId}`;
      
        } catch (err) {
          console.error("Failed to connect to Stream Chat:", err);
        }
        finally{
          setResultPanelOpen(false);
          setMatchStatus("") ;
        }
      });

    } catch (err) {
      console.error("Error sending thought:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.email) ;
        await handleSubmit(user.email!);
        setChecking(false);
      } else {
        router.push('/landingpage'); 
        setTimeout(() => {
          setChecking(false);
        }, 2000);
      }
    });

    return () => unsubscribe();
  }, [router]);
  
  const handleSubmit = async (email: string) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/userroute`, { email });

      if (res.status === 201) {
        console.log(res.data.user.id);
        setUserId(res.data.user.id); 
        setUsername(res.data.user.username);
        setnewusername(res.data.user.username) ;
      } else {
        throw new Error("Failed to fetch userId");
      }
    } catch (error) {
      setUserId(null);
    }
  };

  const handleKeyDown = () => {
    setResultPanelOpen(true);
    setMatchStatus("Waiting for match...");
    sendThought(userId ?? "", thought ?? "");
  }

  const updateusername = async (userid: string , newusername : string) => {
    console.log("call gone now") ;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/userroute/replaceusername`, { userid , newusername });

      if (res.status === 201) {
        setUsername(res.data.user.username);
        alert('User_Name updated')
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error) {
      alert('username not updated')
    }
  }

  useEffect(() => {
  const input = document.getElementById('myInput');
  console.log(input);
  if (input) {
    input.addEventListener('keydown', handleKeyDown);
  }
}, []);

 const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getCountdownString(18, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  if (checking) {
    return <div className="flex h-screen w-full justify-center items-center">Loading... please wait</div>; 
  }

  return (
    <main className="w-full sm:h-screen h-full min-h-screen bg-white sm:px-0 px-4 relative">

    <Logo />


    { Resultpanelopen && (
          <div className="absolute top-1/2 rounded-2xl flex flex-col justify-between items-center overflow-hidden bg-[#dcdee3] left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:w-[40vw] w-[80%] sm:min-h-70 sm:h-[50vh] z-10">
            <section className="mt-6 flex flex-col justify-center items-center">
              {matchStatus === "" ? (
                <>
                  <span className="text-black funnel-regular">Hold on..</span>
                  <span className="text-[#606160]/80 funnel-regular ml-2">
                    Finding kind soul for you
                  </span>
                </>
              ) : (
                <span className="text-black funnel-regular">{matchStatus}</span>
              )}
            </section>
            <video className="mx-auto w-auto h-60" src="/video_assests/giffer.mp4" autoPlay muted loop ></video>
        </div>
      )
      }

    <section className={`relative sm:min-h-screen flex flex-col items-center justify-between sm:w-[70vw] w-full mx-auto pt-[2vw] pb-[3vw] ${Resultpanelopen ? "disabled-panel" : ""} `}>
      <div className="w-full h-8 flex sm:justify-between justify-end">
        <section className="items-center gap-2 py-[0.4rem] hidden sm:flex">
          <img src="/images_assests/left-arrow.png" className="h-full w-auto hover:scale-140" alt="" />
          <img src="/images_assests/left-arrow.png" className="h-full w-auto rotate-180 hover:scale-140" alt="" />
        </section>
        <div className="w-50 h-full bg-[#e5ecec] rounded-xl flex items-center gap-2 py-1">
          <img src="/images_assests/settings.png" className="h-[70%] ml-2 w-auto" alt="" />
          <input value={newusername} onChange={(e) => {
            setnewusername(e.target.value)
          }} className=" w-full h-full funnel-regular text-[0.7rem] focus:outline-none text-black" type="text" />
          <button 
            onClick={() => {if (userId && newusername !== username && newusername !== "") updateusername(userId, newusername)}}
           className="text-black hover:bg-green-300 rounded-full w-7 h-7 mr-2">
            <img className="w-full h-sull hover:-rotate-44" src="/images_assests/pen.png" alt="" />
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col items-start justify-center gap-4 sm:mt-0 mt-10"> 
        <h2 className="text-black sm:text-[3vw] text-[2rem] funnel-regular leading-none">Hello, {username}</h2>
        <h2 className="text-[#606160]/80 leading-none sm:text-[3vw] text-[1.5rem] funnel-regular">Drop a thought, someone's thinking it too.</h2>
      </div>

      <section className="w-full flex sm:flex-row flex-col items-center justify-between gap-6 sm:h-[30vh] text-[#444544] funnel-regular sm:text-[1.1vw] text-[1.1rem] sm:mt-0 mt-14 leading-none ">
        <div className="relative sm:w-1/4 w-full h-full rounded-lg bg-[#e5ecec]/80 p-4 flex flex-col justify-start gap-4 ">
          {
            (parseInt(timeLeft.slice(0, 2)) < 23) ? <>
              <h3 className="text-black">Next session</h3>
              <h3 className="text-black text-[0.8rem] sm:text-[1vw] mt-8">Session Start: <span className="text-white bg-[#f08915]/90 p-1 rounded-lg px-2">{"6:00 PM IST"}</span></h3>
              <h4 className="mt-1 text-black text-[0.8rem] sm:text-[1vw] ">Time left : <span className="text-white bg-[#f08915] p-1 rounded-lg px-2">{`${timeLeft.slice(0, 2)}h ${timeLeft.slice(2, 4)}m ${timeLeft.slice(4, 6)}s`}</span></h4>
              <img src="/images_assests/robot.png" className="absolute bottom-2 right-2 w-7 h-7" alt="" />
            </> : 
            <>
              <span className="bg-[#f08915] text-white sm:py-2 py-[10px] sm:text-[1vw] text-[0.9rem] sm:rounded-xl rounded-lg text-center px-2">Session Ongoing 🎉</span>
              <span className="leading-[1.1rem] sm:text-[1vw] text-[0.8rem] max-w-[10rem]">Type your thoughts and find someone to talk with...</span>
            </>
          }
        </div>
        <div className="relative sm:w-2/4 w-full h-full rounded-lg bg-[#e5ecec]/80 p-4 flex flex-col justify-between items-center gap-1">
          <img src="/images_assests/ai-search.png" className="absolute top-2 right-2 sm:w-4 sm:h-4 w-6 h-6" alt="" />
          <h3 className="mb-2">Ongoing thoughts in live</h3>
          <section className="w-full flex flex-col justify-between gap-2 sm:mt-0 mt-4">
          {
            (liveThoughts).map((val , index) => {
              return (
                <div key={index} className="w-full">
                  <div className="w-full h-8 text-[0.85rem] rounded-sm flex justify-center items-center bg-[#ed8f23] text-white ">
                    <h3 className="text-center">{val}</h3>
                  </div>
                </div>
              )
            })
          }
          </section>
        </div>
        {/* <div className="relative hidden sm:flex sm:w-1/4 w-full h-full hover:cursor-not-allowed rounded-lg bg-[#e5ecec]/80 p-4 flex-col justify-between gap-4 ">
          <img src="/images_assests/notes.png" className="absolute top-2 right-2 w-4 h-4" alt="" />
          <h4>Saved Notes</h4>
          <ul className="list-disc marker:text-black flex flex-col gap-2 pl-2">
            <li className="sm:text-[0.9vw] text-[0.9rem]  text-black/60  p-1 rounded-sm">Does healing mean forgetting, or remembering without hurting?</li>
            <li className="sm:text-[0.9vw] text-[0.9rem]  text-black/60  p-1 rounded-sm">If your younger self met you today, would they be proud</li>
            <li className="sm:text-[0.9vw] text-[0.9rem]  text-black/60  p-1 rounded-sm">Are we living for our future self or our current one?</li>
          </ul>
          <div className="w-full h-8 [background:linear-gradient(135deg,_rgba(246,_247,_247,_1)_0%,_rgba(162,_170,_219,_1)_100%)] rounded-xl flex justify-center items-center">
            <input type="text" placeholder="add notes..." className="w-full h-full rounded-xl focus:outline-none px-4 sm:text-[0.9vw] text-[0.9rem]" />
          </div>
        </div> */}
      </section>

      <div className={`w-full bg-[#e5ecec] h-14 rounded-full text-black sm:text-[1vw] text-[0.9rem] sm:mt-0 mt-14 flex items-center justify-between funnel-regular ${parseInt(timeLeft.slice(0, 2)) < 23 ? 'disabled-panel1' : ''}`}>
        <input required type="text" value={thought} onChange={(e) => {
            setThought(e.target.value);
          }}  id="myInput"  placeholder="Write Your Thought Here" className="h-full w-[80%] rounded-full px-4 focus:outline-none" />
        <button onClick={() => {
                  if(thought === "") {
                    alert('input some thoughts , idea , mood , context')
                  }
                  else{
                    setResultPanelOpen(!Resultpanelopen);
                  sendThought(userId ?? "", thought ?? "");
                  }
                }} className="h-[70%]">
                <motion.img initial={{x:0 , y:0}}
                                whileHover={{
                                    rotate: -90 ,
                                    color: "#8c6951" ,
                                }}
                                transition={{
                                    rotate: { type: "ease" }
                                }} src="/images_assests/arrow-right.png" className="h-full mr-3 opacity-60 bg-white rounded-full w-auto" alt="" /></button>
      </div>
    </section>
    </main>
  );
}

