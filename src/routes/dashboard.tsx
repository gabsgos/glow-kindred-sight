import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  AlertTriangle,
  DollarSign,
  Activity,
  RefreshCw,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { AgendaSlot, Faturamento, Paciente, Pendencia, AuditoriaItem } from "@/lib/types";
import { corDoServico } from "@/lib/mocks";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Início — FisioBot" }] }),
  component: DashboardPage,
});

const HOJE = "2026-05-07";

function DashboardPage() {
  const [agenda, setAgenda] = useState<AgendaSlot[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [auditoria, setAuditoria] = useState<AuditoriaItem[]>([]);

  useEffect(() => {
    void Promise.all([
      api.agenda.list(),
      api.pacientes.list(),
      api.pacientes.financeiro(""),
      api.pendencias.list(),
      api.auditoria.list(),
    ]).then(([a, p, _f, pe, au]) => {
      setAgenda(a);
      setPacientes(p);
      setPendencias(pe);
      setAuditoria(au);
    });
    void api.pacientes.list().then(async () => {
      const fAll = await Promise.all(
        (await api.pacientes.list()).map((p) => api.pacientes.financeiro(p.id)),
      );
      setFaturamentos(fAll.flat());
    });
  }, []);

  const slotsHoje = agenda.filter((s) => s.data === HOJE);
  const atendimentosHoje = slotsHoje.reduce((acc, s) => acc + s.ocupacao, 0);
  const slotsAbertos = slotsHoje.filter((s) => s.status === "aberto").length;

  const aReceber = faturamentos
    .filter((f) => f.statusFinanceiro === "pendente")
    .reduce((acc, f) => acc + f.valorAtendimento, 0);
  const recebidoMes = faturamentos
    .filter((f) => f.statusFinanceiro === "pago" && f.dataPagamento?.startsWith("2026-05"))
    .reduce((acc, f) => acc + f.valorAtendimento, 0);
  const creditoTotal = pacientes.reduce((acc, p) => acc + p.creditoDisponivel, 0);
  const pendenciasAbertas = pendencias.filter((p) => p.status === "aberta").length;

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Início</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do dia · {new Date(HOJE).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to="/agenda">Abrir agenda</Link></Button>
          <Button asChild><Link to="/ia">Comando IA</Link></Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<Calendar className="h-4 w-4" />} label="Atendimentos hoje" value={atendimentosHoje} hint={`${slotsAbertos} slots abertos`} />
        <KpiCard icon={<DollarSign className="h-4 w-4" />} label="A receber" value={`R$ ${aReceber.toFixed(2)}`} tone="warning" />
        <KpiCard icon={<CheckCircle2 className="h-4 w-4" />} label="Recebido (mês)" value={`R$ ${recebidoMes.toFixed(2)}`} tone="success" />
        <KpiCard icon={<AlertTriangle className="h-4 w-4" />} label="Pendências" value={pendenciasAbertas} tone={pendenciasAbertas ? "warning" : "default"} hint={`Crédito em conta: R$ ${creditoTotal.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Agenda de hoje</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/agenda">Ver tudo</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {slotsHoje.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum atendimento programado para hoje.</p>
            )}
            {slotsHoje.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-md border p-3">
                <div className="h-10 w-1 rounded" style={{ background: corDoServico(s.servico) }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{s.servico}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.profissionalNome}</div>
                </div>
                <div className="text-sm tabular-nums">{s.horaInicio}–{s.horaFim}</div>
                <Badge variant="secondary" className="ml-2">
                  {s.ocupacao}/{s.capacidadeIlimitada ? "∞" : s.capacidade}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pendências</CardTitle>
            <Button variant="ghost" size="sm" asChild><Link to="/pendencias">Resolver</Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendencias.filter((p) => p.status === "aberta").length === 0 && (
              <p className="text-sm text-muted-foreground">Tudo em dia. ✅</p>
            )}
            {pendencias.filter((p) => p.status === "aberta").map((p) => (
              <div key={p.id} className="rounded-md border p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" /> {p.tipo}
                </div>
                <div className="text-sm mt-1">{p.descricao}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Pacientes ativos</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{pacientes.filter((p) => p.ativo).length}</div>
            <p className="text-sm text-muted-foreground mt-1">Cadastros ativos no sistema</p>
            <Button variant="outline" size="sm" className="mt-3" asChild><Link to="/pacientes">Abrir lista</Link></Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4" /> Últimas ações</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {auditoria.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-start gap-2 text-sm">
                {a.status === "sucesso" ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" /> : a.status === "pendente" ? <Clock className="h-4 w-4 text-amber-500 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <div className="truncate">{a.mensagem}</div>
                  <div className="text-xs text-muted-foreground">{a.intent} · {a.origem}</div>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" asChild className="w-full mt-2"><Link to="/historico"><RefreshCw className="h-3 w-3 mr-1" />Ver histórico completo</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, hint, tone = "default" }: { icon: React.ReactNode; label: string; value: React.ReactNode; hint?: string; tone?: "default" | "success" | "warning" }) {
  const toneCls = tone === "success" ? "text-emerald-600" : tone === "warning" ? "text-amber-600" : "text-foreground";
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>{label}</span>{icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${toneCls}`}>{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}
