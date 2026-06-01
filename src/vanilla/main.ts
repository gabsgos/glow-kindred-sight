import "./styles.css";

type User = {
  nomeCompleto?: string;
  nomeExibicao?: string;
  login?: string;
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

type Paciente = {
  id: string;
  nomeCompleto: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
  observacoes?: string;
  valorPadraoAtendimento?: number;
  creditoDisponivel?: number;
  ativo?: boolean;
  totalAtendimentos?: number;
  totalPendente?: number;
  totalPago?: number;
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
  data: string;
  horaInicio: string;
  horaFim?: string;
  profissionalNome?: string;
  status?: string;
  clientes?: AgendaCliente[];
  observacao?: string;
  temPendencia?: boolean;
  valorAtendimento?: number;
  statusFinanceiro?: string;
  evolucao?: string;
  podeEditar?: boolean;
};

type Evolucao = {
  id: string;
  pacienteId?: string;
  pacienteNome?: string;
  data?: string;
  texto?: string;
  conduta?: string;
  profissionalNome?: string;
};

type Faturamento = {
  id: string;
  pacienteId?: string;
  nomeCompleto?: string;
  data?: string;
  dataPagamento?: string;
  formaPagamento?: string;
  valorAtendimento?: number;
  statusFinanceiro?: string;
};

type AppState = {
  user: User | null;
  route: "dashboard" | "pacientes" | "agenda" | "evolucoes" | "financeiro" | "relatorios" | "recursos";
  agenda: AgendaSlot[];
  pacientes: Paciente[];
  evolucoes: Evolucao[];
  financeiro: Faturamento[];
  patientFinance: Faturamento[];
  patientEvolutions: Evolucao[];
  selectedPatientId: string | null;
  patientSearch: string;
  reportTab: "atendimentos" | "financeiro" | "pacientes";
  selectedEventId: string | null;
  agendaStart: string;
  agendaEnd: string;
  agendaWeekStart: string;
  agendaSearch: string;
  agendaStatus: string;
  loading: boolean;
};

const app = document.querySelector<HTMLDivElement>("#app");

const state: AppState = {
  user: null,
  route: "dashboard",
  agenda: [],
  pacientes: [],
  evolucoes: [],
  financeiro: [],
  patientFinance: [],
  patientEvolutions: [],
  selectedPatientId: null,
  patientSearch: "",
  reportTab: "atendimentos",
  selectedEventId: null,
  agendaStart: todayISO(),
  agendaEnd: addDaysISO(7),
  agendaWeekStart: startOfWeekISO(new Date()),
  agendaSearch: "",
  agendaStatus: "todos",
  loading: false,
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
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

function setDocumentRoute(route: AppState["route"]): void {
  state.route = route;
  const pathByRoute = {
    dashboard: "/dashboard",
    pacientes: "/pacientes",
    agenda: "/agenda",
    evolucoes: "/evolucoes",
    financeiro: "/financeiro/caixa",
    relatorios: "/relatorios",
    recursos: "/recursos",
  };
  history.replaceState(null, "", pathByRoute[route]);
  renderAppShell();
}

async function bootstrap(): Promise<void> {
  if (!app) return;
  try {
    const session = await fetchJson<SessionPayload>("/api/web/session");
    if (session.authenticated || !session.authRequired) {
      state.user = session.user;
      const path = window.location.pathname;
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
                  : "dashboard";
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
    <main class="auth-shell">
      <section class="auth-panel" aria-label="Login FisioBot">
        <div class="auth-box">
          <div class="brand">
            <div class="brand-mark" aria-hidden="true">F</div>
            <div>
              <p class="brand-title">FisioBot</p>
              <div class="brand-subtitle">cockpit clinico</div>
            </div>
          </div>
          <div class="panel login-card">
            <h1>Entrar</h1>
            <p class="hint">Acesse agenda, pacientes e rotina clinica com sua conta do FisioBot.</p>
            <div id="notice" class="notice ${errorMessage ? "error" : ""}" role="status">${escapeHtml(errorMessage)}</div>
            <form id="login-form" class="form-grid" autocomplete="off" novalidate>
              <label>Usuario
                <input id="login" name="login" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required />
              </label>
              <label>Senha
                <input id="secret" name="secret" type="password" autocomplete="current-password" required />
              </label>
              <label class="check-row">
                <input id="remember" name="remember" type="checkbox" checked />
                Manter este dispositivo autorizado
              </label>
              <button class="primary-button" id="submit" type="submit">Entrar no sistema</button>
            </form>
          </div>
        </div>
      </section>
      <section class="auth-copy" aria-hidden="true">
        <div>
          <h2>Rotina clinica rapida, sem carregar o painel React.</h2>
          <p>Esta versao usa HTML e JavaScript simples para validar o foco em campos, navegar pela agenda e consumir os dados do backend local.</p>
          <div class="feature-grid">
            <div class="feature"><strong>Login</strong><span>Sessao pelo Flask, sem SPA.</span></div>
            <div class="feature"><strong>Inicio</strong><span>Resumo carregado sob demanda.</span></div>
            <div class="feature"><strong>Agenda</strong><span>Eventos vindos do banco do tablet.</span></div>
          </div>
        </div>
      </section>
    </main>
  `;
  document.querySelector<HTMLFormElement>("#login-form")?.addEventListener("submit", handleLogin);
}

function renderLoginCode(login: string, message: string): void {
  if (!app) return;
  app.innerHTML = `
    <main class="auth-shell">
      <section class="auth-panel" aria-label="Codigo FisioBot">
        <div class="auth-box">
          <div class="brand">
            <div class="brand-mark" aria-hidden="true">F</div>
            <div>
              <p class="brand-title">FisioBot</p>
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
          <p>A tela permanece fora do bundle React para isolar travamentos de foco e teclado.</p>
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
  const navGroups: Array<{ label: string; items: Array<{ route: AppState["route"]; icon: string; title: string }> }> = [
    { label: "Geral", items: [{ route: "dashboard", icon: "⌂", title: "Inicio" }] },
    {
      label: "Operacao",
      items: [
        { route: "pacientes", icon: "◉", title: "Pacientes" },
        { route: "agenda", icon: "▦", title: "Agenda" },
        { route: "evolucoes", icon: "✎", title: "Evolucoes" },
      ],
    },
    {
      label: "Gestao",
      items: [
        { route: "financeiro", icon: "$", title: "Financeiro" },
        { route: "relatorios", icon: "▤", title: "Relatorios" },
        { route: "recursos", icon: "⚙", title: "Recursos" },
      ],
    },
  ];
  app.innerHTML = `
    <main class="app-shell">
      <aside class="sidebar">
        <div class="brand shell-brand">
          <div class="brand-mark" aria-hidden="true">F</div>
          <div>
            <p class="brand-title">FisioBot</p>
            <div class="brand-subtitle">cockpit clinico</div>
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
                          <b aria-hidden="true">${item.icon}</b>
                          ${item.title}
                        </button>
                      `,
                    )
                    .join("")}
                </div>
              `,
            )
            .join("")}
        </nav>
      </aside>
      <section class="main">
        <header class="global-topbar">
          <button class="sidebar-toggle" type="button" aria-label="Menu">☰</button>
          <div class="global-search" role="search">
            <span aria-hidden="true">⌕</span>
            <input id="global-search" type="text" placeholder="Pesquisar paciente, atendimento ou relatorio" autocomplete="off" />
          </div>
          <div class="topbar-actions">
            <span class="status-dot ok" title="Backend ativo"></span>
            <span class="user-chip">${escapeHtml(userName)}</span>
            <button class="ghost-button icon-button" id="logout" type="button" title="Sair">⇥</button>
          </div>
        </header>
        <div id="view"></div>
      </section>
    </main>
  `;
  document.querySelector<HTMLButtonElement>(".sidebar-toggle")?.addEventListener("click", () => {
    document.querySelector<HTMLElement>(".sidebar")?.classList.toggle("open");
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
  document.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(isAppRoute(nextRoute) ? nextRoute : "dashboard");
      await loadCurrentRoute();
    });
  });
  document.querySelector<HTMLButtonElement>("#logout")?.addEventListener("click", async () => {
    await sendJson("/api/web/logout");
    state.user = null;
    history.replaceState(null, "", "/");
    renderLogin();
  });
  renderCurrentRoute();
}

