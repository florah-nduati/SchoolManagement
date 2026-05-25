import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { currentUser } from "../controllers/user.controller.js";
import { getRoles } from "../controllers/role.controller.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/roles", getRoles);
router.get("/me", authenticate, currentUser);

router.get("/students", authenticate, authorize("view_students"), (req, res) => {
  res.json({ message: "Access granted: view students" });
});

router.get("/grades", authenticate, authorize("create_grade"), (req, res) => {
  res.json({ message: "Access granted: create or view grades" });
});

router.get("/users", authenticate, authorize("manage_users"), async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: { select: { name: true } },
    },
  });
  res.json({ message: "Access granted: manage users", users });
});

export default router;