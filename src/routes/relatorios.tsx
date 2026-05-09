import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { corDoServico } from "@/lib/mocks";
import type { AgendaSlot, Faturamento, Paciente } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — FisioBot" }] }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const [agenda, setAgenda] = useState<AgendaSlot[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);

  useEffect(() => {
    void api.agenda.list().then(setAgenda);
    void api.pacientes.list().then(async (ps) => {
      setPacientes(ps);
      const all = await Promise.all(ps.map((p) => api.pacientes.financeiro(p.id)));
      setFaturamentos(all.flat());
    });
  }, []);

  // ----- financeiro
  const totalRecebido = faturamentos
    .filter((f) => f.statusFinanceiro === "pago")
    .reduce((a, f) => a + f.valorAtendimento, 0);
  const totalPendente = faturamentos
    .filter((f) => f.statusFinanceiro === "pendente")
    .reduce((a, f) => a + f.valorAtendimento, 0);
  const ticketMedio = faturamentos.length
    ? (totalRecebido + totalPendente) / faturamentos.length
    : 0;

  const porFormaPgto = useMemo(() => {
    const m = new Map<string, number>();
    faturamentos
      .filter((f) => f.statusFinanceiro === "pago" && f.formaPagamento)
      .forEach((f) => m.set(f.formaPagamento!, (m.get(f.formaPagamento!) ?? 0) + f.valorAtendimento));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [faturamentos]);

  // ----- atendimentos
  const porServico = useMemo(() => {
    const m = new Map<string, number>();
    agenda.forEach((s) => m.set(s.servico, (m.get(s.servico) ?? 0) + s.ocupacao));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [agenda]);
  const totalAtend = porServico.reduce((a, [, v]) => a + v, 0);

  const porProfissional = useMemo(() => {
    const m = new Map<string, number>();
    agenda.forEach((s) => m.set(s.profissionalNome, (m.get(s.profissionalNome) ?? 0) + s.ocupacao));
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [agenda]);

  // ----- pacientes
  const topPacientes = useMemo(
    () => [...pacientes].sort((a, b) => (b.totalAtendimentos ?? 0) - (a.totalAtendimentos ?? 0)).slice(0, 5),
    [pacientes],
  );
  const inadimplentes = useMemo(
    () => [...pacientes].filter((p) => (p.totalPendente ?? 0) > 0).sort((a, b) => (b.totalPendente ?? 0) - (a.totalPendente ?? 0)),
    [pacientes],
  );

  const exportar = () => {
    const linhas = [
      ["Tipo", "Chave", "Valor"],
      ["Financeiro", "Recebido", String(totalRecebido)],
      ["Financeiro", "Pendente", String(totalPendente)],
      ["Financeiro", "Ticket médio", ticketMedio.toFixed(2)],
      ...porServico.map(([k, v]) => ["Atendimentos por serviço", k, String(v)]),
      ...porProfissional.map(([k, v]) => ["Atendimentos por profissional", k, String(v)]),
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
          <p className="text-sm text-muted-foreground">Indicadores de operação, financeiro e pacientes.</p>
        </div>
        <Button variant="outline" onClick={exportar}><Download className="h-4 w-4 mr-2" />Exportar CSV</Button>
      </header>

      <Tabs defaultValue="financeiro">
        <TabsList>
          <TabsTrigger value="financeiro"><TrendingUp className="h-4 w-4 mr-1" />Financeiro</TabsTrigger>
          <TabsTrigger value="atendimentos"><Activity className="h-4 w-4 mr-1" />Atendimentos</TabsTrigger>
          <TabsTrigger value="pacientes"><Users className="h-4 w-4 mr-1" />Pacientes</TabsTrigger>
        </TabsList>

        <TabsContent value="financeiro" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MiniKpi label="Total recebido" value={`R$ ${totalRecebido.toFixed(2)}`} tone="success" />
            <MiniKpi label="Total pendente" value={`R$ ${totalPendente.toFixed(2)}`} tone="warning" />
            <MiniKpi label="Ticket médio" value={`R$ ${ticketMedio.toFixed(2)}`} />
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Recebimentos por forma de pagamento</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {porFormaPgto.length === 0 && <p className="text-sm text-muted-foreground">Sem pagamentos registrados.</p>}
              {porFormaPgto.map(([k, v]) => (
                <div key={k}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{k}</span>
                    <span className="tabular-nums">R$ {v.toFixed(2)}</span>
                  </div>
                  <Progress value={totalRecebido ? (v / totalRecebido) * 100 : 0} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="atendimentos" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Por serviço ({totalAtend} no total)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {porServico.map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: corDoServico(k) }} />
                        {k}
                      </span>
                      <span className="tabular-nums">{v}</span>
                    </div>
                    <Progress value={totalAtend ? (v / totalAtend) * 100 : 0} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Por profissional</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {porProfissional.map(([k, v]) => (
                  <div key={k}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="truncate pr-2">{k}</span>
                      <span className="tabular-nums">{v}</span>
                    </div>
                    <Progress value={totalAtend ? (v / totalAtend) * 100 : 0} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Top atendimentos</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {topPacientes.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border rounded-md p-2">
                    <span className="truncate text-sm">{p.nomeCompleto}</span>
                    <Badge variant="secondary">{p.totalAtendimentos ?? 0}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Inadimplentes</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {inadimplentes.length === 0 && <p className="text-sm text-muted-foreground">Ninguém em débito. 🎉</p>}
                {inadimplentes.map((p) => (
                  <div key={p.id} className="flex items-center justify-between border rounded-md p-2">
                    <span className="truncate text-sm">{p.nomeCompleto}</span>
                    <span className="text-sm font-medium text-amber-600">R$ {(p.totalPendente ?? 0).toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MiniKpi({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600" : tone === "warning" ? "text-amber-600" : "text-foreground";
  return (
    <Card>
      <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground font-normal">{label}</CardTitle></CardHeader>
      <CardContent><div className={`text-2xl font-semibold ${toneCls}`}>{value}</div></CardContent>
    </Card>
  );
}
