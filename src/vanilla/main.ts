import "./styles.css";

import { debugIntentLocal, type DebugIntentResult } from "../lib/intentDebug";

registerFisiaPwa();

type User = {
  internalUserId?: string;
  nomeCompleto?: string;
  nomeExibicao?: string;
  login?: string;
  role?: string;
  papel?: string;
  isAdmin?: boolean;
  cpf?: string;
  telefone?: string;
  email?: string;
  conselho?: string;
  numeroRegistroConselho?: string;
  ufConselho?: string;
  endereco?: string;
  profissaoCategoria?: string;
  valorPadraoAtendimento?: number;
  duracaoPadrao?: number;
  onboardingCompletedAt?: string;
};

type LocalAccount = User & {
  cpf: string;
  email: string;
  telefone: string;
  password: string;
  createdAt: string;
  registrationSource?: "whatsapp_device" | "public_page";
  verifiedWhatsapp?: boolean;
  deviceId?: string;
  authToken?: string;
};

type RegisterVerificationState = {
  mode: "whatsapp_device" | "public_page";
  phone: string;
  verified: boolean;
  verificationId?: string;
  userId?: string;
  expiresAt?: string;
  deviceId?: string;
  authToken?: string;
  createdAt: string;
};

type RegistrationWhatsappCodePayload = {
  ok: boolean;
  verificationId: string;
  userId: string;
  expiresAt: string;
  delivery: "local_test" | "whatsapp";
};

type RegistrationWhatsappConfirmPayload = {
  ok: boolean;
  verified: boolean;
  userId: string;
};

type SessionPayload = {
  ok: boolean;
  authRequired: boolean;
  authenticated: boolean;
  user: User | null;
};

type LoginPayload = {
  ok: boolean;
  authenticated: boolean;
  next?: "code";
  login?: string;
  message?: string;
  user?: User;
};

type ProfilePayload = {
  ok?: boolean;
  user: User;
};

type Paciente = {
  id: string;
  nomeCompleto: string;
  nomeSocial?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  idade?: string;
  endereco?: string;
  observacoes?: string;
  valorPadraoAtendimento?: number;
  usaValorGlobal?: boolean;
  creditoDisponivel?: number;
  ativo?: boolean;
  totalAtendimentos?: number;
  totalPendente?: number;
  totalPago?: number;
  genero?: string;
  estadoCivil?: string;
  naturalidade?: string;
  nacionalidade?: string;
  profissaoOcupacao?: string;
  escolaridade?: string;
  cep?: string;
  municipio?: string;
  telefoneResidencial?: string;
  telefoneCelular?: string;
  telefoneComercial?: string;
  email?: string;
  contatoEmergenciaNome?: string;
  contatoEmergenciaTelefone?: string;
  profissionalAvaliador?: string;
  registroProfissional?: string;
  dataAvaliacao?: string;
  convenioPlano?: string;
  numeroCarteirinha?: string;
  encaminhamento?: string;
  profissionalSolicitante?: string;
  cid?: string;
  fotoUrl?: string;
  origemCadastro?: string;
};

type AgendaCliente = {
  pacienteId?: string;
  nomeCompleto?: string;
  situacao?: string;
  temEvolucao?: boolean;
  evolucao?: string;
  valorAtendimento?: number;
  statusFinanceiro?: string;
};

type AgendaSlot = {
  id: string;
  servico?: string;
  tipoAtendimentoId?: string;
  billingModel?: "INDIVIDUAL" | "PACKAGE" | "EXEMPT" | string;
  billingSnapshot?: Record<string, unknown>;
  priceSource?: string;
  data: string;
  horaInicio: string;
  horaFim?: string;
  profissionalNome?: string;
  status?: string;
  clientes?: AgendaCliente[];
  observacao?: string;
  temPendencia?: boolean;
  valorAtendimento?: number;
  valorReferencia?: number;
  statusFinanceiro?: string;
  evolucao?: string;
  podeEditar?: boolean;
};

type PaymentMethod = "pix" | "dinheiro" | "debito" | "cartao_credito" | "transferencia" | "outro";

type Evolucao = {
  id: string;
  pacienteId?: string;
  pacienteNome?: string;
  data?: string;
  texto?: string;
  conduta?: string;
  profissionalNome?: string;
};

type Avaliacao = {
  id: string;
  pacienteId?: string;
  atendimentoId?: string;
  tipo?: "avaliacao" | "reavaliacao";
  status?: "rascunho" | "finalizada";
  queixa?: string;
  historia?: string;
  dor?: string;
  funcionalidade?: string;
  exameFisico?: string;
  testes?: string;
  hipotese?: string;
  objetivos?: string;
  plano?: string;
  resumo?: string;
  avaliadoEm?: string;
  criadoEm?: string;
};

type Faturamento = {
  id: string;
  atendimentoId?: string;
  pacienteId?: string;
  nomeCompleto?: string;
  data?: string;
  dataPagamento?: string;
  formaPagamento?: string;
  valorAtendimento?: number;
  valorReferencia?: number;
  valorPago?: number;
  statusFinanceiro?: string;
  billingModel?: string;
  billingSnapshot?: Record<string, unknown>;
  observacaoFinanceira?: string;
  creditoAntes?: number;
  creditoDepois?: number;
};

type AppointmentType = {
  id: string;
  nome: string;
  duracaoPadrao: number;
  valorPadrao?: number;
  cor?: string;
  modalidade?: string;
  aceitaGrupo?: boolean;
  limiteParticipantes?: number;
  ativo?: boolean;
};

type DashboardMetrics = {
  semEvolucaoCount: number;
  pagamentoPendenteCount: number;
  pendenciasOperacionaisTotal: number;
  recebidoMes: number;
  atendimentosRealizadosMes: number;
  valorPendentePagamento: number;
};

type AdminTableSummary = {
  name: string;
  rows: number;
};

type AdminDatabaseSummary = {
  label: string;
  path: string;
  exists: boolean;
  sizeBytes: number;
  tables: AdminTableSummary[];
};

type AdminUserSummary = {
  internalUserId: string;
  login: string;
  nomeCompleto?: string;
  nomeExibicao?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  status?: string;
  role?: string;
  primaryChannel?: string;
  lastAccessAt?: string;
  createdAt?: string;
  updatedAt?: string;
  counts?: Record<string, number>;
};

type AdminSystemResource = {
  available: boolean;
  path?: string;
  totalBytes?: number;
  freeBytes?: number;
  usedBytes?: number;
};

type AdminOverview = {
  ok: boolean;
  users: AdminUserSummary[];
  databases: AdminDatabaseSummary[];
  memory: AdminSystemResource;
  storage: AdminSystemResource;
  generatedAt: string;
};

type AdminActionKey =
  | "backup"
  | "clear_logs"
  | "clear_operational"
  | "reset_financial"
  | "repair_ownership"
  | "verify_integrity"
  | "reset_total";

type AdminActionResult = {
  ok: boolean;
  action: AdminActionKey;
  backup?: Record<string, unknown>;
  result?: Record<string, unknown>;
  generatedAt?: string;
};

type DebugIntentMessage = {
  id: string;
  text: string;
  createdAt: string;
  result: DebugIntentResult;
};

type OnboardingProfile = {
  conta: {
    nomeCompleto: string;
    nomeExibicao: string;
    cpf: string;
    email: string;
    telefone: string;
    fotoPerfil: string;
    nomeSocial: string;
    genero: string;
    pronome: string;
    cidadeEstado: string;
    endereco: string;
  };
  profissional: {
    profissao: string;
    conselho: string;
    numeroConselho: string;
    ufConselho: string;
    especialidade: string;
    tipoAtuacao: string[];
    nomeClinica: string;
  };
  rotina: {
    valorPadrao: number;
    duracaoPadrao: number;
    diasAtendimento: string[];
    horarioInicio: string;
    horarioFim: string;
    intervalo: number;
    fuso: string;
    tiposAtendimento: string[];
    tipoPadrao: string;
  };
  recebimentos: {
    formasPagamento: string[];
    cobrancaPadrao: string;
    permiteCreditoPaciente: boolean;
    permitePacoteSessoes: boolean;
  };
  whatsapp: {
    numero: string;
    nomeMensagens: string;
    horarioInicio: string;
    horarioFim: string;
    lembreteHorasAntes: number;
    enviarConfirmacao: boolean;
    permitirCancelamento: boolean;
    assinatura: string;
  };
  primeiroPaciente: {
    nome: string;
    telefone: string;
    usarTeste: boolean;
  };
  completedAt?: string;
};

type ReminderJob = {
  id: string;
  type:
    | "professional_agenda_daily"
    | "professional_payment_pending"
    | "patient_appointment_reminder"
    | "patient_appointment_confirmation"
    | "patient_payment_reminder";
  status: "draft" | "scheduled" | "ready" | "sent" | "failed" | "cancelled" | "disabled";
  recipient: "professional" | "patient";
  channel: "whatsapp";
  scheduledFor: string;
  title: string;
  message: string;
  disconnected: true;
  reason: string;
  createdAt: string;
};

type AppState = {
  user: User | null;
  route:
    | "dashboard"
    | "pacientes"
    | "agenda"
    | "evolucoes"
    | "financeiro"
    | "relatorios"
    | "recursos"
    | "usuarios"
    | "debug"
    | "onboarding";
  agenda: AgendaSlot[];
  pacientes: Paciente[];
  evolucoes: Evolucao[];
  financeiro: Faturamento[];
  appointmentTypes: AppointmentType[];
  patientFinance: Faturamento[];
  patientEvolutions: Evolucao[];
  patientEvaluations: Avaliacao[];
  selectedPatientId: string | null;
  patientSearch: string;
  patientSort: "alpha" | "last_attendance" | "newest" | "oldest";
  registryTab: "resumo" | "cadastro" | "evolucoes" | "avaliacoes" | "financeiro";
  patientDrawerOpen: boolean;
  patientDrawerAnimate: boolean;
  appointmentDrawerOpen: boolean;
  appointmentDraftPatientId: string | null;
  appointmentTab: "atendimento" | "financeiro" | "historico";
  paymentSaving: boolean;
  sidebarCollapsed: boolean;
  dashboardCardsCollapsed: boolean;
  dashboardCollapsedSections: Record<DashboardSectionKey, boolean>;
  reportTab: "atendimentos" | "financeiro" | "pacientes";
  selectedEventId: string | null;
  agendaStart: string;
  agendaEnd: string;
  agendaWeekStart: string;
  agendaMonthPickerOpen: boolean;
  agendaPickerMonth: string | null;
  agendaSearch: string;
  agendaStatus: string;
  agendaView: "semana" | "mes" | "ano";
  agendaYearSummary: AgendaYearMonth[];
  loading: boolean;
};

type DashboardSectionKey = "today" | "pending" | "patients" | "quick";

type AgendaYearMonth = {
  chave: string;
  mes: number;
  executados: number;
  abertos: number;
  cancelados: number;
  total: number;
};

const app = document.querySelector<HTMLDivElement>("#app");
const DASHBOARD_CARDS_COLLAPSED_KEY = "fisiobot.dashboardCardsCollapsed";
const SIDEBAR_COLLAPSED_KEY = "fisiobot.sidebarCollapsed";
const DASHBOARD_SECTION_COLLAPSED_PREFIX = "fisiobot.dashboard.section.";
const DEBUG_INTENTS_HISTORY_KEY = "fisiobot.vanilla.debugIntents.messages";
const LOCAL_ACCOUNTS_KEY = "fisiobot.vanilla.accounts";
const LOCAL_ACTIVE_ACCOUNT_KEY = "fisiobot.vanilla.activeAccount";
const ONBOARDING_PROFILE_KEY = "fisiobot.vanilla.onboarding.profile";
const REMINDER_JOBS_KEY = "fisiobot.vanilla.reminderJobs";
const ONBOARDING_STEP_KEY = "fisiobot.vanilla.onboarding.step";
const REGISTER_VERIFICATION_KEY = "fisiobot.vanilla.registerVerification";
let registerVerificationRefreshTimer: number | null = null;
const DEBUG_INTENT_SAMPLES = [
  "Michelle Rossini pagou 200 no cartao",
  "Michelle Rossini pagou 200 no credito",
  "Michelle Rossini pagou 100 com credito do paciente",
  "Michelle Rossini pagou 100 no debito",
  "Michelle Rossini pagou 100 com o que sobrou do saldo",
];
const HEALTH_PROFESSIONS = [
  "Fisioterapeuta",
  "Terapeuta ocupacional",
  "Fonoaudiologo",
  "Psicologo",
  "Nutricionista",
  "Medico",
  "Enfermeiro",
  "Educador fisico",
  "Osteopata",
  "Quiropraxista",
  "Acupunturista",
  "Podologo",
  "Esteticista",
  "Outro profissional de saude",
];
const COUNCIL_UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
const TIMEZONES = ["America/Sao_Paulo", "America/Manaus", "America/Cuiaba", "America/Fortaleza", "America/Belem", "America/Recife", "America/Bahia", "America/Rio_Branco", "UTC"];
const BRAZIL_CALENDAR_2026: Record<string, { label: string; type: "holiday" | "optional" }> = {
  "2026-01-01": { label: "Confraternizacao Universal", type: "holiday" },
  "2026-02-16": { label: "Carnaval", type: "optional" },
  "2026-02-17": { label: "Carnaval", type: "optional" },
  "2026-02-18": { label: "Quarta-feira de Cinzas (ate 14h)", type: "optional" },
  "2026-04-03": { label: "Paixao de Cristo", type: "holiday" },
  "2026-04-21": { label: "Tiradentes", type: "holiday" },
  "2026-05-01": { label: "Dia Mundial do Trabalho", type: "holiday" },
  "2026-06-04": { label: "Corpus Christi", type: "optional" },
  "2026-06-05": { label: "Ponto facultativo", type: "optional" },
  "2026-09-07": { label: "Independencia do Brasil", type: "holiday" },
  "2026-10-12": { label: "Nossa Senhora Aparecida", type: "holiday" },
  "2026-10-28": { label: "Dia do Servidor Publico", type: "optional" },
  "2026-11-02": { label: "Finados", type: "holiday" },
  "2026-11-15": { label: "Proclamacao da Republica", type: "holiday" },
  "2026-11-20": { label: "Dia Nacional de Zumbi e da Consciencia Negra", type: "holiday" },
  "2026-12-24": { label: "Vespera de Natal (apos 13h)", type: "optional" },
  "2026-12-25": { label: "Natal", type: "holiday" },
  "2026-12-31": { label: "Vespera de Ano Novo (apos 13h)", type: "optional" },
};
const DEFAULT_APPOINTMENT_TYPES: AppointmentType[] = [
  { id: "presencial", nome: "Presencial", duracaoPadrao: 60, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: false },
  { id: "grupo", nome: "Grupo", duracaoPadrao: 60, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: true },
  { id: "domiciliar", nome: "Domiciliar", duracaoPadrao: 60, valorPadrao: 0, modalidade: "domiciliar", aceitaGrupo: false },
  { id: "online", nome: "Online", duracaoPadrao: 60, valorPadrao: 0, modalidade: "online", aceitaGrupo: false },
  { id: "avaliacao", nome: "Avaliacao", duracaoPadrao: 60, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: false },
  { id: "retorno", nome: "Retorno", duracaoPadrao: 45, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: false },
  { id: "reavaliacao", nome: "Reavaliacao", duracaoPadrao: 60, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: false },
  { id: "teleatendimento", nome: "Teleatendimento", duracaoPadrao: 50, valorPadrao: 0, modalidade: "online", aceitaGrupo: false },
  { id: "hospitalar", nome: "Hospitalar", duracaoPadrao: 60, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: false },
  { id: "academia_studio", nome: "Academia ou studio", duracaoPadrao: 60, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: true },
  { id: "evento_externo", nome: "Evento/externo", duracaoPadrao: 90, valorPadrao: 0, modalidade: "externo", aceitaGrupo: true },
  { id: "orientacao_familiar", nome: "Orientacao familiar/cuidador", duracaoPadrao: 45, valorPadrao: 0, modalidade: "presencial", aceitaGrupo: true },
  { id: "outro", nome: "Outro", duracaoPadrao: 60, valorPadrao: 0, modalidade: "outro", aceitaGrupo: false },
];

function registerFisiaPwa(): void {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/pwa-sw.js").catch(() => {
      // PWA is optional; the app must keep working if registration is blocked.
    });
  });
}

const state: AppState = {
  user: null,
  route: "dashboard",
  agenda: [],
  pacientes: [],
  evolucoes: [],
  financeiro: [],
  appointmentTypes: [],
  patientFinance: [],
  patientEvolutions: [],
  patientEvaluations: [],
  selectedPatientId: null,
  patientSearch: "",
  patientSort: "alpha",
  registryTab: "resumo",
  patientDrawerOpen: false,
  patientDrawerAnimate: true,
  appointmentDrawerOpen: false,
  appointmentDraftPatientId: null,
  appointmentTab: "atendimento",
  paymentSaving: false,
  sidebarCollapsed: loadBooleanPreference(SIDEBAR_COLLAPSED_KEY),
  dashboardCardsCollapsed: loadBooleanPreference(DASHBOARD_CARDS_COLLAPSED_KEY),
  dashboardCollapsedSections: loadDashboardCollapsedSections(),
  reportTab: "atendimentos",
  selectedEventId: null,
  agendaStart: todayISO(),
  agendaEnd: addDaysISO(7),
  agendaWeekStart: startOfWeekISO(new Date()),
  agendaMonthPickerOpen: false,
  agendaPickerMonth: null,
  agendaSearch: "",
  agendaStatus: "todos",
  agendaView: "semana",
  agendaYearSummary: [],
  loading: false,
};

document.addEventListener("click", (event) => {
  if (state.route !== "debug") return;
  const target = event.target;
  const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  const button = element?.closest<HTMLButtonElement>("[data-debug-sample]");
  if (!button) return;
  event.preventDefault();
  appendDebugIntentMessage(button.dataset.debugSample || "");
});

function loadDashboardCollapsedSections(): Record<DashboardSectionKey, boolean> {
  const keys: DashboardSectionKey[] = ["today", "pending", "patients", "quick"];
  return keys.reduce(
    (acc, key) => {
      acc[key] = loadBooleanPreference(`${DASHBOARD_SECTION_COLLAPSED_PREFIX}${key}`);
      return acc;
    },
    {} as Record<DashboardSectionKey, boolean>,
  );
}

function loadBooleanPreference(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function saveBooleanPreference(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // Local persistence is optional; rendering must keep working in private modes.
  }
}

function saveDashboardSectionPreference(section: DashboardSectionKey, value: boolean): void {
  state.dashboardCollapsedSections[section] = value;
  saveBooleanPreference(`${DASHBOARD_SECTION_COLLAPSED_PREFIX}${section}`, value);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function localDateTime(slot: AgendaSlot): Date | null {
  if (!slot.data) return null;
  const parsed = new Date(`${slot.data}T${normalizeTimeForDate(slot.horaInicio)}`);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function nextAppointmentSlot(agenda: AgendaSlot[]): AgendaSlot | null {
  const now = new Date();
  return (
    agenda
      .filter((slot) => slot.status !== "cancelado")
      .map((slot) => ({ slot, date: localDateTime(slot) }))
      .filter((item): item is { slot: AgendaSlot; date: Date } => Boolean(item.date) && item.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0]?.slot || null
  );
}

function dashboardNextAppointmentHtml(slot: AgendaSlot | null, today: string): string {
  if (!slot) {
    return `<strong>Sem Agendamentos</strong><small>&nbsp;</small>`;
  }
  const patientName = slot.clientes?.[0]?.nomeCompleto || "sem paciente";
  const prefix = slot.data && slot.data !== today ? `${formatDate(slot.data)} ` : "";
  return `<strong>${escapeHtml(`${prefix}${slot.horaInicio || "--:--"}`)}</strong><small>${escapeHtml(patientName)}</small>`;
}

function addDaysISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addDaysToISO(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function startOfWeekISO(date: Date): string {
  const copy = new Date(date);
  copy.setHours(12, 0, 0, 0);
  const day = copy.getDay();
  copy.setDate(copy.getDate() + (day === 0 ? -6 : 1 - day));
  return copy.toISOString().slice(0, 10);
}

function weekDaysFrom(startIso: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDaysToISO(startIso, index));
}

function monthKey(): string {
  return todayISO().slice(0, 7);
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function formatMoney(value?: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(value || 0),
  );
}

function displaySlotMoney(slot: AgendaSlot): string {
  const value = slotValue(slot);
  if (value > 0) return formatMoney(value);
  const status = slotFinancialStatus(slot);
  if (isExemptStatus(status)) return "Cortesia/isento";
  if (isPaidStatus(status)) return "Pago";
  return "Nao faturado";
}

function parseMoneyInput(value: FormDataEntryValue | null): number {
  const normalized = String(value || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function defaultAppointmentDurationMinutes(): number {
  const userDuration = Number(state.user?.duracaoPadrao || 0);
  if (Number.isFinite(userDuration) && userDuration >= 10) return userDuration;
  try {
    const profile = JSON.parse(window.localStorage.getItem(ONBOARDING_PROFILE_KEY) || "{}") as Partial<OnboardingProfile>;
    const profileDuration = Number(profile.rotina?.duracaoPadrao || 0);
    if (Number.isFinite(profileDuration) && profileDuration >= 10) return profileDuration;
  } catch {
    // Onboarding local data is optional.
  }
  return 60;
}

function addMinutesToTime(value: string, minutes = defaultAppointmentDurationMinutes()): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ""));
  if (!match) return "";
  const total = Number(match[1]) * 60 + Number(match[2]) + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function bindAutoEndTime(root: ParentNode, startName = "horaInicio", endName = "horaFim"): void {
  const start = root.querySelector<HTMLInputElement>(`input[name="${startName}"]`);
  const end = root.querySelector<HTMLInputElement>(`input[name="${endName}"]`);
  if (!start || !end) return;
  let duration = defaultAppointmentDurationMinutes();
  const currentDuration = timeDiffMinutes(start.value, end.value);
  if (currentDuration > 0) duration = currentDuration;
  start.addEventListener("change", () => {
    end.value = addMinutesToTime(start.value, duration);
  });
  end.addEventListener("change", () => {
    const next = timeDiffMinutes(start.value, end.value);
    if (next > 0) duration = next;
  });
}

function bindAppointmentTypeDefaults(root: ParentNode): void {
  const select = root.querySelector<HTMLSelectElement>('select[name="tipoAtendimentoId"]');
  const start = root.querySelector<HTMLInputElement>('input[name="horaInicio"]');
  const end = root.querySelector<HTMLInputElement>('input[name="horaFim"]');
  const value = root.querySelector<HTMLInputElement>('input[name="valor"], input[name="valorAtendimento"]');
  const patientId = root.querySelector<HTMLInputElement>('input[name="pacienteId"]')?.value || "";
  const patient = patientId ? state.pacientes.find((item) => item.id === patientId) || null : null;
  if (!select) return;
  select.addEventListener("change", () => {
    const type = appointmentTypeById(select.value);
    if (start && end) end.value = addMinutesToTime(start.value || "08:00", type.duracaoPadrao || defaultAppointmentDurationMinutes());
    if (value && !parseMoneyInput(value.value)) {
      const nextValue = Number(patient?.valorPadraoAtendimento || type.valorPadrao || state.user?.valorPadraoAtendimento || 0);
      value.value = nextValue ? String(nextValue).replace(".", ",") : "";
    }
  });
}

function timeDiffMinutes(start: string, end: string): number {
  const parse = (value: string) => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || ""));
    return match ? Number(match[1]) * 60 + Number(match[2]) : NaN;
  };
  const a = parse(start);
  const b = parse(end);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 0;
  return b - a;
}

function appointmentDurationMinutes(slot: AgendaSlot): number {
  const explicit = timeDiffMinutes(slot.horaInicio || "", slot.horaFim || "");
  if (explicit > 0) return explicit;
  const type = appointmentTypeById(slot.tipoAtendimentoId);
  return Number(type?.duracaoPadrao || defaultAppointmentDurationMinutes() || 60);
}

function findPatientByName(name: string): Paciente | null {
  const target = normalizeStatus(name);
  if (!target) return null;
  return (
    state.pacientes.find((patient) => normalizeStatus(patient.nomeCompleto) === target) ||
    state.pacientes.find((patient) => normalizeStatus(patient.nomeCompleto).includes(target) || target.includes(normalizeStatus(patient.nomeCompleto))) ||
    null
  );
}

function normalizeStatus(value?: string): string {
  return String(value || "").trim().toLowerCase();
}

function isPaidStatus(value?: string): boolean {
  return ["pago", "paid", "quitado", "recebido", "finalizado"].includes(normalizeStatus(value));
}

function isPartialStatus(value?: string): boolean {
  return ["parcial", "partial", "partially paid", "partially_paid"].includes(normalizeStatus(value));
}

function isExemptStatus(value?: string): boolean {
  return ["isento", "exempt", "cortesia", "zero"].includes(normalizeStatus(value));
}

function normalizePaymentMethod(value?: string): string {
  const method = normalizeStatus(value);
  if (["credito", "cartao credito", "cartao de credito", "c credito"].includes(method)) return "cartao_credito";
  if (["cartao debito", "cartao de debito", "c debito"].includes(method)) return "debito";
  if (["credito_cliente", "credito interno", "credito residual"].includes(method)) return "credito_paciente";
  return method;
}

function paymentMethodLabel(value?: string): string {
  const method = normalizePaymentMethod(value);
  const labels: Record<string, string> = {
    pix: "PIX",
    dinheiro: "Dinheiro",
    debito: "Debito",
    cartao_credito: "Cartao credito",
    credito: "Cartao credito",
    credito_paciente: "Credito do paciente",
    credito_cliente: "Credito do paciente",
    transferencia: "Transferencia",
    outro: "Outro",
  };
  return labels[method] || (value ? String(value) : "-");
}

function financialPillClass(status?: string): string {
  if (isPaidStatus(status) || isExemptStatus(status)) return "ok";
  if (isPartialStatus(status)) return "info";
  return "warn";
}

function paymentMethodOptions(selected?: string): string {
  const methods: Array<{ value: PaymentMethod; label: string }> = [
    { value: "pix", label: "PIX" },
    { value: "dinheiro", label: "Dinheiro" },
    { value: "debito", label: "Debito" },
    { value: "cartao_credito", label: "Cartao credito" },
    { value: "transferencia", label: "Transferencia" },
    { value: "outro", label: "Outro" },
  ];
  const current = normalizeStatus(selected || "pix");
  return methods
    .map((method) => `<option value="${method.value}" ${current === method.value ? "selected" : ""}>${method.label}</option>`)
    .join("");
}

function appointmentTypesForUi(): AppointmentType[] {
  return state.appointmentTypes.length ? state.appointmentTypes : DEFAULT_APPOINTMENT_TYPES;
}

function appointmentTypeById(id?: string): AppointmentType {
  return appointmentTypesForUi().find((type) => type.id === id) || appointmentTypesForUi()[0];
}

function appointmentTypeOptions(selected?: string): string {
  const current = selected || appointmentTypesForUi()[0]?.id || "presencial";
  return appointmentTypesForUi()
    .map((type) => `<option value="${escapeHtml(type.id)}" ${type.id === current ? "selected" : ""}>${escapeHtml(type.nome)}</option>`)
    .join("");
}

function appointmentTypeLabels(): string[] {
  return DEFAULT_APPOINTMENT_TYPES.map((type) => type.nome);
}

function billingModelLabel(value?: string): string {
  const model = normalizeStatus(value || "INDIVIDUAL").toUpperCase();
  if (model === "PACKAGE") return "Pacote";
  if (model === "EXEMPT") return "Isento";
  return "Individual";
}

function isCanceledStatus(value?: string): boolean {
  return ["cancelado", "cancelada", "canceled"].includes(normalizeStatus(value));
}

function slotHasEvolution(slot: AgendaSlot): boolean {
  if (String(slot.evolucao || "").trim()) return true;
  return Boolean(slot.clientes?.some((client) => client.temEvolucao || String(client.evolucao || "").trim()));
}

function slotFinancialStatus(slot: AgendaSlot): string {
  return normalizeStatus(slot.statusFinanceiro || slot.clientes?.[0]?.statusFinanceiro || "pendente");
}

function slotValue(slot: AgendaSlot): number {
  return Number(slot.valorAtendimento || slot.clientes?.[0]?.valorAtendimento || 0);
}

function slotPatientId(slot: AgendaSlot): string {
  return String(slot.clientes?.[0]?.pacienteId || "");
}

function slotPatient(slot: AgendaSlot): Paciente | null {
  const patientId = slotPatientId(slot);
  return state.pacientes.find((patient) => patient.id === patientId) || null;
}

function slotPayments(slot: AgendaSlot): Faturamento[] {
  const patientId = slotPatientId(slot);
  const slotDate = String(slot.data || "").slice(0, 10);
  const appointmentId = String(slot.id || "");
  return state.financeiro.filter((item) => {
    const sameAppointment = String(item.atendimentoId || "") === appointmentId || String(item.id || "") === appointmentId;
    const samePatientDate = patientId && String(item.pacienteId || "") === patientId && String(item.data || item.dataPagamento || "").slice(0, 10) === slotDate;
    return sameAppointment || Boolean(samePatientDate);
  });
}

function slotPaidAmount(slot: AgendaSlot): number {
  const payments = slotPayments(slot);
  if (payments.length) {
    return payments
      .filter((item) => isPaidStatus(item.statusFinanceiro) || isPartialStatus(item.statusFinanceiro))
      .reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  }
  return isPaidStatus(slotFinancialStatus(slot)) ? slotValue(slot) : 0;
}

function slotOpenBalance(slot: AgendaSlot): number {
  if (isExemptStatus(slotFinancialStatus(slot))) return 0;
  return Math.max(0, slotValue(slot) - slotPaidAmount(slot));
}

function isRealizedSlot(slot: AgendaSlot): boolean {
  const status = normalizeStatus(slot.status);
  return ["concluido", "concluida", "realizado", "realizada", "finalizado", "finalizada", "completed"].includes(status) || slotHasEvolution(slot);
}

function calendarHoliday(day: string): { label: string; type: "holiday" | "optional" } | null {
  return BRAZIL_CALENDAR_2026[day] || null;
}

function shiftMonthISO(anchorISO: string, amount: number): string {
  const date = new Date(`${anchorISO.slice(0, 7)}-01T12:00:00`);
  date.setMonth(date.getMonth() + amount);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
}

function calculateDashboardMetrics(agenda: AgendaSlot[], financeiro: Faturamento[]): DashboardMetrics {
  const mesAtual = monthKey();
  const monthSlots = agenda.filter((slot) => String(slot.data || "").startsWith(mesAtual) && !isCanceledStatus(slot.status));
  const actionableSlots = monthSlots.filter((slot) => normalizeStatus(slot.status) !== "scheduled");
  const semEvolucaoCount = actionableSlots.filter((slot) => !slotHasEvolution(slot)).length;
  const pagamentoPendenteCount = actionableSlots.filter((slot) => !isPaidStatus(slotFinancialStatus(slot))).length;
  const atendimentosRealizadosMes = monthSlots.filter(isRealizedSlot).length;
  const recebidoMes = financeiro
    .filter((item) => isPaidStatus(item.statusFinanceiro) && String(item.dataPagamento || item.data || "").startsWith(mesAtual))
    .reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  const pendingByFinance = financeiro
    .filter((item) => !isPaidStatus(item.statusFinanceiro) && String(item.data || item.dataPagamento || "").startsWith(mesAtual))
    .reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  const pendingByAgenda = monthSlots
    .filter((slot) => !isPaidStatus(slotFinancialStatus(slot)))
    .reduce((sum, slot) => sum + slotValue(slot), 0);
  return {
    semEvolucaoCount,
    pagamentoPendenteCount,
    pendenciasOperacionaisTotal: semEvolucaoCount + pagamentoPendenteCount,
    recebidoMes,
    atendimentosRealizadosMes,
    valorPendentePagamento: Math.max(pendingByFinance, pendingByAgenda),
  };
}

function onlyDigits(value: unknown): string {
  return String(value ?? "").replace(/\D+/g, "");
}

