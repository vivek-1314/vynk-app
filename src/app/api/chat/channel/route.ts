// app/api/chat/channel/route.ts
import { StreamChat } from 'stream-chat';
import { NextResponse } from 'next/server';

const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.NEXT_PUBLIC_STREAM_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, partnerId } = body;

  if (!userId || !partnerId) {
    return NextResponse.json({ error: "Missing userId or partnerId" }, { status: 400 });
  }

  const sortedIds = [userId, partnerId].sort();
  const channelId = `chat-${sortedIds[0]}-${sortedIds[1]}`;

  const channel = serverClient.channel('messaging', channelId, {
    members: [userId, partnerId],
    created_by_id: userId,
  });

  await channel.create();

  return NextResponse.json({ channelId: channel.id }, { status: 200 });
}
