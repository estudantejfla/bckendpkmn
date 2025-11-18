import { Router } from "express";
import prisma from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const depo = await prisma.depoimento.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } });
    res.json(depo);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar depoimentos" });
  }
});

router.post("/", async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "Missing fields" });
  try {
    const dep = await prisma.depoimento.create({ data: { userId, message } });
    res.json(dep);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar depoimento" });
  }
});

export default router;