function formatCpf(value?: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length !== 11) return digits;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function bindCpfMasks(root: ParentNode = document): void {
  root.querySelectorAll<HTMLInputElement>('input[name="cpf"]').forEach((input) => {
    if (input.disabled) return;
    input.addEventListener("input", () => {
      input.value = formatCpf(input.value);
    });
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    headers: { Accept: "application/json", ...(init.headers || {}) },
    ...init,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.message || payload?.error || `${init.method || "GET"} ${path} ${response.status}`;
    throw new Error(message);
  }
  return payload as T;
}

async function sendJson<T>(path: string, body?: unknown): Promise<T> {
  return fetchJson<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

function navIcon(name: string): string {
  const icons: Record<string, string> = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-7h6v7"/>',
    calendar:
      '<path d="M7 3v4"/><path d="M17 3v4"/><path d="M4 8h16"/><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 12h3"/><path d="M13 12h3"/><path d="M8 16h3"/><path d="M13 16h3"/>',
    cadastro:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M19 8v6"/><path d="M16 11h6"/>',
    finance:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/><path d="M15 15h2"/>',
    debug:
      '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="5" y="6" width="14" height="14" rx="3"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 15h6"/><path d="M2 12h3"/><path d="M19 12h3"/>',
    reports:
      '<path d="M4 19V5"/><path d="M4 19h17"/><path d="M8 16V9"/><path d="M13 16V6"/><path d="M18 16v-4"/>',
    pulse: '<path d="M3 12h4l2.2-6 4 12 2.2-6H21"/>',
    assistant: '<path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8-4.8-1.7 4.8-1.7L12 3Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/><path d="M5 15l.6 1.6L7 17l-1.4.4L5 19l-.6-1.6L3 17l1.4-.4L5 15Z"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    resources:
      '<path d="M4 12h4l2-7 4 14 2-7h4"/><path d="M20 12h1"/><path d="M3 12h1"/>',
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  };
  return `<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icons[name] || icons.home}</svg>`;
}

function setDocumentRoute(route: AppState["route"]): void {
  state.route = route;
  state.patientDrawerOpen = false;
  state.appointmentDrawerOpen = false;
  state.selectedEventId = null;
  const pathByRoute = {
    dashboard: "/dashboard",
    pacientes: "/pacientes",
    agenda: "/agenda",
    evolucoes: "/evolucoes",
    financeiro: "/financeiro/caixa",
    relatorios: "/relatorios",
    recursos: "/recursos",
    usuarios: "/usuarios",
    debug: "/debug-intents",
    onboarding: "/onboarding",
  };
  history.replaceState(null, "", pathByRoute[route]);
  if (route === "onboarding") {
    renderOnboarding();
    return;
  }
  renderAppShell();
}

async function bootstrap(): Promise<void> {
  if (!app) return;
  if (window.location.pathname.startsWith("/cadastro") || window.location.pathname.startsWith("/register") || window.location.pathname.startsWith("/auth")) {
    renderRegister();
    return;
  }
  if (window.location.pathname.startsWith("/debug-intents")) {
    state.user = { nomeExibicao: "Debug local", login: "debug" };
    state.route = "debug";
    renderAppShell();
    renderDebugIntents();
    return;
  }
  if (window.location.pathname.startsWith("/onboarding")) {
    state.user = loadActiveLocalAccount() || { nomeExibicao: "Novo profissional", login: "onboarding" };
    state.route = "onboarding";
    renderOnboarding();
    return;
  }
  const localAccount = loadActiveLocalAccount();
  if (localAccount && !isOnboardingComplete()) {
    state.user = localAccount;
    state.route = "onboarding";
    history.replaceState(null, "", "/onboarding");
    renderOnboarding();
    return;
  }
  try {
    const session = await fetchJson<SessionPayload>("/api/web/session");
    if (session.authenticated || !session.authRequired) {
      state.user = session.user;
      const path = window.location.pathname;
      const patientPathMatch = path.match(/^\/pacientes\/([^/]+)/);
      if (patientPathMatch?.[1]) {
        state.selectedPatientId = decodeURIComponent(patientPathMatch[1]);
        state.patientDrawerOpen = true;
      }
      state.route = path.startsWith("/agenda")
        ? "agenda"
        : path.startsWith("/pacientes")
          ? "pacientes"
          : path.startsWith("/evolucoes")
            ? "evolucoes"
            : path.startsWith("/financeiro")
              ? "financeiro"
              : path.startsWith("/relatorios")
                ? "relatorios"
                : path.startsWith("/recursos")
                  ? "recursos"
                  : path.startsWith("/usuarios")
                    ? "usuarios"
                    : path.startsWith("/debug-intents")
                      ? "debug"
                    : "dashboard";
      if (!isOnboardingComplete()) {
        state.route = "onboarding";
        history.replaceState(null, "", "/onboarding");
        renderOnboarding();
        return;
      }
      renderAppShell();
      await loadCurrentRoute();
      return;
    }
    renderLogin();
  } catch (error) {
    renderLogin(error instanceof Error ? error.message : "Falha ao consultar sessao.");
  }
}

function renderLogin(errorMessage = ""): void {
  if (!app) return;
  app.innerHTML = `
    <main class="auth-shell fisia-login-shell">
      <section class="auth-panel fisia-login-panel" aria-label="Login FISIA">
        <div class="auth-box fisia-login-box">
          <header class="fisia-auth-brand">
            <div class="brand-mark" aria-hidden="true">F</div>
            <div>
              <p class="brand-title">FISIA</p>
              <div class="brand-subtitle">Gestao inteligente para fisioterapeutas</div>
            </div>
          </header>
          <p class="eyebrow">Bem-vindo de volta</p>
          <h1>Entre na sua conta</h1>
          <p class="hint">Acesse sua agenda, seus pacientes e sua rotina clinica.</p>
          <div id="notice" class="notice ${errorMessage ? "error" : ""}" role="status">${escapeHtml(errorMessage)}</div>
          <form id="login-form" class="form-grid fisia-login-form" autocomplete="on" novalidate>
            <label>E-mail, usuario ou WhatsApp
              <input id="login" name="login" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required />
            </label>
            <label>Senha
              <span class="password-field">
                <input id="secret" name="secret" type="password" autocomplete="current-password" required />
                <button class="ghost-button password-toggle" type="button" data-toggle-password="secret" aria-pressed="false">Mostrar</button>
              </span>
            </label>
            <div class="login-options-row">
              <label class="check-row">
                <input id="remember" name="remember" type="checkbox" checked />
                Manter este dispositivo conectado
              </label>
              <a class="text-link" href="/recover">Esqueci minha senha</a>
            </div>
            <button class="primary-button" id="submit" type="submit">Entrar</button>
          </form>
          <div class="fisia-signup-line">
            <span>Ainda nao usa a FISIA?</span>
            <button class="secondary-button" id="open-register" type="button">Criar conta</button>
          </div>
        </div>
      </section>
      <section class="auth-copy fisia-auth-copy" aria-hidden="true">
        <div class="fisia-flow-lines"></div>
        <div class="fisia-auth-copy-content">
          <h2><span>Voce cuida do paciente.</span><strong>A FISIA cuida da rotina.</strong></h2>
          <p>Agenda, pacientes, evolucoes e financeiro conectados a uma assistente inteligente feita para fisioterapeutas.</p>
          <div class="fisia-product-mock">
            <div class="mock-dashboard">
              <div class="mock-toolbar"><span></span><b></b></div>
              <div class="mock-main-card">
                <small>Proximo atendimento</small>
                <strong>14:30</strong>
                <span>Ana Paula Martins</span>
              </div>
              <div class="mock-mini-grid">
                <span>Agenda organizada</span>
                <span>Evolucoes em dia</span>
                <span>Financeiro conectado</span>
              </div>
            </div>
            <div class="mock-phone">
              <i></i><b></b><b></b><b></b>
            </div>
            <div class="mock-assistant">Posso revisar suas pendencias de hoje.</div>
          </div>
          <footer>Quando o fisio precisa, chama a FISIA.</footer>
        </div>
      </section>
    </main>
  `;
  document.querySelector<HTMLFormElement>("#login-form")?.addEventListener("submit", handleLogin);
  document.querySelector<HTMLButtonElement>("#open-register")?.addEventListener("click", () => {
    history.replaceState(null, "", "/cadastro");
    renderRegister();
  });
  bindPasswordToggles();
}

function loadLocalAccounts(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accounts: LocalAccount[]): void {
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadActiveLocalAccount(): LocalAccount | null {
  const activeId = localStorage.getItem(LOCAL_ACTIVE_ACCOUNT_KEY) || "";
  return loadLocalAccounts().find((account) => account.cpf === activeId || account.email === activeId || account.internalUserId === activeId) || null;
}

function isOnboardingComplete(): boolean {
  const profile = loadOnboardingProfile();
  return Boolean(profile.completedAt);
}

function readRegisterEntryParams(): Pick<RegisterVerificationState, "mode" | "deviceId" | "authToken"> {
  const params = new URLSearchParams(window.location.search);
  const deviceId = params.get("device_id") || params.get("deviceId") || "";
  const authToken = params.get("token") || params.get("auth_token") || "";
  return {
    mode: deviceId || authToken ? "whatsapp_device" : "public_page",
    deviceId: deviceId || undefined,
    authToken: authToken || undefined,
  };
}

function loadRegisterVerification(): RegisterVerificationState | null {
  try {
    const raw = localStorage.getItem(REGISTER_VERIFICATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RegisterVerificationState;
    if (parsed.mode === "public_page" && !parsed.verified && parsed.expiresAt && Date.parse(parsed.expiresAt) <= Date.now()) {
      clearRegisterVerification();
      return null;
    }
    return parsed && parsed.phone ? parsed : null;
  } catch {
    return null;
  }
}

function saveRegisterVerification(stateValue: RegisterVerificationState): void {
  localStorage.setItem(REGISTER_VERIFICATION_KEY, JSON.stringify(stateValue));
}

function clearRegisterVerification(): void {
  localStorage.removeItem(REGISTER_VERIFICATION_KEY);
  if (registerVerificationRefreshTimer !== null) {
    window.clearTimeout(registerVerificationRefreshTimer);
    registerVerificationRefreshTimer = null;
  }
}

function maskRegisterPhone(phone: string): string {
  const digits = onlyDigits(phone);
  if (digits.length < 10) return digits;
  const ddd = digits.slice(-11, -9);
  const prefix = digits.slice(-9, -4);
  const suffix = digits.slice(-4);
  return `(${ddd}) ${prefix}-${suffix}`;
}

function passwordMeetsRegisterPolicy(password: string): boolean {
  return password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
}

function formatVerificationRemaining(expiresAt?: string): string {
  const remainingSeconds = Math.max(0, Math.ceil((Date.parse(expiresAt || "") - Date.now()) / 1000));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function scheduleRegisterVerificationRefresh(verification: RegisterVerificationState | null): void {
  if (registerVerificationRefreshTimer !== null) {
    window.clearTimeout(registerVerificationRefreshTimer);
    registerVerificationRefreshTimer = null;
  }
  if (!verification || verification.verified || verification.mode !== "public_page" || !verification.expiresAt) return;
  const refresh = () => {
    const remaining = Date.parse(verification.expiresAt || "") - Date.now();
    if (remaining <= 0) {
      clearRegisterVerification();
      renderRegister("Codigo expirado. Solicite outro.");
      return;
    }
    const countdown = document.querySelector<HTMLElement>("#verification-expiry-value");
    if (countdown) countdown.textContent = formatVerificationRemaining(verification.expiresAt);
    registerVerificationRefreshTimer = window.setTimeout(refresh, Math.min(1000, remaining));
  };
  refresh();
}

function ensureWhatsappDeviceVerification(): RegisterVerificationState | null {
  const entry = readRegisterEntryParams();
  if (entry.mode !== "whatsapp_device") return null;
  const existing = loadRegisterVerification();
  if (existing?.mode === "whatsapp_device" && existing.verified) return existing;
  const phoneFromDevice = onlyDigits(entry.deviceId || "").slice(0, 13);
  const verified: RegisterVerificationState = {
    mode: "whatsapp_device",
    phone: phoneFromDevice,
    verified: true,
    deviceId: entry.deviceId,
    authToken: entry.authToken,
    createdAt: new Date().toISOString(),
  };
  saveRegisterVerification(verified);
  return verified;
}

function registerVerificationBadge(verification: RegisterVerificationState | null): string {
  if (verification?.verified) {
    return "";
  }
  return `<div class="registration-status warn"><strong>WhatsApp ainda nao confirmado</strong><span>Voce pode preencher os dados agora e confirmar o numero antes de concluir a conta.</span></div>`;
}

function renderRegister(errorMessage = ""): void {
  if (!app) return;
  const entryVerification = ensureWhatsappDeviceVerification();
  const verification = entryVerification || loadRegisterVerification();
  const phoneValue = verification?.phone || "";
  const canConfirmCode = Boolean(
    verification &&
      verification.mode === "public_page" &&
      verification.verificationId &&
      verification.userId &&
      verification.expiresAt &&
      !verification.verified,
  );
  app.innerHTML = `
    <main class="register-commercial-shell fisia-register-shell">
      <section class="register-commercial-topbar fisia-register-topbar" aria-label="Cadastro FISIA">
        <div class="brand fisia-auth-brand">
          <div class="brand-mark" aria-hidden="true">F</div>
          <div>
            <p class="brand-title">FISIA</p>
            <div class="brand-subtitle">Gestao inteligente para fisioterapeutas</div>
          </div>
        </div>
        <button class="ghost-button" id="back-to-login" type="button">Entrar</button>
      </section>
      <section class="register-commercial-layout" aria-label="Criacao de conta">
        <aside class="register-commercial-side">
          <div>
            <p class="eyebrow">Etapa 1 de 4</p>
            <h1>Crie sua conta FISIA</h1>
            <p>Comece pelos dados principais. Depois voce configura perfil, rotina, recebimentos e WhatsApp sem perder o progresso.</p>
          </div>
          <div class="register-commercial-progress" aria-label="Progresso do cadastro">
            <span><strong>25%</strong> concluido</span>
            <div><i style="width: 25%"></i></div>
          </div>
          <div class="register-step-list">
            <span class="active">Dados pessoais</span>
            <span>Perfil profissional</span>
            <span>Agenda e atendimento</span>
            <span>Recebimentos e WhatsApp</span>
          </div>
          <div class="register-benefits" aria-label="Resumo">
            <div><strong>Campos unicos</strong><span>E-mail e WhatsApp nao podem duplicar. CPF pode ser informado depois.</span></div>
            <div><strong>Nome de exibicao</strong><span>Usado no painel, links e mensagens.</span></div>
            <div><strong>Ativacao real</strong><span>O fluxo termina com paciente, convite ou exploracao do painel.</span></div>
          </div>
        </aside>
        <div class="panel register-commercial-card">
          <div class="section-title">
            <div>
              <p class="eyebrow">Dados da conta</p>
              <h2>Sua conta principal</h2>
              <p class="hint">Preencha os dados essenciais para liberar a configuracao inicial da rotina.</p>
            </div>
          </div>
          ${registerVerificationBadge(verification)}
          <div id="notice" class="notice ${errorMessage ? "info" : ""}" role="status">${escapeHtml(errorMessage)}</div>
          ${
            verification?.verified
              ? `<div class="register-whatsapp-box ok">
                  <span>WhatsApp confirmado</span>
                  <strong>${escapeHtml(maskRegisterPhone(verification.phone))}</strong>
                  <button class="ghost-button" id="change-register-phone" type="button">Alterar numero</button>
                </div>`
              : `<div class="register-whatsapp-box">
                  <form id="register-verification-form" class="verification-row" autocomplete="off" novalidate>
                    <label>WhatsApp
                      <input name="verificationPhone" type="tel" autocomplete="tel" value="${escapeHtml(phoneValue)}" placeholder="(11) 99999-9999" required />
                    </label>
                    <button class="secondary-button" type="submit">Enviar codigo</button>
                  </form>
                  ${
                    canConfirmCode
                      ? `<form id="register-code-form" class="verification-row" autocomplete="off" novalidate>
                          <label>Codigo recebido
                            <input name="verificationCode" type="text" inputmode="numeric" autocomplete="one-time-code" required />
                          </label>
                          <button class="secondary-button" type="submit">Confirmar</button>
                          <small class="verification-expiry">Expira em <strong id="verification-expiry-value">${formatVerificationRemaining(verification?.expiresAt)}</strong></small>
                        </form>`
                      : ""
                  }
                </div>`
          }
          <form id="register-form" class="form-grid register-account-form" autocomplete="off" novalidate>
            <label>Nome completo
              <input name="nomeCompleto" type="text" autocomplete="name" placeholder="Nome e sobrenome" required />
            </label>
            <label>Nome de exibicao
              <input name="nomeExibicao" type="text" placeholder="Ex.: Dr. Gabriel, CW Rehab" required />
            </label>
            <label>CPF <small>opcional agora</small>
              <input name="cpf" type="text" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" />
            </label>
            <label>E-mail
              <input name="email" type="email" autocomplete="email" placeholder="voce@clinica.com" required />
            </label>
            <label>Confirmar senha
              <input id="register-secret-confirm" name="secretConfirm" type="password" autocomplete="new-password" required />
            </label>
            <label>Senha
              <span class="password-field">
                <input id="register-secret" name="secret" type="password" autocomplete="new-password" required />
                <button class="ghost-button password-toggle" type="button" data-toggle-password="register-secret" aria-pressed="false">Mostrar</button>
              </span>
              <small class="password-rules">Minimo de 8 caracteres, com numero e simbolo.</small>
            </label>
            <label class="terms-block">
              <input name="acceptTerms" type="checkbox" required />
              <span>Confirmo que os dados informados sao meus e autorizo a criacao da conta FISIA.</span>
            </label>
            <div class="button-row register-actions">
              <button class="primary-button" type="submit">Continuar</button>
              <button class="ghost-button" id="save-exit-register" type="button">Salvar e sair</button>
            </div>
          </form>
        </div>
      </section>
    </main>
  `;
  bindCpfMasks();
  bindPasswordToggles();
  document.querySelector<HTMLButtonElement>("#back-to-login")?.addEventListener("click", () => renderLogin());
  document.querySelector<HTMLButtonElement>("#save-exit-register")?.addEventListener("click", () => {
    history.replaceState(null, "", "/");
    renderLogin();
  });
  document.querySelector<HTMLButtonElement>("#change-register-phone")?.addEventListener("click", () => {
    clearRegisterVerification();
    renderRegister();
  });
  document.querySelector<HTMLFormElement>("#register-verification-form")?.addEventListener("submit", handleRegisterVerificationRequest);
  document.querySelector<HTMLFormElement>("#register-code-form")?.addEventListener("submit", handleRegisterCodeConfirm);
  document.querySelector<HTMLFormElement>("#register-form")?.addEventListener("submit", handleRegister);
  const fullNameInput = document.querySelector<HTMLInputElement>('input[name="nomeCompleto"]');
  const displayInput = document.querySelector<HTMLInputElement>('input[name="nomeExibicao"]');
  fullNameInput?.addEventListener("blur", () => {
    if (!displayInput || displayInput.value.trim()) return;
    displayInput.value = fullNameInput.value.trim();
  });
  scheduleRegisterVerificationRefresh(verification);
}

async function handleRegisterVerificationRequest(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const phone = onlyDigits(new FormData(form).get("verificationPhone"));
  if (phone.length < 10) {
    showNotice("error", "Informe um WhatsApp valido para receber o codigo.");
    return;
  }
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  try {
    const result = await sendJson<RegistrationWhatsappCodePayload>("/api/web/registration/whatsapp/request", { phone });
    saveRegisterVerification({
      mode: "public_page",
      phone,
      verified: false,
      verificationId: result.verificationId,
      userId: result.userId,
      expiresAt: result.expiresAt,
      createdAt: new Date().toISOString(),
    });
    renderRegister(result.delivery === "local_test" ? "Codigo gerado para validacao local. Expira em 5 minutos." : "Codigo enviado para o WhatsApp informado. Expira em 5 minutos.");
  } catch (error) {
    showNotice("error", error instanceof Error ? error.message : "Nao foi possivel solicitar o codigo.");
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
}

async function handleRegisterCodeConfirm(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const verification = loadRegisterVerification();
  const code = onlyDigits(new FormData(event.currentTarget as HTMLFormElement).get("verificationCode"));
  if (!verification || verification.mode !== "public_page" || !verification.verificationId || !verification.userId) {
    showNotice("error", "Solicite o codigo antes de confirmar.");
    return;
  }
  try {
    await sendJson<RegistrationWhatsappConfirmPayload>("/api/web/registration/whatsapp/confirm", {
      verificationId: verification.verificationId,
      userId: verification.userId,
      code,
    });
    saveRegisterVerification({ ...verification, verified: true, verificationId: undefined, expiresAt: undefined });
    renderRegister("WhatsApp confirmado. Complete os dados da conta.");
  } catch (error) {
    showNotice("error", error instanceof Error ? error.message : "Nao foi possivel confirmar o codigo.");
  }
}

function handleRegister(event: SubmitEvent): void {
  event.preventDefault();
  const verification = loadRegisterVerification() || ensureWhatsappDeviceVerification();
  if (!verification?.verified) {
    showNotice("error", "Valide o WhatsApp antes de continuar.");
    return;
  }
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const nomeCompleto = String(data.get("nomeCompleto") || "").trim();
  const nomeExibicao = String(data.get("nomeExibicao") || "").trim();
  const cpf = onlyDigits(data.get("cpf")).slice(0, 11);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const telefone = onlyDigits(verification.phone);
  const password = String(data.get("secret") || "");
  const passwordConfirm = String(data.get("secretConfirm") || "");
  const acceptTerms = data.get("acceptTerms") === "on";
  if (!nomeCompleto || !nomeExibicao || !email || !telefone || !password || !passwordConfirm || !acceptTerms) {
    showNotice("error", "Preencha todos os campos obrigatorios.");
    return;
  }
  if (nomeCompleto.split(/\s+/).filter(Boolean).length < 2) {
    showNotice("error", "Informe nome completo com nome e sobrenome.");
    return;
  }
  if (!passwordMeetsRegisterPolicy(password)) {
    showNotice("error", "A senha precisa ter pelo menos 8 caracteres, um numero e um simbolo.");
    return;
  }
  if (password !== passwordConfirm) {
    showNotice("error", "As senhas nao conferem.");
    return;
  }
  const accounts = loadLocalAccounts();
  if (cpf && accounts.some((account) => account.cpf === cpf)) {
    showNotice("error", "CPF ja cadastrado.");
    return;
  }
  if (accounts.some((account) => account.email.toLowerCase() === email)) {
    showNotice("error", "E-mail ja cadastrado.");
    return;
  }
  if (accounts.some((account) => onlyDigits(account.telefone) === telefone)) {
    showNotice("error", "Telefone ja cadastrado.");
    return;
  }
  const account: LocalAccount = {
    internalUserId: `LOCAL-${Date.now()}`,
    login: email,
    nomeCompleto,
    nomeExibicao,
    cpf: cpf || "",
    email,
    telefone,
    password: "local-password-defined",
    createdAt: new Date().toISOString(),
    registrationSource: verification.mode,
    verifiedWhatsapp: true,
    deviceId: verification.deviceId,
    authToken: verification.authToken,
  };
  saveLocalAccounts([...accounts, account]);
  localStorage.setItem(LOCAL_ACTIVE_ACCOUNT_KEY, cpf || email);
  state.user = account;
  const profile = defaultOnboardingProfile(account);
  saveOnboardingProfile({ ...profile, conta: { ...profile.conta, nomeCompleto, nomeExibicao, cpf, email, telefone } });
  clearRegisterVerification();
  state.route = "onboarding";
  history.replaceState(null, "", "/onboarding");
  renderOnboarding();
}

function renderLoginCode(login: string, message: string): void {
  if (!app) return;
  app.innerHTML = `
    <main class="auth-shell">
      <section class="auth-panel" aria-label="Codigo FISIA">
        <div class="auth-box">
          <div class="brand">
            <div class="brand-mark" aria-hidden="true">F</div>
            <div>
              <p class="brand-title">FISIA</p>
              <div class="brand-subtitle">autenticacao</div>
            </div>
          </div>
          <div class="panel login-card">
            <h1>Codigo de acesso</h1>
            <p class="hint">${escapeHtml(message || "Informe o codigo recebido para concluir o acesso.")}</p>
            <div id="notice" class="notice" role="status"></div>
            <form id="code-form" class="form-grid" autocomplete="off" novalidate>
              <input id="pending-login" type="hidden" value="${escapeHtml(login)}" />
              <label>Codigo
                <input id="verification-code" name="verificationCode" type="text" inputmode="numeric" autocomplete="one-time-code" required />
              </label>
              <button class="primary-button" id="submit" type="submit">Confirmar codigo</button>
              <button class="ghost-button" id="back-login" type="button">Voltar</button>
            </form>
          </div>
        </div>
      </section>
      <section class="auth-copy" aria-hidden="true">
        <div>
          <h2>Confirme o codigo para liberar esta sessao.</h2>
          <p>Esse codigo protege o acesso ao painel clinico e vincula o dispositivo autorizado.</p>
        </div>
      </section>
    </main>
  `;
  document.querySelector<HTMLFormElement>("#code-form")?.addEventListener("submit", handleLoginCode);
  document.querySelector<HTMLButtonElement>("#back-login")?.addEventListener("click", () => renderLogin());
}

function showNotice(kind: "error" | "success" | "info", message: string): void {
  const notice = document.querySelector<HTMLDivElement>("#notice");
  if (!notice) return;
  notice.className = `notice ${kind}`;
  notice.textContent = message;
}

function bindPasswordToggles(root: ParentNode = document): void {
  root.querySelectorAll<HTMLButtonElement>("[data-toggle-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const inputId = button.dataset.togglePassword || "";
      const input = root.querySelector<HTMLInputElement>(`#${CSS.escape(inputId)}`);
      if (!input) return;
      const visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.textContent = visible ? "Mostrar" : "Ocultar";
      button.setAttribute("aria-pressed", String(!visible));
    });
  });
}

async function handleLogin(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const submit = form.querySelector<HTMLButtonElement>("#submit");
  const login = String(new FormData(form).get("login") || "").trim().toLowerCase();
  const secret = String(new FormData(form).get("secret") || "");
  const rememberDevice = Boolean(new FormData(form).get("remember"));
  if (!login || !secret) {
    showNotice("error", "Informe login e senha.");
    return;
  }
  if (submit) submit.disabled = true;
  try {
    const response = await sendJson<LoginPayload>("/api/web/login", { login, secret, rememberDevice });
    if (response.authenticated) {
      state.user = response.user || { login };
      setDocumentRoute("dashboard");
      await loadCurrentRoute();
      return;
    }
    if (response.next === "code") {
      renderLoginCode(response.login || login, response.message || "Codigo enviado.");
      return;
    }
    showNotice("error", response.message || "Nao foi possivel entrar.");
  } catch (error) {
    showNotice("error", error instanceof Error ? error.message : "Nao foi possivel entrar.");
  } finally {
    if (submit) submit.disabled = false;
  }
}

async function handleLoginCode(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const submit = form.querySelector<HTMLButtonElement>("#submit");
  const login = String(form.querySelector<HTMLInputElement>("#pending-login")?.value || "");
  const verificationCode = String(new FormData(form).get("verificationCode") || "").trim();
  if (!verificationCode) {
    showNotice("error", "Informe o codigo recebido.");
    return;
  }
  if (submit) submit.disabled = true;
  try {
    const response = await sendJson<LoginPayload>("/api/web/login/code", { login, verificationCode });
    if (response.authenticated) {
      state.user = response.user || { login };
      setDocumentRoute("dashboard");
      await loadCurrentRoute();
      return;
    }
    showNotice("error", response.message || "Codigo invalido.");
  } catch (error) {
    showNotice("error", error instanceof Error ? error.message : "Nao foi possivel validar o codigo.");
  } finally {
    if (submit) submit.disabled = false;
  }
}

function renderAppShell(): void {
  if (!app) return;
  const active = state.route;
  const userName = state.user?.nomeExibicao || state.user?.nomeCompleto || state.user?.login || "Usuario";
  const firstName = String(userName).trim().split(/\s+/)[0] || "profissional";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const adminUser = isAdminUser();
  const managementItems: Array<{ route: AppState["route"]; icon: string; title: string }> = [
    { route: "financeiro", icon: "finance", title: "Financeiro" },
    { route: "relatorios", icon: "reports", title: "Relatorios" },
  ];
  if (adminUser) {
    managementItems.push(
      { route: "recursos", icon: "resources", title: "Recursos" },
      { route: "usuarios", icon: "users", title: "Usuarios" },
      { route: "debug", icon: "debug", title: "Debug intents" },
    );
  }
  const navGroups: Array<{ label: string; items: Array<{ route: AppState["route"]; icon: string; title: string }> }> = [
    { label: "Geral", items: [{ route: "dashboard", icon: "home", title: "Inicio" }] },
    {
      label: "Operacao",
      items: [
        { route: "agenda", icon: "calendar", title: "Agenda" },
        { route: "evolucoes", icon: "cadastro", title: "Pacientes" },
      ],
    },
    {
      label: "Gestao",
      items: managementItems,
    },
  ];
  app.innerHTML = `
    <main class="app-shell ${state.sidebarCollapsed ? "sidebar-collapsed" : ""}">
      <aside class="sidebar">
        <div class="brand shell-brand">
          <div class="brand-mark" aria-hidden="true">F</div>
          <div>
            <p class="brand-title">FISIA</p>
            <div class="brand-subtitle">Fluxo Inteligente de Saude</div>
          </div>
        </div>
        <nav class="nav" aria-label="Principal">
          ${navGroups
            .map(
              (group) => `
                <div class="nav-group">
                  <span>${group.label}</span>
                  ${group.items
                    .map(
                      (item) => `
                        <button type="button" data-route="${item.route}" aria-current="${active === item.route ? "page" : "false"}">
                          ${navIcon(item.icon)}
                          <span class="nav-label">${item.title}</span>
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              `,
            )
            .join("")}
        </nav>
        <footer class="sidebar-footer">
          <button class="assistant-sidebar-card" id="assistant-sidebar" type="button">
            <span>${navIcon("assistant")}</span>
            <strong>Pergunte a Fisia</strong>
            <small>Tire duvidas e receba sugestoes inteligentes.</small>
          </button>
          <button type="button" id="open-settings-sidebar">Configuracoes</button>
          <button type="button" id="logout-sidebar">Sair</button>
        </footer>
      </aside>
      <section class="main">
        <header class="global-topbar ${active === "dashboard" ? "dashboard-topbar" : ""}">
          <button class="sidebar-toggle" type="button" aria-label="Alternar menu">${navIcon("menu")}<span>Menu</span></button>
          ${
            active === "dashboard"
              ? `<div class="dashboard-greeting"><strong>${greeting}, ${escapeHtml(firstName)} <span aria-hidden="true">&#128075;</span></strong><small>${formatDate(todayISO())}</small></div><div class="global-search dashboard-search" role="search"><span aria-hidden="true" class="search-label">Buscar</span><input id="global-search" type="text" placeholder="Buscar pacientes, agendamentos, recibos..." autocomplete="off" /></div>`
              : `<div class="global-search" role="search"><span aria-hidden="true" class="search-label">Buscar</span><input id="global-search" type="text" placeholder="Pesquisar paciente, atendimento ou relatorio" autocomplete="off" /></div>`
          }
          <div class="topbar-actions">
            <button class="notification-button" id="notifications" type="button" title="Notificacoes" aria-label="Notificacoes">
              <span aria-hidden="true">!</span>
            </button>
            <button class="secondary-button topbar-new-appointment" id="new-appointment-topbar" type="button">+ Novo atendimento</button>
            <div class="user-menu">
              <button class="user-chip" id="user-menu-button" type="button" aria-expanded="false">${escapeHtml(userName)}</button>
              <div class="user-menu-panel" id="user-menu-panel" hidden>
                <button type="button" id="open-profile">Editar perfil</button>
                <button type="button" id="open-security">Seguranca e acesso</button>
                <button type="button" id="open-settings">Configuracoes</button>
                <button type="button" id="menu-logout">Sair</button>
              </div>
            </div>
          </div>
        </header>
        <div id="view"></div>
      </section>
      <div id="profile-modal-root"></div>
    </main>
  `;
  document.querySelector<HTMLButtonElement>(".sidebar-toggle")?.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 899px)").matches) {
      document.querySelector<HTMLElement>(".sidebar")?.classList.toggle("open");
      return;
    }
    state.sidebarCollapsed = !state.sidebarCollapsed;
    saveBooleanPreference(SIDEBAR_COLLAPSED_KEY, state.sidebarCollapsed);
    document.querySelector<HTMLElement>(".app-shell")?.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
  });
  document.querySelector<HTMLInputElement>("#global-search")?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const term = event.currentTarget.value.trim();
    if (!term) return;
    state.patientSearch = term;
    setDocumentRoute("pacientes");
    await loadPacientes();
  });
  document.querySelector<HTMLButtonElement>("#new-appointment-topbar")?.addEventListener("click", async () => {
    setDocumentRoute("agenda");
    state.appointmentDrawerOpen = true;
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#assistant-sidebar")?.addEventListener("click", async () => {
    setDocumentRoute("debug");
    await loadCurrentRoute();
  });
  document.querySelector<HTMLButtonElement>("#open-settings-sidebar")?.addEventListener("click", renderSecurityModal);
  document.querySelector<HTMLButtonElement>("#logout-sidebar")?.addEventListener("click", logoutFromWeb);
  document.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(isAppRoute(nextRoute) ? nextRoute : "dashboard");
      await loadCurrentRoute();
    });
  });
  bindUserMenu();
  renderCurrentRoute();
}

function isAdminUser(user: User | null = state.user): boolean {
  if (!user) return false;
  if (user.isAdmin === true) return true;
  const role = normalizeStatus(user.role || user.papel || "");
  return ["admin", "administrador", "owner", "proprietario", "gestor", "super_admin"].includes(role);
}

function bindUserMenu(): void {
  const button = document.querySelector<HTMLButtonElement>("#user-menu-button");
  const panel = document.querySelector<HTMLDivElement>("#user-menu-panel");
  button?.addEventListener("click", () => {
    if (!panel) return;
    const expanded = panel.hidden;
    panel.hidden = !expanded;
    button.setAttribute("aria-expanded", String(expanded));
  });
  document.querySelector<HTMLButtonElement>("#open-profile")?.addEventListener("click", () => {
    if (panel) panel.hidden = true;
    renderProfileModal();
  });
  document.querySelector<HTMLButtonElement>("#open-security")?.addEventListener("click", () => {
    if (panel) panel.hidden = true;
    renderSecurityModal();
  });
  document.querySelector<HTMLButtonElement>("#open-settings")?.addEventListener("click", () => {
    if (panel) panel.hidden = true;
    renderSecurityModal();
  });
  document.querySelector<HTMLButtonElement>("#menu-logout")?.addEventListener("click", async () => {
    if (panel) panel.hidden = true;
    await logoutFromWeb();
  });
}

async function logoutFromWeb(): Promise<void> {
  await sendJson("/api/web/logout");
  state.user = null;
  history.replaceState(null, "", "/");
  renderLogin();
}

function renderProfileModal(profile: User | null = state.user, errorMessage = ""): void {
  const root = document.querySelector<HTMLDivElement>("#profile-modal-root");
  if (!root) return;
  const user = profile || {};
  root.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <section class="profile-modal" role="dialog" aria-modal="true" aria-label="Editar perfil">
        <header>
          <div>
            <h2>Editar perfil</h2>
            <p>Atualize dados do profissional. CPF permanece bloqueado.</p>
          </div>
          <button class="ghost-button" id="close-profile" type="button">Fechar</button>
        </header>
        <div id="profile-notice" class="notice ${errorMessage ? "error" : ""}" role="status">${escapeHtml(errorMessage)}</div>
        <form id="profile-form" class="form-grid profile-grid">
          <label>Nome completo
            <input name="nomeCompleto" type="text" value="${escapeHtml(user.nomeCompleto || "")}" required />
          </label>
          <label>Nome exibido
            <input name="nomeExibicao" type="text" value="${escapeHtml(user.nomeExibicao || "")}" />
          </label>
          <label>CPF
            <input name="cpf" type="text" value="${escapeHtml(formatCpf(user.cpf || ""))}" disabled />
          </label>
          <label>Telefone vinculado
            <input name="telefone" type="tel" value="${escapeHtml(user.telefone || "")}" autocomplete="tel" />
          </label>
          <label>E-mail
            <input name="email" type="email" value="${escapeHtml(user.email || "")}" autocomplete="email" />
          </label>
          <label>Conselho
            <input name="conselho" type="text" value="${escapeHtml(user.conselho || "")}" />
          </label>
          <label>Registro
            <input name="numeroRegistroConselho" type="text" value="${escapeHtml(user.numeroRegistroConselho || "")}" />
          </label>
          <label>UF
            <input name="ufConselho" type="text" value="${escapeHtml(user.ufConselho || "")}" maxlength="2" />
          </label>
          <label>Valor padrao dos atendimentos
            <input name="valorPadraoAtendimento" type="text" inputmode="decimal" value="${escapeHtml(user.valorPadraoAtendimento ?? "")}" />
          </label>
          <label class="span-2">Endereco
            <input name="endereco" type="text" value="${escapeHtml(user.endereco || "")}" />
          </label>
          <label class="span-2">Senha atual para confirmar alteracoes sensiveis
            <span class="password-field">
              <input id="profile-secret" name="secret" type="password" autocomplete="current-password" />
              <button class="ghost-button password-toggle" type="button" data-toggle-password="profile-secret" aria-pressed="false">Mostrar</button>
            </span>
          </label>
          <div class="button-row span-2">
            <button class="primary-button" type="submit">Salvar perfil</button>
            <button class="ghost-button" id="cancel-profile" type="button">Cancelar</button>
          </div>
        </form>
      </section>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("#close-profile")?.addEventListener("click", closeProfileModal);
  root.querySelector<HTMLButtonElement>("#cancel-profile")?.addEventListener("click", closeProfileModal);
  root.querySelector<HTMLFormElement>("#profile-form")?.addEventListener("submit", handleProfileSubmit);
  bindPasswordToggles(root);
  void refreshProfileModal();
}

function closeProfileModal(): void {
  const root = document.querySelector<HTMLDivElement>("#profile-modal-root");
  if (root) root.innerHTML = "";
}

async function refreshProfileModal(): Promise<void> {
  try {
    const payload = await fetchJson<ProfilePayload>("/api/web/profile");
    state.user = payload.user || state.user;
    const form = document.querySelector<HTMLFormElement>("#profile-form");
    if (!form || !payload.user) return;
    Object.entries({
      nomeCompleto: payload.user.nomeCompleto || "",
      nomeExibicao: payload.user.nomeExibicao || "",
      cpf: payload.user.cpf || "",
      telefone: payload.user.telefone || "",
      email: payload.user.email || "",
      conselho: payload.user.conselho || "",
      numeroRegistroConselho: payload.user.numeroRegistroConselho || "",
      ufConselho: payload.user.ufConselho || "",
      endereco: payload.user.endereco || "",
      valorPadraoAtendimento: String(payload.user.valorPadraoAtendimento ?? ""),
    }).forEach(([name, value]) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (input) input.value = value;
    });
  } catch (error) {
    const notice = document.querySelector<HTMLDivElement>("#profile-notice");
    if (notice) {
      notice.className = "notice error";
      notice.textContent = error instanceof Error ? error.message : "Falha ao carregar perfil.";
    }
  }
}

async function handleProfileSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const payload = {
    nomeCompleto: String(data.get("nomeCompleto") || "").trim(),
    nomeExibicao: String(data.get("nomeExibicao") || "").trim(),
    telefone: String(data.get("telefone") || "").trim(),
    email: String(data.get("email") || "").trim(),
    conselho: String(data.get("conselho") || "").trim(),
    numeroRegistroConselho: String(data.get("numeroRegistroConselho") || "").trim(),
    ufConselho: String(data.get("ufConselho") || "").trim().toUpperCase(),
    endereco: String(data.get("endereco") || "").trim(),
    valorPadraoAtendimento: Number(String(data.get("valorPadraoAtendimento") || "0").replace(",", ".")) || 0,
    secret: String(data.get("secret") || ""),
  };
  try {
    const response = await fetchJson<ProfilePayload>("/api/web/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    state.user = response.user;
    renderProfileModal(response.user, "");
    const notice = document.querySelector<HTMLDivElement>("#profile-notice");
    if (notice) {
      notice.className = "notice success";
      notice.textContent = "Perfil atualizado.";
    }
    const userButton = document.querySelector<HTMLButtonElement>("#user-menu-button");
    if (userButton) {
      userButton.textContent = response.user.nomeExibicao || response.user.nomeCompleto || response.user.login || "Usuario";
    }
  } catch (error) {
    const notice = document.querySelector<HTMLDivElement>("#profile-notice");
    if (notice) {
      notice.className = "notice error";
      notice.textContent = error instanceof Error ? error.message : "Falha ao salvar perfil.";
    }
  }
}

function renderSecurityModal(profile: User | null = state.user): void {
  const root = document.querySelector<HTMLDivElement>("#profile-modal-root");
  if (!root) return;
  const user = profile || {};
  root.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <section class="profile-modal security-modal" role="dialog" aria-modal="true" aria-label="Seguranca e acesso">
        <header>
          <div>
            <h2>Seguranca e acesso</h2>
            <p>Gerencie os dados usados para entrar, recuperar acesso e vincular dispositivos.</p>
          </div>
          <button class="ghost-button" id="close-security" type="button">Fechar</button>
        </header>
        <div class="security-grid">
          <div class="security-card">
            <span>Usuario</span>
            <strong>${escapeHtml(user.login || "-")}</strong>
            <small>Tambem e possivel entrar por e-mail ou telefone quando cadastrados.</small>
          </div>
          <div class="security-card">
            <span>Telefone vinculado</span>
            <strong>${escapeHtml(user.telefone || "Nao informado")}</strong>
            <small>Usado para recuperacao de acesso e vinculo WhatsApp.</small>
          </div>
          <div class="security-card">
            <span>E-mail</span>
            <strong>${escapeHtml(user.email || "Nao informado")}</strong>
            <small>Deve ser unico entre usuarios.</small>
          </div>
          <div class="security-card">
            <span>CPF</span>
            <strong>${escapeHtml(formatCpf(user.cpf || "") || "Bloqueado")}</strong>
            <small>Somente leitura neste fluxo.</small>
          </div>
          <div class="security-card">
            <span>Valor padrao dos atendimentos</span>
            <strong>${formatMoney(user.valorPadraoAtendimento)}</strong>
            <small>Usado quando o paciente nao possui valor proprio.</small>
          </div>
        </div>
        <div class="security-actions">
          <button class="ghost-button" id="security-edit-profile" type="button">Editar perfil</button>
          <button class="ghost-button" id="security-logout" type="button">Desconectar este dispositivo</button>
        </div>
      </section>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("#close-security")?.addEventListener("click", closeProfileModal);
  root.querySelector<HTMLButtonElement>("#security-edit-profile")?.addEventListener("click", () => renderProfileModal());
  root.querySelector<HTMLButtonElement>("#security-logout")?.addEventListener("click", logoutFromWeb);
  void refreshSecurityModal();
}

async function refreshSecurityModal(): Promise<void> {
  try {
    const payload = await fetchJson<ProfilePayload>("/api/web/profile");
    state.user = payload.user || state.user;
  } catch {
    // Modal remains useful with the session payload when profile refresh fails.
  }
}

function isAppRoute(value: unknown): value is AppState["route"] {
  return ["dashboard", "pacientes", "agenda", "evolucoes", "financeiro", "relatorios", "recursos", "usuarios", "debug", "onboarding"].includes(String(value));
}

function renderCurrentRoute(): void {
  if (["recursos", "usuarios", "debug"].includes(state.route) && !isAdminUser()) {
    state.route = "dashboard";
    history.replaceState(null, "", "/");
  }
  if (state.route === "agenda") renderAgenda();
  else if (state.route === "pacientes") renderPacientes();
  else if (state.route === "evolucoes") renderEvolucoes();
  else if (state.route === "financeiro") renderFinanceiro();
  else if (state.route === "relatorios") renderRelatorios();
  else if (state.route === "recursos") renderRecursos();
  else if (state.route === "usuarios") renderUsuarios();
  else if (state.route === "debug") renderDebugIntents();
  else if (state.route === "onboarding") renderOnboarding();
  else renderDashboardPro();
}

async function loadCurrentRoute(): Promise<void> {
  if (["recursos", "usuarios", "debug"].includes(state.route) && !isAdminUser()) {
    state.route = "dashboard";
    history.replaceState(null, "", "/");
  }
  if (state.route === "agenda") {
    await loadAgenda();
    return;
  }
  if (state.route === "pacientes") {
    await loadPacientes();
    return;
  }
  if (state.route === "evolucoes") {
    await loadEvolucoes();
    return;
  }
  if (state.route === "financeiro") {
    await loadFinanceiro();
    return;
  }
  if (state.route === "relatorios") {
    await loadRelatorios();
    return;
  }
  if (state.route === "recursos") {
    await loadRecursos();
    return;
  }
  if (state.route === "usuarios") {
    await loadUsuarios();
    return;
  }
  if (state.route === "debug") {
    renderDebugIntents();
    return;
  }
  if (state.route === "onboarding") {
    renderOnboarding();
    return;
  }
  await loadDashboard();
}

async function loadDashboard(): Promise<void> {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  view.innerHTML = `<div class="loading">Carregando inicio...</div>`;
  try {
    const [pacientes, agenda, evolucoes, financeiro] = await Promise.all([
      fetchJson<Paciente[]>("/api/web/pacientes"),
      fetchJson<AgendaSlot[]>(`/api/web/agenda?inicio=${todayISO()}&fim=${addDaysISO(7)}`),
      fetchJson<Evolucao[]>("/api/web/evolucoes"),
      fetchJson<Faturamento[]>("/api/web/financeiro"),
    ]);
    state.agenda = agenda;
    state.pacientes = pacientes;
    state.evolucoes = evolucoes;
    state.financeiro = financeiro;
    renderDashboardPro(pacientes, agenda, evolucoes, financeiro);
  } catch (error) {
    view.innerHTML = `<div class="notice error">Falha ao carregar inicio: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
  }
}

function defaultOnboardingProfile(user: Partial<User & LocalAccount> | null = state.user): OnboardingProfile {
  const displayName = user?.nomeExibicao || user?.nomeCompleto || "FISIA";
  const now = new Date().toISOString();
  return {
    conta: {
      nomeCompleto: user?.nomeCompleto || "",
      nomeExibicao: user?.nomeExibicao || displayName,
      cpf: "cpf" in (user || {}) ? (user as LocalAccount).cpf || "" : "",
      email: "email" in (user || {}) ? (user as LocalAccount).email || "" : user?.login || "",
      telefone: "telefone" in (user || {}) ? (user as LocalAccount).telefone || "" : "",
      fotoPerfil: "",
      nomeSocial: "",
      genero: "",
      pronome: "Dr.",
      cidadeEstado: "",
      endereco: "",
    },
    profissional: {
      profissao: "Fisioterapeuta",
      conselho: "CREFITO",
      numeroConselho: user?.numeroRegistroConselho || "",
      ufConselho: user?.ufConselho || "SP",
      especialidade: "",
      tipoAtuacao: ["Autonomo"],
      nomeClinica: (user as { clinicaWorkspace?: string; clinica_workspace?: string } | null)?.clinicaWorkspace || (user as { clinicaWorkspace?: string; clinica_workspace?: string } | null)?.clinica_workspace || displayName,
    },
    rotina: {
      valorPadrao: String(user?.valorPadraoAtendimento || ""),
      duracaoPadrao: "60",
      diasAtendimento: ["Segunda", "Terca", "Quarta", "Quinta", "Sexta"],
      horarioInicio: "08:00",
      horarioFim: "20:00",
      intervalo: "0",
      fuso: "America/Sao_Paulo",
      tiposAtendimento: ["Presencial", "Online"],
      tipoPadrao: "Presencial",
    },
    recebimentos: {
      formasPagamento: ["PIX", "Dinheiro", "Debito", "Cartao credito"],
      cobrancaPadrao: "No dia do atendimento",
      permiteCreditoPaciente: true,
      permitePacoteSessoes: true,
    },
    whatsapp: {
      numero: "telefone" in (user || {}) ? (user as LocalAccount).telefone || "" : "",
      nomeMensagens: displayName,
      horarioInicio: "08:00",
      horarioFim: "20:00",
      lembreteHorasAntes: "24",
      enviarConfirmacao: true,
      permitirCancelamento: true,
      assinatura: `${displayName}\nFisioterapeuta`,
    },
    primeiroPaciente: {
      nome: "Paciente teste",
      telefone: "",
      usarTeste: true,
    },
    completedAt: now,
  };
}

function loadOnboardingProfile(): OnboardingProfile {
  const raw = localStorage.getItem(ONBOARDING_PROFILE_KEY);
  if (!raw) return defaultOnboardingProfile();
  try {
    return { ...defaultOnboardingProfile(), ...JSON.parse(raw) } as OnboardingProfile;
  } catch {
    return defaultOnboardingProfile();
  }
}

function saveOnboardingProfile(profile: OnboardingProfile): void {
  localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(profile));
}

