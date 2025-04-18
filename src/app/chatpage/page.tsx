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
    <div className="flex flex-col w-full h-screen  items-center p-4 bg-gradient-to-br from-[#A58DC7] via-[#C5B1DF] to-[#A58DC7]">
      <h1 className="fixed top-2 font6 text-xl  font-bold mb-4">Chat with Your Match</h1>

      <div className="scrollbar-hide flex mt-9 overflow-scroll bg-[#222b5a]/50 backdrop-blur-xl rounded-xl p-6 flex-col max-h-[80vh]  space-y-4 mb-4 w-170">
        {messages.map((msg, index) => (
          console.log('Message:', msg),
          <div
            key={index}
            className={`flex items-center  ${
              msg.user?.id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.user?.id === currentUserId 
                  ? 'bg-gray-300 text-black'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <p className="font-semibold text-sm">
                  <strong className="font-bold mr-1">
                    {msg.user?.id === currentUserId ? 'Me' : 'Anonymous'}:
                  </strong>
                  <span className="font-light">{msg.text}</span>
                </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-4 left-1/2 transform translate-x-1/2 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="px-4 py-2 focus:outline-none text-black border rounded-lg w-4/5"
        />
        <button
          onClick={sendMessage}
          className="p-3 font1 bg-blue-600 text-white rounded-lg px-8 h-10 flex justify-center items-center"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
