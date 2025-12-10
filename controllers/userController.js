const User = require("../models/User");
const bcrypt = require("bcrypt");

// Crear usuario
// Crear usuario
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, estado } = req.body;

    const existe = await User.findOne({ email });
    if (existe)
      return res.status(400).json({ mensaje: "El email ya está registrado" });

    // 🔥 Cifrar contraseña antes de guardar
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const nuevo = new User({
      nombre,
      email,
      password: hashedPassword, // ← ahora sí cifrada
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


// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  const usuarios = await User.find();
  res.json(usuarios);
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario)
      return res.status(400).json({ mensaje: "Credenciales inválidas" });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido)
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    // Crear token JWT 🔥
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { uid: usuario._id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      mensaje: "Login exitoso",
      token,     // ← Aquí enviamos el token
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
