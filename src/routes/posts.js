import { Router } from "express";
import prisma from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ include: { author: true }, orderBy: { createdAt: "desc" } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

router.post("/", async (req, res) => {
  const { title, content, authorId } = req.body;
  if (!title || !content || !authorId) return res.status(400).json({ error: "Missing fields" });
  try {
    const post = await prisma.post.create({ data: { title, content, authorId } });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

export default router;
