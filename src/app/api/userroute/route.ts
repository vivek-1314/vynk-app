import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

const allowedOrigin = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Validate request
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ user: existingUser }), { status: 201 });
    }

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
      },
    });

    // Respond with the newly created user
    const response = new NextResponse(
      JSON.stringify({ user: newUser }),
      { status: 201 }
    );



    // Add CORS headers directly to the response
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin!);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;

  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while creating the user' }),
      { status: 500 }
    );
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