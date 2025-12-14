import { Router } from "express";
import multer from "multer";
import XLSX from "xlsx";
import Dataset from "../models/Dataset.js";

const router = Router();

// 🔥 Multer en memoria (Render-safe)
const upload = multer({ storage: multer.memoryStorage() });

// 📤 Subir Excel y guardarlo en MongoDB
router.post("/upload", upload.single("archivo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: "No se subió archivo" });
  }

  try {
    // Leer Excel desde memoria
    const workbook = XLSX.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Excel → JSON (columnas dinámicas)
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (data.length === 0) {
      return res.status(400).json({ mensaje: "Excel vacío" });
    }

    // Guardar dataset en MongoDB
    const dataset = new Dataset({
      nombre: req.file.originalname,
      columnas: Object.keys(data[0]),
      filas: data,
    });

    await dataset.save();

    res.json({
      mensaje: "Archivo procesado y guardado correctamente",
      filas: data.length,
      datos: data,
    });
  } catch (error) {
    console.error("Error procesando Excel:", error);
    res.status(500).json({ mensaje: "Error procesando Excel" });
  }
});

// 📥 Obtener todos los datasets guardados
router.get("/", async (req, res) => {
  try {
    const datasets = await Dataset.find().sort({ creadoEn: -1 });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo datasets" });
  }
});

export default router;
