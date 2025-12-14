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
  },
  {
    timestamps: true,
    collection: "datasets",
  }
);

const Dataset = mongoose.model("Dataset", datasetSchema);

export default Dataset;
