import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: String,
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    rol: {
      type: String,
      default: "usuario"
    },
    estado: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
