import express from "express";
import axios from "axios";
import Prediction from "../models/Prediction.js";

const router = express.Router();

// ======================
// 🔮 PREDICCIÓN SIMPLE (YA FUNCIONA)
// ======================
router.post("/predict", async (req, res) => {
  try {
    const {
      gastos,
      clientes,
      promociones,
      ingresosReales
    } = req.body;

    if (
      gastos == null ||
      clientes == null ||
      promociones == null ||
      ingresosReales == null
    ) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const response = await axios.post(
      "http://localhost:8000/predict",
      { gastos, clientes, promociones }
    );

    const ingresosPredichos = response.data.prediccion_ingresos;
    const diferencia = ingresosPredichos - ingresosReales;

    const pred = await Prediction.create({
      gastos,
      clientes,
      promociones,
      ingresosReales,
      ingresosPredichos,
      diferencia
    });

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
// 🤖 PREDICCIÓN FUTURA MULTIVARIABLE
// ======================
router.post("/predict-futuro", async (req, res) => {
  try {
    const { historial, meses } = req.body;

    if (!historial || !Array.isArray(historial) || !meses) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    // 🔗 FastAPI (nuevo endpoint)
    const response = await axios.post(
      "http://localhost:8000/predict-futuro",
      { historial, meses }
    );

    // response.data contiene:
    // { meses, gastos, clientes, ingresos }

    res.json(response.data);

  } catch (error) {
    console.error("❌ Error en predicción futura:", error);
    res.status(500).json({ error: "Error al predecir futuro" });
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
