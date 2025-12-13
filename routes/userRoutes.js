import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  login
} from "../controllers/userController.js";

const router = Router();

// CRUD Completo
router.post("/", createUser);       // Crear usuario
router.get("/", getUsers);          // Listar usuarios
router.put("/:id", updateUser);     // Actualizar usuario
router.delete("/:id", deleteUser);  // Eliminar usuario

// LOGIN
router.post("/login", login);

export default router;
