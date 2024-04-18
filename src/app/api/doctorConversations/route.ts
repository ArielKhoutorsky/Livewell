import { PrismaClient } from '@prisma/client';

export async function POST(req:any) {
  const prisma = new PrismaClient();

  const { doctorId } = req.query;

  try {
    // Fetch conversations that have been started with this doctor
    const startedConversations = await prisma.conversation.findMany({
      where: {
        doctorId: parseInt(doctorId),
      },
      include: {
        patient: true, // Include patient details in the response
        logs: true // Include message logs in the response
      }
    });

    // Fetch all patients that do not have a conversation with this doctor
    const allPatients = await prisma.patient.findMany();
    const patientsWithConversations = new Set(startedConversations.map(c => c.patientId));
    const availablePatients = allPatients.filter(p => !patientsWithConversations.has(p.id));

        return new Response(JSON.stringify({startedConversations, availablePatients}), {
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
