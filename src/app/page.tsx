'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import useSocket  from '../component/serverconnect'
import { TIMEOUT } from "dns";

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
          console.log("match not found");
          socketref.current!.emit("refresh");
          setMatchStatus("match not found 🙏");
          setTimeout(() => {
            setResultPanelOpen(false);
          }, 2500);
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
          console.log(process.env.NEXT_PUBLIC_STREAM_API_KEY) ;
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
  
          window.location.href = `/chatpage?channelId=${channelId}&userId=${userId  }`;
      
        } catch (err) {
          console.error("Failed to connect to Stream Chat:", err);
        }
        finally{
          setResultPanelOpen(false);
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

  useEffect(() => {
  const input = document.getElementById('myInput');
  console.log(input);
  if (input) {
    input.addEventListener('keydown', handleKeyDown);
  }
}, []);

  if (checking) {
    return <div className="flex h-screen w-full justify-center items-center">Loading... please wait</div>; 
  }

  return (
    <main className="relative sm:min-h-screen h-[95vh] flex felx-col items-end justify-center p-4">
      <div className="sm:w-1/2 w-full flex flex-col items-center justify-center mb-8 rounded-[2rem] backdrop-blur-md bg-white/10 border border-white/20 px-2 shadow-lg sm:py-3 py-1">
              <div className={`w-full overflow-hidden transition-[height] duration-500 ease-in-out flex flex-col gap-4 justify-center items-center ${
                  Resultpanelopen ? 'h-100' : 'h-0'
                }`}>
                  <h5 className="text-[1.5rem] funnel-regular max-w-100 text-center ">{
                    matchStatus
                  }</h5>
                  {matchStatus === "Waiting for match..." && (
                    <div className="loader"></div>
                  ) 

                  }
              </div>

        <section className="w-full  flex items-center justify-between gap-4 ">
          <input id="myInput" placeholder="What’s on your mind right now?" className="w-3/4 focus:outline-none font6 " value={thought} onChange={(e) => {
            setThought(e.target.value);
          }}   type="text" />
          <section className=" flex flex-grow items-center justify-end gap-4 ">
            <button onClick={() => {
                  setResultPanelOpen(true);
                  setMatchStatus("Waiting for match...");
                  sendThought(userId ?? "", thought ?? "");
                }}className="px-3 text-[0.8rem] font6 rounded-full hover:bg-green-700 text-white border border-white text-black py-2">Go</button>
          </section>
        </section>
      </div>
    </main>
  );
}
