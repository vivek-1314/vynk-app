'use client'; // Ensures the component is client-side

import { useState, useEffect , useRef } from 'react';
import { StreamChat, Channel, MessageResponse } from 'stream-chat';
import axios from 'axios';

interface Message {
  user: {
    id: string;
    name: string;
  };
  text: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isClient, setIsClient] = useState(false); // Track client-side mounting status
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // State to hold URL query parameters
  const [channelId, setChannelId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check if window object is available (client-side only)
    if (typeof window !== 'undefined') {
      setIsClient(true);

      // Extract channelId and userId from URL using window.location
      const urlParams = new URLSearchParams(window.location.search);
      setChannelId(urlParams.get('channelId'));
      setUserId(urlParams.get('userId'));
      setCurrentUserId(urlParams.get('userId'));
      
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isClient || !channelId || !userId) return; // Ensure we have all necessary data

    const chatClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);

    const init = async () => {
      try {
        // Get token from your backend
        const { data } = await axios.post('/api/chat/token', { userId });
        const token = data.token;

        // Connect the user to the chat client
        await chatClient.connectUser(
          {
            id: userId,
            name: 'Anonymous',
          },
          token
        );

        // Create a channel and watch it
        const ch = chatClient.channel('messaging', channelId);
        await ch.watch();

        // Load existing messages from the channel
        const state = await ch.query();
        const initialMessages = state.messages.map((msg: MessageResponse) => ({
          text: msg.text || '',
          user: {
            id: msg.user?.id ?? '',
            name: msg.user?.name ?? 'Anonymous',
          }
          
        }));
        setMessages(initialMessages);

        // Listen for new messages
        ch.on('message.new', (event) => {
          const newMsg = event.message;
          if (newMsg?.text && newMsg?.user) {
            setMessages((prev) => [
              ...prev,
              {
                text: newMsg.text ?? '',
                user: {
                  id: newMsg.user?.id ?? '',
                  name: newMsg.user?.name ?? 'Anonymous',
                }                
              },
            ]);
          }
        });

        setChannel(ch);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
      }
    };

    init();

    // Clean up when the component is unmounted
    return () => {
      chatClient.disconnectUser();
    };
  }, [isClient, channelId, userId]); // Re-run when the client-side is ready or query changes

  // Send message logic
  const sendMessage = async () => {
    if (channel && message.trim()) {
      try {
        await channel.sendMessage({
            text: message,
          });
        setMessage('');
      } catch (err) {
        console.error('Send error:', err);
      }
    }
  };

  return (
   <main className='w-full h-screen bg-slate-100 p-1 flex flex-col justify-start sm:pt-0 pt-4'>
    <hr className='w-full hidden sm:block bg-[#a7a6a6] h-[1.2px] mt-10' />

    {/* profile bar */}
    <section className='sm:w-[40rem] w-full h-13 mx-auto border-b-[1.2px] border-x-[1.2px] sm:border-t-0 border-t-[1.2px] border-[#a7a6a6] px-4 flex items-center text-black py-2'>
      <div className="w-full h-full flex gap-4 items-center text-black/70 funnel-regular">
        <img className='h-full aspect-square bg-red-300 rounded-full opacity-80' src="/images_assests/anonymous.png" alt="" />
        <span>Anonymous</span>
      </div>

      <img  src="images_assests/zoom.png" className='h-[70%] aspect-square hover:cursor-not-allowed' alt="" />
    </section>

    {/* chat panel */}
    <section className='sm:w-[40rem] w-full mx-auto sm:h-[80vh] h-[75vh] border-b-[1.2px] border-x-[1.2px] border-[#a7a6a6] scrollbar-hide overflow-scroll flex flex-col gap-[8px] px-4 py-2'>
      {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-center  ${ 
              msg.user?.id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-[12px] rounded-lg max-w-[70%] ${
                msg.user?.id === currentUserId 
                  ? 'bg-[#13957c] text-white'
                  : 'bg-[#dbd9d9] text-black'
              }`}
            >
              <p className="font-semibold text-sm ">
                  <span className="font-light">{msg.text}</span>
                </p>
            </div>
          </div>
        ))}
    <div ref={bottomRef} />
    </section>

    {/* message box */}
    <section className='sm:w-[40rem] w-full h-13 flex justify-between items-center mx-auto border-b-[1.2px] border-x-[1.2px] border-[#a7a6a6] px-2 py-1'>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
           if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          placeholder="Type a message"
          className="px-4 py-2 focus:outline-none text-black w-[80%] h-full text-[14px] "
        />
        <button
          onClick={sendMessage}
          className="h-full font1 rounded-lg px-[0.7rem] hover:bg-gray-300 py-[0.7rem] flex justify-center items-center"
        >.
          <img src="/images_assests/send.png" className='w-full h-full' alt="send.png" />        </button>
    </section>

   </main>
  );
};

export default ChatPage;

//  <div className="flex flex-col w-full h-screen  items-center p-4 bg-gradient-to-br from-[#A58DC7] via-[#C5B1DF] to-[#A58DC7]">
//       <h1 className="fixed top-2 font6 text-xl  font-bold mb-4">Chat with Your Partner</h1>

//       <div className="scrollbar-hide max-w-170 w-full flex mt-9 overflow-scroll bg-[#222b5a]/50 backdrop-blur-xl rounded-xl p-6 flex-col max-h-[80vh]  space-y-4 mb-4">
//         
//         
//       </div>

//       <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
//         
//       </div>
//     </div>
