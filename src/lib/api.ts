import {
  adminStatus,
  agenda,
  auditoria,
  evolucoes,
  faturamentos,
  pacientes,
  pendencias,
  profissionais,
  sync,
} from "./mocks";
import type {
  AgendaSlot,
  ComandoIaResposta,
  Evolucao,
  Faturamento,
  Paciente,
  Pendencia,
} from "./types";

const wait = <T,>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const api = {
  // ---- agenda
  agenda: {
    list: (inicio?: string, fim?: string) => {
      const items = agenda.filter((s) => {
        if (inicio && s.data < inicio) return false;
        if (fim && s.data > fim) return false;
        return true;
      });
      return wait(items);
    },
    getSlot: (id: string) => wait(agenda.find((s) => s.id === id) ?? null),
    concluir: async (id: string) => {
      const slot = agenda.find((s) => s.id === id);
      if (slot) {
        slot.status = "concluido";
        slot.clientes.forEach((c) => (c.situacao = "concluido"));
      }
      return wait(slot);
    },
    cancelar: async (id: string) => {
      const slot = agenda.find((s) => s.id === id);
      if (slot) slot.status = "cancelado";
      return wait(slot);
    },
    removerCliente: async (slotId: string, pacienteId: string) => {
      const slot = agenda.find((s) => s.id === slotId);
      if (slot) {
        slot.clientes = slot.clientes.filter((c) => c.pacienteId !== pacienteId);
        slot.ocupacao = slot.clientes.length;
      }
      return wait(slot);
    },
    marcarDesistente: async (slotId: string, pacienteId: string) => {
      const slot = agenda.find((s) => s.id === slotId);
      const cli = slot?.clientes.find((c) => c.pacienteId === pacienteId);
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
    buscarHorarios: async () => wait(agenda.filter((s) => (s.capacidadeIlimitada ? true : s.ocupacao < (s.capacidade ?? 0)))),
  },

  // ---- pacientes
  pacientes: {
    list: (q?: string) => {
      const term = q?.toLowerCase().trim();
      const items = term
        ? pacientes.filter(
            (p) =>
              p.nomeCompleto.toLowerCase().includes(term) ||
              p.telefone?.includes(term) ||
              p.cpf?.includes(term),
          )
        : pacientes;
      return wait(items);
    },
    get: (id: string) => wait(pacientes.find((p) => p.id === id) ?? null),
    create: async (data: Partial<Paciente>) => {
      const p: Paciente = {
        id: `pac_${Date.now()}`,
        nomeCompleto: data.nomeCompleto ?? "Sem nome",
        telefone: data.telefone,
        cpf: data.cpf,
        valorPadraoAtendimento: data.valorPadraoAtendimento,
        creditoDisponivel: 0,
        ativo: true,
      };
      pacientes.push(p);
      return wait(p);
    },
    update: async (id: string, data: Partial<Paciente>) => {
      const idx = pacientes.findIndex((p) => p.id === id);
      if (idx >= 0) pacientes[idx] = { ...pacientes[idx], ...data };
      return wait(pacientes[idx] ?? null);
    },
    financeiro: (id: string) =>
      wait(faturamentos.filter((f) => f.pacienteId === id)),
    evolucoes: (id: string) => wait(evolucoes.filter((e) => e.pacienteId === id)),
  },

  // ---- evolucoes
  evolucoes: {
    list: () => wait(evolucoes),
    create: async (data: Partial<Evolucao>) => {
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
    porQuantidade: async (input: { pacienteId: string; quantidade: number; formaPagamento: string }) => {
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
      const t = texto.toLowerCase();
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
    refresh: async () => wait({ ok: true }),
  },
  admin: {
    status: () => wait(adminStatus),
    comando: async (cmd: string) => wait({ ok: true, cmd, output: `Comando ${cmd} executado.` }),
  },

  profissionais: () => wait(profissionais),
};