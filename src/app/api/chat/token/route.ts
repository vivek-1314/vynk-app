// src/app/api/chat/token/route.ts
import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.NEXT_PUBLIC_STREAM_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const token = serverClient.createToken(userId);
  return NextResponse.json({ token });
}