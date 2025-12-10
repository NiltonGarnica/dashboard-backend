const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");

// CRUD Completo
router.post("/", userCtrl.createUser);        // Crear usuario
router.get("/", userCtrl.getUsers);           // Listar usuarios
router.put("/:id", userCtrl.updateUser);      // Actualizar usuario
router.delete("/:id", userCtrl.deleteUser);   // Eliminar usuario

// LOGIN (mantiene el nombre)
router.post("/login", userCtrl.login);

module.exports = router;
