'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup ,browserLocalPersistence, setPersistence, } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {


  const [userId, setUserId] = useState<string | null>(null); 
  // const [email, setEmail] = useState<string>("");
  const [thought, setThought] = useState<string>("");
  const [Resultpanelopen , setResultPanelOpen] = useState(false);
  const [matchStatus, setMatchStatus] = useState<string>(""); 
  const [matchedData, setMatchedData] = useState<any>(null); 
  // const [user, setUser] = useState<any>(null);
  
  const router = useRouter();
  const [checking, setChecking] = useState(true);

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
      const res = await axios.post("http://localhost:3000/api/userroute", { email });

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

  const sendThought = async (userId: string, text: string) => {
    try {
      const res = await axios.post("/api/thoughts", { userId, text });
      const thought = res.data.thought;

      const socket = io("http://localhost:3001");

      socket.on("connect", () => {
        socket.emit("join_pool", thought);
      });

      socket.on("waiting_for_match", () => {
        console.log("Waiting for match...");
        setMatchStatus("Waiting for match...");
      });

      socket.on("match_found", async (data) => {
        console.log("Match found!", data);
        setMatchStatus("Match found!");
        setMatchedData(data);
      
        try {
          const response = await axios.post("/api/chat/token", {
            userId: userId,
          });
      
          const token = response.data.token;
      
          const { StreamChat } = await import('stream-chat');
          console.log(process.env.NEXT_PUBLIC_STREAM_API_KEY) ;
          const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
      
          await chatClient.connectUser(
            {
              id: userId,
              name: "Anonymous", 
            },
            token
          );
          console.log("Connected to Stream Chat" , token);

          const channelRes = await axios.post("/api/chat/channel", {
            userId,
            partnerId: data.matchedWith.userId, 
          });
          
          const { channelId } = channelRes.data;
          console.log(channelRes.status ,"Channel ID:", channelId);

          // Now you can use that `channelId` to watch the channel:
          const channel = chatClient.channel('messaging', channelId, {
            members: [userId, data.matchedWith.userId],
          });
          
          await channel.watch(); // Optional: Fetch messages, etc.
          console.log("Joined channel", channelId);

          window.location.href = `/chatpage?channelId=${channelId}&userId=${userId  }`;
      
        } catch (err) {
          console.error("Failed to connect to Stream Chat:", err);
        }
      });
      
    } catch (err) {
      console.error("Error sending thought:", err);
    }
  };

  if (checking) {
    return <div className="flex h-screen w-full justify-center items-center">Loading... please wait</div>; 
  }

  return (
    <main className="relative min-h-screen flex felx-col items-end justify-center p-4">
      <div className="w-1/2 flex flex-col items-center justify-center mb-8 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 px-3 shadow-lg py-3">
              <div className={`w-full overflow-hidden transition-[height] duration-500 ease-in-out flex justify-center items-center ${
                  Resultpanelopen ? 'h-100' : 'h-0'
                }`}>
                  searching for a result...
        </div>

        <section className="w-full  flex items-center justify-between gap-4  ">
          <input placeholder="What’s on your mind right now?" className="w-3/4 focus:outline-none font6 " value={thought} onChange={(e) => {
            setThought(e.target.value);
          }}   type="text" />
          <section className=" flex flex-grow items-center justify-between gap-4 ">
            <div className="w-3 h-3 bg-red-300 rounded-full"> </div>
            <button onClick={() => {
                  setResultPanelOpen(!Resultpanelopen);
                  sendThought(userId ?? "", thought ?? "");
                }}className="px-3 text-[0.8rem] font6 rounded-lg bg-white text-black py-2">LET IT OUT</button>
          </section>
        </section>
      </div>
    </main>
  );
}
