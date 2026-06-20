import { pacientes } from "./mocks";
import { asNumber, formatCurrency } from "./safe";

export type DebugIntentStatus = "sucesso" | "erro" | "pendente";

export type DebugIntentResult = {
  intent: string;
  confidence: number;
  status: DebugIntentStatus;
  mensagem: string;
  source: "local";
  path: string[];
  extracted: {
    pacienteNome: string;
    pacienteId: string;
    valor: number;
    termoPagamento: string;
    formaPagamento: string;
    usarCreditoPaciente: boolean;
    creditoPacienteDisponivel: number;
    motivo: string;
  };
};

const PAYMENT_CHOICE_CARD_TYPE = "cartao_tipo";
const PAYMENT_CHOICE_CREDIT_OR_PATIENT_CREDIT = "credito_ou_credito_paciente";

function normalize(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function hasPhrase(key: string, phrase: string): boolean {
  return ` ${key} `.includes(` ${phrase} `);
}

function hasAny(key: string, phrases: string[]): boolean {
  return phrases.some((phrase) => hasPhrase(key, phrase));
}

function extractMoney(text: string): number {
  const raw = String(text || "");
  const explicit =
    raw.match(/r\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/i)?.[0] ??
    raw.match(/\b\d{1,3}(?:\.\d{3})*(?:,\d{2})?\s*reais?\b/i)?.[0] ??
    raw.match(/\b\d+(?:,\d{1,2})?\b/)?.[0] ??
    "";
  return asNumber(explicit.replace(/r\$/i, "").replace(/reais?/i, ""));
}

function findPatient(text: string) {
  const key = normalize(text);
  return pacientes.find((patient) => {
    const name = normalize(patient.nomeCompleto);
    return name && key.includes(name);
  });
}

function isPatientCreditReference(text: string): boolean {
  const key = normalize(text);
  const strong = [
    "credito do paciente",
    "credito paciente",
    "credito interno",
    "credito residual",
    "saldo residual",
    "saldo pre pago",
    "saldo prepago",
    "saldo do paciente",
    "saldo em conta",
    "saldo na conta",
    "credito em conta",
    "usar saldo",
    "usar credito do paciente",
    "abater do saldo",
    "descontar do saldo",
    "pagar com saldo",
    "pagar com credito do paciente",
    "o que sobrou do saldo",
    "saldo que sobrou",
    "o que ele tem na conta",
    "o que ela tem na conta",
    "sessao do pacote",
    "sessoes do pacote",
    "usar pacote",
  ];
  if (hasAny(key, strong)) return true;
  const contextual = ["valor pendente", "saldo pendente", "credito pendente", "o que sobrou", "tem na conta"];
  const verbs = ["usar", "abater", "descontar", "pagar com", "quitar com", "consumir"];
  return hasAny(key, contextual) && hasAny(key, verbs);
}

function detectPaymentTerms(text: string): {
  formaPagamento: string;
  usarCreditoPaciente: boolean;
  ambiguous: string;
  termoPagamento: string;
} {
  const key = normalize(text);
  if (!key) return { formaPagamento: "", usarCreditoPaciente: false, ambiguous: "", termoPagamento: "" };
  if (isPatientCreditReference(text)) {
    return {
      formaPagamento: "credito_paciente",
      usarCreditoPaciente: true,
      ambiguous: "",
      termoPagamento: "credito_paciente",
    };
  }
  if (hasAny(key, ["pix", "piz", "pixx"])) {
    return { formaPagamento: "pix", usarCreditoPaciente: false, ambiguous: "", termoPagamento: "pix" };
  }
  if (hasAny(key, ["dinheiro", "cash"])) {
    return { formaPagamento: "dinheiro", usarCreditoPaciente: false, ambiguous: "", termoPagamento: "dinheiro" };
  }
  if (hasAny(key, ["transferencia", "transferencia bancaria", "ted", "doc", "deposito bancario"])) {
    return {
      formaPagamento: "transferencia",
      usarCreditoPaciente: false,
      ambiguous: "",
      termoPagamento: "transferencia",
    };
  }
  if (hasAny(key, ["outro", "outros", "vip"])) {
    return { formaPagamento: "outro", usarCreditoPaciente: false, ambiguous: "", termoPagamento: "outro" };
  }
  if (hasAny(key, ["cartao de debito", "cartao debito", "debito no cartao", "c debito", "debito", "deb"])) {
    return { formaPagamento: "debito", usarCreditoPaciente: false, ambiguous: "", termoPagamento: "debito" };
  }
  if (hasAny(key, ["cartao de credito", "cartao credito", "credito no cartao", "credito cartao", "c credito"])) {
    return {
      formaPagamento: "cartao_credito",
      usarCreditoPaciente: false,
      ambiguous: "",
      termoPagamento: "cartao_credito",
    };
  }
  if (hasPhrase(key, "cartao")) {
    return {
      formaPagamento: "",
      usarCreditoPaciente: false,
      ambiguous: PAYMENT_CHOICE_CARD_TYPE,
      termoPagamento: "cartao",
    };
  }
  if (hasAny(key, ["credito", "cred"])) {
    return {
      formaPagamento: "",
      usarCreditoPaciente: false,
      ambiguous: PAYMENT_CHOICE_CREDIT_OR_PATIENT_CREDIT,
      termoPagamento: "credito",
    };
  }
  return { formaPagamento: "", usarCreditoPaciente: false, ambiguous: "", termoPagamento: "" };
}

function paymentDisplay(value: string): string {
  const labels: Record<string, string> = {
    pix: "PIX",
    dinheiro: "Dinheiro",
    debito: "Debito",
    cartao_credito: "Cartao credito",
    transferencia: "Transferencia",
    outro: "Outro",
    credito_paciente: "Credito do paciente",
  };
  return labels[value] ?? value;
}

export function debugIntentLocal(text: string): DebugIntentResult {
  const normalized = normalize(text);
  const path = ["input", "normalizacao_local"];
  const patient = findPatient(text);
  const valor = extractMoney(text);
  const payment = detectPaymentTerms(text);
  const creditoDisponivel = asNumber(patient?.creditoDisponivel);
  let intent = "chat_resposta";
  let confidence = 0.74;
  let status: DebugIntentStatus = "sucesso";
  let motivo = "sem acao operacional clara";
  let formaPagamento = payment.formaPagamento;
  let usarCreditoPaciente = payment.usarCreditoPaciente;
  let mensagem = "Mensagem classificada como resposta livre.";

  if (normalized.includes("pagou") || normalized.includes("recebi") || normalized.includes("quitou")) {
    intent = "registrar_pagamento";
    confidence = patient ? 0.92 : 0.78;
    path.push("regra_pagamento");
    motivo = "verbo financeiro encontrado";
    mensagem = "Pagamento pronto para execucao local.";
  }

  if (payment.ambiguous === PAYMENT_CHOICE_CARD_TYPE) {
    status = "pendente";
    confidence = Math.max(confidence, 0.9);
    motivo = "cartao sem tipo";
    mensagem = "Forma de pagamento ambigua: Cartao credito ou Debito?";
    path.push("pendencia_cartao_tipo");
  } else if (payment.ambiguous === PAYMENT_CHOICE_CREDIT_OR_PATIENT_CREDIT) {
    confidence = Math.max(confidence, 0.9);
    path.push("regra_credito_solto");
    if (creditoDisponivel <= 0) {
      formaPagamento = "cartao_credito";
      usarCreditoPaciente = false;
      motivo = "credito solto sem credito residual disponivel";
      mensagem = "Credito interpretado como Cartao credito.";
    } else if (valor > creditoDisponivel) {
      status = "erro";
      motivo = "credito residual insuficiente";
      mensagem = `Credito insuficiente: ${formatCurrency(creditoDisponivel)}.`;
    } else {
      status = "pendente";
      motivo = "credito solto com credito residual disponivel";
      mensagem = "Forma de pagamento ambigua: Cartao credito ou Credito do paciente?";
    }
  } else if (usarCreditoPaciente) {
    path.push("credito_paciente_explicito");
    if (creditoDisponivel <= 0 || (valor > 0 && valor > creditoDisponivel)) {
      status = "erro";
      motivo = "credito do paciente insuficiente";
      mensagem = `Credito insuficiente: ${formatCurrency(creditoDisponivel)}.`;
    } else {
      motivo = "credito do paciente explicito";
      mensagem = "Pagamento sera quitado com Credito do paciente.";
    }
  } else if (formaPagamento) {
    path.push("forma_pagamento_canonica");
    motivo = `forma canonica ${formaPagamento}`;
    mensagem = `Forma de pagamento: ${paymentDisplay(formaPagamento)}.`;
  }

  if (!patient && intent === "registrar_pagamento") {
    status = "pendente";
    motivo = "paciente ausente ou nao encontrado";
    mensagem = "Informe ou corrija o nome do paciente para continuar.";
  }

  return {
    intent,
    confidence,
    status,
    mensagem,
    source: "local",
    path,
    extracted: {
      pacienteNome: patient?.nomeCompleto ?? "",
      pacienteId: patient?.id ?? "",
      valor,
      termoPagamento: payment.termoPagamento,
      formaPagamento,
      usarCreditoPaciente,
      creditoPacienteDisponivel: creditoDisponivel,
      motivo,
    },
  };
}
