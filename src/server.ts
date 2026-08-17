import "dotenv/config";
import express from "express";
import { conectarBanco } from "./config/database";
import clienteRoutes from "./routes/clienteRoutes";

const app = express();

app.use(express.json());

app.use(clienteRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de clientes funcionando!"
  });
});

conectarBanco();

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});