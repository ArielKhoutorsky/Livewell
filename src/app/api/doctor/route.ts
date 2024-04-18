import { PrismaClient } from '@prisma/client';

export async function POST(request:any) {
  const prisma = new PrismaClient();
  
  try {
    // Parse the request body to get the doctor's name
    const { name, email } = await request.json() as { name: string, email: string };;

    // Check if a doctor with the provided email already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { email },
    });

    // If a doctor with this name exists, throw an error
    if (existingDoctor) {
      throw new Error('A doctor with this email already exists.');
    }

    // If no existing doctor is found, create a new doctor
    const newDoctor = await prisma.doctor.create({
      data: { email, name },
    });

    // Return the newly created doctor with a 201 status code
    return new Response(JSON.stringify(newDoctor), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    // If the error is an instance of Error, use the error message
    // Otherwise, use a generic error message
    const errorMessage = error instanceof Error ? error.message : 'An error occurred during the operation.';

    // Log the error to the server console
    console.error(error);

    // Return a response with a 500 status code and the error message
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: error instanceof Error && error.message.includes('already exists') ? 409 : 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    // Disconnect from the Prisma client
    await prisma.$disconnect();
  }
}
