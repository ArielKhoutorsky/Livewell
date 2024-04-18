import { PrismaClient } from '@prisma/client';

export  async function handler(req:any) {

    const prisma = new PrismaClient();
    const { id } = req.query;  // Get the conversation ID from the URL

    if (!id) {
        return new Response(JSON.stringify({ error: "need conversation id" }), {
        status: 500,
    });
    }

    try {
        // Fetch the conversation including related patient, doctor, and messages
        const conversation = await prisma.conversation.findUnique({
            where: { id: parseInt(id) },
            include: {
                patient: true,
                doctor: true,
                logs: true, // Assuming 'logs' corresponds to messages in the conversation
            }
        });

        if (!conversation) {
        return new Response(JSON.stringify({ error: "conversation not found" }), {
        status: 404,
    });
        }

        return new Response(JSON.stringify({conversation}), {
        status: 200,
    });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "error" }), {
        status: 500,
    });    } finally {
        await prisma.$disconnect();
    }
}
