import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { json } from 'stream/consumers';

const allowedOrigin = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {

    const body = await request.json();
    const { userid, newusername } = body;

    try{
        if (!userid) {
        return new Response(
            JSON.stringify({ error: 'Email is required' }),
            { status: 400 }
        );
        }

        const updatedUser = await prisma.user.update({
            where: { id : userid },
            data: { username: newusername }, 
        });

        const response = new NextResponse(
            JSON.stringify({ user: updatedUser }),
            { status: 201 }
        )

        response.headers.set('Access-Control-Allow-Origin', allowedOrigin!);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return response ;
    }
    catch (error) {
        console.error("Update error:", error);
        return NextResponse.json(
        { success: false, error: "Failed to update user" },
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