function isAppRoute(value: unknown): value is AppState["route"] {
  return ["dashboard", "pacientes", "agenda", "evolucoes", "financeiro", "relatorios", "recursos"].includes(String(value));
}

function renderCurrentRoute(): void {
  if (state.route === "agenda") renderAgenda();
  else if (state.route === "pacientes") renderPacientes();
  else if (state.route === "evolucoes") renderEvolucoes();
  else if (state.route === "financeiro") renderFinanceiro();
  else if (state.route === "relatorios") renderRelatorios();
  else if (state.route === "recursos") renderRecursos();
  else renderDashboard();
}

async function loadCurrentRoute(): Promise<void> {
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
    state.selectedEventId = agenda[0]?.id || null;
    renderDashboard(pacientes, agenda, evolucoes, financeiro);
  } catch (error) {
    view.innerHTML = `<div class="notice error">Falha ao carregar inicio: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
  }
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
  const mesAtual = monthKey();
  const pendente = financeiro
    .filter((item) => String(item.statusFinanceiro || "").toLowerCase() === "pendente")
    .reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  const recebidoMes = financeiro
    .filter(
      (item) =>
        String(item.statusFinanceiro || "").toLowerCase() === "pago" &&
        String(item.dataPagamento || item.data || "").startsWith(mesAtual),
    )
    .reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  const creditoTotal = pacientes.reduce((sum, patient) => sum + Number(patient.creditoDisponivel || 0), 0);
  const slotsAbertos = agendaHoje.filter((slot) => slot.status === "aberto").length;
  const agendaPendencias = agenda.filter((slot) => slot.temPendencia || slot.statusFinanceiro === "pendente");
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Inicio</h1>
        <p>Resumo carregado diretamente do backend local.</p>
      </div>
      <button class="secondary-button" id="refresh-dashboard" type="button">Atualizar</button>
    </header>
    <section class="stats-grid">
      <div class="stat"><span>Pacientes ativos</span><strong>${pacientes.filter((p) => p.ativo !== false).length}</strong></div>
      <div class="stat"><span>Atendimentos hoje</span><strong>${agendaHoje.length}</strong><small>${slotsAbertos} abertos</small></div>
      <div class="stat"><span>Pendente financeiro</span><strong>${formatMoney(pendente)}</strong></div>
      <div class="stat"><span>Recebido no mes</span><strong>${formatMoney(recebidoMes)}</strong><small>Credito: ${formatMoney(creditoTotal)}</small></div>
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
                    <div><strong>${escapeHtml(slot.clientes?.[0]?.nomeCompleto || slot.servico || "-")}</strong><br><span class="muted">${formatDate(slot.data)} ${escapeHtml(slot.horaInicio)} · ${formatMoney(slot.valorAtendimento || slot.clientes?.[0]?.valorAtendimento)}</span></div>
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
    return;
  }
  const patientId = encodeURIComponent(state.selectedPatientId);
  const [finance, evolutions] = await Promise.allSettled([
    fetchJson<Faturamento[]>(`/api/web/pacientes/${patientId}/financeiro`),
    fetchJson<Evolucao[]>(`/api/web/pacientes/${patientId}/evolucoes`),
  ]);
  state.patientFinance = finance.status === "fulfilled" ? finance.value : [];
  state.patientEvolutions = evolutions.status === "fulfilled" ? evolutions.value : [];
}

function renderPacientes(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const selected = state.pacientes.find((patient) => patient.id === state.selectedPatientId) || null;
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Pacientes</h1>
        <p>Cadastro, edicao e exclusao logica via banco operacional.</p>
      </div>
      <button class="secondary-button" id="new-patient" type="button">Novo paciente</button>
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
      <div class="grid-2">
        <div class="table-list">
          ${state.pacientes.map(patientRowHtml).join("") || `<div class="empty">Nenhum paciente encontrado.</div>`}
        </div>
        <aside class="content-panel">
          ${patientFormHtml(selected)}
        </aside>
      </div>
    </section>
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
    renderPacientes();
  });
  document.querySelectorAll<HTMLButtonElement>("[data-patient-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPatientId = button.dataset.patientId || null;
      void loadSelectedPatientDetails().then(() => renderPacientes());
    });
  });
  document.querySelector<HTMLFormElement>("#patient-form")?.addEventListener("submit", handlePatientSubmit);
  document.querySelector<HTMLButtonElement>("#delete-patient")?.addEventListener("click", handlePatientDelete);
}

function patientRowHtml(patient: Paciente): string {
  const selected = patient.id === state.selectedPatientId;
  return `
    <button class="patient-row ${selected ? "selected" : ""}" type="button" data-patient-id="${escapeHtml(patient.id)}">
      <span>
        <strong>${escapeHtml(patient.nomeCompleto || "-")}</strong>
        <small>${escapeHtml(patient.telefone || "sem telefone")} · ${escapeHtml(patient.cpf || "sem CPF")}</small>
      </span>
      <span class="pill ${patient.ativo === false ? "warn" : "ok"}">${patient.ativo === false ? "inativo" : "ativo"}</span>
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
      <label>Nome completo
        <input name="nomeCompleto" type="text" value="${escapeHtml(patient?.nomeCompleto || "")}" required />
      </label>
      <div class="form-columns">
        <label>Telefone
          <input name="telefone" type="text" value="${escapeHtml(patient?.telefone || "")}" />
        </label>
        <label>CPF
          <input name="cpf" type="text" value="${escapeHtml(patient?.cpf || "")}" />
        </label>
      </div>
      <div class="form-columns">
        <label>Nascimento
          <input name="dataNascimento" type="date" value="${escapeHtml(patient?.dataNascimento || "")}" />
        </label>
        <label>Valor padrao
          <input name="valorPadraoAtendimento" type="text" inputmode="decimal" value="${escapeHtml(patient?.valorPadraoAtendimento ?? "")}" />
        </label>
      </div>
      <label>Endereco
        <input name="endereco" type="text" value="${escapeHtml(patient?.endereco || "")}" />
      </label>
      <label>Observacoes
        <textarea name="observacoes" rows="4">${escapeHtml(patient?.observacoes || "")}</textarea>
      </label>
      <label class="check-row">
        <input name="ativo" type="checkbox" ${patient?.ativo === false ? "" : "checked"} />
        Cadastro ativo
      </label>
      <div class="button-row">
        <button class="primary-button" type="submit">${isEdit ? "Salvar alteracoes" : "Cadastrar paciente"}</button>
        ${isEdit ? `<button class="ghost-button danger-button" id="delete-patient" type="button">Excluir cadastro</button>` : ""}
      </div>
      ${
        isEdit
          ? `<div class="stats-grid compact-stats">
              <div class="stat"><span>Atendimentos</span><strong>${escapeHtml(patient?.totalAtendimentos || 0)}</strong></div>
              <div class="stat"><span>Pago</span><strong>${formatMoney(patient?.totalPago)}</strong></div>
              <div class="stat"><span>Pendente</span><strong>${formatMoney(patient?.totalPendente)}</strong></div>
            </div>
            <div class="patient-db-panels">
              <div>
                <div class="section-title"><h2>Financeiro</h2></div>
                <div class="table-list">
                  ${
                    state.patientFinance
                      .slice(0, 6)
                      .map(
                        (item) => `
                          <div class="table-row">
                            <div><strong>${formatMoney(item.valorAtendimento)}</strong><br><span class="muted">${formatDate(item.data)}</span></div>
                            <span class="pill ${item.statusFinanceiro === "pago" ? "ok" : "warn"}">${escapeHtml(item.statusFinanceiro || "pendente")}</span>
                          </div>
                        `,
                      )
                      .join("") || `<div class="empty">Sem financeiro para este paciente.</div>`
                  }
                </div>
              </div>
              <div>
                <div class="section-title"><h2>Evolucoes</h2></div>
                <div class="table-list">
                  ${
                    state.patientEvolutions
                      .slice(0, 6)
                      .map(
                        (item) => `
                          <div class="table-row">
                            <div><strong>${formatDate(item.data)}</strong><br><span class="muted">${escapeHtml((item.texto || "").slice(0, 110))}</span></div>
                          </div>
                        `,
                      )
                      .join("") || `<div class="empty">Sem evolucoes para este paciente.</div>`
                  }
                </div>
              </div>
            </div>`
          : ""
      }
    </form>
  `;
}

function patientPayloadFromForm(form: HTMLFormElement): Partial<Paciente> {
  const data = new FormData(form);
  return {
    nomeCompleto: String(data.get("nomeCompleto") || "").trim(),
    telefone: String(data.get("telefone") || "").trim(),
    cpf: String(data.get("cpf") || "").trim(),
    dataNascimento: String(data.get("dataNascimento") || "").trim(),
    endereco: String(data.get("endereco") || "").trim(),
    observacoes: String(data.get("observacoes") || "").trim(),
    valorPadraoAtendimento: Number(String(data.get("valorPadraoAtendimento") || "0").replace(",", ".")) || 0,
    ativo: Boolean(data.get("ativo")),
  };
}

async function handlePatientSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const id = String(new FormData(form).get("id") || "");
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
    state.patientSearch = "";
    await loadSelectedPatientDetails();
    await loadPacientes();
    showPatientNotice("success", id ? "Cadastro atualizado no banco." : "Paciente cadastrado no banco.");
  } catch (error) {
    showPatientNotice("error", error instanceof Error ? error.message : "Falha ao salvar paciente.");
  }
}

async function handlePatientDelete(): Promise<void> {
  const id = state.selectedPatientId;
  const patient = state.pacientes.find((item) => item.id === id);
  if (!id || !patient) return;
  if (!confirm(`Excluir cadastro de ${patient.nomeCompleto}? O registro sera marcado como inativo.`)) return;
  try {
    await fetchJson<{ ok: boolean }>(`/api/web/pacientes/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.selectedPatientId = null;
    await loadPacientes();
    showPatientNotice("success", "Cadastro marcado como inativo no banco.");
  } catch (error) {
    showPatientNotice("error", error instanceof Error ? error.message : "Falha ao excluir paciente.");
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
    const [patients, evolutions] = await Promise.all([
      fetchJson<Paciente[]>("/api/web/pacientes?limit=500"),
      fetchJson<Evolucao[]>("/api/web/evolucoes?limit=200"),
    ]);
    state.pacientes = patients;
    state.evolucoes = evolutions;
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
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Evolucoes</h1>
        <p>Registro clinico por texto, conectado ao banco operacional.</p>
      </div>
      <button class="secondary-button" id="refresh-evolucoes" type="button">Atualizar</button>
    </header>
    <section class="grid-2">
      <div class="content-panel">
        <div id="evolution-notice" class="notice" role="status"></div>
        <form id="evolution-form" class="form-grid">
          <label>Paciente
            <select name="pacienteId" required>
              <option value="">Selecionar paciente</option>
              ${state.pacientes.map((patient) => `<option value="${escapeHtml(patient.id)}">${escapeHtml(patient.nomeCompleto)}</option>`).join("")}
            </select>
          </label>
          <label>Evolucao
            <textarea name="texto" rows="7" placeholder="Descreva queixas, exercicios realizados e evolucao do paciente..." required></textarea>
          </label>
          <label>Conduta / proximos passos
            <textarea name="conduta" rows="3" placeholder="Manter protocolo, reavaliar em..."></textarea>
          </label>
          <div class="button-row">
            <button class="primary-button" type="submit">Salvar evolucao</button>
            <button class="ghost-button" id="mock-transcribe" type="button">Simular audio</button>
          </div>
        </form>
      </div>
      <aside class="content-panel">
        <div class="section-title">
          <h2>Ultimas evolucoes</h2>
          <span class="pill">${state.evolucoes.length}</span>
        </div>
        ${loading ? `<div class="loading">Carregando evolucoes...</div>` : ""}
        <div class="timeline-list">
          ${state.evolucoes.map(evolutionItemHtml).join("") || `<div class="empty">Nenhuma evolucao registrada.</div>`}
        </div>
      </aside>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-evolucoes")?.addEventListener("click", loadEvolucoes);
  document.querySelector<HTMLButtonElement>("#mock-transcribe")?.addEventListener("click", () => {
    const text = document.querySelector<HTMLTextAreaElement>("[name='texto']");
    const conduct = document.querySelector<HTMLTextAreaElement>("[name='conduta']");
    if (text) text.value = `${text.value ? `${text.value}\n` : ""}Paciente realizou exercicios de fortalecimento e mobilidade. Boa evolucao do quadro algico.`;
    if (conduct) conduct.value = "Manter protocolo. Reavaliar em 1 semana.";
  });
  document.querySelector<HTMLFormElement>("#evolution-form")?.addEventListener("submit", handleEvolutionSubmit);
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

async function handleEvolutionSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const pacienteId = String(data.get("pacienteId") || "");
  const patient = state.pacientes.find((item) => item.id === pacienteId);
  const texto = String(data.get("texto") || "").trim();
  if (!pacienteId || !texto) {
    showEvolutionNotice("error", "Selecione um paciente e escreva a evolucao.");
    return;
  }
  try {
    const saved = await sendJson<Evolucao>("/api/web/evolucoes", {
      pacienteId,
      pacienteNome: patient?.nomeCompleto,
      texto,
      conduta: String(data.get("conduta") || "").trim(),
      data: todayISO(),
      profissionalNome: state.user?.nomeCompleto || state.user?.login || "FisioBot",
    });
    state.evolucoes = [saved, ...state.evolucoes];
    form.reset();
    renderEvolucoes();
    showEvolutionNotice("success", "Evolucao salva no banco.");
  } catch (error) {
    showEvolutionNotice("error", error instanceof Error ? error.message : "Falha ao salvar evolucao.");
  }
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
    state.financeiro = await fetchJson<Faturamento[]>("/api/web/financeiro?limit=500");
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
        <h1>Caixa</h1>
        <p>Espelho financeiro operacional baseado nos faturamentos registrados.</p>
      </div>
      <div class="button-row">
        <button class="secondary-button" id="refresh-financeiro" type="button">Atualizar</button>
        <button class="ghost-button" id="export-financeiro" type="button">Exportar CSV</button>
      </div>
    </header>
    <section class="finance-layout">
      <aside class="finance-side">
        <div class="content-panel">
          <div class="detail-row"><span>Situacao</span><strong>Operacional</strong></div>
          <div class="detail-row"><span>Entradas pagas</span><strong>${formatMoney(totals.paid)}</strong></div>
          <div class="detail-row"><span>Pendentes</span><strong>${formatMoney(totals.pending)}</strong></div>
          <div class="detail-row"><span>Total previsto</span><strong>${formatMoney(totals.total)}</strong></div>
        </div>
        <div class="content-panel">
          <div class="section-title"><h2>Por status</h2></div>
          <div class="method-row"><span>Pago</span><strong>${formatMoney(totals.paid)}</strong></div>
          <div class="method-row"><span>Pendente</span><strong>${formatMoney(totals.pending)}</strong></div>
        </div>
      </aside>
      <section class="content-panel">
        <div class="section-title">
          <h2>Lancamentos</h2>
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
                    <span>${formatDate(item.data)}</span>
                    <span>${escapeHtml(item.nomeCompleto || "-")}</span>
                    <span class="pill ${item.statusFinanceiro === "pago" ? "ok" : "warn"}">${escapeHtml(item.statusFinanceiro || "pendente")}</span>
                    <strong>${formatMoney(item.valorAtendimento)}</strong>
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
}