function selectedValues(form: HTMLFormElement, name: string): string[] {
  return Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function onboardingCurrentStep(): number {
  return Math.min(4, Math.max(1, Number(localStorage.getItem(ONBOARDING_STEP_KEY) || "1")));
}

function setOnboardingStep(step: number): void {
  localStorage.setItem(ONBOARDING_STEP_KEY, String(Math.min(4, Math.max(1, step))));
}

function optionsHtml(values: string[], selected: string): string {
  return values.map((value) => `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
}

function checksHtml(name: string, values: string[], selected: string[]): string {
  const selectedSet = new Set(selected);
  return values
    .map(
      (value) => `
        <label class="onboarding-check">
          <input type="checkbox" name="${escapeHtml(name)}" value="${escapeHtml(value)}" ${selectedSet.has(value) ? "checked" : ""}>
          <span>${escapeHtml(value)}</span>
        </label>
      `,
    )
    .join("");
}

function buildReminderJobs(profile: OnboardingProfile): ReminderJob[] {
  const createdAt = new Date().toISOString();
  const name = profile.whatsapp.nomeMensagens || profile.conta.nomeExibicao || "FISIA";
  const jobs: ReminderJob[] = [
    {
      id: `reminder-${createdAt}-agenda`,
      type: "professional_agenda_daily",
      status: "draft",
      recipient: "professional",
      channel: "whatsapp",
      scheduledFor: `${profile.whatsapp.horarioInicio || "08:00"}`,
      title: "Resumo diario de agenda",
      message: `${name}: enviar resumo dos atendimentos do dia e horarios vagos.`,
      disconnected: true,
      reason: "Pipeline criado, ainda sem worker de envio conectado.",
      createdAt,
    },
    {
      id: `reminder-${createdAt}-payments`,
      type: "professional_payment_pending",
      status: "draft",
      recipient: "professional",
      channel: "whatsapp",
      scheduledFor: `${profile.whatsapp.horarioFim || "20:00"}`,
      title: "Pendencias de pagamento",
      message: `${name}: listar pacientes com pagamento pendente e credito do paciente insuficiente.`,
      disconnected: true,
      reason: "Pipeline criado, ainda sem worker de envio conectado.",
      createdAt,
    },
    {
      id: `reminder-${createdAt}-patient-reminder`,
      type: "patient_appointment_reminder",
      status: "draft",
      recipient: "patient",
      channel: "whatsapp",
      scheduledFor: `${profile.whatsapp.lembreteHorasAntes || "24"}h antes`,
      title: "Lembrete de atendimento do paciente",
      message: `Lembrete automatico de atendimento com ${name}.`,
      disconnected: true,
      reason: "Pipeline criado, ainda sem worker de envio conectado.",
      createdAt,
    },
    {
      id: `reminder-${createdAt}-patient-confirmation`,
      type: "patient_appointment_confirmation",
      status: profile.whatsapp.enviarConfirmacao ? "draft" : "disabled",
      recipient: "patient",
      channel: "whatsapp",
      scheduledFor: "Apos criacao do agendamento",
      title: "Confirmacao de agendamento",
      message: `Confirmacao automatica de horario com ${name}.`,
      disconnected: true,
      reason: "Pipeline criado, ainda sem worker de envio conectado.",
      createdAt,
    },
    {
      id: `reminder-${createdAt}-patient-payment`,
      type: "patient_payment_reminder",
      status: "draft",
      recipient: "patient",
      channel: "whatsapp",
      scheduledFor: "Apos fechamento financeiro pendente",
      title: "Lembrete de pagamento do paciente",
      message: `Aviso automatico de pagamento pendente com ${name}.`,
      disconnected: true,
      reason: "Pipeline criado, ainda sem worker de envio conectado.",
      createdAt,
    },
  ];
  return jobs;
}

function saveReminderJobs(profile: OnboardingProfile): ReminderJob[] {
  const jobs = buildReminderJobs(profile);
  localStorage.setItem(REMINDER_JOBS_KEY, JSON.stringify(jobs));
  return jobs;
}

function renderOnboarding(): void {
  if (!app) return;
  const step = onboardingCurrentStep();
  const profile = loadOnboardingProfile();
  const progress = Math.round((step / 4) * 100);
  app.innerHTML = `
    <main class="register-commercial-shell onboarding-commercial-shell">
      <section class="register-commercial-topbar" aria-label="Configuracao inicial FISIA">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">F</div>
          <div>
            <p class="brand-title">FISIA</p>
            <div class="brand-subtitle">configuracao inicial</div>
          </div>
        </div>
        <button class="ghost-button onboarding-enter-button" id="onboarding-enter" type="button">Entrar</button>
      </section>
      <section class="onboarding-commercial-layout" aria-label="Etapas de configuracao">
        <aside class="onboarding-commercial-aside">
          <div>
            <p class="eyebrow">Etapa ${step} de 5</p>
            <h1>Configure sua rotina profissional</h1>
            <p>Complete os pontos essenciais para deixar agenda, recebimentos e mensagens prontos para uso.</p>
          </div>
          <div class="register-commercial-progress" aria-label="Progresso do onboarding">
            <span><strong>${progress}%</strong> concluido</span>
            <div><i style="width:${progress}%"></i></div>
          </div>
          <nav class="onboarding-commercial-steps" aria-label="Etapas">
            ${["Sua conta", "Perfil profissional", "Rotina clinica", "Recebimentos e WhatsApp"].map((label, index) => {
              const itemStep = index + 1;
              return `<button class="${itemStep === step ? "active" : itemStep < step ? "done" : ""}" type="button" data-onboarding-step="${itemStep}"><span>${itemStep}</span>${escapeHtml(label)}</button>`;
            }).join("")}
          </nav>
        </aside>
        <form class="panel onboarding-commercial-form" id="onboarding-form">
          <div id="notice" class="notice" hidden></div>
          ${onboardingStepHtml(step, profile)}
          <div class="onboarding-actions">
            ${step > 1 ? `<button class="secondary-button" id="onboarding-back" type="button">Voltar</button>` : ""}
            <button class="primary-button" type="submit">${step === 4 ? "Concluir configuracao" : "Continuar"}</button>
          </div>
        </form>
      </section>
    </main>
  `;
  bindCpfMasks();
  document.querySelector<HTMLButtonElement>("#onboarding-enter")?.addEventListener("click", () => renderLogin());
  document.querySelectorAll<HTMLButtonElement>("[data-onboarding-step]").forEach((button) => {
    button.addEventListener("click", () => {
      setOnboardingStep(Number(button.dataset.onboardingStep || "1"));
      renderOnboarding();
    });
  });
  document.querySelector<HTMLButtonElement>("#onboarding-back")?.addEventListener("click", () => {
    setOnboardingStep(step - 1);
    renderOnboarding();
  });
  document.querySelector<HTMLFormElement>("#onboarding-form")?.addEventListener("submit", handleOnboardingSubmit);
}

function onboardingStepHtml(step: number, profile: OnboardingProfile): string {
  if (step === 1) {
    return `
      <div class="section-title"><h2>Sua conta</h2><span>Dados pessoais obrigatorios e identificacao publica</span></div>
      <div class="form-grid">
        <label>Nome completo<input name="nomeCompleto" value="${escapeHtml(profile.conta.nomeCompleto)}" required></label>
        <label>Nome de exibicao<input name="nomeExibicao" value="${escapeHtml(profile.conta.nomeExibicao)}" required></label>
        <label>CPF <small>opcional</small><input name="cpf" data-mask="cpf" value="${escapeHtml(profile.conta.cpf)}"></label>
        <label>E-mail<input type="email" name="email" value="${escapeHtml(profile.conta.email)}" required></label>
        <label>Telefone<input name="telefone" value="${escapeHtml(profile.conta.telefone)}" required></label>
        <label>Nome social<input name="nomeSocial" value="${escapeHtml(profile.conta.nomeSocial)}"></label>
        <label>Pronome<select name="pronome">${optionsHtml(["Dr.", "Dra.", ""], profile.conta.pronome)}</select></label>
        <label>Genero<input name="genero" value="${escapeHtml(profile.conta.genero)}"></label>
        <label>Cidade e estado<input name="cidadeEstado" value="${escapeHtml(profile.conta.cidadeEstado)}"></label>
        <label>Endereco completo<input name="endereco" value="${escapeHtml(profile.conta.endereco)}"></label>
        <label>Foto de perfil<input name="fotoPerfil" value="${escapeHtml(profile.conta.fotoPerfil)}" placeholder="URL ou caminho local"></label>
      </div>
    `;
  }
  if (step === 2) {
    return `
      <div class="section-title"><h2>Perfil profissional</h2><span>Dados usados em painel, links e mensagens</span></div>
      <div class="form-grid">
        <label>Profissao<select name="profissao" required>${optionsHtml(HEALTH_PROFESSIONS, profile.profissional.profissao)}</select></label>
        <label>Conselho profissional<input name="conselho" value="${escapeHtml(profile.profissional.conselho)}" required></label>
        <label>Numero do conselho<input name="numeroConselho" value="${escapeHtml(profile.profissional.numeroConselho)}" required></label>
        <label>Estado do conselho<select name="ufConselho" required>${optionsHtml(COUNCIL_UFS, profile.profissional.ufConselho)}</select></label>
        <label>Area principal<input name="especialidade" value="${escapeHtml(profile.profissional.especialidade)}"></label>
        <label>Nome profissional ou clinica<input name="nomeClinica" value="${escapeHtml(profile.profissional.nomeClinica)}"></label>
      </div>
      <div class="field-block">
        <span>Tipo de atuacao</span>
        <div class="onboarding-check-grid">${checksHtml("tipoAtuacao", ["Autonomo", "Atendimento domiciliar", "Consultorio proprio", "Clinica compartilhada", "Clinica propria", "Hospital", "Academia ou studio", "Online", "Outro"], profile.profissional.tipoAtuacao)}</div>
      </div>
    `;
  }
  if (step === 3) {
    return `
      <div class="section-title"><h2>Sua rotina</h2><span>Agenda padrao e tipos de atendimento</span></div>
      <div class="form-grid">
        <label>Valor padrao da sessao<input name="valorPadrao" value="${escapeHtml(profile.rotina.valorPadrao)}" required placeholder="180,00"></label>
        <label>Duracao padrao<input name="duracaoPadrao" type="number" min="10" step="5" value="${escapeHtml(profile.rotina.duracaoPadrao)}" required></label>
        <label>Horario inicial<input name="horarioInicio" type="time" value="${escapeHtml(profile.rotina.horarioInicio)}" required></label>
        <label>Horario final<input name="horarioFim" type="time" value="${escapeHtml(profile.rotina.horarioFim)}" required></label>
        <label>Intervalo entre atendimentos<input name="intervalo" type="number" min="0" step="5" value="${escapeHtml(profile.rotina.intervalo)}"></label>
        <label>Fuso horario<select name="fuso">${optionsHtml(TIMEZONES, profile.rotina.fuso)}</select></label>
        <label>Tipo padrao<select name="tipoPadrao">${optionsHtml(appointmentTypeLabels(), profile.rotina.tipoPadrao)}</select></label>
      </div>
      <div class="field-block"><span>Dias de atendimento</span><div class="onboarding-check-grid">${checksHtml("diasAtendimento", ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"], profile.rotina.diasAtendimento)}</div></div>
      <div class="field-block"><span>Tipos de atendimento</span><div class="onboarding-check-grid">${checksHtml("tiposAtendimento", appointmentTypeLabels(), profile.rotina.tiposAtendimento)}</div></div>
    `;
  }
  return `
    <div class="section-title"><h2>Recebimentos e WhatsApp</h2><span>Financeiro simples, credito do paciente separado e mensagens planejadas</span></div>
    <div class="field-block"><span>Formas aceitas</span><div class="onboarding-check-grid">${checksHtml("formasPagamento", ["PIX", "Dinheiro", "Debito", "Cartao credito", "Transferencia", "Outro"], profile.recebimentos.formasPagamento)}</div></div>
    <div class="form-grid">
      <label>Cobranca padrao<select name="cobrancaPadrao">${optionsHtml(["No dia do atendimento", "Antecipada", "Por pacote", "Manual"], profile.recebimentos.cobrancaPadrao)}</select></label>
      <label class="toggle-line"><input type="checkbox" name="permiteCreditoPaciente" ${profile.recebimentos.permiteCreditoPaciente ? "checked" : ""}> Permite credito do paciente</label>
      <label class="toggle-line"><input type="checkbox" name="permitePacoteSessoes" ${profile.recebimentos.permitePacoteSessoes ? "checked" : ""}> Permite pacote de sessoes</label>
      <label>Numero de WhatsApp<input name="numero" value="${escapeHtml(profile.whatsapp.numero)}" required></label>
      <label>Nome exibido nas mensagens<input name="nomeMensagens" value="${escapeHtml(profile.whatsapp.nomeMensagens)}" required></label>
      <label>Horario permitido inicio<input name="whatsappInicio" type="time" value="${escapeHtml(profile.whatsapp.horarioInicio)}"></label>
      <label>Horario permitido fim<input name="whatsappFim" type="time" value="${escapeHtml(profile.whatsapp.horarioFim)}"></label>
      <label>Lembrete antes do atendimento<select name="lembreteHorasAntes">${optionsHtml(["2", "12", "24", "48"], profile.whatsapp.lembreteHorasAntes)}</select></label>
      <label>Primeiro paciente de teste<input name="primeiroPacienteNome" value="${escapeHtml(profile.primeiroPaciente.nome)}"></label>
      <label>Telefone do paciente teste<input name="primeiroPacienteTelefone" value="${escapeHtml(profile.primeiroPaciente.telefone)}"></label>
      <label class="toggle-line"><input type="checkbox" name="enviarConfirmacao" ${profile.whatsapp.enviarConfirmacao ? "checked" : ""}> Enviar confirmacao</label>
      <label class="toggle-line"><input type="checkbox" name="permitirCancelamento" ${profile.whatsapp.permitirCancelamento ? "checked" : ""}> Permitir cancelamento pelo paciente</label>
      <label class="toggle-line"><input type="checkbox" name="usarTeste" ${profile.primeiroPaciente.usarTeste ? "checked" : ""}> Criar primeiro paciente de teste</label>
    </div>
    <label>Assinatura padrao<textarea name="assinatura" rows="4">${escapeHtml(profile.whatsapp.assinatura)}</textarea></label>
  `;
}

function handleOnboardingSubmit(event: SubmitEvent): void {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const step = onboardingCurrentStep();
  const profile = loadOnboardingProfile();
  if (step === 1) {
    profile.conta = {
      ...profile.conta,
      nomeCompleto: String(data.get("nomeCompleto") || "").trim(),
      nomeExibicao: String(data.get("nomeExibicao") || "").trim(),
      cpf: onlyDigits(data.get("cpf")).slice(0, 11),
      email: String(data.get("email") || "").trim().toLowerCase(),
      telefone: onlyDigits(data.get("telefone")),
      nomeSocial: String(data.get("nomeSocial") || "").trim(),
      pronome: String(data.get("pronome") || ""),
      genero: String(data.get("genero") || "").trim(),
      cidadeEstado: String(data.get("cidadeEstado") || "").trim(),
      endereco: String(data.get("endereco") || "").trim(),
      fotoPerfil: String(data.get("fotoPerfil") || "").trim(),
    };
    if (!profile.conta.nomeCompleto || !profile.conta.nomeExibicao || !profile.conta.email || !profile.conta.telefone) {
      showNotice("error", "Preencha os dados obrigatorios da conta.");
      return;
    }
  } else if (step === 2) {
    profile.profissional = {
      profissao: String(data.get("profissao") || ""),
      conselho: String(data.get("conselho") || "").trim(),
      numeroConselho: String(data.get("numeroConselho") || "").trim(),
      ufConselho: String(data.get("ufConselho") || ""),
      especialidade: String(data.get("especialidade") || "").trim(),
      tipoAtuacao: selectedValues(form, "tipoAtuacao"),
      nomeClinica: String(data.get("nomeClinica") || "").trim(),
    };
    if (!profile.profissional.profissao || !profile.profissional.conselho || !profile.profissional.numeroConselho || !profile.profissional.ufConselho || !profile.profissional.tipoAtuacao.length) {
      showNotice("error", "Preencha os dados profissionais obrigatorios.");
      return;
    }
  } else if (step === 3) {
    profile.rotina = {
      valorPadrao: String(data.get("valorPadrao") || "").trim(),
      duracaoPadrao: String(data.get("duracaoPadrao") || "").trim(),
      horarioInicio: String(data.get("horarioInicio") || ""),
      horarioFim: String(data.get("horarioFim") || ""),
      intervalo: String(data.get("intervalo") || "0"),
      fuso: String(data.get("fuso") || "America/Sao_Paulo"),
      tipoPadrao: String(data.get("tipoPadrao") || "Individual"),
      diasAtendimento: selectedValues(form, "diasAtendimento"),
      tiposAtendimento: selectedValues(form, "tiposAtendimento"),
    };
    if (!profile.rotina.valorPadrao || !profile.rotina.duracaoPadrao || !profile.rotina.diasAtendimento.length || !profile.rotina.tiposAtendimento.length || !profile.rotina.tipoPadrao) {
      showNotice("error", "Complete valor, duracao, dias e tipo de atendimento.");
      return;
    }
  } else {
    profile.recebimentos = {
      formasPagamento: selectedValues(form, "formasPagamento"),
      cobrancaPadrao: String(data.get("cobrancaPadrao") || "No dia do atendimento"),
      permiteCreditoPaciente: Boolean(data.get("permiteCreditoPaciente")),
      permitePacoteSessoes: Boolean(data.get("permitePacoteSessoes")),
    };
    profile.whatsapp = {
      numero: onlyDigits(data.get("numero")),
      nomeMensagens: String(data.get("nomeMensagens") || "").trim(),
      horarioInicio: String(data.get("whatsappInicio") || "08:00"),
      horarioFim: String(data.get("whatsappFim") || "20:00"),
      lembreteHorasAntes: String(data.get("lembreteHorasAntes") || "24"),
      enviarConfirmacao: Boolean(data.get("enviarConfirmacao")),
      permitirCancelamento: Boolean(data.get("permitirCancelamento")),
      assinatura: String(data.get("assinatura") || "").trim(),
    };
    profile.primeiroPaciente = {
      nome: String(data.get("primeiroPacienteNome") || "").trim(),
      telefone: onlyDigits(data.get("primeiroPacienteTelefone")),
      usarTeste: Boolean(data.get("usarTeste")),
    };
    if (!profile.recebimentos.formasPagamento.length || !profile.whatsapp.numero || !profile.whatsapp.nomeMensagens) {
      showNotice("error", "Escolha uma forma de pagamento e informe os dados do WhatsApp.");
      return;
    }
    profile.completedAt = new Date().toISOString();
    saveOnboardingProfile(profile);
    saveReminderJobs(profile);
    localStorage.setItem(ONBOARDING_STEP_KEY, "4");
    state.user = { ...(state.user || {}), nomeCompleto: profile.conta.nomeCompleto, nomeExibicao: profile.conta.nomeExibicao, onboardingCompletedAt: profile.completedAt };
    renderOnboardingComplete(profile);
    return;
  }
  saveOnboardingProfile(profile);
  setOnboardingStep(step + 1);
  renderOnboarding();
}

function renderOnboardingComplete(profile: OnboardingProfile): void {
  if (!app) return;
  app.innerHTML = `
    <main class="register-commercial-shell onboarding-complete-shell">
      <section class="onboarding-complete-card">
        <div class="brand fisia-auth-brand">
          <div class="brand-mark" aria-hidden="true">F</div>
          <div>
            <p class="brand-title">FISIA</p>
            <div class="brand-subtitle">Voce cuida do paciente. A FISIA cuida da rotina.</div>
          </div>
        </div>
        <p class="eyebrow">Configuracao concluida</p>
        <h1>Tudo pronto. Vamos colocar sua clinica em movimento.</h1>
        <p>Seu painel ja pode usar a rotina de ${escapeHtml(profile.rotina.duracaoPadrao || "60")} minutos, recebimentos configurados e mensagens planejadas.</p>
        <div class="onboarding-complete-actions">
          <button class="primary-button" id="complete-first-patient" type="button">Cadastrar primeiro paciente</button>
          <button class="secondary-button" id="complete-invite-link" type="button">Gerar link de convite</button>
          <button class="ghost-button" id="complete-dashboard" type="button">Explorar a FISIA</button>
        </div>
      </section>
    </main>
  `;
  document.querySelector<HTMLButtonElement>("#complete-first-patient")?.addEventListener("click", async () => {
    setDocumentRoute("evolucoes");
    state.selectedPatientId = null;
    state.patientDrawerOpen = true;
    state.patientDrawerAnimate = true;
    await loadPacientes();
  });
  document.querySelector<HTMLButtonElement>("#complete-invite-link")?.addEventListener("click", () => {
    void navigator.clipboard?.writeText(`${window.location.origin}/cadastro`);
    const button = document.querySelector<HTMLButtonElement>("#complete-invite-link");
    if (button) button.textContent = "Link copiado";
  });
  document.querySelector<HTMLButtonElement>("#complete-dashboard")?.addEventListener("click", async () => {
    setDocumentRoute("dashboard");
    await loadDashboard();
  });
}

function renderDashboard(
  pacientes: Paciente[] = [],
  agenda: AgendaSlot[] = state.agenda,
  evolucoes: Evolucao[] = [],
  financeiro: Faturamento[] = [],
): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const hoje = todayISO();
  const agendaHoje = agenda.filter((slot) => slot.data === hoje);
  const dashboardMetrics = calculateDashboardMetrics(agenda, financeiro);
  const creditoTotal = pacientes.reduce((sum, patient) => sum + Number(patient.creditoDisponivel || 0), 0);
  const slotsAbertos = agendaHoje.filter((slot) => slot.status === "aberto").length;
  const agendaPendencias = agenda.filter((slot) => slot.temPendencia || slot.statusFinanceiro === "pendente");
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Inicio</h1>
        <p>Resumo carregado diretamente do backend local.</p>
      </div>
      <button class="secondary-button icon-only icon-refresh" id="refresh-dashboard" type="button" aria-label="Atualizar" title="Atualizar"></button>
    </header>
    <section class="stats-grid">
      <div class="stat"><span>Pacientes ativos</span><strong>${pacientes.filter((p) => p.ativo !== false).length}</strong></div>
      <div class="stat"><span>Atendimentos hoje</span><strong>${agendaHoje.length}</strong><small>${slotsAbertos} abertos</small></div>
      <div class="stat"><span>Pendencias</span><strong>${dashboardMetrics.pendenciasOperacionaisTotal}</strong><small>${dashboardMetrics.semEvolucaoCount} sem evolucao - ${dashboardMetrics.pagamentoPendenteCount} pagamento pendente</small></div>
      <div class="stat"><span>Financeiro do mes</span><strong>${formatMoney(dashboardMetrics.recebidoMes)}</strong><small>${dashboardMetrics.atendimentosRealizadosMes} atendimentos - ${formatMoney(dashboardMetrics.valorPendentePagamento)} a receber - Credito do paciente: ${formatMoney(creditoTotal)}</small></div>
    </section>
    <section class="grid-2">
      <div class="content-panel">
        <div class="section-title">
          <h2>Proximos atendimentos</h2>
          <button class="ghost-button" id="go-agenda" type="button">Abrir agenda</button>
        </div>
        <div class="agenda-list">
          ${agenda.slice(0, 6).map(eventCardHtml).join("") || `<div class="empty">Nenhum atendimento no periodo.</div>`}
        </div>
      </div>
      <div class="content-panel">
        <div class="section-title"><h2>Pendencias financeiras</h2></div>
        <div class="table-list">
          ${
            agendaPendencias
              .slice(0, 5)
              .map(
                (slot) => `
                  <div class="table-row">
                    <div><strong>${escapeHtml(slot.clientes?.[0]?.nomeCompleto || slot.servico || "-")}</strong><br><span class="muted">${formatDate(slot.data)} ${escapeHtml(slot.horaInicio)} &middot; ${formatMoney(slot.valorAtendimento || slot.clientes?.[0]?.valorAtendimento)}</span></div>
                    <span class="pill warn">${escapeHtml(slot.statusFinanceiro || "pendente")}</span>
                  </div>
                `,
              )
              .join("") || `<div class="empty">Nenhuma pendencia na agenda carregada.</div>`
          }
        </div>
      </div>
    </section>
    <section class="grid-2">
      <div class="content-panel">
        <div class="section-title"><h2>Ultimas evolucoes</h2></div>
        <div class="table-list">
          ${
            evolucoes
              .slice(0, 5)
              .map(
                (evo) => `
                  <div class="table-row">
                    <div><strong>${escapeHtml(evo.pacienteNome || "-")}</strong><br><span class="muted">${escapeHtml((evo.texto || "").slice(0, 90))}</span></div>
                    <span class="muted">${formatDate(evo.data)}</span>
                  </div>
                `,
              )
              .join("") || `<div class="empty">Nenhuma evolucao recente.</div>`
          }
        </div>
      </div>
      <div class="content-panel">
        <div class="section-title">
          <h2>Pacientes recentes</h2>
          <button class="ghost-button" id="go-pacientes" type="button">Abrir pacientes</button>
        </div>
        <div class="table-list">
          ${
            pacientes
              .slice(0, 5)
              .map(
                (patient) => `
                  <div class="table-row">
                    <div><strong>${escapeHtml(patient.nomeCompleto)}</strong><br><span class="muted">${escapeHtml(patient.telefone || "sem telefone")}</span></div>
                    <span class="muted">${formatMoney(patient.totalPendente)}</span>
                  </div>
                `,
              )
              .join("") || `<div class="empty">Nenhum paciente cadastrado.</div>`
          }
        </div>
      </div>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-dashboard")?.addEventListener("click", loadDashboard);
  document.querySelector<HTMLButtonElement>("#go-agenda")?.addEventListener("click", async () => {
    setDocumentRoute("agenda");
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#go-pacientes")?.addEventListener("click", async () => {
    setDocumentRoute("pacientes");
    await loadPacientes();
  });
}

function renderDashboardPro(
  pacientes: Paciente[] = state.pacientes,
  agenda: AgendaSlot[] = state.agenda,
  evolucoes: Evolucao[] = state.evolucoes,
  financeiro: Faturamento[] = state.financeiro,
): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const hoje = todayISO();
  const agendaHoje = agenda.filter((slot) => slot.data === hoje && !isCanceledStatus(slot.status));
  const slotsAbertos = agendaHoje.filter((slot) => normalizeStatus(slot.status) === "aberto").length;
  const metrics = calculateDashboardMetrics(agenda, financeiro);
  const nextSlot = nextAppointmentSlot(agenda);
  const firstName = String(state.user?.nomeExibicao || state.user?.nomeCompleto || "profissional").trim().split(/\s+/)[0];
  const pendingValue = metrics.valorPendentePagamento;
  const profile = loadOnboardingProfile();
  const setupStep = onboardingCurrentStep();
  const statusLabel = (value?: string) => {
    const normalized = normalizeStatus(value || "aberto");
    if (normalized === "concluido" || normalized === "completed") return "Concluido";
    if (normalized === "cancelado" || normalized === "cancelled") return "Cancelado";
    if (normalized === "confirmado" || normalized === "scheduled") return "Confirmado";
    return normalized === "aberto" ? "Aberto" : String(value || "Aberto");
  };
  const financeLabel = (slot: AgendaSlot) => isPaidStatus(slotFinancialStatus(slot)) ? "Pago" : "Pendente";
  const appointmentType = (slot: AgendaSlot) => state.appointmentTypes.find((type) => type.id === slot.tipoAtendimentoId)?.nome || slot.servico || "Presencial";
  const initials = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "P";
  const nextPatientName = nextSlot?.clientes?.[0]?.nomeCompleto || "Sem agendamento";
  const nextService = nextSlot?.servico || "Atendimento";
  const nextType = nextSlot ? appointmentType(nextSlot) : "Agenda livre";
  const nextDuration = nextSlot ? `${appointmentDurationMinutes(nextSlot)} min` : "0 min";
  const todayPercent = Math.min(100, Math.round((agendaHoje.length / Math.max(agendaHoje.length + slotsAbertos, 1)) * 100));
  const revenueGoal = Math.max(metrics.recebidoMes + pendingValue, metrics.recebidoMes, 1);
  const revenuePercent = Math.min(100, Math.round((metrics.recebidoMes / revenueGoal) * 100));
  const futureSlots = agenda.filter((slot) => slot.data >= hoje && !isCanceledStatus(slot.status)).length;
  const priorityItems = [
    {
      icon: "calendar",
      title: `${agenda.filter((slot) => slot.data >= hoje && normalizeStatus(slot.status) === "scheduled").length} agendamentos aguardando confirmacao`,
      detail: "Entre hoje e os proximos dias",
      action: "Precisam de atencao",
      tone: "warn",
      route: "agenda",
    },
    {
      icon: "pulse",
      title: `${metrics.semEvolucaoCount} evolucoes pendentes`,
      detail: "Atendimentos sem evolucao vinculada",
      action: "Hoje",
      tone: "info",
      route: "evolucoes",
    },
    {
      icon: "finance",
      title: `${metrics.pagamentoPendenteCount} recebimentos em aberto`,
      detail: `Total de ${formatMoney(pendingValue)}`,
      action: "Ver agora",
      tone: "success",
      route: "financeiro",
    },
    {
      icon: "cadastro",
      title: `${pacientes.filter((patient) => patient.ativo !== false).length} pacientes ativos`,
      detail: `${futureSlots} atendimento${futureSlots === 1 ? " futuro" : "s futuros"}`,
      action: "Ver pacientes",
      tone: "assistant",
      route: "evolucoes",
    },
    {
      icon: "reports",
      title: "Relatorios mensais disponiveis",
      detail: "Faturamento e atendimentos",
      action: "Acessar",
      tone: "gold",
      route: "relatorios",
    },
  ];
  view.innerHTML = `
    <div class="dashboard-v2 fisia-dashboard">
      <section class="fisia-dashboard-top">
        <article class="fisia-next-card">
          <header>
            <span>${navIcon("calendar")}</span>
            <strong>Proximo atendimento</strong>
          </header>
          <div class="fisia-next-body">
            <div class="fisia-next-time">
              <strong>${escapeHtml(nextSlot?.horaInicio || "--:--")}</strong>
              <span>${nextSlot ? `${formatDate(nextSlot.data)} · ${nextDuration}` : "Agenda livre"}</span>
            </div>
            <div class="fisia-next-patient">
              <i>${escapeHtml(initials(nextPatientName))}</i>
              <div>
                <strong>${escapeHtml(nextPatientName)}</strong>
                <span>${escapeHtml(nextService)} · ${escapeHtml(nextType)}</span>
              </div>
            </div>
            <div class="fisia-next-actions">
              <button class="primary-button" type="button" data-dashboard-route="agenda">Ver detalhes</button>
              <button class="ghost-button" type="button" data-dashboard-quick="attendance">Registrar atendimento</button>
            </div>
          </div>
          <footer>
            <span>${navIcon("calendar")} ${escapeHtml(nextDuration)}</span>
          </footer>
        </article>
        <button class="fisia-stat-card" type="button" data-dashboard-route="agenda">
          <span class="fisia-stat-icon">${navIcon("calendar")}</span>
          <strong>Atendimentos hoje</strong>
          <b>${agendaHoje.length}</b>
          <em>${todayPercent}% da agenda</em>
          <i style="--progress-width:${todayPercent}%"></i>
        </button>
        <button class="fisia-stat-card" type="button" data-dashboard-route="financeiro">
          <span class="fisia-stat-icon money">${navIcon("finance")}</span>
          <strong>Faturamento do mes</strong>
          <b>${formatMoney(metrics.recebidoMes)}</b>
          <em>${revenuePercent}% do previsto</em>
          <i style="--progress-width:${revenuePercent}%"></i>
        </button>
        <button class="fisia-stat-card" type="button" data-dashboard-route="evolucoes">
          <span class="fisia-stat-icon patients">${navIcon("cadastro")}</span>
          <strong>Pacientes ativos</strong>
          <b>${pacientes.filter((patient) => patient.ativo !== false).length}</b>
          <em>${futureSlots} atendimento${futureSlots === 1 ? " futuro" : "s futuros"}</em>
          <i style="--progress-width:${Math.min(100, pacientes.length * 4)}%"></i>
        </button>
      </section>

      <section class="fisia-dashboard-main">
        <section class="fisia-agenda-card">
          <header class="fisia-section-header">
            <div><span>${navIcon("calendar")}</span><h2>Agenda do dia</h2></div>
            <button class="ghost-button" id="dashboard-week" type="button">Ver agenda completa</button>
          </header>
          <div class="fisia-agenda-list">
            ${agendaHoje.length ? agendaHoje.map((slot) => {
            const patient = slot.clientes?.[0] || {};
            const patientName = patient.nomeCompleto || "Paciente";
            const financial = financeLabel(slot);
            const clinical = statusLabel(slot.status);
            const slotDuration = `${appointmentDurationMinutes(slot)} min`;
            return `<button class="fisia-agenda-item" type="button" data-dashboard-event="${escapeHtml(slot.id)}" data-dashboard-action="open">
              <time><strong>${escapeHtml(slot.horaInicio || "--:--")}</strong><span>${escapeHtml(slotDuration)}</span></time>
              <i class="${financial === "Pago" ? "ok" : clinical === "Confirmado" ? "ok" : "warn"}"></i>
              <span class="fisia-agenda-patient"><strong>${escapeHtml(patientName)}</strong><small>${escapeHtml(appointmentType(slot))} · ${escapeHtml(slot.servico || "Atendimento")}</small></span>
              <b class="status-chip ${financial === "Pago" ? "paid" : clinical === "Concluido" ? "done" : "pending"}">${escapeHtml(financial === "Pendente" ? "Pendente" : clinical)}</b>
              <span class="fisia-item-chevron">›</span>
            </button>`;
          }).join("") : `<div class="dashboard-agenda-empty">Nenhum atendimento programado para hoje.</div>`}
          </div>
          <button class="dashboard-all-appointments" id="dashboard-all-appointments" type="button">Ver todos os agendamentos</button>
        </section>

        <section class="fisia-priority-card">
          <header class="fisia-section-header">
            <div><span>${navIcon("assistant")}</span><h2>Prioridades</h2></div>
            <button class="ghost-button" id="dashboard-filters" type="button">Ver todas</button>
          </header>
          <div class="fisia-priority-list">
            ${priorityItems.map((item) => `
              <button class="fisia-priority-item ${escapeHtml(item.tone)}" type="button" data-dashboard-route="${escapeHtml(item.route)}">
                <span>${navIcon(item.icon)}</span>
                <strong>${escapeHtml(item.title)}<small>${escapeHtml(item.detail)}</small></strong>
                <em>${escapeHtml(item.action)}</em>
                <i>›</i>
              </button>
            `).join("")}
          </div>
        </section>
      </section>

      ${
        !isOnboardingComplete()
          ? `<section class="dashboard-setup-grid">
              <section class="dashboard-setup-form">
                <header><h2>Cadastro inicial</h2><p>Complete os dados usados para personalizar sua rotina.</p></header>
                <div class="setup-form-grid">
                  <label>Nome completo<input value="${escapeHtml(profile.conta.nomeCompleto || state.user?.nomeCompleto || "")}" placeholder="Ex.: Gabriel Vinicius da Silva" readonly></label>
                  <label>Nome de exibicao<input value="${escapeHtml(profile.conta.nomeExibicao || state.user?.nomeExibicao || "")}" placeholder="Ex.: Dr. Gabriel, CW Rehab" readonly></label>
                  <label>CPF<input value="${escapeHtml(formatCpf(profile.conta.cpf || state.user?.cpf || ""))}" placeholder="000.000.000-00" readonly></label>
                  <label>E-mail<input value="${escapeHtml(profile.conta.email || state.user?.email || "")}" placeholder="seu@email.com" readonly></label>
                  <label>WhatsApp<input value="${escapeHtml(maskRegisterPhone(profile.conta.telefone || state.user?.telefone || ""))}" placeholder="(11) 99999-9999" readonly></label>
                  <button class="primary-button setup-continue" id="dashboard-onboarding" type="button">Continuar</button>
                </div>
              </section>
              <aside class="dashboard-progress-card"><h2>Seu progresso</h2><p>${setupStep} de 5 completo</p><div class="progress-track"><i style="width:${Math.round((setupStep / 5) * 100)}%"></i></div>${["Dados pessoais", "Perfil profissional", "Agenda e atendimento", "Recebimentos e WhatsApp"].map((item, index) => `<div class="progress-step ${index + 1 < setupStep ? "done" : index + 1 === setupStep ? "active" : ""}"><b>${index + 1}</b><span>${escapeHtml(item)}<small>${index === 0 ? "Informacoes basicas da conta" : index === 1 ? "Formacao e especialidades" : index === 2 ? "Horarios e tipos de servico" : "Formas de pagamento e mensagens"}</small></span></div>`).join("")}</aside>
            </section>`
          : ""
      }
      ${state.selectedEventId ? dashboardAppointmentDrawerHtml() : ""}
    </div>
  `;
  view.querySelectorAll<HTMLButtonElement>("[data-dashboard-route]").forEach((button) => button.addEventListener("click", async () => { const route = button.dataset.dashboardRoute; setDocumentRoute(isAppRoute(route) ? route : "agenda"); await loadCurrentRoute(); }));
  view.querySelectorAll<HTMLButtonElement>("[data-dashboard-event]").forEach((button) => button.addEventListener("click", async () => {
    const eventId = button.dataset.dashboardEvent || "";
    const action = button.dataset.dashboardAction || "open";
    const slot = state.agenda.find((item) => item.id === eventId);
    if (!slot) return;
    if (action === "evolve") { setDocumentRoute("evolucoes"); state.selectedPatientId = slot.clientes?.[0]?.pacienteId || null; state.patientDrawerOpen = Boolean(state.selectedPatientId); state.registryTab = "evolucoes"; await loadEvolucoes(); return; }
    state.selectedEventId = eventId;
    state.appointmentTab = action === "receive" ? "financeiro" : "atendimento";
    renderDashboardPro(pacientes, agenda, evolucoes, financeiro);
  }));
  view.querySelectorAll<HTMLButtonElement>("[data-dashboard-quick]").forEach((button) => button.addEventListener("click", async () => {
    const quick = button.dataset.dashboardQuick;
    if (quick === "payment") { setDocumentRoute("financeiro"); await loadFinanceiro(); renderFinancePaymentModal(); return; }
    if (quick === "reports") { setDocumentRoute("relatorios"); await loadRelatorios(); return; }
    setDocumentRoute("evolucoes"); state.registryTab = quick === "evolution" ? "evolucoes" : "resumo"; await loadEvolucoes();
  }));
  view.querySelector<HTMLButtonElement>("#dashboard-week")?.addEventListener("click", async () => { setDocumentRoute("agenda"); await loadAgenda(); });
  view.querySelector<HTMLButtonElement>("#dashboard-filters")?.addEventListener("click", async () => { setDocumentRoute("agenda"); await loadAgenda(); });
  view.querySelector<HTMLButtonElement>("#dashboard-all-appointments")?.addEventListener("click", async () => { setDocumentRoute("agenda"); await loadAgenda(); });
  view.querySelector<HTMLButtonElement>("#dashboard-onboarding")?.addEventListener("click", () => { setDocumentRoute("onboarding"); });
  bindAppointmentDrawerActions(() => loadDashboard(), () => renderDashboardPro(pacientes, agenda, evolucoes, financeiro));
}

function renderDashboardLegacy(
  pacientes: Paciente[] = state.pacientes,
  agenda: AgendaSlot[] = state.agenda,
  evolucoes: Evolucao[] = state.evolucoes,
  financeiro: Faturamento[] = state.financeiro,
): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const hoje = todayISO();
  const agendaHoje = agenda.filter((slot) => slot.data === hoje);
  const dashboardMetrics = calculateDashboardMetrics(agenda, financeiro);
  const slotsAbertos = agendaHoje.filter((slot) => slot.status === "aberto").length;
  const creditoTotal = pacientes.reduce((sum, patient) => sum + Number(patient.creditoDisponivel || 0), 0);
  const nextSlot = nextAppointmentSlot(agenda);
  const activePatientsCount = pacientes.filter((patient) => patient.ativo !== false).length;
  view.innerHTML = `
    <div class="dashboard-screen ${state.dashboardCardsCollapsed ? "dashboard-compact" : ""}">
    <header class="page-header product-header">
      <div>
        <h1>Hoje</h1>
        <p>${formatDate(hoje)} &middot; operacao clinica em tempo real</p>
      </div>
      <div class="button-row">
        <button class="primary-button" id="new-appointment-dashboard" type="button">Agendar</button>
        <button class="primary-button" id="new-client-dashboard" type="button">Novo Cadastro</button>
        <button class="secondary-button icon-only dashboard-compact-toggle ${state.dashboardCardsCollapsed ? "icon-expand" : "icon-collapse"}" id="toggle-dashboard-cards" type="button" aria-label="${state.dashboardCardsCollapsed ? "Expandir cards" : "Minimizar cards"}" title="${state.dashboardCardsCollapsed ? "Expandir cards" : "Minimizar cards"}"></button>
        <button class="secondary-button icon-only icon-refresh" id="refresh-dashboard" type="button" aria-label="Atualizar" title="Atualizar"></button>
      </div>
    </header>
    <section class="metric-strip">
      <button class="metric metric-action-card" type="button" data-dashboard-route="agenda"><span>Atendimentos hoje</span><strong>${agendaHoje.length}</strong><small>${slotsAbertos} abertos</small></button>
      <button class="metric metric-action-card" type="button" data-dashboard-route="agenda"><span>Proximo horario</span>${dashboardNextAppointmentHtml(nextSlot, hoje)}</button>
      <button class="metric metric-action-card" type="button" data-dashboard-route="agenda"><span>Pendencias</span><strong>${dashboardMetrics.pendenciasOperacionaisTotal}</strong><small>${dashboardMetrics.semEvolucaoCount} sem evolucao - ${dashboardMetrics.pagamentoPendenteCount} pagamento pendente</small></button>
      <button class="metric metric-action-card" type="button" data-dashboard-route="financeiro"><span>Financeiro do mes</span><strong>${formatMoney(dashboardMetrics.recebidoMes)}</strong><small>${dashboardMetrics.atendimentosRealizadosMes} atendimentos - ${formatMoney(dashboardMetrics.valorPendentePagamento)} a receber</small></button>
    </section>
    <section class="today-layout">
      ${dashboardSectionHtml(
        "today",
        "Agenda de hoje",
        `
          <div class="data-table agenda-table desktop-agenda-table">
            <div class="data-row data-head"><span>Horario</span><span>Paciente</span><span>Servico</span><span>Status</span><span>Financeiro</span></div>
            ${
              agendaHoje
                .map((slot) => {
                  const client = slot.clientes?.[0] || {};
                  return `
                    <div class="data-row clickable-row" data-event-id="${escapeHtml(slot.id)}" role="button" tabindex="0">
                      <strong>${escapeHtml(slot.horaInicio || "--:--")}</strong>
                      <span>${escapeHtml(client.nomeCompleto || "-")}</span>
                      <span>${escapeHtml(slot.servico || "Fisioterapia")}</span>
                      <span class="pill ${slot.status === "concluido" ? "ok" : slot.status === "cancelado" ? "warn" : ""}">${escapeHtml(slot.status || "aberto")}</span>
                      <span class="pill ${slot.statusFinanceiro === "pago" ? "ok" : "warn"}">${escapeHtml(slot.statusFinanceiro || client.statusFinanceiro || "pendente")}</span>
                    </div>
                  `;
                })
                .join("") || `<div class="empty">Nenhum atendimento programado para hoje.</div>`
            }
          </div>
          <div class="today-mobile-list">${dashboardTodayListHtml(agendaHoje)}</div>
        `,
        {
          count: agendaHoje.length,
          className: "data-section dashboard-today-section",
          extraHeader: `<button class="ghost-button" id="go-agenda" type="button">Ver tudo</button>`,
        },
      )}
      ${dashboardSectionHtml(
        "pending",
        "Pendencias",
        dashboardPendingListHtml(agenda, dashboardMetrics),
        { count: dashboardMetrics.pendenciasOperacionaisTotal, className: "dashboard-pending-section" },
      )}
    </section>
    <section class="dashboard-secondary">
      ${dashboardSectionHtml(
        "patients",
        "Pacientes ativos",
        `
          <div class="dashboard-count-block">
            <strong>${activePatientsCount}</strong>
            <span>Pacientes ativos no sistema</span>
            <button class="ghost-button" id="go-patient-list" type="button">Abrir lista</button>
          </div>
        `,
        { count: activePatientsCount },
      )}
      ${dashboardSectionHtml(
        "quick",
        "Ultimas acoes",
        `
          <div class="table-list dashboard-actions-list">
            ${dashboardRecentActionsHtml(agenda, financeiro, evolucoes)}
          </div>
          <div class="detail-row"><span>Credito do paciente em conta</span><strong>${formatMoney(creditoTotal)}</strong></div>
        `,
        { summary: `Credito do paciente total ${formatMoney(creditoTotal)}` },
      )}
    </section>
    ${state.selectedEventId ? dashboardAppointmentDrawerHtml() : ""}
    </div>
  `;
  document.querySelector<HTMLButtonElement>("#toggle-dashboard-cards")?.addEventListener("click", () => {
    state.dashboardCardsCollapsed = !state.dashboardCardsCollapsed;
    saveBooleanPreference(DASHBOARD_CARDS_COLLAPSED_KEY, state.dashboardCardsCollapsed);
    (["today", "pending", "patients", "quick"] as DashboardSectionKey[]).forEach((section) => {
      saveDashboardSectionPreference(section, state.dashboardCardsCollapsed);
    });
    renderDashboardPro(pacientes, agenda, evolucoes, financeiro);
  });
  view.querySelectorAll<HTMLButtonElement>("[data-toggle-dashboard-section]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.toggleDashboardSection as DashboardSectionKey;
      if (!section) return;
      saveDashboardSectionPreference(section, !state.dashboardCollapsedSections[section]);
      state.dashboardCardsCollapsed = (["today", "pending", "patients", "quick"] as DashboardSectionKey[]).every(
        (key) => state.dashboardCollapsedSections[key],
      );
      saveBooleanPreference(DASHBOARD_CARDS_COLLAPSED_KEY, state.dashboardCardsCollapsed);
      renderDashboardPro(pacientes, agenda, evolucoes, financeiro);
    });
  });
  document.querySelector<HTMLButtonElement>("#refresh-dashboard")?.addEventListener("click", loadDashboard);
  view.querySelectorAll<HTMLButtonElement>("[data-dashboard-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const route = button.dataset.dashboardRoute;
      setDocumentRoute(isAppRoute(route) ? route : "dashboard");
      await loadCurrentRoute();
    });
  });
  document.querySelector<HTMLButtonElement>("#go-agenda")?.addEventListener("click", async () => {
    setDocumentRoute("agenda");
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#new-appointment-dashboard")?.addEventListener("click", async () => {
    setDocumentRoute("agenda");
    state.appointmentDrawerOpen = true;
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#new-client-dashboard")?.addEventListener("click", async () => {
    setDocumentRoute("evolucoes");
    state.selectedPatientId = null;
    state.registryTab = "cadastro";
    state.patientDrawerOpen = true;
    await loadEvolucoes();
  });
  document.querySelector<HTMLButtonElement>("#go-patient-list")?.addEventListener("click", async () => {
    setDocumentRoute("pacientes");
    await loadPacientes();
  });
  view.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(isAppRoute(nextRoute) ? nextRoute : "dashboard");
      await loadCurrentRoute();
    });
  });
  bindAppointmentCards(() => renderDashboardPro());
  bindAppointmentDrawerActions(
    () => loadDashboard(),
    () => renderDashboardPro(),
  );
  window.requestAnimationFrame(scrollAgendaToCurrentHour);
}

function dashboardAppointmentDrawerHtml(): string {
  const selected = state.agenda.find((slot) => slot.id === state.selectedEventId) || null;
  if (!selected) return "";
  return `<div class="drawer-backdrop" data-close-drawer="true"></div><aside class="appointment-drawer" aria-label="Detalhes do atendimento">${eventDetailHtml(selected)}</aside>`;
}

function bindAppointmentCards(rerender: () => void): void {
  document.querySelectorAll<HTMLButtonElement>("[data-event-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedEventId = button.dataset.eventId || null;
      state.appointmentTab = "atendimento";
      state.appointmentDrawerOpen = false;
      rerender();
    });
  });
}

function bindAppointmentDrawerActions(reload: () => Promise<void>, rerender: () => void): void {
  const selected = state.agenda.find((slot) => slot.id === state.selectedEventId) || null;
  document.querySelectorAll<HTMLButtonElement>("[data-appointment-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTab = button.dataset.appointmentTab as AppState["appointmentTab"];
      state.appointmentTab = nextTab || "atendimento";
      rerender();
    });
  });
  document.querySelectorAll<HTMLElement>("[data-close-drawer]").forEach((element) => {
    element.addEventListener("click", () => {
      state.selectedEventId = null;
      state.appointmentDrawerOpen = false;
      state.appointmentDraftPatientId = null;
      state.appointmentTab = "atendimento";
      rerender();
    });
  });
  document.querySelector<HTMLButtonElement>("#cancel-event")?.addEventListener("click", async () => {
    if (!selected?.id || !confirm("Cancelar este atendimento?")) return;
    await sendJson(`/api/web/agenda/${encodeURIComponent(selected.id)}/cancelar`);
    await reload();
  });
  document.querySelector<HTMLButtonElement>("#complete-event")?.addEventListener("click", async () => {
    if (!selected?.id) return;
    await sendJson(`/api/web/agenda/${encodeURIComponent(selected.id)}/concluir`);
    await reload();
  });
  document.querySelector<HTMLFormElement>("#reschedule-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!selected?.id) return;
    const data = new FormData(event.currentTarget);
    await sendJson(`/api/web/agenda/${encodeURIComponent(selected.id)}/reagendar`, {
      data: String(data.get("data") || ""),
      horaInicio: String(data.get("horaInicio") || ""),
      horaFim: String(data.get("horaFim") || ""),
    });
    await reload();
  });
  const rescheduleForm = document.querySelector<HTMLFormElement>("#reschedule-form");
  if (rescheduleForm) bindAutoEndTime(rescheduleForm);
  document.querySelector<HTMLFormElement>("#appointment-payment-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!selected?.id) return;
    const data = new FormData(event.currentTarget);
    await saveAppointmentPayment(selected.id, {
      valor: parseMoneyInput(data.get("valor")),
      formaPagamento: String(data.get("formaPagamento") || "pix"),
      observacao: String(data.get("observacao") || "").trim(),
    }, reload, rerender);
  });
  document.querySelector<HTMLButtonElement>("#use-credit-payment")?.addEventListener("click", async () => {
    if (!selected?.id) return;
    await saveAppointmentPayment(selected.id, { usarCredito: true }, reload, rerender);
  });
}

function compactEvolutionRowHtml(evo: Evolucao): string {
  return `
    <div class="table-row compact-row">
      <div><strong>${escapeHtml(evo.pacienteNome || "-")}</strong><br><span class="muted">${escapeHtml((evo.texto || "").slice(0, 86))}</span></div>
      <span class="muted">${formatDate(evo.data)}</span>
    </div>
  `;
}

function compactPatientRowHtml(patient: Paciente): string {
  return `
    <div class="table-row compact-row">
      <div><strong>${escapeHtml(patient.nomeCompleto)}</strong><br><span class="muted">${escapeHtml(patient.telefone || "sem telefone")}</span></div>
      <span class="muted">${formatMoney(patient.totalPendente)}</span>
    </div>
  `;
}

function dashboardSectionHtml(
  section: DashboardSectionKey,
  title: string,
  bodyHtml: string,
  options: { count?: number | string; summary?: string; extraHeader?: string; className?: string } = {},
): string {
  const collapsed = state.dashboardCollapsedSections[section];
  return `
    <section class="content-panel dashboard-card-section ${options.className || ""} ${collapsed ? "is-collapsed" : ""}" data-dashboard-section="${section}">
      <div class="section-title dashboard-section-title">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${options.summary ? `<small>${escapeHtml(options.summary)}</small>` : ""}
        </div>
        <div class="section-actions">
          ${options.count !== undefined ? `<span class="pill">${escapeHtml(options.count)}</span>` : ""}
          ${options.extraHeader || ""}
          <button class="ghost-button icon-only section-collapse-button ${collapsed ? "icon-expand" : "icon-collapse"}" type="button" data-toggle-dashboard-section="${section}" aria-expanded="${collapsed ? "false" : "true"}" aria-label="${collapsed ? "Expandir" : "Minimizar"}" title="${collapsed ? "Expandir" : "Minimizar"}"></button>
        </div>
      </div>
      <div class="dashboard-section-body">${bodyHtml}</div>
    </section>
  `;
}

function dashboardTodayListHtml(slots: AgendaSlot[]): string {
  if (!slots.length) return `<div class="empty">Nenhum atendimento para hoje.</div>`;
  return slots
    .map((slot) => {
      const client = slot.clientes?.[0] || {};
      const clinical = slot.status || "aberto";
      const financial = slot.statusFinanceiro || client.statusFinanceiro || "pendente";
      return `
        <button class="today-appointment-item" type="button" data-event-id="${escapeHtml(slot.id)}">
          <strong>${escapeHtml(slot.horaInicio || "--:--")}</strong>
          <span>${escapeHtml(client.nomeCompleto || "-")}</span>
          <div>
            <span class="pill ${clinical === "concluido" ? "ok" : clinical === "cancelado" ? "warn" : ""}">${escapeHtml(clinical)}</span>
            <span class="pill ${financial === "pago" ? "ok" : "warn"}">${escapeHtml(financial)}</span>
          </div>
        </button>
      `;
    })
    .join("");
}

function dashboardPendingListHtml(slots: AgendaSlot[], metrics: DashboardMetrics): string {
  const items = slots
    .filter((slot) => !isCanceledStatus(slot.status))
    .flatMap((slot) => {
      const patientName = slot.clientes?.[0]?.nomeCompleto || "Paciente";
      const label = `${patientName} - ${formatDate(slot.data)} ${slot.horaInicio || ""}`.trim();
      const pendingItems: Array<{ type: string; text: string; eventId: string }> = [];
      if (!slotHasEvolution(slot)) {
        pendingItems.push({ type: "evolucao_pendente", text: `${label}: registrar evolucao`, eventId: slot.id });
      }
      if (!isPaidStatus(slotFinancialStatus(slot))) {
        pendingItems.push({ type: "pagamento_pendente", text: `${label}: resolver pagamento`, eventId: slot.id });
      }
      return pendingItems;
    })
    .slice(0, 4);
  if (!items.length) {
    return `<div class="empty">Nenhuma pendencia operacional.</div>`;
  }
  return `
    <div class="table-list pending-list">
      ${items
        .map(
          (item) => `
            <button class="pending-card" type="button" data-event-id="${escapeHtml(item.eventId)}">
              <span class="eyebrow">${escapeHtml(item.type)}</span>
              <strong>${escapeHtml(item.text)}</strong>
            </button>
          `,
        )
        .join("")}
    </div>
    <div class="detail-row">
      <span>Total</span>
      <strong>${metrics.semEvolucaoCount} sem evolucao - ${metrics.pagamentoPendenteCount} pagamento pendente</strong>
    </div>
  `;
}

function dashboardRecentActionsHtml(agenda: AgendaSlot[], financeiro: Faturamento[], evolucoes: Evolucao[]): string {
  const actions = [
    ...financeiro.slice(0, 4).map((item) => ({
      date: item.dataPagamento || item.data || "",
      status: isPaidStatus(item.statusFinanceiro) ? "ok" : "warn",
      title: `${item.nomeCompleto || "Paciente"} - ${formatMoney(item.valorPago || item.valorAtendimento)}`,
      detail: `financeiro - ${paymentMethodLabel(item.formaPagamento)}`,
    })),
    ...evolucoes.slice(0, 4).map((item) => ({
      date: item.data || "",
      status: "ok",
      title: `${item.pacienteNome || "Paciente"} - evolucao`,
      detail: (item.texto || item.conduta || "registro clinico").slice(0, 80),
    })),
    ...agenda.slice(0, 4).map((slot) => ({
      date: slot.data,
      status: slot.status === "cancelado" ? "warn" : "info",
      title: `${slot.clientes?.[0]?.nomeCompleto || "Paciente"} - ${slot.horaInicio || "--:--"}`,
      detail: `agenda - ${slot.status || "aberto"}`,
    })),
  ]
    .filter((item) => item.title.trim())
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 5);
  if (!actions.length) {
    return `<div class="empty">Nenhuma acao recente.</div>`;
  }
  return actions
    .map(
      (item) => `
        <div class="action-row">
          <span class="action-dot ${escapeHtml(item.status)}"></span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <small>${escapeHtml(item.detail)}</small>
          </div>
        </div>
      `,
    )
    .join("");
}

async function loadPacientes(): Promise<void> {
  renderPacientes(true);
  try {
    const suffix = state.patientSearch ? `?q=${encodeURIComponent(state.patientSearch)}` : "";
    state.pacientes = await fetchJson<Paciente[]>(`/api/web/pacientes${suffix}`);
    state.selectedPatientId =
      state.selectedPatientId && state.pacientes.some((patient) => patient.id === state.selectedPatientId)
        ? state.selectedPatientId
        : state.pacientes[0]?.id || null;
    await loadSelectedPatientDetails();
    renderPacientes();
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar pacientes: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

async function loadSelectedPatientDetails(): Promise<void> {
  if (!state.selectedPatientId) {
    state.patientFinance = [];
    state.patientEvolutions = [];
    state.patientEvaluations = [];
    return;
  }
  const patientId = encodeURIComponent(state.selectedPatientId);
  const [finance, evolutions, evaluations] = await Promise.allSettled([
    fetchJson<Faturamento[]>(`/api/web/pacientes/${patientId}/financeiro`),
    fetchJson<Evolucao[]>(`/api/web/pacientes/${patientId}/evolucoes`),
    fetchJson<Avaliacao[]>(`/api/web/pacientes/${patientId}/avaliacoes`),
  ]);
  state.patientFinance = finance.status === "fulfilled" ? finance.value : [];
  state.patientEvolutions = evolutions.status === "fulfilled" ? evolutions.value : [];
  state.patientEvaluations = evaluations.status === "fulfilled" ? evaluations.value : [];
}

function renderPacientes(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const selected = state.pacientes.find((patient) => patient.id === state.selectedPatientId) || null;
  const sortedPatients = sortedPatientList(
    state.patientSearch
      ? state.pacientes.filter((patient) =>
          [patient.nomeCompleto, patient.nomeSocial, patient.telefone, patient.cpf]
            .join(" ")
            .toLowerCase()
            .includes(state.patientSearch.toLowerCase()),
        )
      : state.pacientes,
  );
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Pacientes</h1>
        <p>Lista operacional com abertura rapida da ficha completa.</p>
      </div>
      <button class="primary-button" id="new-patient" type="button">Novo Cliente</button>
    </header>
    <section class="content-panel">
      <div id="patient-notice" class="notice" role="status"></div>
      <div class="agenda-toolbar">
        <label>Busca manual
          <input id="patient-search" type="text" value="${escapeHtml(state.patientSearch)}" placeholder="Nome, telefone ou CPF" />
        </label>
        <button class="primary-button" id="apply-patient-search" type="button">Buscar</button>
        <button class="ghost-button" id="clear-patient-search" type="button">Limpar</button>
      </div>
      ${loading ? `<div class="loading">Carregando pacientes...</div>` : ""}
      <div class="patient-card-list patient-card-list-wide">
        ${sortedPatients.map(patientRowHtml).join("") || `<div class="empty">Nenhum paciente encontrado.</div>`}
      </div>
    </section>
    ${selected && state.patientDrawerOpen ? patientProfileDrawerHtml(selected) : ""}
    ${!selected && state.patientDrawerOpen ? newClientDrawerHtml() : ""}
    ${state.appointmentDrawerOpen ? newAppointmentDrawerHtml() : ""}
  `;
  document.querySelector<HTMLButtonElement>("#apply-patient-search")?.addEventListener("click", async () => {
    state.patientSearch = document.querySelector<HTMLInputElement>("#patient-search")?.value.trim() || "";
    state.selectedPatientId = null;
    await loadPacientes();
  });
  document.querySelector<HTMLInputElement>("#patient-search")?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    state.patientSearch = event.currentTarget.value.trim();
    state.selectedPatientId = null;
    await loadPacientes();
  });
  document.querySelector<HTMLButtonElement>("#clear-patient-search")?.addEventListener("click", async () => {
    state.patientSearch = "";
    state.selectedPatientId = null;
    await loadPacientes();
  });
  document.querySelector<HTMLButtonElement>("#new-patient")?.addEventListener("click", () => {
    state.selectedPatientId = null;
    state.registryTab = "cadastro";
    state.patientDrawerOpen = true;
    state.patientDrawerAnimate = true;
    renderPacientes();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-patient-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPatientId = button.dataset.patientId || null;
      state.registryTab = "resumo";
      state.patientDrawerOpen = true;
      state.patientDrawerAnimate = true;
      void loadSelectedPatientDetails().then(() => renderPacientes());
    });
  });
  document.querySelectorAll<HTMLButtonElement>("[data-registry-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.registryTab = (button.dataset.registryTab as AppState["registryTab"]) || "resumo";
      state.patientDrawerAnimate = false;
      renderPacientes();
    });
  });
  document.querySelector<HTMLFormElement>("#patient-form")?.addEventListener("submit", handlePatientSubmit);
  document.querySelector<HTMLFormElement>("#evaluation-form")?.addEventListener("submit", handleEvaluationSubmit);
  document.querySelectorAll<HTMLButtonElement>("[data-duplicate-evaluation]").forEach((button) => {
    button.addEventListener("click", () => handleDuplicateEvaluation(button.dataset.duplicateEvaluation || ""));
  });
  document.querySelectorAll<HTMLButtonElement>("[data-summary-evaluation]").forEach((button) => {
    button.addEventListener("click", () => handleEvaluationSummary(button.dataset.summaryEvaluation || ""));
  });
  bindCpfMasks(document);
  document.querySelector<HTMLButtonElement>("#delete-patient")?.addEventListener("click", handlePatientDelete);
  document.querySelectorAll<HTMLButtonElement>("[data-delete-patient]").forEach((button) => {
    button.addEventListener("click", handlePatientDelete);
  });
  document.querySelectorAll<HTMLElement>("[data-close-patient-drawer]").forEach((element) => {
    element.addEventListener("click", () => {
      state.patientDrawerOpen = false;
      renderPacientes();
    });
  });
  document.querySelector<HTMLButtonElement>("[data-retro-attendance]")?.addEventListener("click", () => {
    if (selected) renderRetroAttendanceModal(selected);
  });
  document.querySelector<HTMLButtonElement>("[data-schedule-patient]")?.addEventListener("click", (event) => {
    const patientId = (event.currentTarget as HTMLButtonElement).dataset.schedulePatient || selected?.id || "";
    state.appointmentDraftPatientId = patientId;
    state.patientDrawerOpen = false;
    state.selectedEventId = null;
    state.appointmentDrawerOpen = true;
    renderEvolucoes();
  });
}

