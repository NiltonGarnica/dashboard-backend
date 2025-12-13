import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";

dotenv.config();

const app = express();

/* 🔥 CORS DEFINITIVO */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ngc-webapp.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// Rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/excel", excelRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch(err => console.error("❌ Error Mongo:", err));

// Puerto dinámico (Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
