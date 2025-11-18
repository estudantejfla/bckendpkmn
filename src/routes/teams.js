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
router.post("/share/:teamId", async (req, res) => {
  const teamId = req.params.teamId;

  const shared = await prisma.sharedTeam.create({
    data: { teamId },
  });

  res.json(shared);
});

export default router;