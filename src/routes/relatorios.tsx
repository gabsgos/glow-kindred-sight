import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, TrendingUp, Users, Activity, Search, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { corDoServico } from "@/lib/mocks";
import {
  asArray,
  asNumber,
  asSearchTerm,
  asText,
  formatCurrency,
  formatDecimal,
  matchesText,
} from "@/lib/safe";
import type { AgendaSlot, Faturamento, Paciente } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — FisioBot" }] }),
  component: RelatoriosPage,
});

const brl = formatCurrency;

function isoWeek(d: Date): string {
  // ISO week key YYYY-Www
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function fmtDay(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function RelatoriosPage() {
  const [agenda, setAgenda] = useState<AgendaSlot[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    void api.agenda
      .list()
      .then((items) => setAgenda(asArray(items)))
      .catch(() => setAgenda([]));
    void api.pacientes
      .list()
      .then(async (ps) => {
        setPacientes(asArray(ps));
        setFaturamentos(asArray(await api.pacientes.financeiro("")));
      })
      .catch(() => {
        setPacientes([]);
        setFaturamentos([]);
      });
  }, []);

  // ----- financeiro
  const totalRecebido = asArray(faturamentos)
    .filter((f) => f.statusFinanceiro === "pago")
    .reduce((a, f) => a + asNumber(f.valorAtendimento), 0);
  const totalPendente = asArray(faturamentos)
    .filter((f) => f.statusFinanceiro === "pendente")
    .reduce((a, f) => a + asNumber(f.valorAtendimento), 0);
  const ticketMedio = asArray(faturamentos).length
    ? (totalRecebido + totalPendente) / asArray(faturamentos).length
    : 0;

  const porFormaPgto = useMemo(() => {
    const m = new Map<string, number>();
    asArray(faturamentos)
      .filter((f) => f.statusFinanceiro === "pago" && f.formaPagamento)
      .forEach((f) => {
        const forma = asText(f.formaPagamento);
        if (forma) m.set(forma, (m.get(forma) ?? 0) + asNumber(f.valorAtendimento));
      });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [faturamentos]);

  // ----- atendimentos (séries temporais: dia, semana, mês)
  const slotsConcluidos = useMemo(
    () => asArray(agenda).filter((s) => s.status !== "cancelado"),
    [agenda],
  );

  const porDia = useMemo(() => {
    const m = new Map<string, number>();
    slotsConcluidos.forEach((s) => {
      const key = asText(s.data);
      if (key) m.set(key, (m.get(key) ?? 0) + (asNumber(s.ocupacao) || asArray(s.clientes).length));
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [slotsConcluidos]);

  const porSemana = useMemo(() => {
    const m = new Map<string, number>();
    slotsConcluidos.forEach((s) => {
      const data = asText(s.data);
      if (!data) return;
      const k = isoWeek(new Date(`${data}T00:00:00`));
      m.set(k, (m.get(k) ?? 0) + (asNumber(s.ocupacao) || asArray(s.clientes).length));
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [slotsConcluidos]);

  const porMes = useMemo(() => {
    const m = new Map<string, number>();
    slotsConcluidos.forEach((s) => {
      const k = asText(s.data).slice(0, 7);
      if (k) m.set(k, (m.get(k) ?? 0) + (asNumber(s.ocupacao) || asArray(s.clientes).length));
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [slotsConcluidos]);

  const totalGeral = porDia.reduce((a, [, v]) => a + v, 0);
  const mediaDia = porDia.length ? totalGeral / porDia.length : 0;
  const mediaSemana = porSemana.length ? totalGeral / porSemana.length : 0;
  const mediaMes = porMes.length ? totalGeral / porMes.length : 0;

  const porServico = useMemo(() => {
    const m = new Map<string, number>();
    slotsConcluidos.forEach((s) => {
      const servico = asText(s.servico) || "Sem servico";
      m.set(servico, (m.get(servico) ?? 0) + (asNumber(s.ocupacao) || asArray(s.clientes).length));
    });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [slotsConcluidos]);
  const totalAtend = porServico.reduce((a, [, v]) => a + v, 0);

  // ----- pacientes (com busca)
  const pacientesStats = useMemo(() => {
    const atendPorPac = new Map<string, number>();
    slotsConcluidos.forEach((s) =>
      asArray(s.clientes).forEach((c) =>
        atendPorPac.set(c.pacienteId, (atendPorPac.get(c.pacienteId) ?? 0) + 1),
      ),
    );
    const finPorPac = new Map<string, { pago: number; pendente: number }>();
    asArray(faturamentos).forEach((f) => {
      const cur = finPorPac.get(f.pacienteId) ?? { pago: 0, pendente: 0 };
      if (f.statusFinanceiro === "pago") cur.pago += asNumber(f.valorAtendimento);
      if (f.statusFinanceiro === "pendente") cur.pendente += asNumber(f.valorAtendimento);
      finPorPac.set(f.pacienteId, cur);
    });
    return asArray(pacientes).map((p) => ({
      paciente: p,
      atendimentos: asNumber(atendPorPac.get(p.id) ?? p.totalAtendimentos),
      pago: asNumber(finPorPac.get(p.id)?.pago ?? p.totalPago),
      pendente: asNumber(finPorPac.get(p.id)?.pendente ?? p.totalPendente),
    }));
  }, [pacientes, slotsConcluidos, faturamentos]);

  const pacientesFiltrados = useMemo(() => {
    const q = asSearchTerm(busca);
    const list = q
      ? pacientesStats.filter(
          (s) =>
            matchesText(s.paciente.nomeCompleto, q) ||
            matchesText(s.paciente.telefone, q) ||
            matchesText(s.paciente.cpf, q),
        )
      : pacientesStats;
    return [...list].sort((a, b) => b.atendimentos - a.atendimentos);
  }, [pacientesStats, busca]);

  const inadimplentes = useMemo(
    () => pacientesStats.filter((s) => s.pendente > 0).sort((a, b) => b.pendente - a.pendente),
    [pacientesStats],
  );

  const exportar = () => {
    const linhas = [
      ["Tipo", "Chave", "Valor"],
      ["Financeiro", "Recebido", String(totalRecebido)],
      ["Financeiro", "Pendente", String(totalPendente)],
      ["Financeiro", "Ticket médio", formatDecimal(ticketMedio, 2)],
      ...porDia.map(([k, v]) => ["Atendimentos por dia", k, String(v)]),
      ...porSemana.map(([k, v]) => ["Atendimentos por semana", k, String(v)]),
      ...porMes.map(([k, v]) => ["Atendimentos por mês", k, String(v)]),
      ...porServico.map(([k, v]) => ["Atendimentos por serviço", k, String(v)]),
    ];
    const csv = linhas.map((l) => l.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fisiobot-relatorio-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Relatório exportado em CSV.");
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            Estatísticas de atendimentos, financeiro e busca por paciente.
          </p>
        </div>
        <Button variant="outline" onClick={exportar}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </header>

      <Tabs defaultValue="atendimentos">
        <TabsList>
          <TabsTrigger value="atendimentos">
            <Activity className="h-4 w-4 mr-1" />
            Atendimentos
          </TabsTrigger>
          <TabsTrigger value="financeiro">
            <TrendingUp className="h-4 w-4 mr-1" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="pacientes">
            <Users className="h-4 w-4 mr-1" />
            Pacientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atendimentos" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniKpi label="Média por dia" value={formatDecimal(mediaDia)} />
            <MiniKpi label="Média por semana" value={formatDecimal(mediaSemana)} />
            <MiniKpi label="Média por mês" value={formatDecimal(mediaMes)} />
          </div>

          <SerieCard
            titulo="Atendimentos por dia"
            icone={<Calendar className="h-4 w-4" />}
            dados={porDia}
            formatKey={fmtDay}
          />
          <SerieCard
            titulo="Atendimentos por semana"
            icone={<Calendar className="h-4 w-4" />}
            dados={porSemana}
          />
          <SerieCard
            titulo="Atendimentos por mês"
            icone={<Calendar className="h-4 w-4" />}
            dados={porMes}
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Por serviço ({totalAtend} no total)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {porServico.length === 0 && (
                <p className="text-sm text-muted-foreground">Sem atendimentos.</p>
              )}
              {porServico.map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: corDoServico(k) }}
                      />
                      {k}
                    </span>
                    <span className="tabular-nums">{v}</span>
                  </div>
                  <Progress value={totalAtend ? (v / totalAtend) * 100 : 0} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniKpi label="Total recebido" value={brl(totalRecebido)} tone="success" />
            <MiniKpi label="Total pendente" value={brl(totalPendente)} tone="warning" />
            <MiniKpi label="Ticket médio" value={brl(ticketMedio)} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recebimentos por forma de pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {porFormaPgto.length === 0 && (
                <p className="text-sm text-muted-foreground">Sem pagamentos registrados.</p>
              )}
              {porFormaPgto.map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{k}</span>
                    <span className="tabular-nums">{brl(v)}</span>
                  </div>
                  <Progress value={totalRecebido ? (v / totalRecebido) * 100 : 0} />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inadimplentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {inadimplentes.length === 0 && (
                <p className="text-sm text-muted-foreground">Ninguém em débito.</p>
              )}
              {inadimplentes.map((s) => (
                <div
                  key={s.paciente.id}
                  className="flex items-center justify-between border rounded-md p-2"
                >
                  <span className="truncate text-sm">{s.paciente.nomeCompleto}</span>
                  <span className="text-sm font-medium text-amber-600">{brl(s.pendente)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar paciente por nome, telefone ou CPF..."
              className="pl-9"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {pacientesFiltrados.length} paciente{pacientesFiltrados.length === 1 ? "" : "s"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="p-3">Paciente</th>
                      <th className="p-3 text-right">Atendimentos</th>
                      <th className="p-3 text-right">Pago</th>
                      <th className="p-3 text-right">Pendente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientesFiltrados.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-muted-foreground">
                          Nenhum paciente encontrado.
                        </td>
                      </tr>
                    )}
                    {pacientesFiltrados.map((s) => (
                      <tr key={s.paciente.id} className="border-t">
                        <td className="p-3">
                          <div className="font-medium">
                            {asText(s.paciente.nomeCompleto) || "Paciente sem nome"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {asText(s.paciente.telefone) || "-"}
                          </div>
                        </td>
                        <td className="p-3 text-right tabular-nums">
                          <Badge variant="secondary">{s.atendimentos}</Badge>
                        </td>
                        <td className="p-3 text-right tabular-nums text-emerald-600">
                          {brl(s.pago)}
                        </td>
                        <td className="p-3 text-right tabular-nums">
                          <span
                            className={
                              s.pendente > 0
                                ? "text-amber-600 font-medium"
                                : "text-muted-foreground"
                            }
                          >
                            {brl(s.pendente)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SerieCard({
  titulo,
  icone,
  dados,
  formatKey,
}: {
  titulo: string;
  icone?: React.ReactNode;
  dados: Array<[string, number]>;
  formatKey?: (k: string) => string;
}) {
  const max = dados.reduce((a, [, v]) => Math.max(a, v), 0);
  const total = dados.reduce((a, [, v]) => a + v, 0);
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          {icone}
          {titulo}
        </CardTitle>
        <span className="text-xs text-muted-foreground">Total: {total}</span>
      </CardHeader>
      <CardContent>
        {dados.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados.</p>
        ) : (
          <div className="flex items-end gap-1.5 h-32">
            {dados.map(([k, v]) => (
              <div key={k} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                <div className="text-[10px] tabular-nums text-muted-foreground">{v}</div>
                <div
                  className="w-full rounded-t bg-primary/80 hover:bg-primary transition"
                  style={{ height: `${max ? (v / max) * 100 : 0}%`, minHeight: v > 0 ? 4 : 0 }}
                  title={`${k}: ${v}`}
                />
                <div className="text-[10px] text-muted-foreground truncate w-full text-center">
                  {formatKey ? formatKey(k) : k}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MiniKpi({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "warning";
}) {
  const toneCls =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warning"
        ? "text-amber-600"
        : "text-foreground";
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-xs text-muted-foreground font-normal">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${toneCls}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
