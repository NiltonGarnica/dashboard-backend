const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");

// RUTAS
router.post("/", userCtrl.crearUsuario);
router.get("/", userCtrl.obtenerUsuarios);
router.post("/login", userCtrl.login);

module.exports = router;
