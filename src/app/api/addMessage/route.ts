import { PrismaClient } from '@prisma/client';

export default async function handler(req:any) {

    const prisma = new PrismaClient();

    const { id } = req.query; // Conversation ID from the URL
    const { message, senderId, senderType } = req.body; // Message text, sender's ID, and sender's type ('doctor' or 'patient')

    if (!message || !senderId || !senderType) {
        return new Response(JSON.stringify({ error: "params required" }), {
        status: 400,
    });
    }

    try {
        // Validate the sender type and find the conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: parseInt(id) },
        });

        if (!conversation) {
        return new Response(JSON.stringify({ error: "conversation not found" }), {
        status: 404,
    });
        }

        // Create a new message in the conversation
        const newMessage = await prisma.message.create({
            data: {
                message: message,
                timeStamp: new Date(),
                sender: senderType === 'doctor' ? 'Doctor' : 'Patient',
                conversationId: parseInt(id), // Ensure the ID is an integer
            }
        });

        return new Response(JSON.stringify(newMessage), {
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