function patientInitial(patient: Paciente): string {
  return escapeHtml((patient.nomeSocial || patient.nomeCompleto || "P").slice(0, 1).toUpperCase());
}

function patientAgeGender(patient: Paciente): string {
  const parts = [patient.idade ? `${patient.idade} anos` : "", patient.genero || ""].filter(Boolean);
  return parts.join(" - ") || "Ficha incompleta";
}

function patientPendingFlags(patient: Paciente): string {
  const slots = state.agenda.filter((slot) => slotMatchesPatient(slot, patient));
  const hasOpenEvolution = slots.some((slot) => slot.status !== "cancelado" && !slot.temEvolucao);
  const hasOpenPayment = Number(patient.totalPendente || 0) > 0 || slots.some((slot) => appointmentFinanceStatus(slot) !== "pago" && slot.temEvolucao);
  return `
    <span class="patient-flags" aria-label="Pendencias do paciente">
      ${hasOpenEvolution ? `<span class="flag-dot danger" title="Atendimento aberto sem evolucao">!</span>` : ""}
      ${hasOpenPayment ? `<span class="flag-dot info" title="Pagamento pendente">!</span>` : ""}
    </span>
  `;
}

function patientAvatarHtml(patient: Paciente, large = false): string {
  return `<span class="patient-avatar ${large ? "large" : ""}">
    ${patient.fotoUrl ? `<img src="${escapeHtml(patient.fotoUrl)}" alt="Foto de ${escapeHtml(patient.nomeCompleto)}" />` : `<span>${patientInitial(patient)}</span>`}
  </span>`;
}

