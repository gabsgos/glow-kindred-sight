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
  pacienteNome?: string;
  data?: string;
  texto?: string;
};

type Faturamento = {
  id: string;
  nomeCompleto?: string;
  data?: string;
  dataPagamento?: string;
  valorAtendimento?: number;
  statusFinanceiro?: string;
};

type AppState = {
  user: User | null;
  route: "dashboard" | "pacientes" | "agenda";
  agenda: AgendaSlot[];
  pacientes: Paciente[];
  patientFinance: Faturamento[];
  patientEvolutions: Evolucao[];
  selectedPatientId: string | null;
  patientSearch: string;
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
  patientFinance: [],
  patientEvolutions: [],
  selectedPatientId: null,
  patientSearch: "",
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
  app.innerHTML = `
    <main class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">F</div>
          <div>
            <p class="brand-title">FisioBot</p>
            <div class="brand-subtitle">${escapeHtml(userName)}</div>
          </div>
        </div>
        <nav class="nav" aria-label="Principal">
          <button type="button" data-route="dashboard" aria-current="${active === "dashboard" ? "page" : "false"}">Inicio</button>
          <button type="button" data-route="pacientes" aria-current="${active === "pacientes" ? "page" : "false"}">Pacientes</button>
          <button type="button" data-route="agenda" aria-current="${active === "agenda" ? "page" : "false"}">Agenda</button>
          <a class="react-switch" href="/react-app?route=${encodeURIComponent(window.location.pathname || "/dashboard")}">Abrir React</a>
          <button type="button" id="logout">Sair</button>
        </nav>
      </aside>
      <section class="main">
        <div id="view"></div>
      </section>
    </main>
  `;
  document.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
    button.addEventListener("click", async () => {
      const nextRoute = button.dataset.route;
      setDocumentRoute(nextRoute === "agenda" ? "agenda" : nextRoute === "pacientes" ? "pacientes" : "dashboard");
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

function renderCurrentRoute(): void {
  if (state.route === "agenda") renderAgenda();
  else if (state.route === "pacientes") renderPacientes();
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
  view.innerHTML = `
    <header class="topbar">
      <div>
        <h1>Agenda</h1>
        <p>Semana de ${formatDate(state.agendaStart)} a ${formatDate(state.agendaEnd)}.</p>
      </div>
      <button class="secondary-button" id="refresh-agenda" type="button">Atualizar</button>
    </header>
    <section class="content-panel">
      <div class="calendar-toolbar">
        <button class="ghost-button" id="prev-week" type="button">Anterior</button>
        <button class="ghost-button" id="today-week" type="button">Hoje</button>
        <button class="ghost-button" id="next-week" type="button">Proxima</button>
        <label>Buscar
          <input id="agenda-search" type="text" value="${escapeHtml(state.agendaSearch)}" placeholder="Paciente ou atendimento" />
        </label>
        <label>Status
          <select id="agenda-status">
            <option value="todos" ${state.agendaStatus === "todos" ? "selected" : ""}>Todos</option>
            <option value="aberto" ${state.agendaStatus === "aberto" ? "selected" : ""}>Abertos</option>
            <option value="concluido" ${state.agendaStatus === "concluido" ? "selected" : ""}>Concluidos</option>
            <option value="cancelado" ${state.agendaStatus === "cancelado" ? "selected" : ""}>Cancelados</option>
          </select>
        </label>
        <button class="primary-button" id="apply-agenda-filter" type="button">Filtrar</button>
      </div>
      <div class="status-strip">
        <span>Futuros: ${totals.future}</span>
        <span>Retroativos: ${totals.retro}</span>
        <span>Pendencia faturamento: ${totals.pending}</span>
      </div>
      ${loading ? `<div class="loading">Carregando agenda...</div>` : ""}
      <div class="grid-2">
        <div>
          ${weekGridHtml(weekDays, filteredAgenda)}
          <div class="content-panel agenda-list-panel">
            <div class="section-title"><h2>Atendimentos da semana</h2></div>
            <div class="agenda-list">
              ${filteredAgenda.map(eventCardHtml).join("") || `<div class="empty">Nenhum atendimento no filtro atual.</div>`}
            </div>
          </div>
        </div>
        <aside class="content-panel">
          ${selected ? eventDetailHtml(selected) : `<div class="empty">Selecione um atendimento.</div>`}
        </aside>
      </div>
    </section>
  `;
  document.querySelector<HTMLButtonElement>("#refresh-agenda")?.addEventListener("click", loadAgenda);
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
  const hours = Array.from({ length: 16 }, (_, index) => index + 6);
  const labels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  return `
    <div class="week-grid">
      <div class="week-head time-head"></div>
      ${weekDays
        .map((day) => {
          const date = new Date(`${day}T12:00:00`);
          return `<div class="week-head ${day === todayISO() ? "today" : ""}"><span>${labels[date.getDay()]}</span><strong>${date.getDate()}</strong></div>`;
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
  return `
    <button class="calendar-chip ${escapeHtml(slot.status || "aberto")}" type="button" data-event-id="${escapeHtml(slot.id)}">
      <strong>${escapeHtml(slot.horaInicio || "")}</strong>
      <span>${escapeHtml(cliente?.nomeCompleto || slot.servico || "Atendimento")}</span>
    </button>
  `;
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
