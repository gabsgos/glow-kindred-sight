import {
  adminStatus,
  agenda,
  auditoria,
  caixas,
  comissoes,
  contasFinanceiras,
  contasPagar,
  evolucoes,
  faturamentos,
  lancamentosCaixa,
  pacientes,
  pendencias,
  profissionais,
  sync,
  vendas,
} from "./mocks";
import type {
  AgendaSlot,
  AuthSession,
  ComandoIaResposta,
  ContaFinanceira,
  ContaPagar,
  Evolucao,
  Faturamento,
  LancamentoCaixa,
  LoginResponse,
  MetodoPagamento,
  Paciente,
  Pendencia,
  Venda,
} from "./types";
import { asArray, asNumber, asSearchTerm, matchesText } from "./safe";

const wait = <T>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const API_BASE = (import.meta.env.VITE_FISIOBOT_API_BASE ?? "").replace(/\/$/, "");
const USE_BACKEND_DB = import.meta.env.VITE_FISIOBOT_USE_BACKEND === "1";
const API_TIMEOUT_MS = Number(import.meta.env.VITE_FISIOBOT_API_TIMEOUT_MS ?? 10_000);
const API_WARN_MS = 1_200;
const API_WARN_BYTES = 500_000;
const MAX_AGENDA_ITEMS = 200;
const MAX_PATIENT_ITEMS = 200;
const MAX_EVOLUTION_ITEMS = 200;
const MOCK_USER = {
  internalUserId: "mock-web-user",
  login: "mock.web",
  nomeCompleto: "FisioBot Mock",
  role: "admin",
  status: "ativo",
};

class BackendAuthError extends Error {
  constructor() {
    super("auth_required");
    this.name = "BackendAuthError";
  }
}

