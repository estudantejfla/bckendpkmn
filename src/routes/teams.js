import express from "express";
import prisma from "../db.js";

const router = express.Router();

router.get("/user/:id", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: { ownerId: req.params.id },
      orderBy: { createdAt: "desc" }
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar times" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: req.params.id }
    });

    if (!team) return res.status(404).json({ error: "Time não encontrado" });

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar time" });
  }
});

router.post("/", async (req, res) => {
  const { ownerId, name, pokemon, description } = req.body;

  try {
    const team = await prisma.team.create({
      data: {
        ownerId,
        name,
        pokemon: JSON.stringify(pokemon),
        description,
        shared: false
      }
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar time" });
  }
});

router.put("/:id", async (req, res) => {
  const { name, pokemon, description } = req.body;

  try {
    const team = await prisma.team.update({
      where: { id: req.params.id },
      data: {
        name,
        pokemon: JSON.stringify(pokemon),
        description
      }
    });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar time" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.team.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar time" });
  }
});

router.post("/share/:id", async (req, res) => {
  try {
    const team = await prisma.team.update({
      where: { id: req.params.id },
      data: { shared: true }
    });
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ error: "Erro ao compartilhar time" });
  }
});

router.get("/shared", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      where: { shared: true },
      include: { owner: true }
    });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar times públicos" });
  }
});

export default router;
