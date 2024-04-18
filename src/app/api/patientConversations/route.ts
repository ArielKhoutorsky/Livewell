import { PrismaClient } from '@prisma/client';

export async function POST(req:any) {
  const prisma = new PrismaClient();

  const { patientId } = req.query;

  try {
    // Fetch conversations that have been started with this doctor
    const startedConversations = await prisma.conversation.findMany({
      where: {
        patientId: parseInt(patientId),
      },
      include: {
        doctor: true, // Include patient details in the response
        logs: true // Include message logs in the response
      }
    });

    // Fetch all doctors that do not have a conversation with this patient
    const allDoctors = await prisma.patient.findMany();
    const doctorsWithConversations = new Set(startedConversations.map(c => c.patientId));
    const availableDoctors = allDoctors.filter(d => !doctorsWithConversations.has(d.id));

        return new Response(JSON.stringify({startedConversations, availableDoctors}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
        return new Response(JSON.stringify({ error: "error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
