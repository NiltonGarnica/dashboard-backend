const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------------------------------
// 🚀 CREAR USUARIO
// ------------------------------------------
exports.createUser = async (req, res) => {
  try {
    const { nombre, email, password, rol, estado } = req.body;

    const existe = await User.findOne({ email });
    if (existe)
      return res.status(400).json({ mensaje: "El email ya está registrado" });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const nuevo = new User({
      nombre,
      email,
      password: hashedPassword,
      rol,
      estado
    });

    await nuevo.save();

    res.json({ mensaje: "Usuario creado correctamente", usuario: nuevo });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error al crear usuario" });
  }
};

// ------------------------------------------
// 🚀 OBTENER USUARIOS
// ------------------------------------------
exports.getUsers = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password"); // No mostrar contraseñas
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

// ------------------------------------------
// 🚀 ACTUALIZAR USUARIO
// ------------------------------------------
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    const actualizado = await User.findByIdAndUpdate(id, req.body, {
      new: true
    }).select("-password");

    res.json({ mensaje: "Usuario actualizado", usuario: actualizado });
  } catch (err) {
    res.status(500).json({ mensaje: "Error al actualizar usuario" });
  }
};

// ------------------------------------------
// 🚀 ELIMINAR USUARIO
// ------------------------------------------
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.json({ mensaje: "Usuario eliminado" });

  } catch (err) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

// ------------------------------------------
// 🚀 LOGIN
// ------------------------------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario)
      return res.status(400).json({ mensaje: "Credenciales inválidas" });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido)
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign(
      { uid: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: "Error en el servidor" });
  }
};
