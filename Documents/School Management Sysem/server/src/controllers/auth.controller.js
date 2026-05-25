import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { email, password, roleId } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const role = roleId
      ? await prisma.role.findUnique({ where: { id: roleId } })
      : await prisma.role.findUnique({ where: { name: "student" } });

    if (!role) {
      return res.status(400).json({ message: "Provided role is invalid" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roleId: role.id,
      },
    });

    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email, roleId: user.roleId }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ user: { id: user.id, email: user.email, roleId: user.roleId }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};