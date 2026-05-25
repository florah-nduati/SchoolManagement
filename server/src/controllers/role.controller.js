import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};