function patientRowHtml(patient: Paciente): string {
  const selected = patient.id === state.selectedPatientId;
  return `
    <button class="patient-row patient-profile-card ${selected ? "selected" : ""}" type="button" data-patient-id="${escapeHtml(patient.id)}">
      ${patientAvatarHtml(patient)}
      <span class="patient-card-main">
        <strong>${escapeHtml(patient.nomeCompleto || "-")}</strong>
        <small>${escapeHtml(patientAgeGender(patient))}</small>
        <em>${escapeHtml(patient.telefone || "sem telefone")}</em>
      </span>
      <span class="patient-card-actions">
        ${patientPendingFlags(patient)}
        <span class="pill ${patient.ativo === false ? "warn" : "ok"}">${patient.ativo === false ? "inativo" : "ativo"}</span>
        <strong>Abrir paciente</strong>
      </span>
    </button>
  `;
}

function patientFormHtml(patient: Paciente | null): string {
  const isEdit = Boolean(patient?.id);
  return `
    <form id="patient-form" class="form-grid">
      <input type="hidden" name="id" value="${escapeHtml(patient?.id || "")}" />
      <div class="section-title">
        <h2>${isEdit ? "Editar cadastro" : "Novo cadastro"}</h2>
        ${isEdit ? `<span class="pill">${escapeHtml(patient?.id)}</span>` : ""}
      </div>
      <div id="patient-notice" class="notice" role="status"></div>
      ${patientCadastroSectionsHtml(patient)}
      <div class="button-row">
        <button class="primary-button" type="submit">${isEdit ? "Salvar alteracoes" : "Cadastrar paciente"}</button>
        ${isEdit ? `<button class="ghost-button danger-button" id="delete-patient" type="button">Excluir definitivamente</button>` : ""}
      </div>
    </form>
  `;
}

function formSectionHtml(title: string, body: string, open = false): string {
  return `<details class="patient-form-section" ${open ? "open" : ""}>
    <summary><span>${title}</span></summary>
    <div class="patient-form-section-body">${body}</div>
  </details>`;
}

function patientCadastroSectionsHtml(patient: Paciente | null): string {
  const identification = `
    <div class="patient-photo-uploader">
      ${patient?.fotoUrl ? `<img src="${escapeHtml(patient.fotoUrl)}" alt="Foto do paciente" />` : `<span>${escapeHtml((patient?.nomeCompleto || "P").slice(0, 1).toUpperCase())}</span>`}
      <div class="patient-photo-content">
        <strong>Foto do paciente</strong>
        <label class="photo-upload-action">
          <input name="fotoUpload" type="file" accept="image/*" />
          <span>Escolher foto</span>
          <small>JPG, PNG ou WebP ate 12 MB</small>
        </label>
        <p class="form-helper">A imagem e reduzida automaticamente para 480x480 antes de salvar.</p>
      </div>
    </div>
    <label>Nome completo
      <input name="nomeCompleto" type="text" value="${escapeHtml(patient?.nomeCompleto || "")}" required />
    </label>
    <label>Nome social
      <input name="nomeSocial" type="text" value="${escapeHtml(patient?.nomeSocial || "")}" />
    </label>
    <div class="form-columns">
      <label>CPF
        <input name="cpf" type="text" inputmode="numeric" value="${escapeHtml(formatCpf(patient?.cpf || ""))}" />
      </label>
      <label>Data de nascimento
        <input name="dataNascimento" type="date" value="${escapeHtml(patient?.dataNascimento || "")}" />
      </label>
    </div>
    <div class="form-columns">
      <label>Idade calculada
        <input type="text" value="${escapeHtml(patient?.idade || "")}" disabled />
      </label>
      <label>Genero / sexo
        <input name="genero" type="text" value="${escapeHtml(patient?.genero || "")}" />
      </label>
    </div>
  `;
  const contact = `
    <div class="form-columns">
      <label>Telefone principal
        <input name="telefone" type="text" value="${escapeHtml(patient?.telefone || "")}" />
      </label>
      <label>WhatsApp
        <input name="telefoneCelular" type="text" value="${escapeHtml(patient?.telefoneCelular || "")}" />
      </label>
    </div>
    <label>E-mail
      <input name="email" type="email" value="${escapeHtml(patient?.email || "")}" />
    </label>
    <div class="form-columns">
      <label>Telefone residencial
        <input name="telefoneResidencial" type="text" value="${escapeHtml(patient?.telefoneResidencial || "")}" />
      </label>
      <label>Telefone comercial
        <input name="telefoneComercial" type="text" value="${escapeHtml(patient?.telefoneComercial || "")}" />
      </label>
    </div>
    <div class="form-columns">
      <label>Contato de emergencia
        <input name="contatoEmergenciaNome" type="text" value="${escapeHtml(patient?.contatoEmergenciaNome || "")}" />
      </label>
      <label>Telefone emergencia
        <input name="contatoEmergenciaTelefone" type="text" value="${escapeHtml(patient?.contatoEmergenciaTelefone || "")}" />
      </label>
    </div>
  `;
  const address = `
    <div class="form-columns">
      <label>CEP
        <input name="cep" type="text" value="${escapeHtml(patient?.cep || "")}" />
      </label>
      <label>Municipio
        <input name="municipio" type="text" value="${escapeHtml(patient?.municipio || "")}" />
      </label>
    </div>
    <label>Endereco completo
      <input name="endereco" type="text" value="${escapeHtml(patient?.endereco || "")}" />
    </label>
    <div class="form-columns">
      <label>Naturalidade
        <input name="naturalidade" type="text" value="${escapeHtml(patient?.naturalidade || "")}" />
      </label>
      <label>Nacionalidade
        <input name="nacionalidade" type="text" value="${escapeHtml(patient?.nacionalidade || "")}" />
      </label>
    </div>
  `;
  const social = `
    <div class="form-columns">
      <label>Estado civil
        <input name="estadoCivil" type="text" value="${escapeHtml(patient?.estadoCivil || "")}" />
      </label>
      <label>Profissao / ocupacao
        <input name="profissaoOcupacao" type="text" value="${escapeHtml(patient?.profissaoOcupacao || "")}" />
      </label>
    </div>
    <label>Escolaridade
      <input name="escolaridade" type="text" value="${escapeHtml(patient?.escolaridade || "")}" />
    </label>
  `;
  const admin = `
    <div class="form-columns">
      <label>Profissional / avaliador
        <input name="profissionalAvaliador" type="text" value="${escapeHtml(patient?.profissionalAvaliador || "")}" />
      </label>
      <label>Registro profissional / CREFITO
        <input name="registroProfissional" type="text" value="${escapeHtml(patient?.registroProfissional || "")}" />
      </label>
    </div>
    <div class="form-columns">
      <label>Data da avaliacao
        <input name="dataAvaliacao" type="date" value="${escapeHtml(patient?.dataAvaliacao || "")}" />
      </label>
      <label>Convenio / plano
        <input name="convenioPlano" type="text" value="${escapeHtml(patient?.convenioPlano || "")}" />
      </label>
    </div>
    <div class="form-columns">
      <label>Carteirinha
        <input name="numeroCarteirinha" type="text" value="${escapeHtml(patient?.numeroCarteirinha || "")}" />
      </label>
      <label>CID
        <input name="cid" type="text" value="${escapeHtml(patient?.cid || "")}" />
      </label>
    </div>
    <label>Encaminhamento
      <input name="encaminhamento" type="text" value="${escapeHtml(patient?.encaminhamento || "")}" />
    </label>
    <label>Profissional solicitante
      <input name="profissionalSolicitante" type="text" value="${escapeHtml(patient?.profissionalSolicitante || "")}" />
    </label>
    <label>Observacoes
      <textarea name="observacoes" rows="4">${escapeHtml(patient?.observacoes || "")}</textarea>
    </label>
  `;
  const finance = `
    <div class="form-columns">
      <label>Valor padrao
        <input name="valorPadraoAtendimento" type="text" inputmode="decimal" value="${escapeHtml(patient?.valorPadraoAtendimento ?? "")}" />
      </label>
      <input name="fotoUrl" type="hidden" value="${escapeHtml(patient?.fotoUrl || "")}" />
    </div>
    <label class="check-row">
      <input name="usaValorGlobal" type="checkbox" ${patient?.usaValorGlobal === false ? "" : "checked"} />
      Usar valor global das configuracoes quando nao houver valor proprio
    </label>
    <label class="check-row">
      <input name="ativo" type="checkbox" ${patient?.ativo === false ? "" : "checked"} />
      Cadastro ativo
    </label>
  `;
  return [
    formSectionHtml("Identificacao", identification, true),
    formSectionHtml("Contato", contact, true),
    formSectionHtml("Endereco", address),
    formSectionHtml("Perfil social e ocupacional", social),
    formSectionHtml("Dados clinicos administrativos", admin),
    formSectionHtml("Financeiro administrativo", finance),
  ].join("");
}

function patientPayloadFromForm(form: HTMLFormElement): Partial<Paciente> {
  const data = new FormData(form);
  return {
    nomeCompleto: String(data.get("nomeCompleto") || "").trim(),
    nomeSocial: String(data.get("nomeSocial") || "").trim(),
    telefone: String(data.get("telefone") || "").trim(),
    cpf: onlyDigits(data.get("cpf")),
    dataNascimento: String(data.get("dataNascimento") || "").trim(),
    endereco: String(data.get("endereco") || "").trim(),
    observacoes: String(data.get("observacoes") || "").trim(),
    valorPadraoAtendimento: Number(String(data.get("valorPadraoAtendimento") || "0").replace(",", ".")) || 0,
    usaValorGlobal: Boolean(data.get("usaValorGlobal")),
    genero: String(data.get("genero") || "").trim(),
    estadoCivil: String(data.get("estadoCivil") || "").trim(),
    naturalidade: String(data.get("naturalidade") || "").trim(),
    nacionalidade: String(data.get("nacionalidade") || "").trim(),
    profissaoOcupacao: String(data.get("profissaoOcupacao") || "").trim(),
    escolaridade: String(data.get("escolaridade") || "").trim(),
    cep: String(data.get("cep") || "").trim(),
    municipio: String(data.get("municipio") || "").trim(),
    telefoneResidencial: String(data.get("telefoneResidencial") || "").trim(),
    telefoneCelular: String(data.get("telefoneCelular") || "").trim(),
    telefoneComercial: String(data.get("telefoneComercial") || "").trim(),
    email: String(data.get("email") || "").trim(),
    contatoEmergenciaNome: String(data.get("contatoEmergenciaNome") || "").trim(),
    contatoEmergenciaTelefone: String(data.get("contatoEmergenciaTelefone") || "").trim(),
    profissionalAvaliador: String(data.get("profissionalAvaliador") || "").trim(),
    registroProfissional: String(data.get("registroProfissional") || "").trim(),
    dataAvaliacao: String(data.get("dataAvaliacao") || "").trim(),
    convenioPlano: String(data.get("convenioPlano") || "").trim(),
    numeroCarteirinha: String(data.get("numeroCarteirinha") || "").trim(),
    encaminhamento: String(data.get("encaminhamento") || "").trim(),
    profissionalSolicitante: String(data.get("profissionalSolicitante") || "").trim(),
    cid: String(data.get("cid") || "").trim(),
    fotoUrl: String(data.get("fotoUrl") || "").trim(),
    ativo: Boolean(data.get("ativo")),
  };
}

