import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/usuarios", userRoutes);
app.use("/api/excel", excelRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo conectado"))
  .catch((err) => console.log("Error al conectar Mongo:", err));

// Servidor
app.listen(3000, () => {
  console.log("Backend corriendo en http://localhost:3000");
});
