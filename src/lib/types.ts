export type Paciente = {
  id: string;
  nomeCompleto: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
  valorPadraoAtendimento?: number;
  creditoDisponivel: number;
  observacoes?: string;
  ativo: boolean;
  aliases?: string[];
  criadoEm?: string;
  atualizadoEm?: string;
  ultimoAtendimento?: string;
  totalAtendimentos?: number;
  totalPendente?: number;
  totalPago?: number;
};

export type SituacaoCliente =
  | "reservado"
  | "concluido"
  | "cancelado"
  | "desistente";

export type OrigemCliente = "manual" | "matricula" | "ia" | "reagendamento";

export type AgendaCliente = {
  pacienteId: string;
  nomeCompleto: string;
  situacao: SituacaoCliente;
  origem: OrigemCliente;
  temEvolucao: boolean;
};

export type StatusSlot = "aberto" | "concluido" | "cancelado";

export type TipoServico =
  | "Fisioterapia"
  | "Preparação Física"
  | "Fisioterapia Sábado"
  | "MED SANTA";

export type AgendaSlot = {
  id: string;
  servico: TipoServico | string;
  data: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFim: string;
  profissionalId: string;
  profissionalNome: string;
  status: StatusSlot;
  capacidade: number | null;
  capacidadeIlimitada: boolean;
  ocupacao: number;
  clientes: AgendaCliente[];
  observacao?: string;
  temPendencia?: boolean;
};

export type Evolucao = {
  id: string;
  pacienteId: string;
  pacienteNome?: string;
  atendimentoId?: string;
  data: string;
  texto: string;
  conduta?: string;
  queixa?: string;
  profissionalId?: string;
  profissionalNome?: string;
  criadoEm: string;
};

export type StatusFinanceiro = "pendente" | "pago" | "cancelado" | "isento";

export type Faturamento = {
  id: string;
  pacienteId: string;
  atendimentoId?: string;
  nomeCompleto: string;
  valorAtendimento: number;
  data: string;
  statusFinanceiro: StatusFinanceiro;
  formaPagamento?: string;
  dataPagamento?: string;
  creditoAntes?: number;
  creditoDepois?: number;
  observacaoFinanceira?: string;
};

export type Pendencia = {
  id: string;
  tipo: string;
  descricao: string;
  pacienteId?: string;
  pacienteNome?: string;
  status: "aberta" | "confirmada" | "cancelada";
  criadoEm: string;
  opcoes?: Array<{ id: string; label: string }>;
};

export type AuditoriaItem = {
  id: string;
  dataHora: string;
  usuario: string;
  origem: "web" | "telegram" | "whatsapp" | "n8n" | "debug";
  intent: string;
  mensagem: string;
  resultado: string;
  status: "sucesso" | "erro" | "pendente";
};

export type ComandoIaResposta = {
  intent: string;
  status: "sucesso" | "erro" | "pendente";
  mensagem: string;
  dados?: Record<string, unknown>;
  pendencia?: Pendencia | null;
};

export type SyncItem = {
  id: string;
  tipo: string;
  criadoEm: string;
  tentativas: number;
  ultimoErro?: string;
  status: "pendente" | "enviado" | "erro";
};

export type AdminStatus = {
  ramLivreMb: number;
  swapLivreMb: number;
  filaSync: number;
  modoContexto: "normal" | "compacto" | "minimo";
  whisper: "ok" | "off" | "erro";
  llm: "ok" | "off" | "erro";
  googleSheets: "ok" | "off" | "erro";
  n8n: "ok" | "off" | "erro";
  ultimoErro?: string;
  build: string;
};

export type ContaFinanceira = {
  id: string;
  nome: string;
  tipo: "caixa" | "banco" | "cartao";
  saldo: number;
};

export type MetodoPagamento =
  | "Dinheiro"
  | "C. Crédito"
  | "C. Débito"
  | "Cheque"
  | "Depósito bancário"
  | "Pix";

export type LancamentoCaixa = {
  id: string;
  caixaId: string;
  data: string; // ISO
  origem: string; // "Contas a receber", "Avulso", etc.
  metodo: MetodoPagamento;
  tipo: "entrada" | "saida" | "transferencia";
  valor: number;
  descricao?: string;
  pacienteId?: string;
};

export type Caixa = {
  id: string;
  responsavel: string;
  contaId: string;
  contaNome: string;
  dataAbertura: string; // ISO
  dataFechamento?: string;
  saldoInicial: number;
  situacao: "aberto" | "fechado";
};

export type ContaPagar = {
  id: string;
  descricao: string;
  categoria: string; // Aluguel, Insumos, Salário, Energia, etc.
  fornecedor?: string;
  valor: number;
  vencimento: string; // YYYY-MM-DD
  pago: boolean;
  dataPagamento?: string;
  contaId?: string;
  recorrente?: boolean;
};

export type Venda = {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  pacote: string; // "10 sessões Fisioterapia"
  quantidadeSessoes: number;
  valorTotal: number;
  desconto: number;
  valorFinal: number;
  formaPagamento: MetodoPagamento;
  parcelas: number;
  data: string; // YYYY-MM-DD
  vendedorId?: string;
  vendedorNome?: string;
  status: "ativa" | "cancelada" | "concluida";
};

export type Comissao = {
  id: string;
  profissionalId: string;
  profissionalNome: string;
  referencia: string; // YYYY-MM
  atendimentos: number;
  baseCalculo: number;
  percentual: number;
  valor: number;
  status: "pendente" | "paga";
  dataPagamento?: string;
};