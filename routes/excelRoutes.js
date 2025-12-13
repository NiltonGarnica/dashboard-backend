import { Router } from "express";
import multer from "multer";
import XLSX from "xlsx";

const router = Router();

// 🔥 Multer en MEMORIA (Render-safe)
const upload = multer({ storage: multer.memoryStorage() });

// subir y leer Excel
router.post("/upload", upload.single("archivo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ mensaje: "No se subió archivo" });
  }

  try {
    // Leer Excel desde memoria
    const workbook = XLSX.read(req.file.buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Excel → JSON
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    res.json({
      mensaje: "Archivo procesado correctamente",
      filas: data.length,
      datos: data
    });

  } catch (error) {
    console.error("Error procesando Excel:", error);
    res.status(500).json({ mensaje: "Error procesando Excel" });
  }
});

export default router;
