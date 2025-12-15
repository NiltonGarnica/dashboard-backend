import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    columnas: {
      type: [String],
      required: true,
    },
    filas: {
      type: Array,
      required: true,
    },

    // 🔑 NUEVO
    activo: {
      type: Boolean,
      default: false,
    },

    // (opcional, pero profesional)
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "datasets",
  }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;
