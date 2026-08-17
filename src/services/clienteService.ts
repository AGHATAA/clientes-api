import { Cliente } from "../models/Cliente";
import {
  limparCPF,
  limparTelefone,
  validarCliente
} from "../validators/clienteValidator";

type ErroAtualizacao = {
  erro: true;
  tipo?: string;
  erros?: {
    field: string;
    message: string;
  }[];
};

type SucessoAtualizacao = {
  erro: false;
  cliente: any;
};

export type ResultadoAtualizacao =
  | ErroAtualizacao
  | SucessoAtualizacao
  | null;

export async function cadastrarCliente(dados: any) {
  const erros = validarCliente(dados);

  if (erros.length > 0) {
    return {
      erro: true,
      erros
    };
  }

  const cpf = limparCPF(dados.cpf);
  const telefone = limparTelefone(dados.telefone);
  const email = dados.email.trim().toLowerCase();

  const cpfExistente = await Cliente.findOne({ cpf });

  if (cpfExistente) {
    return {
      erro: true,
      tipo: "CPF_ALREADY_EXISTS"
    };
  }

  const emailExistente = await Cliente.findOne({ email });

  if (emailExistente) {
    return {
      erro: true,
      tipo: "EMAIL_ALREADY_EXISTS"
    };
  }

  const cliente = await Cliente.create({
    nome: dados.nome.trim(),
    cpf,
    email,
    telefone,
    dataNascimento: dados.dataNascimento,
    ativo: dados.ativo ?? true,
    endereco: {
      cep: dados.endereco.cep.replace(/\D/g, ""),
      logradouro: dados.endereco.logradouro.trim(),
      numero: dados.endereco.numero,
      complemento: dados.endereco.complemento?.trim(),
      bairro: dados.endereco.bairro.trim(),
      cidade: dados.endereco.cidade.trim(),
      estado: dados.endereco.estado.toUpperCase()
    }
  });

  return {
    erro: false,
    cliente
  };
}

export async function listarClientes(
  page: number,
  limit: number,
  ativo?: boolean,
  nome?: string
) {
  const filtro: any = {};

  if (ativo !== undefined) {
    filtro.ativo = ativo;
  }

  if (nome) {
    filtro.nome = {
      $regex: nome,
      $options: "i"
    };
  }

  const total = await Cliente.countDocuments(filtro);

  const clientes = await Cliente.find(filtro)
    .collation({
      locale: "pt",
      strength: 1
    })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    data: clientes
  };
}

export async function buscarClientePorId(id: string) {
  return await Cliente.findById(id);
}

export async function atualizarCliente(
  id: string,
  dados: any
): Promise<ResultadoAtualizacao> {

  const clienteAtual = await Cliente.findById(id);

  if (!clienteAtual) {
    return null;
  }

  const enderecoAtual = clienteAtual.endereco;

  const dadosCompletos = {
    nome: dados.nome ?? clienteAtual.nome,

    // CPF permanece sempre o original
    cpf: clienteAtual.cpf,

    email: dados.email ?? clienteAtual.email,

    telefone:
      dados.telefone ?? clienteAtual.telefone,

    dataNascimento:
      dados.dataNascimento ??
      clienteAtual.dataNascimento,

    ativo:
      dados.ativo ??
      clienteAtual.ativo,

    endereco: {
      cep:
        dados.endereco?.cep ??
        enderecoAtual?.cep ??
        "",

      logradouro:
        dados.endereco?.logradouro ??
        enderecoAtual?.logradouro ??
        "",

      numero:
        dados.endereco?.numero ??
        enderecoAtual?.numero ??
        "",

      complemento:
        dados.endereco?.complemento ??
        enderecoAtual?.complemento,

      bairro:
        dados.endereco?.bairro ??
        enderecoAtual?.bairro ??
        "",

      cidade:
        dados.endereco?.cidade ??
        enderecoAtual?.cidade ??
        "",

      estado:
        dados.endereco?.estado ??
        enderecoAtual?.estado ??
        ""
    }
  };

  const erros = validarCliente(dadosCompletos);

  if (erros.length > 0) {
    return {
      erro: true,
      erros
    };
  }

  const email = dadosCompletos.email
    .trim()
    .toLowerCase();

  const telefone = limparTelefone(
    dadosCompletos.telefone
  );

  const emailExistente = await Cliente.findOne({
    email,
    _id: { $ne: id }
  });

  if (emailExistente) {
    return {
      erro: true,
      tipo: "EMAIL_ALREADY_EXISTS"
    };
  }

  const clienteAtualizado =
    await Cliente.findByIdAndUpdate(
      id,
      {
        nome: dadosCompletos.nome.trim(),

        // CPF não entra na atualização
        email,

        telefone,

        dataNascimento:
          dadosCompletos.dataNascimento,

        ativo:
          dadosCompletos.ativo,

        endereco: {
          cep:
            dadosCompletos.endereco.cep.replace(
              /\D/g,
              ""
            ),

          logradouro:
            dadosCompletos.endereco.logradouro.trim(),

          numero:
            dadosCompletos.endereco.numero,

          complemento:
            dadosCompletos.endereco
              .complemento
              ?.trim(),

          bairro:
            dadosCompletos.endereco.bairro.trim(),

          cidade:
            dadosCompletos.endereco.cidade.trim(),

          estado:
            dadosCompletos.endereco.estado.toUpperCase()
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

  if (!clienteAtualizado) {
    return null;
  }

  return {
    erro: false,
    cliente: clienteAtualizado
  };
}

export async function deletarCliente(id: string) {
  return await Cliente.findByIdAndDelete(id);
}