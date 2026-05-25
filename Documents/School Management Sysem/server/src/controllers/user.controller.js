import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const currentUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const permissions = user.role.permissions.map((item) => item.permission.name);
    res.json({ id: user.id, email: user.email, role: { id: user.role.id, name: user.role.name }, permissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};