import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET ALL DEPOIMENTOS
router.get("/", async (req, res) => {
  const depo = await prisma.depoimento.findMany({
    include: { user: true },
  });
  res.json(depo);
});

// CREATE DEPOIMENTO
router.post("/", async (req, res) => {
  const { userId, message } = req.body;

  const dep = await prisma.depoimento.create({
    data: { userId, message },
  });

  res.json(dep);
});

export default router;


