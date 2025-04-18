import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embed';
import prisma from '@/lib/prisma'; 

const allowedOrigin = process.env.NEXT_PUBLIC_API_URL;
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, text } = body;


  try {
    const embedding = await generateEmbedding(text);
    const newThought = await prisma.thought.create({
      data: {
        userId,
        thought: text,
        embedding,
      },
    });

    const response =  NextResponse.json({ success: true, thought: newThought }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin',allowedOrigin!); // Your frontend URL
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;

  }catch (error) {
    console.error('Error creating thought:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  } 
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  const allowedOrigin = process.env.NEXT_PUBLIC_API_URL;
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin!);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

