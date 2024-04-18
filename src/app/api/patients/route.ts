import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();

  try {
    const doctors = await prisma.patient.findMany();
    // Assuming Response is a provided or globally available object similar to Fetch API
    return new Response(JSON.stringify({ doctors }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
   if (error instanceof Error){
        // Log the error to the server console
    console.error(error);

    // Return a response with a 500 status code and the error message
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
   }
  } finally {
    // Ensure that we disconnect after handling the request
    await prisma.$disconnect();
  }
}
