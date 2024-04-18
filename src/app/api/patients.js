// api/patients.js
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  try {
    const patients = await prisma.patient.findMany();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the patients." });
  } finally {
    await prisma.$disconnect();
  }
}
