import mongoose from "mongoose";

export async function conectarBanco() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    console.log("MongoDB conectado!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}