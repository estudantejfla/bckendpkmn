import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

// REGISTER (username + password only)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // check if username exists
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        email: username + "@none.com", // auto fake email (to satisfy schema)
      },
    });

    res.json({ message: "Conta criada com sucesso!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

// LOGIN (by username)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Senha incorreta" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.json({ token, user });
});

export default router;

