export function limparCPF(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

export function cpfValido(cpf: string): boolean {
  const cpfLimpo = limparCPF(cpf);

  if (cpfLimpo.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpfLimpo[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;

  if (resto === 10) {
    resto = 0;
  }

  if (resto !== Number(cpfLimpo[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpfLimpo[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10) {
    resto = 0;
  }

  return resto === Number(cpfLimpo[10]);
}

export function nomeValido(nome: string): boolean {
  const nomeLimpo = nome.trim();

  return nomeLimpo.length >= 3;
}

export function emailValido(email: string): boolean {
  const emailLimpo = email.trim().toLowerCase();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
}

export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

export function telefoneValido(telefone: string): boolean {
  const telefoneLimpo = limparTelefone(telefone);

  return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 13;
}

export function dataNascimentoValida(data: string): boolean {
  const nascimento = new Date(data);
  const hoje = new Date();

  if (isNaN(nascimento.getTime())) {
    return false;
  }

  if (nascimento > hoje) {
    return false;
  }

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mes = hoje.getMonth() - nascimento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoje.getDate() < nascimento.getDate())
  ) {
    idade--;
  }

  return idade >= 18;
}

export function estadoValido(estado: string): boolean {
  return /^[A-Za-z]{2}$/.test(estado);
}

export function validarCliente(dados: any) {
  const erros: { field: string; message: string }[] = [];

  if (!dados.nome || !nomeValido(dados.nome)) {
    erros.push({
      field: "nome",
      message: "O nome deve possuir pelo menos 3 caracteres."
    });
  }

  if (!dados.cpf || !cpfValido(dados.cpf)) {
    erros.push({
      field: "cpf",
      message: "Informe um CPF válido."
    });
  }

  if (!dados.email || !emailValido(dados.email)) {
    erros.push({
      field: "email",
      message: "Informe um e-mail válido."
    });
  }

  if (!dados.telefone || !telefoneValido(dados.telefone)) {
    erros.push({
      field: "telefone",
      message: "Informe um telefone válido."
    });
  }

  if (
    !dados.dataNascimento ||
    !dataNascimentoValida(dados.dataNascimento)
  ) {
    erros.push({
      field: "dataNascimento",
      message:
        "O cliente deve possuir pelo menos 18 anos e a data não pode ser futura."
    });
  }

  // Validação do campo ativo
  if (
    dados.ativo !== undefined &&
    typeof dados.ativo !== "boolean"
  ) {
    erros.push({
      field: "ativo",
      message: "O campo ativo deve ser booleano."
    });
  }

  if (!dados.endereco) {
    erros.push({
      field: "endereco",
      message: "O endereço é obrigatório."
    });
  } else {
    if (!dados.endereco.cep) {
      erros.push({
        field: "endereco.cep",
        message: "O CEP é obrigatório."
      });
    }

    if (!dados.endereco.logradouro) {
      erros.push({
        field: "endereco.logradouro",
        message: "O logradouro é obrigatório."
      });
    }

    if (!dados.endereco.numero) {
      erros.push({
        field: "endereco.numero",
        message: "O número é obrigatório."
      });
    }

    if (!dados.endereco.bairro) {
      erros.push({
        field: "endereco.bairro",
        message: "O bairro é obrigatório."
      });
    }

    if (!dados.endereco.cidade) {
      erros.push({
        field: "endereco.cidade",
        message: "A cidade é obrigatória."
      });
    }

    if (
      !dados.endereco.estado ||
      !estadoValido(dados.endereco.estado)
    ) {
      erros.push({
        field: "endereco.estado",
        message: "O estado deve possuir exatamente duas letras."
      });
    }
  }

  return erros;
}