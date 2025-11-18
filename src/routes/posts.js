import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET ALL POSTS
router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({ include: { author: true } });
  res.json(posts);
});

// CREATE POST
router.post("/", async (req, res) => {
  const { title, content, authorId } = req.body;

  const post = await prisma.post.create({
    data: { title, content, authorId },
  });

  res.json(post);
});

export default router;