async function handlePatientSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  const id = String(formData.get("id") || "");
  const photoFile = formData.get("fotoUpload") instanceof File ? (formData.get("fotoUpload") as File) : null;
  const payload = patientPayloadFromForm(form);
  if (!payload.nomeCompleto) {
    showPatientNotice("error", "Informe o nome completo.");
    return;
  }
  try {
    const saved = id
      ? await fetchJson<Paciente>(`/api/web/pacientes/${encodeURIComponent(id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await sendJson<Paciente>("/api/web/pacientes", payload);
    state.selectedPatientId = saved.id;
    if (photoFile && photoFile.size > 0) {
      try {
        await uploadPatientPhoto(saved.id, photoFile);
      } catch (photoError) {
        showPatientNotice("error", photoError instanceof Error ? photoError.message : "Cadastro salvo, mas a foto falhou.");
      }
    }
    state.patientSearch = "";
    await loadSelectedPatientDetails();
    await loadPacientes();
    if (state.patientDrawerOpen) renderEvolucoes();
    showPatientNotice("success", id ? "Cadastro atualizado no banco." : "Paciente cadastrado no banco.");
  } catch (error) {
    showPatientNotice("error", error instanceof Error ? error.message : "Falha ao salvar paciente.");
  }
}

async function uploadPatientPhoto(patientId: string, file: File): Promise<void> {
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("A foto original deve ter ate 12 MB.");
  }
  const optimized = await compressPatientPhoto(file);
  const body = new FormData();
  body.set("foto", optimized, optimized.name);
  await fetchJson<{ ok: boolean; fotoUrl?: string }>(`/api/web/pacientes/${encodeURIComponent(patientId)}/foto`, {
    method: "POST",
    body,
  });
}

async function compressPatientPhoto(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const size = 480;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Nao foi possivel preparar a foto.");
  const sourceSize = Math.min(bitmap.width, bitmap.height);
  const sx = Math.round((bitmap.width - sourceSize) / 2);
  const sy = Math.round((bitmap.height - sourceSize) / 2);
  ctx.drawImage(bitmap, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.76);
  });
  if (!blob) throw new Error("Nao foi possivel comprimir a foto.");
  return new File([blob], "paciente.webp", { type: "image/webp" });
}

function handlePatientDelete(): void {
  const id = state.selectedPatientId;
  const patient = state.pacientes.find((item) => item.id === id);
  if (!id || !patient) return;
  renderDeletePatientModal(patient);
}

function renderDeletePatientModal(patient: Paciente, errorMessage = ""): void {
  const root = document.querySelector<HTMLDivElement>("#profile-modal-root");
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop" role="presentation">
      <section class="profile-modal danger-modal" role="dialog" aria-modal="true" aria-label="Excluir paciente">
        <header>
          <div>
            <h2>Excluir definitivamente</h2>
            <p>Esta acao remove o cadastro, atendimentos, evolucoes e financeiro deste paciente. Nao e reversivel.</p>
          </div>
          <button class="ghost-button" id="close-delete-patient" type="button">Fechar</button>
        </header>
        <div class="delete-summary">
          <span>Paciente</span>
          <strong>${escapeHtml(patient.nomeCompleto)}</strong>
          <small>${escapeHtml(patient.telefone || "sem telefone")} - ${escapeHtml(patient.cpf || "sem CPF")}</small>
        </div>
        <div id="delete-patient-notice" class="notice ${errorMessage ? "error" : ""}" role="status">${escapeHtml(errorMessage)}</div>
        <form id="delete-patient-form" class="form-grid">
          <input type="hidden" name="patientId" value="${escapeHtml(patient.id)}" />
          <label>Senha do usuario logado
            <span class="password-field">
              <input id="delete-patient-secret" name="secret" type="password" autocomplete="current-password" required />
              <button class="ghost-button password-toggle" type="button" data-toggle-password="delete-patient-secret" aria-pressed="false">Mostrar</button>
            </span>
          </label>
          <div class="button-row">
            <button class="danger-button" id="confirm-delete-patient" type="submit">Excluir definitivamente</button>
            <button class="ghost-button" id="cancel-delete-patient" type="button">Cancelar</button>
          </div>
        </form>
      </section>
    </div>
  `;
  root.querySelector<HTMLButtonElement>("#close-delete-patient")?.addEventListener("click", closeProfileModal);
  root.querySelector<HTMLButtonElement>("#cancel-delete-patient")?.addEventListener("click", closeProfileModal);
  root.querySelector<HTMLFormElement>("#delete-patient-form")?.addEventListener("submit", confirmPatientDelete);
  bindPasswordToggles(root);
}

async function confirmPatientDelete(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const id = String(new FormData(form).get("patientId") || "");
  const secret = String(new FormData(form).get("secret") || "");
  const patient = state.pacientes.find((item) => item.id === id);
  if (!secret) {
    const notice = document.querySelector<HTMLDivElement>("#delete-patient-notice");
    if (notice) {
      notice.className = "notice error";
      notice.textContent = "Senha obrigatoria.";
    }
    return;
  }
  const button = form.querySelector<HTMLButtonElement>("#confirm-delete-patient");
  if (button) button.disabled = true;
  try {
    await fetchJson<{ ok: boolean }>(`/api/web/pacientes/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    closeProfileModal();
    state.selectedPatientId = null;
    await loadPacientes();
    showPatientNotice("success", "Cadastro excluido definitivamente do banco.");
  } catch (error) {
    renderDeletePatientModal(patient || { id, nomeCompleto: "Paciente" }, error instanceof Error ? error.message : "Falha ao excluir paciente.");
  } finally {
    if (button) button.disabled = false;
  }
}

function showPatientNotice(kind: "error" | "success" | "info", message: string): void {
  const notice = document.querySelector<HTMLDivElement>("#patient-notice");
  if (!notice) return;
  notice.className = `notice ${kind}`;
  notice.textContent = message;
}

async function loadEvolucoes(): Promise<void> {
  renderEvolucoes(true);
  try {
    const [patients, evolutions, agenda] = await Promise.allSettled([
      fetchJson<Paciente[]>("/api/web/pacientes?limit=500"),
      fetchJson<Evolucao[]>("/api/web/evolucoes?limit=200"),
      fetchJson<AgendaSlot[]>(`/api/web/agenda?${new URLSearchParams({ inicio: addDaysISO(-90), fim: addDaysISO(30) })}`),
    ]);
    state.pacientes = patients.status === "fulfilled" ? patients.value : [];
    state.evolucoes = evolutions.status === "fulfilled" ? evolutions.value : [];
    state.agenda = agenda.status === "fulfilled" ? agenda.value : [];
    state.selectedPatientId =
      state.selectedPatientId && state.pacientes.some((patient) => patient.id === state.selectedPatientId)
        ? state.selectedPatientId
        : null;
    await loadSelectedPatientDetails();
    renderEvolucoes();
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar evolucoes: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

function renderEvolucoes(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const selected = state.pacientes.find((patient) => patient.id === state.selectedPatientId) || null;
  const sortedPatients = sortedPatientList(
    state.patientSearch
      ? state.pacientes.filter((patient) =>
          [patient.nomeCompleto, patient.nomeSocial, patient.telefone, patient.cpf]
            .join(" ")
            .toLowerCase()
            .includes(state.patientSearch.toLowerCase()),
        )
      : state.pacientes,
  );
  const activePatients = state.pacientes.filter((patient) => patient.ativo !== false).length;
  const inactivePatients = state.pacientes.length - activePatients;
  view.innerHTML = `
    <header class="page-header">
      <div>
        <h1>Pacientes</h1>
        <p>Pacientes, ficha clinica, financeiro e linha do tempo operacional em um unico lugar.</p>
      </div>
      <div class="button-row">
        <button class="primary-button" id="new-registry" type="button">Novo Cliente</button>
        <button class="ghost-button" id="invite-client" type="button">Convidar cliente</button>
        <button class="secondary-button icon-only icon-refresh" id="refresh-evolucoes" type="button" aria-label="Atualizar" title="Atualizar"></button>
      </div>
    </header>
    <section class="content-panel registry-shell">
      <div id="evolution-notice" class="notice" role="status"></div>
      ${loading ? `<div class="loading">Carregando cadastros...</div>` : ""}
      <div class="registry-layout registry-layout-full">
        <div class="registry-list registry-list-full">
          <div class="section-title compact-title">
            <h2>Pacientes</h2>
            <span class="pill">${state.pacientes.length}</span>
          </div>
          <div class="registry-overview-bar">
            <div class="stat"><span>Pacientes cadastrados</span><strong>${state.pacientes.length}</strong></div>
            <div class="stat"><span>Ativos</span><strong>${activePatients}</strong></div>
            <div class="stat"><span>Inativos</span><strong>${inactivePatients}</strong></div>
          </div>
          <div class="registry-filter-row">
            <label class="compact-select">Buscar paciente
              <span class="inline-search">
                <input id="registry-patient-search" type="text" value="${escapeHtml(state.patientSearch)}" placeholder="Nome, telefone ou CPF" />
                <button class="primary-button compact-button" id="apply-registry-search" type="button">Buscar</button>
              </span>
            </label>
            <label class="compact-select">Ordenar
              <select id="patient-sort">
                <option value="alpha" ${state.patientSort === "alpha" ? "selected" : ""}>Alfabetico</option>
                <option value="last_attendance" ${state.patientSort === "last_attendance" ? "selected" : ""}>Ultimo atendimento</option>
                <option value="newest" ${state.patientSort === "newest" ? "selected" : ""}>Pacientes recentes</option>
                <option value="oldest" ${state.patientSort === "oldest" ? "selected" : ""}>Pacientes mais antigos</option>
              </select>
            </label>
          </div>
          <div class="patient-card-list">
            ${sortedPatients.map(patientRowHtml).join("") || `<div class="empty">Nenhum paciente cadastrado.</div>`}
          </div>
        </div>
      </div>
    </section>
    ${selected && state.patientDrawerOpen ? patientProfileDrawerHtml(selected) : ""}
    ${!selected && state.patientDrawerOpen ? newClientDrawerHtml() : ""}
  `;
  document.querySelector<HTMLButtonElement>("#refresh-evolucoes")?.addEventListener("click", loadEvolucoes);
  document.querySelector<HTMLButtonElement>("#new-registry")?.addEventListener("click", () => {
    state.selectedPatientId = null;
    state.registryTab = "cadastro";
    state.patientDrawerOpen = true;
    state.patientDrawerAnimate = true;
    renderEvolucoes();
  });
  document.querySelector<HTMLButtonElement>("#invite-client")?.addEventListener("click", handleInviteClient);
  document.querySelector<HTMLButtonElement>("#apply-registry-search")?.addEventListener("click", () => {
    state.patientSearch = String(document.querySelector<HTMLInputElement>("#registry-patient-search")?.value || "");
    renderEvolucoes();
  });
  document.querySelector<HTMLInputElement>("#registry-patient-search")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      state.patientSearch = event.currentTarget.value;
      renderEvolucoes();
    }
  });
  document.querySelector<HTMLSelectElement>("#patient-sort")?.addEventListener("change", (event) => {
    state.patientSort = event.currentTarget.value as AppState["patientSort"];
    renderEvolucoes();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-registry-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.registryTab = (button.dataset.registryTab as AppState["registryTab"]) || "resumo";
      state.patientDrawerAnimate = false;
      renderEvolucoes();
    });
  });
  document.querySelector<HTMLFormElement>("#patient-form")?.addEventListener("submit", handlePatientSubmit);
  bindCpfMasks(document);
  document.querySelector<HTMLButtonElement>("#delete-patient")?.addEventListener("click", handlePatientDelete);
  document.querySelectorAll<HTMLButtonElement>("[data-delete-patient]").forEach((button) => {
    button.addEventListener("click", handlePatientDelete);
  });
  document.querySelectorAll<HTMLElement>("[data-close-patient-drawer]").forEach((element) => {
    element.addEventListener("click", () => {
      state.patientDrawerOpen = false;
      renderEvolucoes();
    });
  });
  document.querySelector<HTMLButtonElement>("[data-retro-attendance]")?.addEventListener("click", () => {
    if (selected) renderRetroAttendanceModal(selected);
  });
  document.querySelector<HTMLButtonElement>("[data-schedule-patient]")?.addEventListener("click", async (event) => {
    const patientId = (event.currentTarget as HTMLButtonElement).dataset.schedulePatient || selected?.id || "";
    state.appointmentDraftPatientId = patientId;
    state.patientDrawerOpen = false;
    state.selectedEventId = null;
    state.appointmentDrawerOpen = true;
    setDocumentRoute("agenda");
    await loadAgenda();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-patient-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPatientId = button.dataset.patientId || null;
      state.registryTab = "resumo";
      state.patientDrawerOpen = true;
      state.patientDrawerAnimate = true;
      void loadSelectedPatientDetails().then(() => renderEvolucoes());
    });
  });
  view.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(isAppRoute(nextRoute) ? nextRoute : "dashboard");
      await loadCurrentRoute();
    });
  });
  bindNewAppointmentDrawer(() => renderEvolucoes());
}

function sortedPatientList(patients: Paciente[]): Paciente[] {
  const byName = (a: Paciente, b: Paciente) => String(a.nomeCompleto || "").localeCompare(String(b.nomeCompleto || ""), "pt-BR");
  const list = [...patients];
  if (state.patientSort === "alpha") return list.sort(byName);
  if (state.patientSort === "last_attendance") return list.sort((a, b) => latestPatientAttendance(b) - latestPatientAttendance(a) || byName(a, b));
  if (state.patientSort === "oldest") return list.reverse();
  return list;
}

function latestPatientAttendance(patient: Paciente): number {
  const dates = state.agenda
    .filter((slot) => slotMatchesPatient(slot, patient))
    .map((slot) => new Date(`${slot.data}T${normalizeTimeForDate(slot.horaInicio)}`).getTime())
    .filter(Number.isFinite);
  return dates.length ? Math.max(...dates) : 0;
}

function slotMatchesPatient(slot: AgendaSlot, patient: Paciente): boolean {
  const client = slot.clientes?.[0];
  return Boolean(
    (client?.pacienteId && client.pacienteId === patient.id) ||
      (client?.nomeCompleto && patient.nomeCompleto && client.nomeCompleto === patient.nomeCompleto),
  );
}

function appointmentFinanceStatus(slot: AgendaSlot): string {
  return String(slot.statusFinanceiro || slot.clientes?.[0]?.statusFinanceiro || "pendente").toLowerCase();
}

function normalizeTimeForDate(value: unknown): string {
  const text = String(value || "00:00").trim();
  if (/^\d{2}:\d{2}:\d{2}$/.test(text)) return text;
  if (/^\d{2}:\d{2}$/.test(text)) return `${text}:00`;
  return "00:00:00";
}

function monthlyFinanceDistribution(items: Faturamento[]): string {
  const totals = new Map<string, number>();
  items.forEach((item) => {
    const key = String(item.dataPagamento || item.data || "").slice(0, 7) || "sem mes";
    totals.set(key, (totals.get(key) || 0) + Number(item.valorAtendimento || 0));
  });
  const entries = [...totals.entries()].slice(0, 4);
  if (!entries.length) return `<div class="empty compact-empty">Sem distribuicao mensal.</div>`;
  return entries.map(([month, total]) => `<div><span>${escapeHtml(month)}</span><strong>${formatMoney(total)}</strong></div>`).join("");
}

function newClientDrawerHtml(): string {
  const drawerAnimationClass = state.patientDrawerAnimate ? "" : "no-drawer-animation";
  return `
    <div class="drawer-backdrop patient-drawer-backdrop ${drawerAnimationClass}" role="presentation" data-close-patient-drawer></div>
    <aside class="patient-profile-drawer new-client-drawer ${drawerAnimationClass}" role="dialog" aria-modal="true" aria-label="Novo cliente">
      <header class="patient-profile-header">
        <span class="patient-avatar large"><span>N</span></span>
        <div>
          <h2>Novo Cliente</h2>
          <p>Cadastro manual com nome obrigatorio e demais campos opcionais.</p>
          <div class="patient-profile-actions">
            <button class="primary-button compact-button" type="button">Cadastro</button>
          </div>
        </div>
        <span class="pill ok">rascunho</span>
        <button class="ghost-button" type="button" data-close-patient-drawer>Fechar</button>
      </header>
      <nav class="registry-tabs patient-tabs" role="tablist" aria-label="Novo cliente">
        <button class="selected" type="button">Cadastro</button>
      </nav>
      <div class="patient-drawer-body">
        <div class="registry-card registry-panel registry-panel-wide">${patientFormHtml(null)}</div>
      </div>
    </aside>
  `;
}

function patientProfileDrawerHtml(patient: Paciente): string {
  const drawerAnimationClass = state.patientDrawerAnimate ? "" : "no-drawer-animation";
  const patientSlots = state.agenda.filter((slot) => slotMatchesPatient(slot, patient));
  const latestDates = [...patientSlots]
    .sort((a, b) => String(b.data + b.horaInicio).localeCompare(String(a.data + a.horaInicio)))
    .slice(0, 4)
    .map((slot) => `${formatDate(slot.data)} ${slot.horaInicio || ""}`.trim());
  const pending = state.patientFinance
    .filter((item) => String(item.statusFinanceiro || "").toLowerCase() !== "pago")
    .reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  return `
    <div class="drawer-backdrop patient-drawer-backdrop ${drawerAnimationClass}" role="presentation" data-close-patient-drawer></div>
    <aside class="patient-profile-drawer ${drawerAnimationClass}" role="dialog" aria-modal="true" aria-label="Perfil do paciente">
      <header class="patient-profile-header">
        ${patientAvatarHtml(patient, true)}
        <div>
          <h2>${escapeHtml(patient.nomeCompleto || "-")} ${patientPendingFlags(patient)}</h2>
          <p>${escapeHtml(patientAgeGender(patient))}</p>
          <div class="patient-profile-actions">
            <button class="primary-button compact-button" type="button" data-registry-tab="cadastro">Cadastro</button>
            <button class="ghost-button compact-button" type="button" data-schedule-patient="${escapeHtml(patient.id)}">Agendar</button>
            <button class="ghost-button danger-button compact-button" type="button" data-delete-patient>Excluir</button>
          </div>
        </div>
        <span class="pill ${patient.ativo === false ? "warn" : "ok"}">${patient.ativo === false ? "Inativo" : "Ativo"}</span>
        <button class="ghost-button" type="button" data-close-patient-drawer>Fechar</button>
      </header>
      <nav class="registry-tabs patient-tabs" role="tablist" aria-label="Ficha do paciente">
        <button class="${state.registryTab === "resumo" ? "selected" : ""}" type="button" data-registry-tab="resumo">Resumo</button>
        <button class="${state.registryTab === "cadastro" ? "selected" : ""}" type="button" data-registry-tab="cadastro">Cadastro</button>
        <button class="${state.registryTab === "evolucoes" ? "selected" : ""}" type="button" data-registry-tab="evolucoes">Evolucoes</button>
        <button class="${state.registryTab === "avaliacoes" ? "selected" : ""}" type="button" data-registry-tab="avaliacoes">Avaliacoes</button>
        <button class="${state.registryTab === "financeiro" ? "selected" : ""}" type="button" data-registry-tab="financeiro">Financeiro</button>
      </nav>
      <div class="patient-drawer-body">
        ${state.registryTab === "resumo" ? patientSummaryPanel(patient, latestDates, pending) : ""}
        ${state.registryTab === "cadastro" ? `<div class="registry-card registry-panel registry-panel-wide">${patientFormHtml(patient)}</div>` : ""}
        ${state.registryTab === "evolucoes" ? patientOperationalTimeline(patient, patientSlots) : ""}
        ${state.registryTab === "avaliacoes" ? patientEvaluationsPanel(patient) : ""}
        ${state.registryTab === "financeiro" ? patientFinancePanel(pending) : ""}
      </div>
    </aside>
  `;
}

function patientSummaryPanel(patient: Paciente, latestDates: string[], pending: number): string {
  return `
    <div class="stats-grid compact-stats">
      <div class="stat"><span>Atendimentos</span><strong>${escapeHtml(patient.totalAtendimentos || 0)}</strong></div>
      <div class="stat"><span>Pendente</span><strong>${formatMoney(pending || patient.totalPendente)}</strong></div>
      <div class="stat"><span>Evolucoes</span><strong>${state.patientEvolutions.length}</strong></div>
    </div>
    <div class="registry-grid drawer-grid">
      <div class="registry-card registry-panel">
        <div class="section-title compact-title"><h2>Resumo operacional</h2></div>
        <div class="summary-list">
          <div><span>Ultimas datas</span><strong>${escapeHtml(latestDates.join(" | ") || "Sem atendimentos")}</strong></div>
          <div><span>Telefone</span><strong>${escapeHtml(patient.telefone || patient.telefoneCelular || "Nao informado")}</strong></div>
          <div><span>Valor do atendimento</span><strong>${formatMoney(patient.valorPadraoAtendimento)}</strong></div>
        </div>
        <button class="primary-button" type="button" data-retro-attendance>Registrar Atendimento</button>
      </div>
      <div class="registry-card registry-panel">
        <div class="section-title compact-title"><h2>Historico clinico</h2><span class="pill">${state.patientEvolutions.length}</span></div>
        <div class="timeline-list compact-history">
          ${state.patientEvolutions.slice(0, 3).map(evolutionItemHtml).join("") || `<div class="empty">Nenhuma evolucao registrada.</div>`}
        </div>
      </div>
    </div>
  `;
}

function renderRetroAttendanceModal(patient: Paciente): void {
  const root = document.querySelector<HTMLDivElement>("#profile-modal-root");
  if (!root) return;
  const defaultValue = patient.valorPadraoAtendimento || state.user?.valorPadraoAtendimento || 0;
  const startTime = "08:00";
  const endTime = addMinutesToTime(startTime);
  root.innerHTML = `
    <div class="modal-backdrop soft-modal-backdrop" role="presentation" data-close-retro-modal>
      <section class="profile-modal retro-attendance-modal" role="dialog" aria-modal="true" aria-label="Registrar atendimento" data-modal-panel>
        <header>
          <div>
            <h2>Registrar Atendimento</h2>
            <p>${escapeHtml(patient.nomeCompleto)} - atendimento retroativo ou futuro</p>
          </div>
          <button class="ghost-button" type="button" data-close-retro-modal>Fechar</button>
        </header>
        <form id="retro-attendance-form" class="form-grid">
          <input type="hidden" name="pacienteId" value="${escapeHtml(patient.id)}" />
          <div class="form-columns">
            <label>Data
              <input name="data" type="date" value="${todayISO()}" required />
            </label>
            <label>Tipo de atendimento
              <select name="tipoAtendimentoId">
                ${appointmentTypeOptions(appointmentTypeById().id)}
              </select>
            </label>
          </div>
          <div class="form-columns">
            <label>Inicio
              <input name="horaInicio" type="time" value="${escapeHtml(startTime)}" required />
            </label>
            <label>Fim
              <input name="horaFim" type="time" value="${escapeHtml(endTime)}" required />
            </label>
          </div>
          <div class="form-columns">
            <label>Valor
              <input name="valorAtendimento" type="text" inputmode="decimal" value="${escapeHtml(defaultValue ? String(defaultValue).replace(".", ",") : "")}" />
            </label>
            <label>Status inicial
              <select name="status">
                <option value="aberto">Aberto</option>
                <option value="concluido">Concluido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </label>
          </div>
          <label>Observacoes
            <textarea name="observacao" rows="3"></textarea>
          </label>
          <div id="retro-attendance-notice" class="notice" role="status"></div>
          <div class="button-row">
            <button class="primary-button" type="submit">Salvar atendimento</button>
            <button class="ghost-button" type="button" data-close-retro-modal>Cancelar</button>
          </div>
        </form>
      </section>
    </div>
  `;
  root.querySelectorAll<HTMLElement>("[data-close-retro-modal]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target !== element && element.classList.contains("modal-backdrop")) return;
      closeProfileModal();
    });
  });
  root.querySelector<HTMLElement>("[data-modal-panel]")?.addEventListener("click", (event) => event.stopPropagation());
  const form = root.querySelector<HTMLFormElement>("#retro-attendance-form");
  if (form) {
    bindAutoEndTime(form);
    bindAppointmentTypeDefaults(form);
  }
  root.querySelector<HTMLFormElement>("#retro-attendance-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitRetroAttendance(event.currentTarget as HTMLFormElement, patient);
  });
}

async function submitRetroAttendance(form: HTMLFormElement, patient: Paciente): Promise<void> {
  const data = new FormData(form);
  const date = String(data.get("data") || "").trim();
  const start = String(data.get("horaInicio") || "").trim();
  const end = String(data.get("horaFim") || "").trim();
  const appointmentTypeId = String(data.get("tipoAtendimentoId") || "").trim();
  const appointmentType = appointmentTypeById(appointmentTypeId);
  const service = appointmentType.nome || "Atendimento";
  const value = parseMoneyInput(data.get("valorAtendimento")) || Number(patient.valorPadraoAtendimento || state.user?.valorPadraoAtendimento || 0);
  const status = String(data.get("status") || "aberto").trim() || "aberto";
  const observation = String(data.get("observacao") || "").trim();
  const notice = document.querySelector<HTMLDivElement>("#retro-attendance-notice");
  if (!date || !start) {
    if (notice) {
      notice.className = "notice error";
      notice.textContent = "Informe data e horario inicial.";
    }
    return;
  }
  if (notice) {
    notice.className = "notice info";
    notice.textContent = "Salvando atendimento na agenda real...";
  }
  try {
    await sendJson<AgendaSlot>("/api/web/agenda", {
      pacienteId: patient.id,
      patientId: patient.id,
      pacienteNome: patient.nomeCompleto,
      patientName: patient.nomeCompleto,
      nomeCompleto: patient.nomeCompleto,
      servico: service,
      service,
      tipoAtendimentoId: appointmentTypeId,
      appointmentTypeId,
      data: date,
      horaInicio: start,
      horaFim: end,
      startAt: `${date} ${start}:00`,
      endAt: end ? `${date} ${end}:00` : "",
      status,
      valorAtendimento: value,
      valor: value,
      observacao: observation,
      observacoes: observation,
    });
    closeProfileModal();
    await Promise.allSettled([loadSelectedPatientDetails(), loadAgenda()]);
    state.patientDrawerOpen = true;
    state.selectedPatientId = patient.id;
    renderPacientes();
  } catch (error) {
    if (notice) {
      notice.className = "notice error";
      notice.textContent = error instanceof Error ? error.message : "Falha ao salvar atendimento.";
    }
  }
}

function patientFinancePanel(pending: number): string {
  const selected = state.pacientes.find((patient) => patient.id === state.selectedPatientId) || null;
  const paidItems = state.patientFinance.filter((item) => isPaidStatus(item.statusFinanceiro));
  const paid = paidItems
    .reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  const credit = Number(selected?.creditoDisponivel || 0);
  const partial = state.patientFinance
    .filter((item) => isPartialStatus(item.statusFinanceiro))
    .reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  return `
    <div class="registry-card registry-panel registry-panel-wide">
      <div class="section-title compact-title">
        <h2>Financeiro individual</h2>
        <span class="pill ${pending ? "warn" : "ok"}">${formatMoney(pending)}</span>
      </div>
      <div class="stats-grid compact-stats">
        <div class="stat"><span>Recebido</span><strong>${formatMoney(paid)}</strong></div>
        <div class="stat"><span>Parcial</span><strong>${formatMoney(partial)}</strong></div>
        <div class="stat"><span>Pendente</span><strong>${formatMoney(pending)}</strong></div>
        <div class="stat"><span>Credito do paciente</span><strong>${formatMoney(credit)}</strong></div>
      </div>
      <div class="month-distribution">${monthlyFinanceDistribution(state.patientFinance)}</div>
      <div class="section-title compact-title"><h2>Historico financeiro</h2><span class="pill">${state.patientFinance.length}</span></div>
      <div class="table-list">
        ${
          state.patientFinance
            .map(
              (item) => `
                <div class="table-row">
                  <div><strong>${formatMoney(item.valorPago || item.valorAtendimento)}</strong><br><span class="muted">${formatDate(item.dataPagamento || item.data)} &middot; ${paymentMethodLabel(item.formaPagamento)}</span></div>
                  <span class="pill ${financialPillClass(item.statusFinanceiro)}">${escapeHtml(item.statusFinanceiro || "pendente")}</span>
                </div>
              `,
            )
            .join("") || `<div class="empty">Sem financeiro para este paciente.</div>`
        }
      </div>
      <div class="section-title compact-title"><h2>Pacotes e credito do paciente</h2></div>
      <div class="package-card">
        <div><span>Credito do paciente disponivel</span><strong>${formatMoney(credit)}</strong></div>
        <small>Credito do paciente e consumido quando o atendimento e baixado com saldo suficiente.</small>
      </div>
    </div>
  `;
}

function patientOperationalTimeline(patient: Paciente, patientSlots: AgendaSlot[]): string {
  const slotItems = patientSlots.map((slot) => {
    const financeStatus = appointmentFinanceStatus(slot);
    const status = slot.status === "cancelado" ? "cancelado" : !slot.temEvolucao ? "evolucao_aberta" : financeStatus !== "pago" ? "financeiro_aberto" : "finalizado";
    return {
      type: "slot",
      date: `${slot.data}T${normalizeTimeForDate(slot.horaInicio)}`,
      html: timelineSlotHtml(slot, status),
    };
  });
  const evolutionItems = state.patientEvolutions.map((evolution) => ({
    type: "evolution",
    date: `${evolution.data || ""}T00:00:00`,
    html: evolutionItemHtml(evolution),
  }));
  const items = [...slotItems, ...evolutionItems].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return `
    <div class="registry-card registry-panel registry-panel-wide">
      <div class="section-title compact-title">
        <h2>Linha do tempo operacional</h2>
        <span class="pill">${items.length}</span>
      </div>
      <div class="timeline-legend">
        <span><b class="flag-dot danger">!</b> aberto sem evolucao</span>
        <span><b class="flag-dot info">!</b> evoluido sem pagamento</span>
        <span><b class="flag-dot ok">âœ“</b> finalizado</span>
      </div>
      <div class="timeline-list operational-timeline">
        ${items.map((item) => item.html).join("") || `<div class="empty">Nenhum atendimento ou evolucao para ${escapeHtml(patient.nomeCompleto)}.</div>`}
      </div>
    </div>
  `;
}

function patientEvaluationsPanel(patient: Paciente): string {
  return `
    <div class="registry-grid drawer-grid">
      <div class="registry-card registry-panel">
        <div class="section-title compact-title">
          <h2>Avaliacoes</h2>
          <span class="pill">${state.patientEvaluations.length}</span>
        </div>
        <div class="timeline-list compact-history">
          ${
            state.patientEvaluations
              .map(
                (item) => `
                  <article class="timeline-item">
                    <div class="timeline-header">
                      <strong>${escapeHtml(item.tipo === "reavaliacao" ? "Reavaliacao" : "Avaliacao")}</strong>
                      <span class="pill ${item.status === "finalizada" ? "ok" : "warn"}">${escapeHtml(item.status || "rascunho")}</span>
                    </div>
                    <p>${escapeHtml(item.queixa || item.resumo || "Sem resumo preenchido.")}</p>
                    <small>${formatDate(item.avaliadoEm || item.criadoEm)}</small>
                    <div class="button-row">
                      <button class="ghost-button compact-button" type="button" data-duplicate-evaluation="${escapeHtml(item.id)}">Duplicar como reavaliacao</button>
                      <button class="ghost-button compact-button" type="button" data-summary-evaluation="${escapeHtml(item.id)}">Gerar resumo para evolucao</button>
                    </div>
                  </article>
                `,
              )
              .join("") || `<div class="empty">Nenhuma avaliacao registrada para ${escapeHtml(patient.nomeCompleto)}.</div>`
          }
        </div>
      </div>
      <div class="registry-card registry-panel">
        <div class="section-title compact-title"><h2>Nova avaliacao</h2></div>
        <form id="evaluation-form" class="form-grid">
          <input type="hidden" name="pacienteId" value="${escapeHtml(patient.id)}" />
          <div class="form-columns">
            <label>Tipo
              <select name="tipo">
                <option value="avaliacao">Avaliacao</option>
                <option value="reavaliacao">Reavaliacao</option>
              </select>
            </label>
            <label>Data
              <input name="avaliadoEm" type="date" value="${todayISO()}" />
            </label>
          </div>
          <label>Queixa principal
            <textarea name="queixa" rows="3"></textarea>
          </label>
          <label>Historia atual
            <textarea name="historia" rows="3"></textarea>
          </label>
          <div class="form-columns">
            <label>Dor / sintomas
              <textarea name="dor" rows="3"></textarea>
            </label>
            <label>Funcionalidade
              <textarea name="funcionalidade" rows="3"></textarea>
            </label>
          </div>
          <label>Exame fisico basico
            <textarea name="exameFisico" rows="3"></textarea>
          </label>
          <label>Testes simples
            <textarea name="testes" rows="3"></textarea>
          </label>
          <label>Hipotese fisioterapeutica
            <textarea name="hipotese" rows="3"></textarea>
          </label>
          <div class="form-columns">
            <label>Objetivos
              <textarea name="objetivos" rows="3"></textarea>
            </label>
            <label>Plano terapeutico
              <textarea name="plano" rows="3"></textarea>
            </label>
          </div>
          <div id="evaluation-notice" class="notice" role="status"></div>
          <div class="button-row">
            <button class="ghost-button" type="submit" data-evaluation-status="rascunho">Salvar rascunho</button>
            <button class="primary-button" type="submit" data-evaluation-status="finalizada">Finalizar avaliacao</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function timelineSlotHtml(slot: AgendaSlot, status: string): string {
  const marker = status === "evolucao_aberta" ? "danger" : status === "financeiro_aberto" ? "info" : status === "finalizado" ? "ok" : "neutral";
  const symbol = marker === "ok" ? "âœ“" : marker === "neutral" ? "-" : "!";
  const action =
    status === "evolucao_aberta"
      ? "Registrar evolucao"
      : status === "financeiro_aberto"
        ? "Baixar pagamento"
        : status === "finalizado"
          ? "Visualizar / imprimir"
          : "Visualizar";
  return `
    <article class="timeline-item timeline-slot">
      <div class="timeline-header">
        <strong><span class="flag-dot ${marker}">${symbol}</span> ${escapeHtml(slot.servico || "Atendimento")}</strong>
        <span>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}</span>
      </div>
      <p>${escapeHtml(slot.clientes?.[0]?.nomeCompleto || "Paciente")} - ${formatMoney(slot.valorAtendimento || slot.clientes?.[0]?.valorAtendimento)} - ${escapeHtml(appointmentFinanceStatus(slot))}</p>
      <div class="button-row"><button class="ghost-button compact-button" type="button">${action}</button></div>
    </article>
  `;
}

function evolutionItemHtml(evolution: Evolucao): string {
  return `
    <article class="timeline-item">
      <div class="timeline-header">
        <strong>${escapeHtml(evolution.pacienteNome || "Paciente sem nome")}</strong>
        <span>${formatDate(evolution.data)}</span>
      </div>
      <p>${escapeHtml(evolution.texto || "-")}</p>
      ${evolution.conduta ? `<small>Conduta: ${escapeHtml(evolution.conduta)}</small>` : ""}
    </article>
  `;
}

async function handleInviteClient(): Promise<void> {
  try {
    const invite = await sendJson<{ ok: boolean; url: string; expiresAt: string }>("/api/web/pacientes/convites", {});
    const message = `Convite criado. Link expira em 24h: ${invite.url}`;
    try {
      await navigator.clipboard?.writeText(invite.url);
      showEvolutionNotice("success", `${message} Link copiado.`);
    } catch {
      showEvolutionNotice("success", message);
    }
  } catch (error) {
    showEvolutionNotice("error", error instanceof Error ? error.message : "Falha ao criar convite.");
  }
}

async function handleEvolutionSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const pacienteId = String(data.get("pacienteId") || "");
  const agendaId = String(data.get("agendaId") || "");
  const patient = state.pacientes.find((item) => item.id === pacienteId);
  const texto = String(data.get("texto") || "").trim();
  if (!pacienteId || !agendaId || !texto) {
    showEvolutionNotice("error", "Selecione um atendimento em aberto e escreva a evolucao.");
    return;
  }
  try {
    const saved = await sendJson<Evolucao>("/api/web/evolucoes", {
      pacienteId,
      agendaId,
      pacienteNome: patient?.nomeCompleto,
      texto,
      conduta: String(data.get("conduta") || "").trim(),
      data: todayISO(),
      profissionalNome: state.user?.nomeCompleto || state.user?.login || "FISIA",
    });
    state.evolucoes = [saved, ...state.evolucoes];
    state.patientEvolutions = [saved, ...state.patientEvolutions];
    form.reset();
    renderEvolucoes();
    showEvolutionNotice("success", "Evolucao salva no banco.");
  } catch (error) {
    showEvolutionNotice("error", error instanceof Error ? error.message : "Falha ao salvar evolucao.");
  }
}

async function handleEvaluationSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const patientId = String(data.get("pacienteId") || state.selectedPatientId || "");
  const submitter = event.submitter as HTMLButtonElement | null;
  const status = submitter?.dataset.evaluationStatus || "rascunho";
  if (!patientId) {
    showEvaluationNotice("error", "Selecione um paciente.");
    return;
  }
  const payload = {
    tipo: String(data.get("tipo") || "avaliacao"),
    status,
    avaliadoEm: String(data.get("avaliadoEm") || todayISO()),
    queixa: String(data.get("queixa") || "").trim(),
    historia: String(data.get("historia") || "").trim(),
    dor: String(data.get("dor") || "").trim(),
    funcionalidade: String(data.get("funcionalidade") || "").trim(),
    exameFisico: String(data.get("exameFisico") || "").trim(),
    testes: String(data.get("testes") || "").trim(),
    hipotese: String(data.get("hipotese") || "").trim(),
    objetivos: String(data.get("objetivos") || "").trim(),
    plano: String(data.get("plano") || "").trim(),
  };
  if (!payload.queixa && !payload.historia && !payload.exameFisico && !payload.plano) {
    showEvaluationNotice("error", "Preencha ao menos queixa, historia, exame fisico ou plano.");
    return;
  }
  try {
    const saved = await sendJson<Avaliacao>(`/api/web/pacientes/${encodeURIComponent(patientId)}/avaliacoes`, payload);
    state.patientEvaluations = [saved, ...state.patientEvaluations];
    form.reset();
    renderEvolucoes();
    showEvaluationNotice("success", status === "finalizada" ? "Avaliacao finalizada." : "Rascunho salvo.");
  } catch (error) {
    showEvaluationNotice("error", error instanceof Error ? error.message : "Falha ao salvar avaliacao.");
  }
}

async function handleDuplicateEvaluation(evaluationId: string): Promise<void> {
  if (!evaluationId) return;
  try {
    const duplicated = await sendJson<Avaliacao>(`/api/web/avaliacoes/${encodeURIComponent(evaluationId)}/duplicar`, {});
    state.patientEvaluations = [duplicated, ...state.patientEvaluations];
    renderEvolucoes();
    showEvolutionNotice("success", "Reavaliacao criada como rascunho.");
  } catch (error) {
    showEvolutionNotice("error", error instanceof Error ? error.message : "Falha ao duplicar avaliacao.");
  }
}

function handleEvaluationSummary(evaluationId: string): void {
  const item = state.patientEvaluations.find((evaluation) => evaluation.id === evaluationId);
  if (!item) return;
  const text = item.resumo || [item.queixa, item.historia, item.exameFisico, item.hipotese, item.objetivos, item.plano].filter(Boolean).join("\n");
  navigator.clipboard?.writeText(text).then(
    () => showEvolutionNotice("success", "Resumo copiado para usar na evolucao."),
    () => showEvolutionNotice("info", text || "Avaliacao sem resumo."),
  );
}

function showEvaluationNotice(kind: "error" | "success" | "info", message: string): void {
  const notice = document.querySelector<HTMLDivElement>("#evaluation-notice");
  if (!notice) return;
  notice.className = `notice ${kind}`;
  notice.textContent = message;
}

function showEvolutionNotice(kind: "error" | "success" | "info", message: string): void {
  const notice = document.querySelector<HTMLDivElement>("#evolution-notice");
  if (!notice) return;
  notice.className = `notice ${kind}`;
  notice.textContent = message;
}

async function loadFinanceiro(): Promise<void> {
  renderFinanceiro(true);
  try {
    const [financeiro, pacientes] = await Promise.allSettled([
      fetchJson<Faturamento[]>("/api/web/financeiro?limit=500"),
      fetchJson<Paciente[]>("/api/web/pacientes?limit=500"),
    ]);
    state.financeiro = financeiro.status === "fulfilled" ? financeiro.value : [];
    if (pacientes.status === "fulfilled") state.pacientes = pacientes.value;
    renderFinanceiro();
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar financeiro: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

function renderFinanceiro(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const totals = financeTotals(state.financeiro);
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Financeiro</h1>
        <p>Recebimentos, contas em aberto e caixa diario dos atendimentos.</p>
      </div>
      <div class="button-row">
        <button class="primary-button" id="new-finance-payment" type="button">Registrar pagamento</button>
        <button class="secondary-button icon-only icon-refresh" id="refresh-financeiro" type="button" aria-label="Atualizar" title="Atualizar"></button>
        <button class="ghost-button" id="export-financeiro" type="button">Exportar CSV</button>
      </div>
    </header>
    <section class="finance-kpi-grid">
      <div class="stat"><span>Recebido hoje</span><strong>${formatMoney(totals.todayReceived)}</strong><small>${totals.todayCount} recebimentos</small></div>
      <div class="stat"><span>Recebido mes</span><strong>${formatMoney(totals.monthReceived)}</strong><small>${totals.monthCount} recebimentos</small></div>
      <div class="stat"><span>Contas em aberto</span><strong>${formatMoney(totals.pending)}</strong><small>${totals.pendingCount} sessoes</small></div>
      <div class="stat"><span>Ticket medio</span><strong>${formatMoney(totals.ticketAverage)}</strong><small>pagamentos do mes</small></div>
    </section>
    <section class="finance-layout">
      <aside class="finance-side">
        <div class="content-panel">
          <div class="section-title"><h2>Caixa diario</h2></div>
          <div class="detail-row"><span>Total recebido</span><strong>${formatMoney(totals.todayReceived)}</strong></div>
          <div class="detail-row"><span>Quantidade</span><strong>${totals.todayCount}</strong></div>
          <div class="detail-row"><span>Ticket medio</span><strong>${formatMoney(totals.todayAverage)}</strong></div>
        </div>
        <div class="content-panel">
          <div class="section-title"><h2>Formas de pagamento</h2></div>
          ${Object.entries(totals.methods)
            .map(([method, value]) => `<div class="method-row"><span>${paymentMethodLabel(method)}</span><strong>${formatMoney(value)}</strong></div>`)
            .join("")}
        </div>
      </aside>
      <section class="content-panel">
        <div class="section-title">
          <h2>Ultimos recebimentos e contas</h2>
          <span class="pill">${state.financeiro.length}</span>
        </div>
        ${loading ? `<div class="loading">Carregando financeiro...</div>` : ""}
        <div class="data-table">
          <div class="data-row data-head"><span>Data</span><span>Paciente</span><span>Status</span><span>Valor</span></div>
          ${
            state.financeiro
              .map(
                (item) => `
                  <div class="data-row">
                    <span>${formatDate(item.dataPagamento || item.data)}</span>
                    <span>${escapeHtml(item.nomeCompleto || "-")}</span>
                    <span class="pill ${financialPillClass(item.statusFinanceiro)}">${escapeHtml(item.statusFinanceiro || "pendente")}</span>
                    <strong>${formatMoney(isPaidStatus(item.statusFinanceiro) || isPartialStatus(item.statusFinanceiro) ? item.valorPago || item.valorAtendimento : item.valorAtendimento)}</strong>
                  </div>
                `,
              )
              .join("") || `<div class="empty">Sem lancamentos financeiros.</div>`
          }
        </div>
      </section>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-financeiro")?.addEventListener("click", loadFinanceiro);
  document.querySelector<HTMLButtonElement>("#export-financeiro")?.addEventListener("click", exportFinanceCsv);
  document.querySelector<HTMLButtonElement>("#new-finance-payment")?.addEventListener("click", renderFinancePaymentModal);
}

function renderFinancePaymentModal(): void {
  const root = document.querySelector<HTMLDivElement>("#profile-modal-root");
  if (!root) return;
  root.innerHTML = `
    <div class="modal-backdrop soft-modal-backdrop" role="presentation" data-close-finance-payment>
      <section class="profile-modal retro-attendance-modal" role="dialog" aria-modal="true" aria-label="Registrar pagamento" data-modal-panel>
        <header>
          <div>
            <h2>Registrar pagamento</h2>
            <p>Pagamento financeiro simples, separado de credito do paciente.</p>
          </div>
          <button class="ghost-button" type="button" data-close-finance-payment>Fechar</button>
        </header>
        <form id="finance-payment-form" class="form-grid">
          <label>Paciente
            <input name="paciente" type="text" list="finance-payment-patients" required placeholder="Nome do paciente" />
            <datalist id="finance-payment-patients">
              ${state.pacientes.map((patient) => `<option value="${escapeHtml(patient.nomeCompleto)}"></option>`).join("")}
            </datalist>
          </label>
          <div class="form-columns">
            <label>Valor recebido
              <input name="valor" type="text" inputmode="decimal" required placeholder="150,00" />
            </label>
            <label>Data
              <input name="data" type="date" value="${todayISO()}" required />
            </label>
          </div>
          <label>Forma de pagamento
            <select name="formaPagamento">${paymentMethodOptions("pix")}</select>
          </label>
          <label>Vinculo opcional a atendimento
            <select name="atendimentoId">
              <option value="">Sem vinculo automatico</option>
              ${state.agenda
                .filter((slot) => !isPaidStatus(slotFinancialStatus(slot)))
                .map((slot) => `<option value="${escapeHtml(slot.id)}">${escapeHtml(`${formatDate(slot.data)} ${slot.horaInicio || ""} - ${slot.clientes?.[0]?.nomeCompleto || slot.servico || "Atendimento"}`)}</option>`)
                .join("")}
            </select>
          </label>
          <label>Observacoes
            <textarea name="observacao" rows="3"></textarea>
          </label>
          <div id="finance-payment-notice" class="notice" role="status"></div>
          <div class="button-row">
            <button class="primary-button" type="submit">Salvar pagamento</button>
            <button class="ghost-button" type="button" data-close-finance-payment>Cancelar</button>
          </div>
        </form>
      </section>
    </div>
  `;
  root.querySelectorAll<HTMLElement>("[data-close-finance-payment]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target !== element && element.classList.contains("modal-backdrop")) return;
      closeProfileModal();
    });
  });
  root.querySelector<HTMLElement>("[data-modal-panel]")?.addEventListener("click", (event) => event.stopPropagation());
  root.querySelector<HTMLFormElement>("#finance-payment-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitFinancePayment(event.currentTarget as HTMLFormElement);
  });
}

