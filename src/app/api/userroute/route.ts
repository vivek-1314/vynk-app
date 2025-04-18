import  prisma  from '@/lib/prisma';

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
    return new Response(JSON.stringify({ user: newUser }), { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while creating the user' }),
      { status: 500 }
    );
  }
}
