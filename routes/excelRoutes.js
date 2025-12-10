
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import XLSX from 'xlsx';

const router = Router();

// almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// subir y leer Excel
router.post('/upload', upload.single('archivo'), (req, res) => {
  console.log(req.file);

  if (!req.file) {
    return res.status(400).json({ mensaje: 'No se subió archivo' });
  }

  try {
    // LEER archivo Excel
    const workbook = XLSX.readFile(req.file.path);

    // Tomar primera hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertir Excel → JSON
    const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    console.log('Datos del Excel:', data);

    // Respuesta al frontend
    res.json({
      mensaje: 'Archivo procesado correctamente',
      archivo: req.file.filename,
      datos: data
    });

  } catch (error) {
    console.error("Error al procesar el archivo:", error);
    res.status(500).json({ mensaje: 'Error procesando Excel' });
  }
});

export default router;
