import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },

    cpf: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    telefone: {
      type: String,
      required: true
    },

    dataNascimento: {
      type: Date,
      required: true
    },

    ativo: {
      type: Boolean,
      default: true
    },

    endereco: {
      cep: {
        type: String,
        required: true
      },

      logradouro: {
        type: String,
        required: true
      },

      numero: {
        type: String,
        required: true
      },

      complemento: {
        type: String
      },

      bairro: {
        type: String,
        required: true
      },

      cidade: {
        type: String,
        required: true
      },

      estado: {
        type: String,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

export const Cliente = mongoose.model("Cliente", clienteSchema);