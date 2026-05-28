import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Calendar,
  Users,
  AlertTriangle,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { AgendaSlot, AuditoriaItem, Faturamento, Paciente, Pendencia } from "@/lib/types";
import { corDoServico } from "@/lib/mocks";
import {
  asArray,
  asBoolean,
  asNumber,
  asText,
  formatCurrency,
  formatDatePt,
  safeSlice,
} from "@/lib/safe";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Início - FisioBot" }] }),
  component: DashboardPage,
});

const hojeIso = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function DashboardPage() {
  const [agenda, setAgenda] = useState<AgendaSlot[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [pendencias, setPendencias] = useState<Pendencia[]>([]);
  const [auditoria, setAuditoria] = useState<AuditoriaItem[]>([]);

  useEffect(() => {
    let active = true;

    void Promise.allSettled([
      api.agenda.list(),
      api.pacientes.list(),
      api.pacientes.financeiro(""),
      api.pendencias.list(),
      api.auditoria.list(),
    ]).then(
      ([agendaResult, pacientesResult, faturamentoResult, pendenciaResult, auditoriaResult]) => {
        if (!active) return;
        setAgenda(agendaResult.status === "fulfilled" ? asArray(agendaResult.value) : []);
        setPacientes(pacientesResult.status === "fulfilled" ? asArray(pacientesResult.value) : []);
        setFaturamentos(
          faturamentoResult.status === "fulfilled" ? asArray(faturamentoResult.value) : [],
        );
        setPendencias(pendenciaResult.status === "fulfilled" ? asArray(pendenciaResult.value) : []);
        setAuditoria(auditoriaResult.status === "fulfilled" ? asArray(auditoriaResult.value) : []);
      },
    );

    return () => {
      active = false;
    };
  }, []);

  const HOJE = hojeIso();
  const mesAtual = HOJE.slice(0, 7);

  const resumo = useMemo(() => {
    const slotsHoje = asArray(agenda).filter((slot) => asText(slot.data) === HOJE);
    const pendenciasAbertas = asArray(pendencias).filter((item) => item.status === "aberta");
    const faturamentosSeguros = asArray(faturamentos);
    const pacientesSeguros = asArray(pacientes);

    return {
      slotsHoje,
      slotsHojeVisiveis: safeSlice(slotsHoje, 12),
      atendimentosHoje: slotsHoje.reduce((acc, slot) => acc + asNumber(slot.ocupacao), 0),
      slotsAbertos: slotsHoje.filter((slot) => slot.status === "aberto").length,
      aReceber: faturamentosSeguros
        .filter((item) => item.statusFinanceiro === "pendente")
        .reduce((acc, item) => acc + asNumber(item.valorAtendimento), 0),
      recebidoMes: faturamentosSeguros
        .filter(
          (item) =>
            item.statusFinanceiro === "pago" && asText(item.dataPagamento).startsWith(mesAtual),
        )
        .reduce((acc, item) => acc + asNumber(item.valorAtendimento), 0),
      creditoTotal: pacientesSeguros.reduce(
        (acc, paciente) => acc + asNumber(paciente.creditoDisponivel),
        0,
      ),
      pendenciasAbertas,
      pendenciasVisiveis: safeSlice(pendenciasAbertas, 8),
      pacientesAtivos: pacientesSeguros.filter((paciente) => asBoolean(paciente.ativo)).length,
      auditoriaVisivel: safeSlice(auditoria, 4),
    };
  }, [HOJE, agenda, auditoria, faturamentos, mesAtual, pacientes, pendencias]);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Início</h1>
          <p className="text-sm text-muted-foreground">Visão geral do dia - {formatDatePt(HOJE)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/agenda">Abrir agenda</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Calendar className="h-4 w-4" />}
          label="Atendimentos hoje"
          value={resumo.atendimentosHoje}
          hint={`${resumo.slotsAbertos} slots abertos`}
        />
        <KpiCard
          icon={<DollarSign className="h-4 w-4" />}
          label="A receber"
          value={formatCurrency(resumo.aReceber)}
          tone="warning"
        />
        <KpiCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Recebido no mês"
          value={formatCurrency(resumo.recebidoMes)}
          tone="success"
        />
        <KpiCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Pendências"
          value={resumo.pendenciasAbertas.length}
          tone={resumo.pendenciasAbertas.length ? "warning" : "default"}
          hint={`Crédito em conta: ${formatCurrency(resumo.creditoTotal)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Agenda de hoje</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/agenda">Ver tudo</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumo.slotsHoje.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum atendimento programado para hoje.
              </p>
            )}
            {resumo.slotsHojeVisiveis.map((slot) => (
              <div key={slot.id} className="flex items-center gap-3 rounded-md border p-3">
                <div
                  className="h-10 w-1 rounded"
                  style={{ background: corDoServico(asText(slot.servico)) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {asText(slot.servico) || "Atendimento"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {asText(slot.profissionalNome) || "Profissional não informado"}
                  </div>
                </div>
                <div className="text-sm tabular-nums">
                  {asText(slot.horaInicio)}-{asText(slot.horaFim)}
                </div>
                <Badge variant="secondary" className="ml-2">
                  {asNumber(slot.ocupacao)}/
                  {asBoolean(slot.capacidadeIlimitada) ? "Ilimitado" : asNumber(slot.capacidade)}
                </Badge>
              </div>
            ))}
            {resumo.slotsHoje.length > resumo.slotsHojeVisiveis.length && (
              <p className="text-xs text-muted-foreground">
                Mostrando os primeiros 12 atendimentos de hoje.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pendências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumo.pendenciasAbertas.length === 0 && (
              <p className="text-sm text-muted-foreground">Tudo em dia.</p>
            )}
            {resumo.pendenciasVisiveis.map((pendencia) => (
              <div key={pendencia.id} className="rounded-md border p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" /> {asText(pendencia.tipo) || "Pendência"}
                </div>
                <div className="text-sm mt-1">{asText(pendencia.descricao)}</div>
              </div>
            ))}
            {resumo.pendenciasAbertas.length > resumo.pendenciasVisiveis.length && (
              <p className="text-xs text-muted-foreground">
                Mostrando as primeiras 8 pendências abertas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Pacientes ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{resumo.pacientesAtivos}</div>
            <p className="text-sm text-muted-foreground mt-1">Cadastros ativos no sistema</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link to="/pacientes">Abrir lista</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Últimas ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resumo.auditoriaVisivel.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                {item.status === "sucesso" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                ) : item.status === "pendente" ? (
                  <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="truncate">{asText(item.mensagem) || "Evento registrado"}</div>
                  <div className="text-xs text-muted-foreground">
                    {asText(item.intent)} - {asText(item.origem)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          <span>{label}</span>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-semibold ${toneCls}`}>{value}</div>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}
