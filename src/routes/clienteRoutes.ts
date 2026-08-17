import { Router } from "express";
import {
  criarCliente,
  listarTodosClientes,
  buscarClientePorIdController,
  atualizarClienteController,
  deletarClienteController
} from "../controllers/clienteController";

const router = Router();

router.post("/clientes", criarCliente);

router.get("/clientes", listarTodosClientes);

router.get("/clientes/:id", buscarClientePorIdController);

router.put("/clientes/:id", atualizarClienteController);

router.delete("/clientes/:id", deletarClienteController);

export default router;