import { Router } from "express";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ error: "Usuário já existe" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, email: username + "@none.com" }
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "devsecret");
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar conta" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Senha incorreta" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "devsecret");
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao logar" });
  }
});

export default router;