async function submitFinancePayment(form: HTMLFormElement): Promise<void> {
  const data = new FormData(form);
  const patientName = String(data.get("paciente") || "").trim();
  const patient = findPatientByName(patientName);
  const value = parseMoneyInput(data.get("valor"));
  const paymentDate = String(data.get("data") || todayISO()).trim();
  const appointmentId = String(data.get("atendimentoId") || "").trim();
  const notice = document.querySelector<HTMLDivElement>("#finance-payment-notice");
  if (!patient || !value || value <= 0) {
    if (notice) {
      notice.className = "notice error";
      notice.textContent = "Informe paciente cadastrado e valor recebido valido.";
    }
    return;
  }
  if (notice) {
    notice.className = "notice info";
    notice.textContent = "Salvando pagamento...";
  }
  try {
    const payload = {
      pacienteId: patient.id,
      patientId: patient.id,
      pacienteNome: patient.nomeCompleto,
      patientName: patient.nomeCompleto,
      valor: value,
      valorAtendimento: value,
      valorPago: value,
      dataPagamento: paymentDate,
      formaPagamento: String(data.get("formaPagamento") || "pix"),
      observacao: String(data.get("observacao") || "").trim(),
      atendimentoId: appointmentId,
      agendaId: appointmentId,
    };
    if (appointmentId) {
      await sendJson(`/api/web/agenda/${encodeURIComponent(appointmentId)}/pagamento`, payload);
    } else {
      await sendJson("/api/web/pagamentos", payload);
    }
    closeProfileModal();
    await loadFinanceiro();
  } catch (error) {
    if (notice) {
      notice.className = "notice error";
      notice.textContent = error instanceof Error ? error.message : "Falha ao salvar pagamento.";
    }
  }
}

function financeTotals(items: Faturamento[]): {
  paid: number;
  pending: number;
  pendingCount: number;
  total: number;
  todayReceived: number;
  todayCount: number;
  todayAverage: number;
  monthReceived: number;
  monthCount: number;
  ticketAverage: number;
  methods: Record<string, number>;
} {
  const today = todayISO();
  const month = monthKey();
  const paidItems = items.filter((item) => isPaidStatus(item.statusFinanceiro) || isPartialStatus(item.statusFinanceiro));
  const openItems = items.filter((item) => !isPaidStatus(item.statusFinanceiro) && !isExemptStatus(item.statusFinanceiro));
  const paid = paidItems.reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  const pending = openItems.reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  const todayPaid = paidItems.filter((item) => String(item.dataPagamento || item.data || "").slice(0, 10) === today);
  const monthPaid = paidItems.filter((item) => String(item.dataPagamento || item.data || "").startsWith(month));
  const todayReceived = todayPaid.reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  const monthReceived = monthPaid.reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
  const methods = ["pix", "cartao_credito", "debito", "dinheiro", "transferencia"].reduce(
    (acc, method) => {
      acc[method] = monthPaid
        .filter((item) => normalizePaymentMethod(item.formaPagamento) === method)
        .reduce((sum, item) => sum + Number(item.valorPago || item.valorAtendimento || 0), 0);
      return acc;
    },
    {} as Record<string, number>,
  );
  return {
    paid,
    pending,
    pendingCount: openItems.length,
    total: paid + pending,
    todayReceived,
    todayCount: todayPaid.length,
    todayAverage: todayPaid.length ? todayReceived / todayPaid.length : 0,
    monthReceived,
    monthCount: monthPaid.length,
    ticketAverage: monthPaid.length ? monthReceived / monthPaid.length : 0,
    methods,
  };
}

function exportFinanceCsv(): void {
  const rows = [
    ["Data", "Paciente", "Status", "Valor"].join(";"),
    ...state.financeiro.map((item) => [item.data || "", item.nomeCompleto || "", item.statusFinanceiro || "", String(item.valorAtendimento || 0)].join(";")),
  ].join("\n");
  downloadText(`fisia-financeiro-${todayISO()}.csv`, rows);
}

async function loadRelatorios(): Promise<void> {
  renderRelatorios(true);
  try {
    const [patients, agenda, finance] = await Promise.all([
      fetchJson<Paciente[]>("/api/web/pacientes?limit=500"),
      fetchJson<AgendaSlot[]>("/api/web/agenda?limit=500"),
      fetchJson<Faturamento[]>("/api/web/financeiro?limit=500"),
    ]);
    state.pacientes = patients;
    state.agenda = agenda;
    state.financeiro = finance;
    renderRelatorios();
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar relatorios: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

function renderRelatorios(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const report = buildReportData();
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Relatorios</h1>
        <p>Estatisticas de atendimentos, financeiro e pacientes.</p>
      </div>
      <button class="ghost-button" id="export-report" type="button">Exportar CSV</button>
    </header>
    <section class="tabs">
      <button class="${state.reportTab === "atendimentos" ? "active" : ""}" data-report-tab="atendimentos">Atendimentos</button>
      <button class="${state.reportTab === "financeiro" ? "active" : ""}" data-report-tab="financeiro">Financeiro</button>
      <button class="${state.reportTab === "pacientes" ? "active" : ""}" data-report-tab="pacientes">Pacientes</button>
    </section>
    ${loading ? `<div class="loading">Carregando relatorios...</div>` : ""}
    ${state.reportTab === "financeiro" ? reportFinanceHtml(report) : state.reportTab === "pacientes" ? reportPatientsHtml(report) : reportAttendanceHtml(report)}
  `;
  document.querySelectorAll<HTMLButtonElement>("[data-report-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.reportTab;
      state.reportTab = tab === "financeiro" || tab === "pacientes" ? tab : "atendimentos";
      renderRelatorios();
    });
  });
  document.querySelector<HTMLButtonElement>("#export-report")?.addEventListener("click", () => {
    const rows = [["Tipo", "Chave", "Valor"], ...report.byDay.map(([k, v]) => ["Atendimentos por dia", k, String(v)]), ["Financeiro", "Recebido", String(report.finance.paid)], ["Financeiro", "Pendente", String(report.finance.pending)]];
    downloadText(`fisia-relatorio-${todayISO()}.csv`, rows.map((row) => row.join(";")).join("\n"));
  });
}

function buildReportData() {
  const activeAgenda = state.agenda.filter((slot) => slot.status !== "cancelado");
  const byDay = groupCount(activeAgenda.map((slot) => slot.data).filter(Boolean));
  const byService = groupCount(activeAgenda.map((slot) => slot.servico || "Fisioterapia"));
  const finance = financeTotals(state.financeiro);
  const patients = state.pacientes.map((patient) => ({
    patient,
    atendimentos: Number(patient.totalAtendimentos || 0),
    pago: Number(patient.totalPago || 0),
    pendente: Number(patient.totalPendente || 0),
  })).sort((a, b) => b.atendimentos - a.atendimentos);
  return { byDay, byService, finance, patients };
}

function groupCount(keys: string[]): Array<[string, number]> {
  const map = new Map<string, number>();
  keys.forEach((key) => map.set(key, (map.get(key) || 0) + 1));
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

function reportAttendanceHtml(report: ReturnType<typeof buildReportData>): string {
  return `
    <section class="stats-grid">
      <div class="stat"><span>Total atendimentos</span><strong>${report.byDay.reduce((sum, [, value]) => sum + value, 0)}</strong></div>
      <div class="stat"><span>Dias com agenda</span><strong>${report.byDay.length}</strong></div>
      <div class="stat"><span>Servicos</span><strong>${report.byService.length}</strong></div>
    </section>
    <section class="grid-2">
      <div class="content-panel">${barSeriesHtml("Atendimentos por dia", report.byDay, formatDate)}</div>
      <div class="content-panel">${barSeriesHtml("Por servico", report.byService)}</div>
    </section>
  `;
}

function reportFinanceHtml(report: ReturnType<typeof buildReportData>): string {
  return `
    <section class="stats-grid">
      <div class="stat"><span>Total recebido</span><strong>${formatMoney(report.finance.paid)}</strong></div>
      <div class="stat"><span>Total pendente</span><strong>${formatMoney(report.finance.pending)}</strong></div>
      <div class="stat"><span>Total previsto</span><strong>${formatMoney(report.finance.total)}</strong></div>
    </section>
    <section class="content-panel">${barSeriesHtml("Recebimentos por status", [["Pago", report.finance.paid], ["Pendente", report.finance.pending]])}</section>
  `;
}

function reportPatientsHtml(report: ReturnType<typeof buildReportData>): string {
  return `
    <section class="content-panel">
      <div class="section-title"><h2>${report.patients.length} pacientes</h2></div>
      <div class="data-table">
        <div class="data-row data-head"><span>Paciente</span><span>Atend.</span><span>Pago</span><span>Pendente</span></div>
        ${
          report.patients.map((item) => `
            <div class="data-row">
              <span>${escapeHtml(item.patient.nomeCompleto)}</span>
              <span>${item.atendimentos}</span>
              <span>${formatMoney(item.pago)}</span>
              <strong>${formatMoney(item.pendente)}</strong>
            </div>
          `).join("") || `<div class="empty">Sem pacientes.</div>`
        }
      </div>
    </section>
  `;
}

function barSeriesHtml(title: string, items: Array<[string, number]>, formatKey?: (value: string) => string): string {
  const max = Math.max(1, ...items.map(([, value]) => value));
  return `
    <div class="section-title"><h2>${escapeHtml(title)}</h2></div>
    <div class="bar-list">
      ${
        items.map(([key, value]) => `
          <div class="bar-row">
            <span>${escapeHtml(formatKey ? formatKey(key) : key)}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.max(4, (value / max) * 100)}%"></div></div>
            <strong>${typeof value === "number" && value > 99 ? formatMoney(value) : value}</strong>
          </div>
        `).join("") || `<div class="empty">Sem dados.</div>`
      }
    </div>
  `;
}

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function loadDebugIntentMessages(): DebugIntentMessage[] {
  try {
    const raw = localStorage.getItem(DEBUG_INTENTS_HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 50) : [];
  } catch {
    return [];
  }
}

function saveDebugIntentMessages(messages: DebugIntentMessage[]): void {
  localStorage.setItem(DEBUG_INTENTS_HISTORY_KEY, JSON.stringify(messages.slice(0, 50)));
}

function debugMessageId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `DBG-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function appendDebugIntentMessage(text: string): void {
  const clean = text.trim();
  if (!clean) return;
  const next: DebugIntentMessage = {
    id: debugMessageId(),
    text: clean,
    createdAt: new Date().toISOString(),
    result: debugIntentLocal(clean),
  };
  saveDebugIntentMessages([next, ...loadDebugIntentMessages()]);
  renderDebugIntents();
}

function renderDebugIntents(): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const messages = loadDebugIntentMessages();
  const latest = messages[0]?.result;
  const totals = {
    total: messages.length,
    pending: messages.filter((item) => item.result.status === "pendente").length,
    errors: messages.filter((item) => item.result.status === "erro").length,
  };
  view.innerHTML = `
    <header class="page-header">
      <div>
        <h1>Debug intents</h1>
        <p>Parser local para testar mensagens no formato WhatsApp antes de enviar ao worker.</p>
      </div>
      <div class="page-actions">
        <button class="secondary-button" id="clear-debug-intents" type="button" ${messages.length ? "" : "disabled"}>Limpar</button>
      </div>
    </header>
    <section class="debug-intents-layout">
      <div class="content-panel debug-phone">
        <div class="debug-phone-header">
          <strong>FISIA local</strong>
          <span>${totals.total} testes</span>
        </div>
        <div class="debug-chat-list" aria-live="polite">
          ${
            messages
              .map(
                (item) => `
                  <article class="debug-message">
                    <div class="debug-bubble user">
                      <time>${new Date(item.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</time>
                      <p>${escapeHtml(item.text)}</p>
                    </div>
                    <div class="debug-bubble bot ${item.result.status}">
                      <span>${escapeHtml(item.result.status)}</span>
                      <strong>${escapeHtml(item.result.intent)} - ${Math.round(item.result.confidence * 100)}%</strong>
                      <p>${escapeHtml(item.result.mensagem)}</p>
                      <dl>
                        <div><dt>Forma</dt><dd>${escapeHtml(item.result.extracted.formaPagamento || "-")}</dd></div>
                        <div><dt>Credito paciente</dt><dd>${item.result.extracted.usarCreditoPaciente ? "sim" : "nao"}</dd></div>
                      </dl>
                    </div>
                  </article>
                `,
              )
              .join("") || `<div class="empty debug-empty">Nenhuma mensagem local.</div>`
          }
        </div>
        <div class="debug-samples">
          ${DEBUG_INTENT_SAMPLES.map((sample) => `<button type="button" data-debug-sample="${escapeHtml(sample)}">${escapeHtml(sample)}</button>`).join("")}
        </div>
        <form class="debug-compose" id="debug-intent-form">
          <textarea id="debug-intent-input" rows="2" placeholder="Mensagem local"></textarea>
          <button class="primary-button" type="submit" aria-label="Enviar debug">Enviar</button>
        </form>
      </div>
      <aside class="content-panel debug-summary">
        <div class="section-title">
          <h2>Resumo</h2>
          <span class="pill info">local</span>
        </div>
        <div class="debug-metrics">
          <div><span>Total</span><strong>${totals.total}</strong></div>
          <div><span>Pendentes</span><strong>${totals.pending}</strong></div>
          <div><span>Erros</span><strong>${totals.errors}</strong></div>
        </div>
        ${
          latest
            ? `
              <div class="debug-current">
                <h3>Intent atual</h3>
                <div class="detail-row"><span>Intent</span><strong>${escapeHtml(latest.intent)}</strong></div>
                <div class="detail-row"><span>Confidence</span><strong>${Math.round(latest.confidence * 100)}%</strong></div>
                <div class="detail-row"><span>Paciente</span><strong>${escapeHtml(latest.extracted.pacienteNome || "-")}</strong></div>
                <div class="detail-row"><span>Valor</span><strong>${formatMoney(latest.extracted.valor)}</strong></div>
                <div class="detail-row"><span>Termo</span><strong>${escapeHtml(latest.extracted.termoPagamento || "-")}</strong></div>
                <div class="detail-row"><span>Forma</span><strong>${escapeHtml(latest.extracted.formaPagamento || "-")}</strong></div>
                <div class="detail-row"><span>Credito disponivel</span><strong>${formatMoney(latest.extracted.creditoPacienteDisponivel)}</strong></div>
                <div class="detail-row"><span>Motivo</span><strong>${escapeHtml(latest.extracted.motivo || "-")}</strong></div>
                <div class="debug-path">${latest.path.map((step) => `<span>${escapeHtml(step)}</span>`).join("")}</div>
              </div>
            `
            : `<p class="muted">Sem intent selecionada.</p>`
        }
      </aside>
    </section>
  `;

  document.querySelector<HTMLButtonElement>("#clear-debug-intents")?.addEventListener("click", () => {
    localStorage.removeItem(DEBUG_INTENTS_HISTORY_KEY);
    renderDebugIntents();
  });
  document.querySelector<HTMLFormElement>("#debug-intent-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector<HTMLTextAreaElement>("#debug-intent-input");
    appendDebugIntentMessage(input?.value || "");
  });
}

async function loadRecursos(): Promise<void> {
  renderRecursos(true);
  const checks = await Promise.allSettled([
    fetchJson<{ status?: string }>("/healthz"),
    fetchJson<SessionPayload>("/api/web/session"),
    fetchJson<{ ok?: boolean; connected?: boolean; status?: string }>("/whatsapp/baileys/health"),
  ]);
  const health = checks[0].status === "fulfilled" ? checks[0].value : null;
  const session = checks[1].status === "fulfilled" ? checks[1].value : null;
  const whatsapp = checks[2].status === "fulfilled" ? checks[2].value : null;
  renderRecursos(false, { health, session, whatsapp });
}

function renderRecursos(
  loading = false,
  data: {
    health: { status?: string } | null;
    session: SessionPayload | null;
    whatsapp: { ok?: boolean; connected?: boolean; status?: string } | null;
  } = { health: null, session: null, whatsapp: null },
): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const modules = [
    {
      name: "Backend Flask",
      status: data.health?.status === "ok" ? "Ativo" : "Indisponivel",
      detail: "API local, sessao web e rotas operacionais.",
      active: data.health?.status === "ok",
    },
    {
      name: "Sessao web",
      status: data.session?.authenticated ? "Autenticado" : "Aguardando login",
      detail: data.session?.user?.login || "Controle por cookie no backend.",
      active: Boolean(data.session?.authenticated),
    },
    {
      name: "WhatsApp / Baileys",
      status: data.whatsapp?.connected || data.whatsapp?.ok ? "Ativo" : "Verificar",
      detail: data.whatsapp?.status || "Worker separado do dashboard.",
      active: Boolean(data.whatsapp?.connected || data.whatsapp?.ok),
    },
    {
      name: "Pacientes",
      status: "Ativo",
      detail: "Cadastro, edicao, exclusao logica e detalhes por paciente.",
      active: true,
    },
    {
      name: "Agenda",
      status: "Ativo",
      detail: "Grade semanal, filtros manuais e acoes de atendimento.",
      active: true,
    },
    {
      name: "IA, CRM, Operacao e dashboards internos",
      status: "Oculto",
      detail: "Estrutura preservada para ativacao futura.",
      active: false,
    },
  ];
  view.innerHTML = `
    <header class="page-header">
      <div>
        <h1>Recursos do sistema</h1>
        <p>Status rapido dos modulos ativos e conexoes criticas.</p>
      </div>
      <button class="secondary-button icon-only icon-refresh" id="refresh-recursos" type="button" aria-label="Atualizar" title="Atualizar"></button>
    </header>
    ${loading ? `<div class="loading">Verificando recursos...</div>` : ""}
    <section class="resources-layout">
      <div class="content-panel resource-list">
        ${modules
          .map(
            (item, index) => `
              <button class="resource-row ${index === 0 ? "selected" : ""}" type="button">
                <span class="resource-icon">${item.active ? "OK" : "-"}</span>
                <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail)}</small></span>
                <em class="${item.active ? "ok" : "warn"}">${escapeHtml(item.status)}</em>
              </button>
            `,
          )
          .join("")}
      </div>
      <aside class="content-panel resource-detail">
        <div class="resource-badge">F</div>
        <h2>FISIA operacional</h2>
        <p>Esta tela segue o modelo de recursos do NextFit, mas com os modulos realmente ativos no tablet. Os itens ocultos ficam fora da navegacao principal e continuam desconectados ate nova etapa.</p>
        <div class="detail-row"><span>Modo de interface</span><strong>Vanilla HTML/CSS/JS</strong></div>
        <div class="detail-row"><span>Banco de dados</span><strong>Acesso somente via backend</strong></div>
        <div class="detail-row"><span>WhatsApp</span><strong>Worker separado do dashboard</strong></div>
      </aside>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-recursos")?.addEventListener("click", loadRecursos);
}

async function loadUsuarios(): Promise<void> {
  renderUsuarios(true);
  try {
    const overview = await fetchJson<AdminOverview>("/api/admin/overview");
    renderUsuarios(false, overview);
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar usuarios: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

function renderUsuarios(loading = false, overview: AdminOverview | null = null): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const users = overview?.users || [];
  const databases = overview?.databases || [];
  const totalRows = databases.reduce(
    (sum, database) => sum + database.tables.reduce((tableSum, table) => tableSum + Number(table.rows || 0), 0),
    0,
  );
  const adminActions: Array<{ action: AdminActionKey; title: string; description: string; danger?: boolean }> = [
    { action: "backup", title: "Backup agora", description: "Copia os bancos atuais antes de qualquer manutencao." },
    { action: "clear_logs", title: "Limpar logs", description: "Zera logs e tabelas auxiliares de log/cache.", danger: true },
    { action: "clear_operational", title: "Limpar dados operacionais", description: "Remove agenda, pacientes, financeiro, filas e runtime preservando login.", danger: true },
    { action: "reset_financial", title: "Reset financeiro", description: "Remove pagamentos, pacotes, creditos e contas financeiras.", danger: true },
    { action: "repair_ownership", title: "Reparar ownership", description: "Reindexa dados antigos para o usuario correto por identidade tecnica/CPF." },
    { action: "verify_integrity", title: "Verificar integridade", description: "Executa quick_check nos bancos monitorados." },
    { action: "reset_total", title: "Reset total", description: "Remove tudo, inclusive usuarios e vinculos. Exige senha fixa.", danger: true },
  ];
  view.innerHTML = `
    <header class="page-header">
      <div>
        <h1>Gerenciador de usuarios</h1>
        <p>Pagina administrativa sem senha, com permissao total para remover usuarios e inspecionar bancos.</p>
      </div>
      <div class="page-actions">
        <button class="secondary-button icon-only icon-refresh" id="refresh-usuarios" type="button" aria-label="Atualizar" title="Atualizar"></button>
      </div>
    </header>
    ${loading ? `<div class="loading">Carregando usuarios e bancos...</div>` : ""}
    <section class="metrics-strip">
      <div class="metric"><span>Usuarios</span><strong>${users.length}</strong><small>auth_users</small></div>
      <div class="metric"><span>Bancos</span><strong>${databases.filter((db) => db.exists).length}</strong><small>${databases.length} monitorados</small></div>
      <div class="metric"><span>Entradas</span><strong>${totalRows}</strong><small>soma das tabelas listadas</small></div>
      <div class="metric"><span>RAM livre</span><strong>${formatBytes(overview?.memory?.freeBytes)}</strong><small>${formatBytes(overview?.memory?.totalBytes)} total</small></div>
      <div class="metric"><span>ROM livre</span><strong>${formatBytes(overview?.storage?.freeBytes)}</strong><small>${formatBytes(overview?.storage?.totalBytes)} total</small></div>
    </section>
    <section class="content-panel admin-actions-panel">
      <div class="section-title">
        <h2>Controle dos bancos</h2>
        <span class="pill">admin</span>
      </div>
      <div class="admin-action-grid">
        ${adminActions
          .map(
            (item) => `
              <button class="${item.danger ? "admin-action-card danger" : "admin-action-card"}" type="button" data-admin-action="${item.action}">
                <strong>${item.title}</strong>
                <small>${item.description}</small>
              </button>
            `,
          )
          .join("")}
      </div>
      <pre class="admin-action-result" id="admin-action-result" hidden></pre>
    </section>
    <section class="admin-grid">
      <div class="content-panel">
        <div class="section-title">
          <h2>Usuarios cadastrados</h2>
          <span class="pill">${users.length}</span>
        </div>
        <div class="admin-user-list">
          ${
            users
              .map(
                (user) => `
                  <article class="admin-user-card">
                    <div>
                      <strong>${escapeHtml(user.nomeExibicao || user.nomeCompleto || user.login || "Usuario")}</strong>
                      <small>${escapeHtml(user.login || "-")} - ${escapeHtml(user.internalUserId || "-")}</small>
                      <small>CPF ${escapeHtml(user.cpf || "-")} - Tel ${escapeHtml(user.telefone || "-")} - ${escapeHtml(user.email || "-")}</small>
                      <small>Pacientes ${Number(user.counts?.patients || 0)} - Financeiro ${Number(user.counts?.billing || 0)} - Agenda ${Number(user.counts?.agenda || 0)}</small>
                    </div>
                    <div class="admin-user-actions">
                      <span class="pill ${user.status === "ativo" ? "ok" : "warn"}">${escapeHtml(user.status || "-")}</span>
                      <button class="danger-button" type="button" data-delete-user="${escapeHtml(user.internalUserId)}" data-user-label="${escapeHtml(user.login || user.nomeCompleto || user.internalUserId)}">Excluir</button>
                    </div>
                  </article>
                `,
              )
              .join("") || `<div class="empty">Nenhum usuario cadastrado.</div>`
          }
        </div>
      </div>
      <div class="content-panel">
        <div class="section-title">
          <h2>Bancos e tabelas</h2>
          <span class="pill">${databases.length}</span>
        </div>
        <div class="admin-db-list">
          ${
            databases
              .map(
                (database) => `
                  <details class="admin-db-card" ${database.exists ? "open" : ""}>
                    <summary>
                      <strong>${escapeHtml(database.label)}</strong>
                      <span>${database.exists ? `${database.tables.length} tabelas - ${formatBytes(database.sizeBytes)}` : "nao encontrado"}</span>
                    </summary>
                    <small>${escapeHtml(database.path)}</small>
                    <div class="data-table compact-table">
                      <div class="data-row data-head"><span>Tabela</span><span>Entradas</span></div>
                      ${
                        database.tables
                          .map(
                            (table) => `
                              <div class="data-row"><span>${escapeHtml(table.name)}</span><strong>${Number(table.rows || 0)}</strong></div>
                            `,
                          )
                          .join("") || `<div class="empty">Sem tabelas listadas.</div>`
                      }
                    </div>
                  </details>
                `,
              )
              .join("") || `<div class="empty">Nenhum banco encontrado.</div>`
          }
        </div>
      </div>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-usuarios")?.addEventListener("click", loadUsuarios);
  bindAdminActionButtons();
  document.querySelectorAll<HTMLButtonElement>("[data-delete-user]").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.deleteUser || "";
      const label = button.dataset.userLabel || userId;
      if (!userId) return;
      if (!confirm(`Excluir definitivamente o usuario ${label} e dados vinculados?`)) return;
      button.disabled = true;
      try {
        await fetchJson(`/api/admin/users/${encodeURIComponent(userId)}`, { method: "DELETE" });
        await loadUsuarios();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Falha ao excluir usuario.");
        button.disabled = false;
      }
    });
  });
}

function bindAdminActionButtons(): void {
  const resultBox = document.querySelector<HTMLPreElement>("#admin-action-result");
  document.querySelectorAll<HTMLButtonElement>("[data-admin-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.adminAction as AdminActionKey | undefined;
      if (!action) return;
      const actionLabels: Record<AdminActionKey, string> = {
        backup: "Backup agora",
        clear_logs: "Limpar logs",
        clear_operational: "Limpar dados operacionais",
        reset_financial: "Reset financeiro",
        repair_ownership: "Reparar ownership",
        verify_integrity: "Verificar integridade",
        reset_total: "Reset total",
      };
      const dangerous = new Set<AdminActionKey>(["clear_logs", "clear_operational", "reset_financial", "reset_total"]);
      const body: Record<string, unknown> = {};
      if (dangerous.has(action)) {
        const expected = action === "reset_total" ? "RESET TOTAL" : "CONFIRMAR";
        const confirmation = prompt(`Acao: ${actionLabels[action]}. Um backup sera gerado antes. Digite ${expected} para continuar.`);
        if (confirmation !== expected) return;
      }
      if (action === "reset_total") {
        const password = prompt("Digite a senha fixa de reset total.");
        if (!password) return;
        body.password = password;
      }
      button.disabled = true;
      if (resultBox) {
        resultBox.hidden = false;
        resultBox.textContent = `Executando ${actionLabels[action]}...`;
      }
      try {
        const result = await sendJson<AdminActionResult>(`/api/admin/actions/${action}`, body);
        if (resultBox) {
          resultBox.textContent = JSON.stringify(result, null, 2);
        }
        if (!["verify_integrity", "backup"].includes(action)) {
          window.setTimeout(() => void loadUsuarios(), 1200);
        }
      } catch (error) {
        if (resultBox) {
          resultBox.hidden = false;
          resultBox.textContent = error instanceof Error ? error.message : "Falha na acao administrativa.";
        } else {
          alert(error instanceof Error ? error.message : "Falha na acao administrativa.");
        }
      } finally {
        button.disabled = false;
      }
    });
  });
}

