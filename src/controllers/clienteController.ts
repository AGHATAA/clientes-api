import { Request, Response } from "express";
import {
  cadastrarCliente,
  listarClientes,
  buscarClientePorId,
  atualizarCliente,
  deletarCliente,
  ResultadoAtualizacao
} from "../services/clienteService";

export async function criarCliente(
  req: Request,
  res: Response
) {
  try {
    const resultado = await cadastrarCliente(req.body);

    if (resultado.erro) {
      if (resultado.tipo === "CPF_ALREADY_EXISTS") {
        return res.status(409).json({
          error: "CPF_ALREADY_EXISTS",
          message:
            "Já existe um cliente cadastrado com este CPF."
        });
      }

      if (resultado.tipo === "EMAIL_ALREADY_EXISTS") {
        return res.status(409).json({
          error: "EMAIL_ALREADY_EXISTS",
          message:
            "Já existe um cliente cadastrado com este e-mail."
        });
      }

      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message:
          "Existem campos inválidos na requisição.",
        details: resultado.erros
      });
    }

    return res.status(201).json(resultado.cliente);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message:
        "Ocorreu um erro interno ao processar a solicitação."
    });
  }
}

export async function listarTodosClientes(
  req: Request,
  res: Response
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const ativo =
      req.query.ativo !== undefined
        ? req.query.ativo === "true"
        : undefined;

    const nome =
      typeof req.query.nome === "string"
        ? req.query.nome
        : undefined;

    const resultado = await listarClientes(
      page,
      limit,
      ativo,
      nome
    );

    return res.status(200).json(resultado);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message:
        "Ocorreu um erro interno ao buscar os clientes."
    });
  }
}

export async function buscarClientePorIdController(
  req: Request,
  res: Response
) {
  try {
    const cliente = await buscarClientePorId(
      String(req.params.id)
    );

    if (!cliente) {
      return res.status(404).json({
        error: "CLIENT_NOT_FOUND",
        message: "Cliente não encontrado."
      });
    }

    return res.status(200).json(cliente);

  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: "INVALID_ID",
      message: "ID do cliente inválido."
    });
  }
}

export async function atualizarClienteController(
  req: Request,
  res: Response
) {
  try {

    // CPF não pode ser alterado
    if (req.body.cpf !== undefined) {
      return res.status(400).json({
        error: "CPF_INVALID_UPDATE",
        message:
          "O CPF do cliente não pode ser alterado."
      });
    }

    const resultado: ResultadoAtualizacao =
      await atualizarCliente(
        String(req.params.id),
        req.body
      );

    // Cliente não encontrado
    if (!resultado) {
      return res.status(404).json({
        error: "CLIENT_NOT_FOUND",
        message: "Cliente não encontrado."
      });
    }

    // E-mail duplicado
    if (
      resultado.erro &&
      resultado.tipo === "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        error: "EMAIL_ALREADY_EXISTS",
        message:
          "Já existe um cliente cadastrado com este e-mail."
      });
    }

    // Erros de validação
    if (resultado.erro) {
      return res.status(400).json({
        error: "VALIDATION_ERROR",
        message:
          "Existem campos inválidos na requisição.",
        details: resultado.erros
      });
    }

    // Atualização realizada com sucesso
    return res.status(200).json(resultado.cliente);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message:
        "Ocorreu um erro interno ao atualizar o cliente."
    });
  }
}

export async function deletarClienteController(
  req: Request,
  res: Response
) {
  try {
    const cliente = await deletarCliente(
      String(req.params.id)
    );

    if (!cliente) {
      return res.status(404).json({
        error: "CLIENT_NOT_FOUND",
        message: "Cliente não encontrado."
      });
    }

    return res.status(204).send();

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message:
        "Ocorreu um erro interno ao deletar o cliente."
    });
  }
}