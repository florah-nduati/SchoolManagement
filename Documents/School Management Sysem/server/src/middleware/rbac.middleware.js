import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const authorize = (permissionName) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user?.roleId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const permissions = await prisma.rolePermission.findMany({
        where: {
          roleId: user.roleId,
        },
        include: {
          permission: true,
        },
      });

      const hasPermission = permissions.some(
        (p) => p.permission.name === permissionName
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
};