async function requestWithTimeout(input: RequestInfo | URL, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Tempo esgotado ao consultar o servidor.");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const started = performance.now();
  const response = await requestWithTimeout(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (response.status === 401) {
    const errorBody = await response.json().catch(() => null);
    if (errorBody?.error === "auth_required") throw new BackendAuthError();
    throw new Error(errorBody?.message || `GET ${path} -> ${response.status}`);
  }
  if (!response.ok) throw new Error(`GET ${path} -> ${response.status}`);
  const raw = await response.text();
  const elapsed = performance.now() - started;
  if (elapsed > API_WARN_MS || raw.length > API_WARN_BYTES) {
    console.warn("[FisioBot API]", { path, ms: Math.round(elapsed), bytes: raw.length });
  }
  return (raw ? JSON.parse(raw) : null) as T;
}

async function sendJson<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await requestWithTimeout(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    if (response.status === 401 && errorBody?.error === "auth_required")
      throw new BackendAuthError();
    throw new Error(errorBody?.message || `${method} ${path} -> ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function withBackend<T>(request: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (!USE_BACKEND_DB) return fallback();
  try {
    return await request();
  } catch (error) {
    if (error instanceof BackendAuthError) throw error;
    console.warn("[FisioBot API] backend request failed", error);
    throw error;
  }
}

function limitArray<T>(items: T[], max: number): T[] {
  return asArray(items).slice(0, max);
}

export const api = {
  auth: {
    session: () =>
      USE_BACKEND_DB
        ? fetchJson<AuthSession>("/api/web/session")
        : wait({ ok: true, authRequired: false, authenticated: true, user: MOCK_USER }),
    login: (input: { login: string; secret: string; rememberDevice: boolean }) =>
      USE_BACKEND_DB
        ? sendJson<LoginResponse>("/api/web/login", "POST", input)
        : wait({ ok: true, authenticated: true, user: MOCK_USER, login: input.login }),
    loginCode: (input: { login: string; verificationCode: string }) =>
      USE_BACKEND_DB
        ? sendJson<LoginResponse>("/api/web/login/code", "POST", input)
        : wait({ ok: true, authenticated: true, user: MOCK_USER, login: input.login }),
    logout: () =>
      USE_BACKEND_DB
        ? sendJson<{ ok: boolean; authenticated: false }>("/api/web/logout", "POST")
        : wait({ ok: true, authenticated: false as const }),
  },

  // ---- agenda
  agenda: {
    list: (inicio?: string, fim?: string) =>
      withBackend(
        () => {
          const params = new URLSearchParams();
          if (inicio) params.set("inicio", inicio);
          if (fim) params.set("fim", fim);
          params.set("limit", String(MAX_AGENDA_ITEMS));
          return fetchJson<AgendaSlot[]>(`/api/web/agenda${params.toString() ? `?${params}` : ""}`).then((items) =>
            limitArray(items, MAX_AGENDA_ITEMS),
          );
        },
        () => {
          const items = agenda.filter((s) => {
            if (inicio && s.data < inicio) return false;
            if (fim && s.data > fim) return false;
            return true;
          });
          return wait(items);
        },
      ),
    getSlot: (id: string) =>
      withBackend(
        async () => {
          const slots = await fetchJson<AgendaSlot[]>("/api/web/agenda");
          return slots.find((s) => s.id === id) ?? null;
        },
        () => wait(agenda.find((s) => s.id === id) ?? null),
      ),
    concluir: async (id: string) =>
      withBackend(
        () =>
          sendJson<AgendaSlot | null>(`/api/web/agenda/${encodeURIComponent(id)}/concluir`, "POST"),
        async () => {
          const slot = agenda.find((s) => s.id === id);
          if (slot) {
            slot.status = "concluido";
            asArray(slot.clientes).forEach((c) => (c.situacao = "concluido"));
          }
          return wait(slot);
        },
      ),
    cancelar: async (id: string) =>
      withBackend(
        () =>
          sendJson<AgendaSlot | null>(`/api/web/agenda/${encodeURIComponent(id)}/cancelar`, "POST"),
        async () => {
          const slot = agenda.find((s) => s.id === id);
          if (slot) slot.status = "cancelado";
          return wait(slot);
        },
      ),
    reagendar: async (id: string, input: { data: string; horaInicio: string; horaFim?: string }) =>
      withBackend(
        () =>
          sendJson<AgendaSlot | null>(
            `/api/web/agenda/${encodeURIComponent(id)}/reagendar`,
            "POST",
            input,
          ),
        async () => {
          const slot = agenda.find((s) => s.id === id);
          if (slot && !asArray(slot.clientes).some((c) => c.temEvolucao)) {
            slot.data = input.data;
            slot.horaInicio = input.horaInicio;
            slot.horaFim = input.horaFim ?? slot.horaFim;
          }
          return wait(slot ?? null);
        },
      ),
    removerCliente: async (slotId: string, pacienteId: string) => {
      const slot = agenda.find((s) => s.id === slotId);
      if (slot) {
        slot.clientes = asArray(slot.clientes).filter((c) => c.pacienteId !== pacienteId);
        slot.ocupacao = slot.clientes.length;
      }
      return wait(slot);
    },
    marcarDesistente: async (slotId: string, pacienteId: string) => {
      const slot = agenda.find((s) => s.id === slotId);
      const cli = asArray(slot?.clientes).find((c) => c.pacienteId === pacienteId);
      if (cli) cli.situacao = "desistente";
      return wait(slot);
    },
    addCliente: async (slotId: string, pacienteId: string) => {
      const slot = agenda.find((s) => s.id === slotId);
      const pac = pacientes.find((p) => p.id === pacienteId);
      if (slot && pac) {
        slot.clientes.push({
          pacienteId,
          nomeCompleto: pac.nomeCompleto,
          situacao: "reservado",
          origem: "manual",
          temEvolucao: false,
        });
        slot.ocupacao = slot.clientes.length;
      }
      return wait(slot);
    },
    createSlot: async (input: Partial<AgendaSlot>) => {
      const slot: AgendaSlot = {
        id: `slot_${Date.now()}`,
        servico: input.servico ?? "Fisioterapia",
        data: input.data ?? new Date().toISOString().slice(0, 10),
        horaInicio: input.horaInicio ?? "08:00",
        horaFim: input.horaFim ?? "09:00",
        profissionalId: input.profissionalId ?? profissionais[0].id,
        profissionalNome:
          input.profissionalNome ??
          profissionais.find((p) => p.id === input.profissionalId)?.nome ??
          profissionais[0].nome,
        status: "aberto",
        capacidade: input.capacidade ?? 3,
        capacidadeIlimitada: input.capacidadeIlimitada ?? false,
        ocupacao: 0,
        clientes: [],
        observacao: input.observacao,
      };
      agenda.push(slot);
      return wait(slot);
    },
    buscarHorarios: async () =>
      wait(agenda.filter((s) => (s.capacidadeIlimitada ? true : s.ocupacao < (s.capacidade ?? 0)))),
  },

  // ---- pacientes
  pacientes: {
    list: (q?: string) =>
      withBackend(
        () => {
          const params = new URLSearchParams();
          if (q) params.set("q", q);
          params.set("limit", String(MAX_PATIENT_ITEMS));
          return fetchJson<Paciente[]>(`/api/web/pacientes?${params}`).then((items) =>
            limitArray(items, MAX_PATIENT_ITEMS),
          );
        },
        () => {
          const term = asSearchTerm(q);
          const items = term
            ? pacientes.filter(
                (p) =>
                  matchesText(p.nomeCompleto, term) ||
                  matchesText(p.telefone, term) ||
                  matchesText(p.cpf, term),
              )
            : pacientes;
          return wait(items);
        },
      ),
    get: (id: string) =>
      withBackend(
        () => fetchJson<Paciente | null>(`/api/web/pacientes/${encodeURIComponent(id)}`),
        () => wait(pacientes.find((p) => p.id === id) ?? null),
      ),
    create: async (data: Partial<Paciente>) =>
      withBackend(
        () => sendJson<Paciente>("/api/web/pacientes", "POST", data),
        async () => {
          const p: Paciente = {
            id: `pac_${Date.now()}`,
            nomeCompleto: data.nomeCompleto ?? "Sem nome",
            telefone: data.telefone,
            cpf: data.cpf,
            dataNascimento: data.dataNascimento,
            endereco: data.endereco,
            observacoes: data.observacoes,
            aliases: data.aliases,
            valorPadraoAtendimento: data.valorPadraoAtendimento,
            creditoDisponivel: data.creditoDisponivel ?? 0,
            ativo: data.ativo ?? true,
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString(),
            totalAtendimentos: 0,
            totalPago: 0,
            totalPendente: 0,
          };
          pacientes.push(p);
          return wait(p);
        },
      ),
    update: async (id: string, data: Partial<Paciente>) =>
      withBackend(
        () =>
          sendJson<Paciente | null>(`/api/web/pacientes/${encodeURIComponent(id)}`, "PATCH", data),
        async () => {
          const idx = pacientes.findIndex((p) => p.id === id);
          if (idx >= 0)
            pacientes[idx] = {
              ...pacientes[idx],
              ...data,
              atualizadoEm: new Date().toISOString(),
            };
          return wait(pacientes[idx] ?? null);
        },
      ),
    remove: async (id: string) =>
      withBackend(
        () => sendJson<{ ok: boolean }>(`/api/web/pacientes/${encodeURIComponent(id)}`, "DELETE"),
        async () => {
          const idx = pacientes.findIndex((p) => p.id === id);
          if (idx >= 0) pacientes.splice(idx, 1);
          return wait({ ok: idx >= 0 });
        },
      ),
    financeiro: (id: string) =>
      withBackend(
        () =>
          id
            ? fetchJson<Faturamento[]>(`/api/web/pacientes/${encodeURIComponent(id)}/financeiro`)
            : fetchJson<Faturamento[]>("/api/web/financeiro"),
        () => wait(id ? faturamentos.filter((f) => f.pacienteId === id) : faturamentos),
      ),
    evolucoes: (id: string) =>
      withBackend(
        () => fetchJson<Evolucao[]>(`/api/web/pacientes/${encodeURIComponent(id)}/evolucoes`),
        () => wait(evolucoes.filter((e) => e.pacienteId === id)),
      ),
  },

  // ---- evolucoes
  evolucoes: {
    list: () =>
      withBackend(
        () => fetchJson<Evolucao[]>(`/api/web/evolucoes?limit=${MAX_EVOLUTION_ITEMS}`).then((items) =>
          limitArray(items, MAX_EVOLUTION_ITEMS),
        ),
        () => wait(evolucoes),
      ),
    create: async (data: Partial<Evolucao>) =>
      withBackend(
        () => sendJson<Evolucao>("/api/web/evolucoes", "POST", data),
        async () => {
          const e: Evolucao = {
            id: `evo_${Date.now()}`,
            pacienteId: data.pacienteId ?? "",
            pacienteNome: data.pacienteNome,
            atendimentoId: data.atendimentoId,
            data: data.data ?? new Date().toISOString().slice(0, 10),
            texto: data.texto ?? "",
            conduta: data.conduta,
            queixa: data.queixa,
            profissionalNome: data.profissionalNome,
            criadoEm: new Date().toISOString(),
          };
          evolucoes.unshift(e);
          return wait(e);
        },
      ),
  },

  // ---- pagamentos
  pagamentos: {
    porValor: async (input: { pacienteId: string; valor: number; formaPagamento: string }) => {
      const pac = pacientes.find((p) => p.id === input.pacienteId);
      let restante = input.valor;
      const quitados: Faturamento[] = [];
      faturamentos
        .filter((f) => f.pacienteId === input.pacienteId && f.statusFinanceiro === "pendente")
        .sort((a, b) => a.data.localeCompare(b.data))
        .forEach((f) => {
          if (restante >= f.valorAtendimento) {
            f.statusFinanceiro = "pago";
            f.formaPagamento = input.formaPagamento;
            f.dataPagamento = new Date().toISOString().slice(0, 10);
            restante -= f.valorAtendimento;
            quitados.push(f);
          }
        });
      if (pac) pac.creditoDisponivel += restante;
      return wait({
        quitados,
        creditoFinal: pac?.creditoDisponivel ?? 0,
        excedente: restante,
      });
    },
    porQuantidade: async (input: {
      pacienteId: string;
      quantidade: number;
      formaPagamento: string;
    }) => {
      const pac = pacientes.find((p) => p.id === input.pacienteId);
      const pendentes = faturamentos
        .filter((f) => f.pacienteId === input.pacienteId && f.statusFinanceiro === "pendente")
        .sort((a, b) => a.data.localeCompare(b.data))
        .slice(0, input.quantidade);
      pendentes.forEach((f) => {
        f.statusFinanceiro = "pago";
        f.formaPagamento = input.formaPagamento;
        f.dataPagamento = new Date().toISOString().slice(0, 10);
      });
      return wait({ quitados: pendentes, creditoFinal: pac?.creditoDisponivel ?? 0 });
    },
  },

  // ---- pendencias
  pendencias: {
    list: () => wait(pendencias),
    confirmar: async (id: string, opcaoId?: string) => {
      const p = pendencias.find((x) => x.id === id);
      if (p) p.status = "confirmada";
      return wait({ pendencia: p, opcaoId });
    },
    cancelar: async (id: string) => {
      const p = pendencias.find((x) => x.id === id);
      if (p) p.status = "cancelada";
      return wait(p);
    },
  },

  // ---- IA
  ia: {
    comando: async (texto: string): Promise<ComandoIaResposta> => {
      const t = asSearchTerm(texto);
      if (t.startsWith("#")) {
        return wait({
          intent: "debug",
          status: "sucesso",
          mensagem: `Comando ${texto} executado (mock).`,
        });
      }
      if (t.includes("pagou")) {
        return wait({
          intent: "registrar_pagamento",
          status: "sucesso",
          mensagem: "Pagamento registrado. 2 atendimentos quitados.",
        });
      }
      if (t.includes("michelle")) {
        const pend: Pendencia = {
          id: `pend_${Date.now()}`,
          tipo: "paciente_ambiguo",
          descricao: "Encontrei mais de uma Michelle. Qual deseja usar?",
          status: "aberta",
          criadoEm: new Date().toISOString(),
          opcoes: [
            { id: "pac_004", label: "Michelle Rossini" },
            { id: "pac_006", label: "Michelle Santos" },
          ],
        };
        pendencias.unshift(pend);
        return wait({
          intent: "pedir_confirmacao",
          status: "pendente",
          mensagem: pend.descricao,
          pendencia: pend,
        });
      }
      return wait({
        intent: "registrar_atendimento",
        status: "sucesso",
        mensagem: "Atendimento registrado com sucesso.",
      });
    },
  },

  // ---- auditoria / sync / admin
  auditoria: { list: () => wait(auditoria) },
  sync: {
    status: () => wait(sync),
    refresh: async () => wait({ ok: false, reason: "sheets_sync_disabled" }),
  },
  admin: {
    status: () => wait(adminStatus),
    comando: async (cmd: string) => wait({ ok: true, cmd, output: `Comando ${cmd} executado.` }),
  },

  profissionais: () => wait(profissionais),
};

// ---- caixa
export const caixaApi = {
  contas: () => wait(contasFinanceiras),
  addConta: async (input: Omit<ContaFinanceira, "id">) => {
    const novo: ContaFinanceira = { ...input, id: `cf_${Date.now()}` };
    contasFinanceiras.push(novo);
    return wait(novo);
  },
  updateConta: async (id: string, input: Partial<ContaFinanceira>) => {
    const idx = contasFinanceiras.findIndex((c) => c.id === id);
    if (idx >= 0) contasFinanceiras[idx] = { ...contasFinanceiras[idx], ...input };
    return wait(contasFinanceiras[idx] ?? null);
  },
  removeConta: async (id: string) => {
    const idx = contasFinanceiras.findIndex((c) => c.id === id);
    if (idx >= 0) contasFinanceiras.splice(idx, 1);
    return wait({ ok: idx >= 0 });
  },
  caixaAtual: () => wait(caixas.find((c) => c.situacao === "aberto") ?? null),
  listCaixas: () => wait([...caixas].reverse()),
  lancamentos: (caixaId: string) =>
    wait(
      [...lancamentosCaixa]
        .filter((l) => l.caixaId === caixaId)
        .sort((a, b) => (a.data < b.data ? 1 : -1)),
    ),
  addLancamento: async (input: Omit<LancamentoCaixa, "id">) => {
    const novo: LancamentoCaixa = { ...input, id: `lc_${Date.now()}` };
    lancamentosCaixa.unshift(novo);
    return wait(novo);
  },
  fecharCaixa: async (id: string) => {
    const c = caixas.find((x) => x.id === id);
    if (c) {
      c.situacao = "fechado";
      c.dataFechamento = new Date().toISOString();
    }
    return wait(c);
  },
  abrirCaixa: async (input: { responsavel: string; contaId: string; saldoInicial: number }) => {
    const conta = contasFinanceiras.find((c) => c.id === input.contaId);
    const novo = {
      id: `caixa_${Date.now()}`,
      responsavel: input.responsavel,
      contaId: input.contaId,
      contaNome: conta?.nome ?? "—",
      dataAbertura: new Date().toISOString(),
      saldoInicial: asNumber(input.saldoInicial),
      situacao: "aberto" as const,
    };
    caixas.push(novo);
    return wait(novo);
  },
};

// ---- contas a pagar
export const contasPagarApi = {
  list: () => wait([...contasPagar]),
  create: async (input: Omit<ContaPagar, "id">) => {
    const novo: ContaPagar = { ...input, id: `cp_${Date.now()}` };
    contasPagar.push(novo);
    return wait(novo);
  },
  update: async (id: string, input: Partial<ContaPagar>) => {
    const idx = contasPagar.findIndex((c) => c.id === id);
    if (idx >= 0) contasPagar[idx] = { ...contasPagar[idx], ...input };
    return wait(contasPagar[idx] ?? null);
  },
  remove: async (id: string) => {
    const idx = contasPagar.findIndex((c) => c.id === id);
    if (idx >= 0) contasPagar.splice(idx, 1);
    return wait({ ok: idx >= 0 });
  },
  marcarPaga: async (id: string, dataPagamento?: string) => {
    const c = contasPagar.find((x) => x.id === id);
    if (c) {
      c.pago = true;
      c.dataPagamento = dataPagamento ?? new Date().toISOString().slice(0, 10);
    }
    return wait(c);
  },
};

// ---- vendas
export const vendasApi = {
  list: () => wait([...vendas].sort((a, b) => b.data.localeCompare(a.data))),
  create: async (input: Omit<Venda, "id">) => {
    const novo: Venda = { ...input, id: `vd_${Date.now()}` };
    vendas.unshift(novo);
    return wait(novo);
  },
  cancelar: async (id: string) => {
    const v = vendas.find((x) => x.id === id);
    if (v) v.status = "cancelada";
    return wait(v);
  },
};

// ---- comissão
export const comissaoApi = {
  list: () => wait([...comissoes]),
  marcarPaga: async (id: string) => {
    const c = comissoes.find((x) => x.id === id);
    if (c) {
      c.status = "paga";
      c.dataPagamento = new Date().toISOString().slice(0, 10);
    }
    return wait(c);
  },
};

export type { MetodoPagamento };
