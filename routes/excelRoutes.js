import { Router } from "express";
import multer from "multer";
import XLSX from "xlsx";
import Dataset from "../models/Dataset.js";

const router = Router();

// Multer en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Subir Excel
router.post("/upload", upload.single("archivo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: "No se subió archivo" });
  }

  try {
    const workbook = XLSX.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (data.length === 0) {
      return res.status(400).json({ mensaje: "Excel vacío" });
    }

    const dataset = new Dataset({
      nombre: req.file.originalname,
      columnas: Object.keys(data[0]),
      filas: data,
      activo: false
    });


    await dataset.save();

    res.json({
      mensaje: "Archivo procesado y guardado correctamente",
      filas: data.length,
    });
  } catch (error) {
    console.error("Error procesando Excel:", error);
    res.status(500).json({ mensaje: "Error procesando Excel" });
  }
});

// Listar datasets
router.get("/", async (req, res) => {
  try {
    const datasets = await Dataset.find().sort({ createdAt: -1 });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo datasets" });
  }
});
// Marcar dataset como activo
router.post("/usar/:id", async (req, res) => {
  try {
    // Desactivar todos
    await Dataset.updateMany({}, { activo: false });

    // Activar el seleccionado
    await Dataset.findByIdAndUpdate(req.params.id, {
      activo: true
    });

    res.json({ mensaje: "Dataset activado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error activando dataset" });
  }
});
// Obtener dataset activo
router.get("/activo", async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ activo: true });

    if (!dataset) {
      return res.json(null);
    }

    res.json(dataset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo dataset activo" });
  }
});


export default router;
