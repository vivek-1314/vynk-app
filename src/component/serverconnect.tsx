// useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL!, {
      transports: ['websocket'], 
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef;
};

export default useSocket;
