import { PrismaClient } from '@prisma/client';

export default async function handler(req:any) {

  const prisma = new PrismaClient();
  const { doctorId, patientId } = req.body;

  // Validate input
  if (!doctorId || !patientId) {
        return new Response(JSON.stringify({ error: "wrong params" }), {
        status: 500,
    });
  }

  try {
    // Check if a conversation already exists between the doctor and patient
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { doctorId: parseInt(doctorId) },
          { patientId: parseInt(patientId) }
        ]
      }
    });

    if (existingConversation) {
             return new Response(JSON.stringify({ error: "A conversation between the given doctor and patient already exists." }), {
        status: 409,
    });
    }

    // Create a new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        doctorId: parseInt(doctorId),
        patientId: parseInt(patientId)
      }
    });

    return new Response(JSON.stringify({newConversation}), {
        status: 201,
    });
  } catch (error) {
    console.error(error);
            return new Response(JSON.stringify({ error: "error" }), {
        status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
