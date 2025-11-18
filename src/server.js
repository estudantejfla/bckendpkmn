import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import teamRoutes from "./routes/teams.js";
import depoRoutes from "./routes/depoimentos.js";

const app = express();
app.use(cors());
app.use(express.json({ strict: false }));

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/teams", teamRoutes);
app.use("/depoimentos", depoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("API running on port " + PORT));