function financeTotals(items: Faturamento[]): { paid: number; pending: number; total: number } {
  const paid = items.filter((item) => item.statusFinanceiro === "pago").reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  const pending = items.filter((item) => item.statusFinanceiro !== "pago").reduce((sum, item) => sum + Number(item.valorAtendimento || 0), 0);
  return { paid, pending, total: paid + pending };
}

function exportFinanceCsv(): void {
  const rows = [
    ["Data", "Paciente", "Status", "Valor"].join(";"),
    ...state.financeiro.map((item) => [item.data || "", item.nomeCompleto || "", item.statusFinanceiro || "", String(item.valorAtendimento || 0)].join(";")),
  ].join("\n");
  downloadText(`fisiobot-financeiro-${todayISO()}.csv`, rows);
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
    downloadText(`fisiobot-relatorio-${todayISO()}.csv`, rows.map((row) => row.join(";")).join("\n"));
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
      <button class="secondary-button" id="refresh-recursos" type="button">Atualizar</button>
    </header>
    ${loading ? `<div class="loading">Verificando recursos...</div>` : ""}
    <section class="resources-layout">
      <div class="content-panel resource-list">
        ${modules
          .map(
            (item, index) => `
              <button class="resource-row ${index === 0 ? "selected" : ""}" type="button">
                <span class="resource-icon">${item.active ? "✓" : "–"}</span>
                <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.detail)}</small></span>
                <em class="${item.active ? "ok" : "warn"}">${escapeHtml(item.status)}</em>
              </button>
            `,
          )
          .join("")}
      </div>
      <aside class="content-panel resource-detail">
        <div class="resource-badge">F</div>
        <h2>FisioBot operacional</h2>
        <p>Esta tela segue o modelo de recursos do NextFit, mas com os modulos realmente ativos no tablet. Os itens ocultos ficam fora da navegacao principal e continuam desconectados ate nova etapa.</p>
        <div class="detail-row"><span>Modo de interface</span><strong>Vanilla HTML/CSS/JS</strong></div>
        <div class="detail-row"><span>Banco de dados</span><strong>Acesso somente via backend</strong></div>
        <div class="detail-row"><span>WhatsApp</span><strong>Worker separado do dashboard</strong></div>
      </aside>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-recursos")?.addEventListener("click", loadRecursos);
}

