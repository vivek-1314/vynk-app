// src/app/api/chat/token/route.ts
import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.NEXT_PUBLIC_STREAM_API_SECRET!
);

const allowedOrigin = process.env.NEXT_PUBLIC_API_URL;
export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const token = serverClient.createToken(userId);
  const response =  NextResponse.json({ token });

  response.headers.set('Access-Control-Allow-Origin',allowedOrigin!); // Your frontend URL
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  const allowedOrigin = process.env.NEXT_PUBLIC_API_URL;
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin!);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}