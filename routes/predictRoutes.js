import express from "express";
import axios from "axios";
import Prediction from "../models/Prediction.js";

const router = express.Router();

// ======================
// 🔮 PREDICCIÓN
// ======================
router.post("/predict", async (req, res) => {
  try {
    const {
      gastos,
      clientes,
      promociones,
      ingresosReales
    } = req.body;

    // 1️⃣ Llamar a FastAPI (Python)
    const response = await axios.post(
      "http://localhost:8000/predict",
      { gastos, clientes, promociones }
    );

    // ✅ FORMA CORRECTA
    const ingresosPredichos = response.data.prediccion_ingresos;

    // 2️⃣ Calcular diferencia
    const diferencia = ingresosPredichos - ingresosReales;

    // 3️⃣ Guardar en MongoDB
    const pred = await Prediction.create({
      gastos,
      clientes,
      promociones,
      ingresosReales,
      ingresosPredichos,
      diferencia
    });

    // 4️⃣ Respuesta al frontend
    res.json({
      prediccion_ingresos: ingresosPredichos,
      diferencia,
      guardado: true,
      id: pred._id
    });

  } catch (error) {
    console.error("❌ Error en predicción:", error);
    res.status(500).json({ error: "Error al predecir" });
  }
});

// ======================
// 📜 HISTORIAL
// ======================
router.get("/history", async (req, res) => {
  try {
    const historial = await Prediction.find()
      .sort({ fecha: -1 })
      .limit(20);

    res.json(historial);
  } catch (error) {
    console.error("❌ Error historial:", error);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

export default router;