async function loadAgenda(): Promise<void> {
  renderAgenda(true);
  try {
    state.agendaStart = state.agendaWeekStart;
    state.agendaEnd = addDaysToISO(state.agendaWeekStart, 6);
    const params = new URLSearchParams({ inicio: state.agendaStart, fim: state.agendaEnd });
    state.agenda = await fetchJson<AgendaSlot[]>(`/api/web/agenda?${params}`);
    state.selectedEventId = state.selectedEventId || state.agenda[0]?.id || null;
    renderAgenda();
  } catch (error) {
    const view = document.querySelector<HTMLDivElement>("#view");
    if (view) {
      view.innerHTML = `<div class="notice error">Falha ao carregar agenda: ${escapeHtml(error instanceof Error ? error.message : "erro desconhecido")}</div>`;
    }
  }
}

function renderAgenda(loading = false): void {
  const view = document.querySelector<HTMLDivElement>("#view");
  if (!view) return;
  const filteredAgenda = filteredAgendaSlots();
  const selected =
    state.agenda.find((slot) => slot.id === state.selectedEventId) || filteredAgenda[0] || null;
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
        <button class="secondary-button" id="refresh-agenda" type="button">Atualizar</button>
        <button class="primary-button" type="button" data-route="pacientes">Novo paciente</button>
      </div>
    </header>
    <section class="calendar-shell">
      <div class="calendar-topline">
        <div class="calendar-nav">
          <button class="ghost-button icon-button" id="prev-week" type="button" title="Semana anterior">‹</button>
          <button class="secondary-button" id="today-week" type="button">HOJE</button>
          <button class="ghost-button icon-button" id="next-week" type="button" title="Proxima semana">›</button>
          <strong>${escapeHtml(monthLabel)}</strong>
        </div>
        <div class="calendar-actions">
          <label>Visualizacao
            <select id="agenda-view" disabled>
              <option>Semana</option>
            </select>
          </label>
          <button class="ghost-button" id="apply-agenda-filter" type="button">Filtros</button>
        </div>
      </div>
      <div class="calendar-filterbar">
        <label>Buscar
          <input id="agenda-search" type="text" value="${escapeHtml(state.agendaSearch)}" placeholder="Paciente, servico ou profissional" />
        </label>
        <label>Status
          <select id="agenda-status">
            <option value="todos" ${state.agendaStatus === "todos" ? "selected" : ""}>Todos</option>
            <option value="aberto" ${state.agendaStatus === "aberto" ? "selected" : ""}>Abertos</option>
            <option value="concluido" ${state.agendaStatus === "concluido" ? "selected" : ""}>Concluidos</option>
            <option value="cancelado" ${state.agendaStatus === "cancelado" ? "selected" : ""}>Cancelados</option>
          </select>
        </label>
        <div class="status-strip">
          <span>Futuros: ${totals.future}</span>
          <span>Retroativos: ${totals.retro}</span>
          <span>Pend. faturamento: ${totals.pending}</span>
        </div>
      </div>
      ${loading ? `<div class="loading">Carregando agenda...</div>` : ""}
      <div class="calendar-workspace">
        <div class="calendar-main">
          ${weekGridHtml(weekDays, filteredAgenda)}
          <div class="content-panel agenda-list-panel dense-panel">
            <div class="section-title"><h2>Atendimentos da semana</h2></div>
            <div class="agenda-list">
              ${filteredAgenda.map(eventCardHtml).join("") || `<div class="empty">Nenhum atendimento no filtro atual.</div>`}
            </div>
          </div>
        </div>
        <aside class="content-panel agenda-detail-panel">
          ${selected ? eventDetailHtml(selected) : `<div class="empty">Selecione um atendimento.</div>`}
        </aside>
      </div>
      <div class="quick-rail" aria-label="Acoes rapidas">
        <button type="button" title="Atualizar" id="quick-refresh">↻</button>
        <button type="button" title="Pacientes" data-route="pacientes">◉</button>
        <button type="button" title="Relatorios" data-route="relatorios">▤</button>
      </div>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-agenda")?.addEventListener("click", loadAgenda);
  document.querySelector<HTMLButtonElement>("#quick-refresh")?.addEventListener("click", loadAgenda);
  window.requestAnimationFrame(scrollAgendaToCurrentHour);
  document.querySelector<HTMLButtonElement>("#prev-week")?.addEventListener("click", async () => {
    state.agendaWeekStart = addDaysToISO(state.agendaWeekStart, -7);
    state.selectedEventId = null;
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#today-week")?.addEventListener("click", async () => {
    state.agendaWeekStart = startOfWeekISO(new Date());
    state.selectedEventId = null;
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#next-week")?.addEventListener("click", async () => {
    state.agendaWeekStart = addDaysToISO(state.agendaWeekStart, 7);
    state.selectedEventId = null;
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#apply-agenda-filter")?.addEventListener("click", () => {
    state.agendaSearch = document.querySelector<HTMLInputElement>("#agenda-search")?.value.trim() || "";
    state.agendaStatus = document.querySelector<HTMLSelectElement>("#agenda-status")?.value || "todos";
    renderAgenda();
  });
  document.querySelector<HTMLInputElement>("#agenda-search")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    state.agendaSearch = event.currentTarget.value.trim();
    state.agendaStatus = document.querySelector<HTMLSelectElement>("#agenda-status")?.value || "todos";
    renderAgenda();
  });
  view.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(isAppRoute(nextRoute) ? nextRoute : "dashboard");
      await loadCurrentRoute();
    });
  });
  document.querySelectorAll<HTMLButtonElement>("[data-event-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedEventId = button.dataset.eventId || null;
      renderAgenda();
    });
  });
  document.querySelector<HTMLButtonElement>("#cancel-event")?.addEventListener("click", async () => {
    if (!selected?.id || !confirm("Cancelar este atendimento?")) return;
    await sendJson(`/api/web/agenda/${encodeURIComponent(selected.id)}/cancelar`);
    await loadAgenda();
  });
  document.querySelector<HTMLButtonElement>("#complete-event")?.addEventListener("click", async () => {
    if (!selected?.id) return;
    await sendJson(`/api/web/agenda/${encodeURIComponent(selected.id)}/concluir`);
    await loadAgenda();
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
    await loadAgenda();
  });
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
          return `<div class="week-head ${day === todayISO() ? "today" : ""}"><span>${labels[date.getDay()]}.</span><strong>${date.getDate()}</strong></div>`;
        })
        .join("")}
      ${hours
        .map(
          (hour) => `
            <div class="hour-cell">${String(hour).padStart(2, "0")}:00</div>
            ${weekDays
              .map((day) => {
                const cellSlots = slots.filter((slot) => slot.data === day && Number((slot.horaInicio || "0").slice(0, 2)) === hour);
                return `<div class="week-cell ${day === todayISO() ? "today-bg" : ""}">
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

function calendarChipHtml(slot: AgendaSlot): string {
  const cliente = slot.clientes?.[0];
  const status = String(slot.status || "aberto").toLowerCase();
  const capacity = slot.clientes?.length || 0;
  return `
    <button class="calendar-chip ${escapeHtml(status)}" type="button" data-event-id="${escapeHtml(slot.id)}">
      <span class="chip-time">${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? ` - ${escapeHtml(slot.horaFim)}` : ""}</span>
      <span>${escapeHtml(cliente?.nomeCompleto || slot.servico || "Atendimento")}</span>
      <small>${escapeHtml(slot.servico || "Fisioterapia")} · ${capacity} / ∞</small>
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
  return `
    <button class="event-card ${escapeHtml(status)}" type="button" data-event-id="${escapeHtml(slot.id)}">
      <strong>${escapeHtml(cliente?.nomeCompleto || slot.servico || "Atendimento")}</strong>
      <div class="event-meta">
        <span>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? `-${escapeHtml(slot.horaFim)}` : ""}</span>
        <span>${escapeHtml(slot.servico || "Fisioterapia")}</span>
        <span class="pill ${slot.statusFinanceiro === "pago" ? "ok" : "warn"}">${escapeHtml(slot.statusFinanceiro || "pendente")}</span>
        ${cliente?.temEvolucao ? `<span class="pill ok">com evolucao</span>` : `<span class="pill warn">sem evolucao</span>`}
      </div>
    </button>
  `;
}

function eventDetailHtml(slot: AgendaSlot): string {
  const cliente = slot.clientes?.[0] || {};
  const canEdit = slot.podeEditar !== false;
  return `
    <div class="detail">
      <div class="section-title">
        <h2>Detalhes</h2>
        <span class="pill ${slot.status === "concluido" ? "ok" : slot.status === "cancelado" ? "warn" : ""}">${escapeHtml(slot.status || "aberto")}</span>
      </div>
      <div class="detail-hero">
        <strong>${escapeHtml(cliente.nomeCompleto || slot.servico || "Atendimento")}</strong>
        <span>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? `-${escapeHtml(slot.horaFim)}` : ""}</span>
      </div>
      <div class="detail-row"><span>Paciente</span><strong>${escapeHtml(cliente.nomeCompleto || "-")}</strong></div>
      <div class="detail-row"><span>Data e horario</span><strong>${formatDate(slot.data)} ${escapeHtml(slot.horaInicio || "")}${slot.horaFim ? `-${escapeHtml(slot.horaFim)}` : ""}</strong></div>
      <div class="detail-row"><span>Servico</span><strong>${escapeHtml(slot.servico || "Fisioterapia")}</strong></div>
      <div class="detail-row"><span>Financeiro</span><strong>${formatMoney(slot.valorAtendimento || cliente.valorAtendimento)} - ${escapeHtml(slot.statusFinanceiro || cliente.statusFinanceiro || "pendente")}</strong></div>
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
    </div>
  `;
}

void bootstrap();
