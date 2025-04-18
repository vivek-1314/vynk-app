import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embed';
import prisma from '@/lib/prisma'; 

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

    return NextResponse.json({ success: true, thought: newThought }, { status: 201 });

  }catch (error) {
    console.error('Error creating thought:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  } 
}