function formatBytes(value: unknown): string {
  const bytes = Number(value || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let amount = bytes;
  let unit = 0;
  while (amount >= 1024 && unit < units.length - 1) {
    amount /= 1024;
    unit += 1;
  }
  return `${amount.toLocaleString("pt-BR", { maximumFractionDigits: unit === 0 ? 0 : 1 })} ${units[unit]}`;
}

async function loadAgenda(): Promise<void> {
  state.selectedEventId = null;
  renderAgenda(true);
  try {
    state.agendaStart = state.agendaWeekStart;
    state.agendaEnd = addDaysToISO(state.agendaWeekStart, 6);
    const params = new URLSearchParams({ inicio: state.agendaStart, fim: state.agendaEnd });
    const year = new Date(`${state.agendaWeekStart}T12:00:00`).getFullYear();
    const [agenda, yearSummary, pacientes, financeiro, appointmentTypes] = await Promise.allSettled([
      fetchJson<AgendaSlot[]>(`/api/web/agenda?${params}`),
      fetchJson<{ ano: number; meses: AgendaYearMonth[] }>(`/api/web/agenda/resumo-anual?ano=${year}`),
      fetchJson<Paciente[]>("/api/web/pacientes?limit=500"),
      fetchJson<Faturamento[]>("/api/web/financeiro?limit=500"),
      fetchJson<AppointmentType[]>("/api/web/appointment-types"),
    ]);
    state.agenda = agenda.status === "fulfilled" ? agenda.value : [];
    if (pacientes.status === "fulfilled") state.pacientes = pacientes.value;
    if (financeiro.status === "fulfilled") state.financeiro = financeiro.value;
    state.appointmentTypes = appointmentTypes.status === "fulfilled" ? appointmentTypes.value : DEFAULT_APPOINTMENT_TYPES;
    state.agendaYearSummary =
      yearSummary.status === "fulfilled" && Array.isArray(yearSummary.value?.meses)
        ? yearSummary.value.meses
        : [];
    renderAgenda();
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar agenda: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

function newAppointmentDrawerHtml(): string {
  const patient = state.appointmentDraftPatientId
    ? state.pacientes.find((item) => item.id === state.appointmentDraftPatientId) || null
    : null;
  const startTime = "08:00";
  const defaultType = appointmentTypeById();
  const endTime = addMinutesToTime(startTime, defaultType.duracaoPadrao || defaultAppointmentDurationMinutes());
  const value = Number(patient?.valorPadraoAtendimento || defaultType.valorPadrao || state.user?.valorPadraoAtendimento || 0);
  return `
    <div class="drawer-backdrop" data-close-drawer="true"></div>
    <aside class="appointment-drawer" aria-label="Novo agendamento">
      <div class="detail">
        <div class="section-title">
          <h2>Novo agendamento</h2>
          <button class="ghost-button" type="button" data-close-drawer="true">Fechar</button>
        </div>
        <div class="notice" role="status" hidden></div>
        <form id="new-appointment-form" class="form-grid">
          <input name="pacienteId" type="hidden" value="${escapeHtml(patient?.id || "")}" />
          <label>Paciente
            <input name="paciente" type="text" list="appointment-patient-options" placeholder="Nome do cliente" value="${escapeHtml(patient?.nomeCompleto || "")}" required />
            <datalist id="appointment-patient-options">
              ${state.pacientes.map((patient) => `<option value="${escapeHtml(patient.nomeCompleto)}"></option>`).join("")}
            </datalist>
          </label>
          <label>Tipo de atendimento
            <select name="tipoAtendimentoId" id="appointment-type-select">
              ${appointmentTypeOptions(defaultType.id)}
            </select>
          </label>
          <div class="form-columns">
            <label>Data
              <input name="data" type="date" value="${todayISO()}" />
            </label>
            <label>Valor
              <input name="valor" type="text" inputmode="decimal" value="${escapeHtml(value ? String(value).replace(".", ",") : "")}" placeholder="Nao faturado" />
            </label>
          </div>
          <div class="form-columns">
            <label>Inicio
              <input name="horaInicio" type="time" value="${escapeHtml(startTime)}" />
            </label>
            <label>Fim
              <input name="horaFim" type="time" value="${escapeHtml(endTime)}" />
            </label>
          </div>
          <label>Status
            <select name="status">
              <option value="aberto">Aberto</option>
              <option value="concluido">Concluido</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </label>
          <label>Modelo de cobranca
            <select name="billingModel">
              <option value="INDIVIDUAL">Individual</option>
              <option value="PACKAGE">Usar pacote</option>
              <option value="EXEMPT">Isento</option>
            </select>
          </label>
          <div class="form-columns">
            <label>Desconto
              <select name="discountType">
                <option value="NONE">Sem desconto</option>
                <option value="PERCENTAGE">Percentual</option>
                <option value="FIXED_AMOUNT">Valor fixo</option>
              </select>
            </label>
            <label>Valor do desconto
              <input name="discountValue" type="text" inputmode="decimal" placeholder="0" />
            </label>
          </div>
          <label>Tipo de isencao
            <select name="exemptionType">
              <option value="">Nao se aplica</option>
              <option value="VIP">VIP</option>
              <option value="CORTESIA">Cortesia</option>
              <option value="PRO_BONO">Pro bono</option>
              <option value="FAMILIAR">Familiar</option>
              <option value="PARCERIA">Parceria</option>
              <option value="FUNCIONARIO">Funcionario</option>
              <option value="PERMUTA">Permuta</option>
              <option value="GARANTIA_RETORNO">Garantia/retorno</option>
              <option value="AJUSTE_COMERCIAL">Ajuste comercial</option>
              <option value="OUTRO">Outro</option>
            </select>
          </label>
          <label>Observacoes
            <textarea name="observacoes" rows="4"></textarea>
          </label>
          <button class="primary-button" type="submit">Salvar agendamento</button>
        </form>
      </div>
    </aside>
  `;
}

function bindNewAppointmentDrawer(rerender: () => void): void {
  const drawer = document.querySelector<HTMLElement>('aside[aria-label="Novo agendamento"]');
  if (!drawer) return;
  const closeDrawer = () => {
    state.appointmentDrawerOpen = false;
    state.appointmentDraftPatientId = null;
    rerender();
  };
  [
    ...drawer.querySelectorAll<HTMLElement>('[data-close-drawer="true"]'),
    ...document.querySelectorAll<HTMLElement>('.drawer-backdrop[data-close-drawer="true"]'),
  ].forEach((element) => {
    element.addEventListener("click", () => {
      closeDrawer();
    });
  });
  const form = drawer.querySelector<HTMLFormElement>("#new-appointment-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitNewAppointment(event.currentTarget);
  });
  if (form) {
    bindAutoEndTime(form);
    bindAppointmentTypeDefaults(form);
  }
}

async function submitNewAppointment(form: HTMLFormElement): Promise<void> {
  const data = new FormData(form);
  const patientId = String(data.get("pacienteId") || "").trim();
  const patientName = String(data.get("paciente") || "").trim();
  const appointmentTypeId = String(data.get("tipoAtendimentoId") || "").trim();
  const appointmentType = appointmentTypeById(appointmentTypeId);
  const service = appointmentType.nome || "Atendimento";
  const appointmentDate = String(data.get("data") || "").trim();
  const startTime = String(data.get("horaInicio") || "").trim();
  const endTime = String(data.get("horaFim") || "").trim();
  const status = String(data.get("status") || "aberto").trim() || "aberto";
  const observation = String(data.get("observacoes") || "").trim();
  const patient = patientId ? state.pacientes.find((item) => item.id === patientId) || null : findPatientByName(patientName);
  const value = parseMoneyInput(data.get("valor")) || Number(patient?.valorPadraoAtendimento || appointmentType.valorPadrao || state.user?.valorPadraoAtendimento || 0);
  const notice = document.querySelector<HTMLDivElement>(".appointment-drawer .notice");
  if (!patientName || !appointmentDate || !startTime) {
    if (notice) {
      notice.hidden = false;
      notice.className = "notice error";
      notice.textContent = "Informe paciente, data e horario inicial.";
    }
    return;
  }
  const payload = {
    pacienteId: patient?.id || "",
    patientId: patient?.id || "",
    pacienteNome: patientName,
    patientName,
    nomeCompleto: patientName,
    servico: service,
    service,
    tipoAtendimentoId: appointmentTypeId,
    appointmentTypeId,
    data: appointmentDate,
    horaInicio: startTime,
    horaFim: endTime,
    startAt: `${appointmentDate} ${startTime}:00`,
    endAt: endTime ? `${appointmentDate} ${endTime}:00` : "",
    status,
    valorAtendimento: value,
    valor: value,
    billingModel: String(data.get("billingModel") || "INDIVIDUAL"),
    discountType: String(data.get("discountType") || "NONE"),
    discountValue: parseMoneyInput(data.get("discountValue")) || Number(data.get("discountValue") || 0),
    exemptionType: String(data.get("exemptionType") || ""),
    exemptionReason: observation,
    observacao: observation,
    observacoes: observation,
  };
  if (notice) {
    notice.hidden = false;
    notice.className = "notice info";
    notice.textContent = "Salvando agendamento...";
  }
  try {
    await sendJson<AgendaSlot>("/api/web/agenda", payload);
    state.appointmentDrawerOpen = false;
    state.appointmentDraftPatientId = null;
    if (state.route === "evolucoes") {
      await loadEvolucoes();
    } else {
      await loadAgenda();
    }
  } catch (error) {
    if (notice) {
      notice.hidden = false;
      notice.className = "notice error";
      notice.textContent = error instanceof Error ? error.message : "Falha ao salvar agendamento.";
    }
  }
}

function renderAgenda(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const filteredAgenda = filteredAgendaSlots();
  const selected = state.agenda.find((slot) => slot.id === state.selectedEventId) || null;
  const weekDays = weekDaysFrom(state.agendaWeekStart);
  const totals = agendaTotals(state.agenda);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
    new Date(`${state.agendaWeekStart}T12:00:00`),
  );
  view.innerHTML = `
    <header class="page-header">
      <div>
        <h1>Agenda</h1>
        <p>Semana de ${formatDate(state.agendaStart)} a ${formatDate(state.agendaEnd)}.</p>
      </div>
      <div class="button-row">
        <button class="secondary-button icon-only icon-refresh" id="refresh-agenda" type="button" aria-label="Atualizar" title="Atualizar"></button>
        <button class="primary-button" id="new-appointment-mock" type="button">Novo agendamento</button>
      </div>
    </header>
    <section class="calendar-shell">
      <div class="calendar-topline">
        <div class="calendar-nav-stack">
          <div class="calendar-nav">
          <button class="ghost-button icon-button arrow-button" id="prev-week" type="button" title="Semana anterior">&laquo;</button>
          <button class="secondary-button" id="today-week" type="button">HOJE</button>
          <button class="ghost-button icon-button arrow-button" id="next-week" type="button" title="Proxima semana">&raquo;</button>
            <button class="calendar-month-trigger" id="agenda-month-picker" type="button" aria-expanded="${state.agendaMonthPickerOpen}">${escapeHtml(monthLabel)}</button>
            ${state.agendaMonthPickerOpen ? `<div class="agenda-month-popover">${agendaMonthPickerHtml(state.agendaPickerMonth || state.agendaWeekStart)}</div>` : ""}
          </div>
          <div class="status-strip">
            <span>Futuros: ${totals.future}</span>
            <span>Retroativos: ${totals.retro}</span>
            <span>Pend. faturamento: ${totals.pending}</span>
          </div>
        </div>
        <div class="calendar-actions calendar-inline-controls">
          <label>Status
            <select id="agenda-status">
              <option value="todos" ${state.agendaStatus === "todos" ? "selected" : ""}>Todos</option>
              <option value="aberto" ${state.agendaStatus === "aberto" ? "selected" : ""}>Abertos</option>
              <option value="concluido" ${state.agendaStatus === "concluido" ? "selected" : ""}>Concluidos</option>
              <option value="cancelado" ${state.agendaStatus === "cancelado" ? "selected" : ""}>Cancelados</option>
            </select>
          </label>
          <label>Visualizacao
            <select id="agenda-view">
              <option value="semana" ${state.agendaView === "semana" ? "selected" : ""}>Semana</option>
              <option value="mes" ${state.agendaView === "mes" ? "selected" : ""}>Mensal</option>
              <option value="ano" ${state.agendaView === "ano" ? "selected" : ""}>Anual</option>
            </select>
          </label>
          <button class="ghost-button" id="apply-agenda-filter" type="button">Filtros</button>
        </div>
      </div>
      <div class="agenda-month-rail" aria-label="Navegar por meses">
        ${agendaMonthRailHtml(state.agendaWeekStart)}
      </div>
      ${loading ? `<div class="loading">Carregando agenda...</div>` : ""}
      <div class="calendar-workspace">
        <div class="calendar-main">
          <div class="calendar-grid-scroller">
            ${
              state.agendaView === "ano"
                ? yearGridHtml(state.agendaWeekStart, state.agendaYearSummary)
                : state.agendaView === "mes"
                  ? monthGridHtml(state.agendaWeekStart, filteredAgenda)
                  : weekGridHtml(weekDays, filteredAgenda)
            }
          </div>
          <div class="content-panel agenda-list-panel dense-panel">
            <div class="section-title"><h2>Atendimentos da semana</h2></div>
            <div class="agenda-list">
              ${filteredAgenda.map(eventCardHtml).join("") || `<div class="empty">Nenhum atendimento no filtro atual.</div>`}
            </div>
          </div>
        </div>
      </div>
      ${selected ? `<div class="drawer-backdrop" data-close-drawer="true"></div><aside class="appointment-drawer" aria-label="Detalhes do atendimento">${eventDetailHtml(selected)}</aside>` : ""}
      ${state.appointmentDrawerOpen ? newAppointmentDrawerHtml() : ""}
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-agenda")?.addEventListener("click", loadAgenda);
  document.querySelector<HTMLButtonElement>("#new-appointment-mock")?.addEventListener("click", () => {
    state.selectedEventId = null;
    state.appointmentDrawerOpen = true;
    renderAgenda();
  });
  window.requestAnimationFrame(scrollAgendaToCurrentHour);
  document.querySelector<HTMLButtonElement>("#prev-week")?.addEventListener("click", async () => {
    state.agendaWeekStart = addDaysToISO(state.agendaWeekStart, -7);
    state.selectedEventId = null;
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#today-week")?.addEventListener("click", () => {
    state.agendaMonthPickerOpen = !state.agendaMonthPickerOpen;
    state.agendaPickerMonth = state.agendaMonthPickerOpen ? state.agendaWeekStart : null;
    renderAgenda();
  });
  document.querySelector<HTMLButtonElement>("#agenda-month-picker")?.addEventListener("click", () => {
    state.agendaMonthPickerOpen = !state.agendaMonthPickerOpen;
    state.agendaPickerMonth = state.agendaMonthPickerOpen ? state.agendaWeekStart : null;
    renderAgenda();
  });
  view.querySelector<HTMLButtonElement>("#agenda-picker-prev")?.addEventListener("click", () => {
    state.agendaPickerMonth = shiftMonthISO(state.agendaPickerMonth || state.agendaWeekStart, -1);
    renderAgenda();
  });
  view.querySelector<HTMLButtonElement>("#agenda-picker-next")?.addEventListener("click", () => {
    state.agendaPickerMonth = shiftMonthISO(state.agendaPickerMonth || state.agendaWeekStart, 1);
    renderAgenda();
  });
  document.querySelector<HTMLButtonElement>("#next-week")?.addEventListener("click", async () => {
    state.agendaWeekStart = addDaysToISO(state.agendaWeekStart, 7);
    state.selectedEventId = null;
    await loadAgenda();
  });
  view.querySelectorAll<HTMLButtonElement>("[data-agenda-month]").forEach((button) => {
    button.addEventListener("click", async () => {
      const month = button.dataset.agendaMonth;
      if (!month) return;
      state.agendaWeekStart = startOfWeekISO(new Date(`${month}-01T12:00:00`));
      state.selectedEventId = null;
      await loadAgenda();
    });
  });
  view.querySelectorAll<HTMLButtonElement>("[data-agenda-picker-day]").forEach((button) => {
    button.addEventListener("click", async () => {
      const day = button.dataset.agendaPickerDay;
      if (!day) return;
      state.agendaWeekStart = startOfWeekISO(new Date(`${day}T12:00:00`));
      state.agendaMonthPickerOpen = false;
      state.agendaPickerMonth = null;
      state.selectedEventId = null;
      await loadAgenda();
    });
  });
  document.querySelector<HTMLButtonElement>("#apply-agenda-filter")?.addEventListener("click", () => {
    state.agendaStatus = document.querySelector<HTMLSelectElement>("#agenda-status")?.value || "todos";
    state.agendaView = (document.querySelector<HTMLSelectElement>("#agenda-view")?.value as AppState["agendaView"]) || "semana";
    renderAgenda();
  });
  document.querySelector<HTMLSelectElement>("#agenda-view")?.addEventListener("change", (event) => {
    state.agendaView = event.currentTarget.value as AppState["agendaView"];
    renderAgenda();
  });
  bindNewAppointmentDrawer(() => renderAgenda());
  view.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(isAppRoute(nextRoute) ? nextRoute : "dashboard");
      await loadCurrentRoute();
    });
  });
  bindAppointmentCards(() => renderAgenda());
  bindAppointmentDrawerActions(() => loadAgenda(), () => renderAgenda());
}

function agendaMonthRailHtml(anchorISO: string): string {
  const anchor = new Date(`${anchorISO}T12:00:00`);
  const selectedMonth = `${anchor.getFullYear()}-${String(anchor.getMonth() + 1).padStart(2, "0")}`;
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  return Array.from({ length: 9 }, (_, index) => {
    const date = new Date(anchor.getFullYear(), anchor.getMonth() + index - 4, 1, 12);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = monthNames[date.getMonth()];
    return `<button class="agenda-month-option ${key === selectedMonth ? "active" : ""}" type="button" data-agenda-month="${key}" aria-pressed="${key === selectedMonth}">${escapeHtml(label)}</button>`;
  }).join("");
}

function agendaMonthPickerHtml(anchorISO: string): string {
  const anchor = new Date(`${anchorISO}T12:00:00`);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(anchor);
  const firstWeekday = new Date(year, month, 1, 12).getDay();
  const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
  const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];
  const days = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return `<span class="agenda-picker-blank" aria-hidden="true"></span>`;
    const dayNumber = index - firstWeekday + 1;
    const day = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
    const holiday = calendarHoliday(day);
    return `<button class="agenda-picker-day ${day === todayISO() ? "today" : ""} ${holiday ? `is-${holiday.type}` : ""}" type="button" data-agenda-picker-day="${day}" title="${escapeHtml(holiday?.label || formatDate(day))}">${dayNumber}</button>`;
  }).join("");
  return `<div class="agenda-picker-header"><button class="agenda-picker-arrow" id="agenda-picker-prev" type="button" aria-label="Mes anterior">${navIcon("chevronLeft")}</button><div class="agenda-picker-title">${escapeHtml(label)}</div><button class="agenda-picker-arrow" id="agenda-picker-next" type="button" aria-label="Proximo mes">${navIcon("chevronRight")}</button></div><div class="agenda-picker-weekdays">${weekdays.map((day) => `<span>${day}</span>`).join("")}</div><div class="agenda-picker-days">${days}</div><div class="agenda-picker-legend"><span class="holiday">Feriado</span><span class="optional">Ponto facultativo</span></div>`;
}

async function saveAppointmentPayment(
  eventId: string,
  payload: Record<string, unknown>,
  reload: () => Promise<void> = () => loadAgenda(),
  rerender: () => void = () => renderAgenda(),
): Promise<void> {
  state.paymentSaving = true;
  rerender();
  try {
    await sendJson(`/api/web/agenda/${encodeURIComponent(eventId)}/pagamento`, payload);
    state.appointmentTab = "financeiro";
    await reload();
    state.selectedEventId = eventId;
    state.appointmentTab = "financeiro";
    state.paymentSaving = false;
    rerender();
  } catch (error) {
    state.paymentSaving = false;
    rerender();
    alert(error instanceof Error ? error.message : "Falha ao registrar pagamento.");
  } finally {
    state.paymentSaving = false;
  }
}

function filteredAgendaSlots(): AgendaSlot[] {
  const term = state.agendaSearch.toLowerCase();
  return state.agenda.filter((slot) => {
    if (state.agendaStatus !== "todos" && slot.status !== state.agendaStatus) return false;
    if (!term) return true;
    const patientName = slot.clientes?.[0]?.nomeCompleto || "";
    return [slot.servico, slot.profissionalNome, patientName, slot.observacao]
      .some((value) => String(value || "").toLowerCase().includes(term));
  });
}

function agendaTotals(slots: AgendaSlot[]): { future: number; retro: number; pending: number } {
  const today = todayISO();
  return {
    future: slots.filter((slot) => slot.data >= today).length,
    retro: slots.filter((slot) => slot.data < today).length,
    pending: slots.filter((slot) => slot.temPendencia || slot.statusFinanceiro === "pendente").length,
  };
}

function weekGridHtml(weekDays: string[], slots: AgendaSlot[]): string {
  const hours = Array.from({ length: 17 }, (_, index) => index + 6);
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  return `
    <div class="week-grid">
      <div class="week-head time-head"></div>
      ${weekDays
        .map((day) => {
          const date = new Date(`${day}T12:00:00`);
          const holiday = calendarHoliday(day);
          return `<div class="week-head ${day === todayISO() ? "today" : ""} ${holiday ? `is-${holiday.type}` : ""}" title="${escapeHtml(holiday?.label || "")}"><span>${labels[date.getDay()]}.</span><strong>${date.getDate()}</strong>${holiday ? `<small>${escapeHtml(holiday.label)}</small>` : ""}</div>`;
        })
        .join("")}
      ${hours
        .map(
          (hour) => `
            <div class="hour-cell">${String(hour).padStart(2, "0")}:00</div>
            ${weekDays
              .map((day) => {
                const cellSlots = slots.filter((slot) => slot.data === day && Number((slot.horaInicio || "0").slice(0, 2)) === hour);
                const holiday = calendarHoliday(day);
                return `<div class="week-cell ${day === todayISO() ? "today-bg" : ""} ${holiday ? `is-${holiday.type}` : ""}" title="${escapeHtml(holiday?.label || "")}">
                  ${cellSlots.map(calendarChipHtml).join("")}
                </div>`;
              })
              .join("")}
          `,
        )
        .join("")}
    </div>
  `;
}

function monthGridHtml(anchorISO: string, slots: AgendaSlot[]): string {
  const anchor = new Date(`${anchorISO}T12:00:00`);
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date.toISOString().slice(0, 10);
  });
  return `
    <div class="month-grid">
      ${labels.map((label) => `<div class="month-head">${label}</div>`).join("")}
      ${days
        .map((day) => {
          const date = new Date(`${day}T12:00:00`);
          const daySlots = slots.filter((slot) => slot.data === day);
          const holiday = calendarHoliday(day);
          return `
            <button class="month-cell ${date.getMonth() === anchor.getMonth() ? "" : "muted-month"} ${day === todayISO() ? "today" : ""} ${holiday ? `is-${holiday.type}` : ""}" type="button" title="${escapeHtml(holiday?.label || "")}">
              <strong>${date.getDate()}</strong>
              ${holiday ? `<small>${escapeHtml(holiday.label)}</small>` : ""}
              ${daySlots
                .slice(0, 3)
                .map((slot) => `<span>${escapeHtml(slot.horaInicio || "")} ${escapeHtml(slot.clientes?.[0]?.nomeCompleto || slot.servico || "Atendimento")}</span>`)
                .join("")}
              ${daySlots.length > 3 ? `<small>+${daySlots.length - 3}</small>` : ""}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function yearGridHtml(anchorISO: string, months: AgendaYearMonth[]): string {
  const year = new Date(`${anchorISO}T12:00:00`).getFullYear();
  const byMonth = new Map(months.map((item) => [item.mes, item]));
  const formatter = new Intl.DateTimeFormat("pt-BR", { month: "long" });
  return `
    <div class="year-grid">
      ${Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const item = byMonth.get(month) || { chave: `${year}-${String(month).padStart(2, "0")}`, mes: month, executados: 0, abertos: 0, cancelados: 0, total: 0 };
        const label = formatter.format(new Date(year, index, 1));
        return `
          <button class="year-card" type="button" data-year-month="${escapeHtml(item.chave)}">
            <div>
              <span>${escapeHtml(label)}</span>
              <strong>${escapeHtml(item.total)}</strong>
            </div>
            <dl>
              <div><dt>Executados</dt><dd>${escapeHtml(item.executados)}</dd></div>
              <div><dt>Abertos</dt><dd>${escapeHtml(item.abertos)}</dd></div>
              <div><dt>Cancelados</dt><dd>${escapeHtml(item.cancelados)}</dd></div>
            </dl>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function calendarChipHtml(slot: AgendaSlot): string {
  const cliente = slot.clientes?.[0];
  const status = String(slot.status || "aberto").toLowerCase();
  const capacity = slot.clientes?.length || 0;
  const financial = slotFinancialStatus(slot) || "pendente";
  return `
    <button class="calendar-chip ${escapeHtml(status)}" type="button" data-event-id="${escapeHtml(slot.id)}">
      <span class="chip-time">${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? ` - ${escapeHtml(slot.horaFim)}` : ""}</span>
      <span>${escapeHtml(cliente?.nomeCompleto || slot.servico || "Atendimento")}</span>
      <small>${escapeHtml(slot.servico || "Fisioterapia")} &middot; ${capacity} / sem limite</small>
      <em class="finance-mini ${financialPillClass(financial)}">${escapeHtml(displaySlotMoney(slot))} &middot; ${escapeHtml(financial)}</em>
    </button>
  `;
}

function scrollAgendaToCurrentHour(): void {
  const grid = document.querySelector<HTMLDivElement>(".week-grid");
  if (!grid) return;
  const currentHour = new Date().getHours();
  grid.scrollTop = Math.max(0, currentHour - 1) * 84;
}

function eventCardHtml(slot: AgendaSlot): string {
  const cliente = slot.clientes?.[0];
  const status = String(slot.status || "aberto").toLowerCase();
  const financial = slotFinancialStatus(slot) || "pendente";
  return `
    <button class="event-card ${escapeHtml(status)}" type="button" data-event-id="${escapeHtml(slot.id)}">
      <strong>${escapeHtml(cliente?.nomeCompleto || slot.servico || "Atendimento")}</strong>
      <div class="event-meta">
        <span>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? `-${escapeHtml(slot.horaFim)}` : ""}</span>
        <span>${escapeHtml(slot.servico || "Fisioterapia")}</span>
        <span>${escapeHtml(displaySlotMoney(slot))}</span>
        <span class="pill ${financialPillClass(financial)}">${escapeHtml(financial)}</span>
        ${cliente?.temEvolucao ? `<span class="pill ok">com evolucao</span>` : `<span class="pill warn">sem evolucao</span>`}
      </div>
    </button>
  `;
}

function eventDetailHtml(slot: AgendaSlot): string {
  const cliente = slot.clientes?.[0] || {};
  const canEdit = slot.podeEditar !== false;
  const financial = slotFinancialStatus(slot) || "pendente";
  const tab = state.appointmentTab;
  return `
    <div class="detail">
      <div class="section-title">
        <h2>Detalhes</h2>
        <button class="ghost-button compact-button" type="button" data-close-drawer="true">Fechar</button>
        <span class="pill ${slot.status === "concluido" ? "ok" : slot.status === "cancelado" ? "warn" : ""}">${escapeHtml(slot.status || "aberto")}</span>
      </div>
      <div class="detail-hero">
        <strong>${escapeHtml(cliente.nomeCompleto || slot.servico || "Atendimento")}</strong>
        <span>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? `-${escapeHtml(slot.horaFim)}` : ""}</span>
      </div>
      <div class="appointment-tabs">
        <button class="${tab === "atendimento" ? "active" : ""}" type="button" data-appointment-tab="atendimento">Atendimento</button>
        <button class="${tab === "financeiro" ? "active" : ""}" type="button" data-appointment-tab="financeiro">Financeiro</button>
        <button class="${tab === "historico" ? "active" : ""}" type="button" data-appointment-tab="historico">Historico</button>
      </div>
      ${
        tab === "financeiro"
          ? appointmentFinanceTabHtml(slot)
          : tab === "historico"
            ? appointmentHistoryTabHtml(slot)
            : appointmentAttendanceTabHtml(slot, canEdit, financial)
      }
    </div>
  `;
}

function appointmentAttendanceTabHtml(slot: AgendaSlot, canEdit: boolean, financial: string): string {
  const cliente = slot.clientes?.[0] || {};
  return `
    <div class="detail-row"><span>Paciente</span><strong>${escapeHtml(cliente.nomeCompleto || "-")}</strong></div>
    <div class="detail-row"><span>Data e horario</span><strong>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? `-${escapeHtml(slot.horaFim)}` : ""}</strong></div>
    <div class="detail-row"><span>Servico</span><strong>${escapeHtml(slot.servico || "Fisioterapia")}</strong></div>
    <div class="detail-row"><span>Financeiro</span><strong>${escapeHtml(displaySlotMoney(slot))} - ${escapeHtml(financial)}</strong></div>
    <div class="detail-row"><span>Evolucao</span><p>${escapeHtml(slot.evolucao || cliente.evolucao || "Sem evolucao registrada.")}</p></div>
    <div class="button-row">
      <button class="secondary-button" id="complete-event" type="button">Concluir</button>
      <button class="ghost-button" id="cancel-event" type="button" ${canEdit ? "" : "disabled"}>Cancelar</button>
    </div>
    <form id="reschedule-form" class="form-grid">
      <div class="button-row">
        <label>Nova data
          <input name="data" type="date" value="${escapeHtml(slot.data)}" ${canEdit ? "" : "disabled"} />
        </label>
        <label>Inicio
          <input name="horaInicio" type="time" value="${escapeHtml(slot.horaInicio || "")}" ${canEdit ? "" : "disabled"} />
        </label>
        <label>Fim
          <input name="horaFim" type="time" value="${escapeHtml(slot.horaFim || "")}" ${canEdit ? "" : "disabled"} />
        </label>
      </div>
      <button class="primary-button" type="submit" ${canEdit ? "" : "disabled"}>Reagendar</button>
    </form>
  `;
}

function appointmentFinanceTabHtml(slot: AgendaSlot): string {
  const status = slotFinancialStatus(slot) || "pendente";
  const value = slotValue(slot);
  const reference = Number(slot.valorReferencia || value || 0);
  const paid = slotPaidAmount(slot);
  const open = slotOpenBalance(slot);
  const patient = slotPatient(slot);
  const credit = Number(patient?.creditoDisponivel || 0);
  const payments = slotPayments(slot);
  const defaultPayment = open > 0 ? open : value;
  return `
    <section class="appointment-finance">
      <div class="finance-summary-grid">
        <div><span>Modelo</span><strong>${escapeHtml(billingModelLabel(slot.billingModel))}</strong></div>
        <div><span>Valor base</span><strong>${formatMoney(reference)}</strong></div>
        <div><span>Valor final</span><strong>${formatMoney(value)}</strong></div>
        <div><span>Status</span><strong class="pill ${financialPillClass(status)}">${escapeHtml(status)}</strong></div>
        <div><span>Recebido</span><strong>${formatMoney(paid)}</strong></div>
        <div><span>Saldo</span><strong>${formatMoney(open)}</strong></div>
      </div>
      <div class="detail-row"><span>Credito do paciente</span><strong>${formatMoney(credit)}</strong></div>
      <form id="appointment-payment-form" class="payment-form">
        <div class="form-columns">
          <label>Valor recebido
            <input name="valor" type="text" inputmode="decimal" value="${escapeHtml(String(defaultPayment || "").replace(".", ","))}" />
          </label>
          <label>Forma
            <select name="formaPagamento">${paymentMethodOptions("pix")}</select>
          </label>
        </div>
        <label>Observacao
          <textarea name="observacao" rows="3" placeholder="Opcional"></textarea>
        </label>
        <div class="button-row">
          <button class="primary-button" type="submit" ${state.paymentSaving ? "disabled" : ""}>${state.paymentSaving ? "Salvando..." : "Registrar pagamento"}</button>
          <button class="ghost-button" id="use-credit-payment" type="button" ${credit > 0 && open > 0 ? "" : "disabled"}>Consumir credito do paciente</button>
        </div>
      </form>
      <div class="payment-history">
        <h3>Pagamentos realizados</h3>
        ${
          payments.length
            ? payments.map((item) => `
                <div class="payment-row">
                  <span>${formatDate(item.dataPagamento || item.data)}</span>
                <strong>${formatMoney(item.valorPago || item.valorAtendimento)}</strong>
                  <em>${paymentMethodLabel(item.formaPagamento)}</em>
                  <span class="pill ${financialPillClass(item.statusFinanceiro)}">${escapeHtml(item.statusFinanceiro || "pendente")}</span>
                </div>
              `).join("")
            : `<div class="empty">Nenhum pagamento registrado para este atendimento.</div>`
        }
      </div>
    </section>
  `;
}

function appointmentHistoryTabHtml(slot: AgendaSlot): string {
  const patientId = slotPatientId(slot);
  const evolutions = state.evolucoes.filter((item) => item.pacienteId === patientId).slice(0, 5);
  return `
    <section class="payment-history">
      <h3>Historico recente</h3>
      ${
        evolutions.length
          ? evolutions.map((item) => `
              <div class="timeline-item">
                <div class="timeline-header"><strong>${escapeHtml(item.pacienteNome || "Paciente")}</strong><span>${formatDate(item.data)}</span></div>
                <p>${escapeHtml(item.texto || "-")}</p>
              </div>
            `).join("")
          : `<div class="empty">Sem historico carregado para este paciente.</div>`
      }
    </section>
  `;
}

void bootstrap();

