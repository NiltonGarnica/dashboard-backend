import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";

dotenv.config();

const app = express();

// ✅ CORS SOLO LOCAL
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

app.use(express.json());

// Rutas
app.use("/api/usuarios", userRoutes);
app.use("/api/excel", excelRoutes);

// Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch(err => console.error("❌ Error Mongo:", err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend en http://localhost:${PORT}`);
});
