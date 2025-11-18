import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// pega o time dousuario
router.get("/user/:id", async (req, res) => {
  const teams = await prisma.team.findMany({
    where: { ownerId: req.params.id },
    include: { sharedTeam: true },
  });

  res.json(teams);
});

// criar time
router.post("/", async (req, res) => {
  const { ownerId, name, description, pokemon } = req.body;

  const team = await prisma.team.create({
    data: { ownerId, name, description, pokemon },
  });

  res.json(team);
});

// compartilahar TIME
// Compartilhar time
router.post("/share/:id", async (req, res) => {
  const teamId = req.params.id;

  try {
    const updated = await prisma.team.update({
      where: { id: teamId },
      data: { shared: true }
    });

    res.json({ success: true, team: updated });

  } catch (err) {
    res.status(500).json({ error: "Erro ao compartilhar time" });
  }
});



export default router;
