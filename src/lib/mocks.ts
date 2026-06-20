import type {
  AdminStatus,
  AgendaSlot,
  AuditoriaItem,
  Caixa,
  Comissao,
  ContaFinanceira,
  ContaPagar,
  Evolucao,
  Faturamento,
  LancamentoCaixa,
  Paciente,
  Pendencia,
  SyncItem,
  TipoServico,
  Venda,
} from "./types";

export const profissionais = [
  { id: "prof_001", nome: "Ana Cristini Lins Fernandes" },
  { id: "prof_002", nome: "Cayo Uehara Lance" },
  { id: "prof_003", nome: "Cirilo Mendes" },
  { id: "prof_004", nome: "William Souza" },
];

export const pacientes: Paciente[] = [
  {
    id: "pac_001",
    nomeCompleto: "Gabriel Albuquerque Guimaraes",
    telefone: "(11) 98123-0001",
    valorPadraoAtendimento: 200,
    creditoDisponivel: 0,
    ativo: true,
    totalAtendimentos: 12,
    totalPendente: 200,
    totalPago: 2200,
    ultimoAtendimento: "2026-05-05",
  },
  {
    id: "pac_002",
    nomeCompleto: "Gustavo Hideki Lima Ota",
    telefone: "(11) 98123-0002",
    valorPadraoAtendimento: 180,
    creditoDisponivel: 0,
    ativo: true,
    totalAtendimentos: 8,
    totalPendente: 360,
    totalPago: 1080,
    ultimoAtendimento: "2026-05-06",
  },
  {
    id: "pac_003",
    nomeCompleto: "Marcos Rocha",
    telefone: "(11) 98123-0003",
    valorPadraoAtendimento: 200,
    creditoDisponivel: 100,
    ativo: true,
    totalAtendimentos: 20,
    totalPendente: 0,
    totalPago: 4000,
    ultimoAtendimento: "2026-05-04",
  },
  {
    id: "pac_004",
    nomeCompleto: "Michelle Rossini",
    telefone: "(11) 98123-0004",
    valorPadraoAtendimento: 200,
    creditoDisponivel: 400,
    ativo: true,
    totalAtendimentos: 30,
    totalPendente: 0,
    totalPago: 6000,
    ultimoAtendimento: "2026-05-07",
  },
  {
    id: "pac_005",
    nomeCompleto: "Bernardo Matsuoka",
    telefone: "(11) 98123-0005",
    valorPadraoAtendimento: 220,
    creditoDisponivel: 0,
    ativo: true,
    totalAtendimentos: 5,
    totalPendente: 440,
    totalPago: 660,
    ultimoAtendimento: "2026-05-03",
  },
];

// Semana fixa de demonstração: 04/05/2026 (seg) → 10/05/2026 (dom)
const week = ["2026-05-04", "2026-05-05", "2026-05-06", "2026-05-07", "2026-05-08", "2026-05-09", "2026-05-10"];

let slotSeq = 1;
const mkSlot = (
  data: string,
  horaInicio: string,
  horaFim: string,
  servico: TipoServico,
  prof: { id: string; nome: string },
  capacidade: number | null,
  ocupacao: number,
  clientes: AgendaSlot["clientes"] = [],
  capacidadeIlimitada = false,
): AgendaSlot => ({
  id: `slot_${String(slotSeq++).padStart(3, "0")}`,
  servico,
  data,
  horaInicio,
  horaFim,
  profissionalId: prof.id,
  profissionalNome: prof.nome,
  status: "aberto",
  capacidade,
  capacidadeIlimitada,
  ocupacao,
  clientes,
});

const ana = profissionais[0];
const cayo = profissionais[1];

