// api/doctors.js
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  try {
    const doctors = await prisma.doctor.findMany();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the doctors." });
  } finally {
    await prisma.$disconnect();
  }
}
