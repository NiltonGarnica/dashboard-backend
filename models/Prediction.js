import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  gastos: Number,
  clientes: Number,
  promociones: Number,
  ingresosReales: Number,
  ingresosPredichos: Number,
  diferencia: Number,
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Prediction", predictionSchema);