export const agenda: AgendaSlot[] = [
  mkSlot(week[0], "07:00", "08:00", "Fisioterapia", ana, 3, 1, [
    { pacienteId: "pac_001", nomeCompleto: pacientes[0].nomeCompleto, situacao: "reservado", origem: "matricula", temEvolucao: false },
  ]),
  mkSlot(week[0], "08:00", "09:00", "Fisioterapia", ana, 3, 0),
  mkSlot(week[0], "09:00", "10:00", "Fisioterapia", ana, 3, 1, [
    { pacienteId: "pac_002", nomeCompleto: pacientes[1].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
  ]),
  mkSlot(week[0], "18:00", "19:00", "Fisioterapia", cayo, null, 1, [
    { pacienteId: "pac_003", nomeCompleto: pacientes[2].nomeCompleto, situacao: "reservado", origem: "ia", temEvolucao: true },
  ], true),
  mkSlot(week[0], "18:00", "19:00", "Preparação Física", cayo, 2, 0),

  mkSlot(week[1], "07:00", "08:00", "Fisioterapia", ana, 3, 2, [
    { pacienteId: "pac_002", nomeCompleto: pacientes[1].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
    { pacienteId: "pac_003", nomeCompleto: pacientes[2].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
  ]),
  mkSlot(week[1], "15:00", "16:00", "MED SANTA", ana, null, 0, [], true),
  mkSlot(week[1], "16:00", "17:00", "MED SANTA", ana, null, 0, [], true),

  mkSlot(week[2], "07:00", "08:00", "Preparação Física", cayo, 2, 0),
  mkSlot(week[2], "08:00", "09:00", "Fisioterapia", ana, 3, 0),
  mkSlot(week[2], "15:00", "16:00", "MED SANTA", ana, null, 0, [], true),

  mkSlot(week[3], "07:00", "08:00", "Preparação Física", cayo, 2, 0),
  mkSlot(week[3], "07:30", "08:30", "Fisioterapia", ana, 2, 1, [
    { pacienteId: "pac_001", nomeCompleto: pacientes[0].nomeCompleto, situacao: "reservado", origem: "matricula", temEvolucao: false },
  ]),
  mkSlot(week[3], "08:00", "09:00", "Preparação Física", cayo, 2, 0),

  mkSlot(week[4], "06:30", "07:30", "Preparação Física", cayo, 2, 0),
  mkSlot(week[4], "08:00", "09:00", "Preparação Física", cayo, 2, 0),
  mkSlot(week[4], "18:00", "19:00", "Preparação Física", cayo, 2, 0),

  mkSlot(week[5], "07:00", "08:00", "Fisioterapia", ana, 3, 2, [
    { pacienteId: "pac_004", nomeCompleto: pacientes[3].nomeCompleto, situacao: "reservado", origem: "ia", temEvolucao: true },
    { pacienteId: "pac_005", nomeCompleto: pacientes[4].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
  ]),
  mkSlot(week[5], "08:00", "09:00", "Fisioterapia Sábado", ana, null, 0, [], true),
  mkSlot(week[5], "09:00", "10:00", "Fisioterapia Sábado", ana, null, 2, [
    { pacienteId: "pac_001", nomeCompleto: pacientes[0].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
    { pacienteId: "pac_002", nomeCompleto: pacientes[1].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
  ], true),
  mkSlot(week[5], "10:00", "11:00", "Fisioterapia Sábado", ana, null, 1, [
    { pacienteId: "pac_003", nomeCompleto: pacientes[2].nomeCompleto, situacao: "reservado", origem: "manual", temEvolucao: false },
  ], true),
];

export const evolucoes: Evolucao[] = [
  {
    id: "evo_001",
    pacienteId: "pac_004",
    pacienteNome: "Michelle Rossini",
    data: "2026-05-05",
    texto:
      "Paciente relata menor dor no agachamento. Realizou fortalecimento de MMII, treino de marcha e controle de quadril.",
    conduta: "Manter protocolo. Aumentar carga progressivamente.",
    profissionalNome: "Cayo Uehara Lance",
    criadoEm: "2026-05-05T10:30:00Z",
  },
  {
    id: "evo_002",
    pacienteId: "pac_003",
    pacienteNome: "Marcos Rocha",
    data: "2026-05-04",
    texto: "Manutenção preventiva. Sem queixas. Mobilidade preservada.",
    profissionalNome: "Ana Cristini Lins Fernandes",
    criadoEm: "2026-05-04T09:15:00Z",
  },
];

export const faturamentos: Faturamento[] = [
  {
    id: "fat_001",
    pacienteId: "pac_001",
    atendimentoId: "atd_001",
    nomeCompleto: "Gabriel Albuquerque Guimaraes",
    valorAtendimento: 200,
    data: "2026-05-05",
    statusFinanceiro: "pendente",
  },
  {
    id: "fat_002",
    pacienteId: "pac_002",
    atendimentoId: "atd_002",
    nomeCompleto: "Gustavo Hideki Lima Ota",
    valorAtendimento: 180,
    data: "2026-05-06",
    statusFinanceiro: "pendente",
  },
  {
    id: "fat_003",
    pacienteId: "pac_004",
    atendimentoId: "atd_003",
    nomeCompleto: "Michelle Rossini",
    valorAtendimento: 200,
    data: "2026-05-05",
    statusFinanceiro: "pago",
    formaPagamento: "pix",
    dataPagamento: "2026-05-05",
    creditoAntes: 600,
    creditoDepois: 400,
  },
];

export const pendencias: Pendencia[] = [
  {
    id: "pend_001",
    tipo: "paciente_ambiguo",
    descricao: "Encontrei mais de uma Michelle. Qual deseja usar?",
    status: "aberta",
    criadoEm: "2026-05-07T08:12:00Z",
    opcoes: [
      { id: "pac_004", label: "Michelle Rossini" },
      { id: "pac_006", label: "Michelle Santos" },
    ],
  },
  {
    id: "pend_002",
    tipo: "valor_ausente",
    descricao: "Bernardo Matsuoka não tem valor padrão. Confirmar R$ 220?",
    pacienteId: "pac_005",
    pacienteNome: "Bernardo Matsuoka",
    status: "aberta",
    criadoEm: "2026-05-07T08:30:00Z",
    opcoes: [
      { id: "sim", label: "Sim, usar R$ 220" },
      { id: "nao", label: "Não, cancelar" },
    ],
  },
];

export const auditoria: AuditoriaItem[] = [
  {
    id: "aud_001",
    dataHora: "2026-05-07T08:12:10Z",
    usuario: "cayo",
    origem: "telegram",
    intent: "registrar_pagamento",
    mensagem: "Michelle Rossini pagou 400",
    resultado: "Pagamento registrado. 2 atendimentos quitados.",
    status: "sucesso",
  },
  {
    id: "aud_002",
    dataHora: "2026-05-07T08:14:00Z",
    usuario: "cayo",
    origem: "web",
    intent: "registrar_atendimento",
    mensagem: "Atendimento Michelle Rossini, treino de marcha",
    resultado: "Atendimento registrado.",
    status: "sucesso",
  },
  {
    id: "aud_003",
    dataHora: "2026-05-07T08:30:00Z",
    usuario: "cayo",
    origem: "web",
    intent: "pedir_confirmacao",
    mensagem: "Bernardo paga 220?",
    resultado: "Aguardando confirmação.",
    status: "pendente",
  },
];

export const sync: SyncItem[] = [
];

export const adminStatus: AdminStatus = {
  ramLivreMb: 1240,
  swapLivreMb: 2048,
  filaSync: 0,
  modoContexto: "normal",
  whisper: "ok",
  llm: "ok",
  googleSheets: "off",
  n8n: "ok",
  ultimoErro: "",
  build: "0.1.108",
};

export function corDoServico(servico: string): string {
  switch (servico) {
    case "Preparação Física":
      return "var(--service-prep)";
    case "MED SANTA":
      return "var(--service-med)";
    case "Fisioterapia Sábado":
      return "var(--service-sabado)";
    default:
      return "var(--service-fisio)";
  }
}

export const contasFinanceiras: ContaFinanceira[] = [
  { id: "cf_001", nome: "Caixinha", tipo: "caixa", saldo: 130152 },
  { id: "cf_002", nome: "Banco Itaú", tipo: "banco", saldo: 48230.5 },
  { id: "cf_003", nome: "Cartão Stone", tipo: "cartao", saldo: 2280.24 },
];

export const caixas: Caixa[] = [
  {
    id: "caixa_001",
    responsavel: "CW REHAB",
    contaId: "cf_001",
    contaNome: "Caixinha",
    dataAbertura: "2026-05-08T17:14:00",
    saldoInicial: 0,
    situacao: "aberto",
  },
];

export const lancamentosCaixa: LancamentoCaixa[] = [
  { id: "lc_001", caixaId: "caixa_001", data: "2026-05-05T13:55:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 800, pacienteId: "pac_001" },
  { id: "lc_002", caixaId: "caixa_001", data: "2026-05-05T13:40:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 2400, pacienteId: "pac_002" },
  { id: "lc_003", caixaId: "caixa_001", data: "2026-05-05T13:37:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 2100, pacienteId: "pac_003" },
  { id: "lc_004", caixaId: "caixa_001", data: "2026-05-05T13:29:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 2400, pacienteId: "pac_004" },
  { id: "lc_005", caixaId: "caixa_001", data: "2026-05-05T13:27:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 800, pacienteId: "pac_001" },
  { id: "lc_006", caixaId: "caixa_001", data: "2026-05-05T13:25:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 800, pacienteId: "pac_002" },
  { id: "lc_007", caixaId: "caixa_001", data: "2026-05-05T13:22:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 750, pacienteId: "pac_003" },
  { id: "lc_008", caixaId: "caixa_001", data: "2026-05-05T13:19:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 1600, pacienteId: "pac_004" },
  { id: "lc_009", caixaId: "caixa_001", data: "2026-05-04T09:35:00", origem: "Contas a receber", metodo: "Cartao credito", tipo: "entrada", valor: 1280.24, pacienteId: "pac_001" },
  { id: "lc_010", caixaId: "caixa_001", data: "2026-05-04T09:35:00", origem: "Contas a receber", metodo: "Cartao credito", tipo: "entrada", valor: 1000, pacienteId: "pac_002" },
  { id: "lc_011", caixaId: "caixa_001", data: "2026-04-08T09:06:00", origem: "Contas a receber", metodo: "Dinheiro", tipo: "entrada", valor: 1800, pacienteId: "pac_003" },
];

export const contasPagar: ContaPagar[] = [
  { id: "cp_001", descricao: "Aluguel da clínica — Maio", categoria: "Aluguel", fornecedor: "Imobiliária Centro", valor: 4800, vencimento: "2026-05-10", pago: false, contaId: "cf_002", recorrente: true },
  { id: "cp_002", descricao: "Conta de energia — Abril", categoria: "Utilidades", fornecedor: "Enel", valor: 612.45, vencimento: "2026-05-12", pago: false, contaId: "cf_002" },
  { id: "cp_003", descricao: "Insumos (gel, esparadrapo, etc.)", categoria: "Insumos", fornecedor: "Distribuidora Vida", valor: 320.9, vencimento: "2026-05-15", pago: false, contaId: "cf_001" },
  { id: "cp_004", descricao: "Salário — Ana Cristini", categoria: "Folha", fornecedor: "Ana Cristini Lins Fernandes", valor: 5200, vencimento: "2026-05-05", pago: true, dataPagamento: "2026-05-05", contaId: "cf_002", recorrente: true },
  { id: "cp_005", descricao: "Internet/Telefone", categoria: "Utilidades", fornecedor: "Vivo", valor: 219.9, vencimento: "2026-05-20", pago: false, contaId: "cf_002", recorrente: true },
  { id: "cp_006", descricao: "Manutenção macas", categoria: "Manutenção", fornecedor: "Tec Hospitalar", valor: 480, vencimento: "2026-04-28", pago: true, dataPagamento: "2026-04-28", contaId: "cf_001" },
];

export const vendas: Venda[] = [
  { id: "vd_001", pacienteId: "pac_001", pacienteNome: "Gabriel Albuquerque Guimaraes", pacote: "10 sessões — Fisioterapia", quantidadeSessoes: 10, valorTotal: 2000, desconto: 200, valorFinal: 1800, formaPagamento: "Pix", parcelas: 1, data: "2026-04-15", vendedorId: "prof_001", vendedorNome: "Ana Cristini Lins Fernandes", status: "ativa" },
  { id: "vd_002", pacienteId: "pac_002", pacienteNome: "Gustavo Hideki Lima Ota", pacote: "5 sessões — Preparação Física", quantidadeSessoes: 5, valorTotal: 900, desconto: 0, valorFinal: 900, formaPagamento: "Cartao credito", parcelas: 3, data: "2026-04-20", vendedorId: "prof_002", vendedorNome: "Cayo Uehara Lance", status: "ativa" },
  { id: "vd_003", pacienteId: "pac_003", pacienteNome: "Marcos Rocha", pacote: "20 sessões — Fisioterapia", quantidadeSessoes: 20, valorTotal: 4000, desconto: 400, valorFinal: 3600, formaPagamento: "Debito", parcelas: 1, data: "2026-03-10", vendedorId: "prof_003", vendedorNome: "Cirilo Mendes", status: "concluida" },
  { id: "vd_004", pacienteId: "pac_004", pacienteNome: "Michelle Rossini", pacote: "10 sessões — Fisioterapia Sábado", quantidadeSessoes: 10, valorTotal: 2400, desconto: 0, valorFinal: 2400, formaPagamento: "Dinheiro", parcelas: 1, data: "2026-05-02", vendedorId: "prof_001", vendedorNome: "Ana Cristini Lins Fernandes", status: "ativa" },
];

export const comissoes: Comissao[] = [
  { id: "cm_001", profissionalId: "prof_001", profissionalNome: "Ana Cristini Lins Fernandes", referencia: "2026-04", atendimentos: 42, baseCalculo: 8400, percentual: 30, valor: 2520, status: "paga", dataPagamento: "2026-05-05" },
  { id: "cm_002", profissionalId: "prof_002", profissionalNome: "Cayo Uehara Lance", referencia: "2026-04", atendimentos: 28, baseCalculo: 5040, percentual: 30, valor: 1512, status: "paga", dataPagamento: "2026-05-05" },
  { id: "cm_003", profissionalId: "prof_003", profissionalNome: "Cirilo Mendes", referencia: "2026-04", atendimentos: 35, baseCalculo: 7000, percentual: 30, valor: 2100, status: "paga", dataPagamento: "2026-05-05" },
  { id: "cm_004", profissionalId: "prof_001", profissionalNome: "Ana Cristini Lins Fernandes", referencia: "2026-05", atendimentos: 18, baseCalculo: 3600, percentual: 30, valor: 1080, status: "pendente" },
  { id: "cm_005", profissionalId: "prof_002", profissionalNome: "Cayo Uehara Lance", referencia: "2026-05", atendimentos: 12, baseCalculo: 2160, percentual: 30, valor: 648, status: "pendente" },
  { id: "cm_006", profissionalId: "prof_003", profissionalNome: "Cirilo Mendes", referencia: "2026-05", atendimentos: 15, baseCalculo: 3000, percentual: 30, valor: 900, status: "pendente" },
  { id: "cm_007", profissionalId: "prof_004", profissionalNome: "William Souza", referencia: "2026-05", atendimentos: 10, baseCalculo: 1800, percentual: 30, valor: 540, status: "pendente" },
];
