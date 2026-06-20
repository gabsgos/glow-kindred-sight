import { createFileRoute, Link } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Plus, Search, Phone, CreditCard, AlertCircle, Wallet, FileText, CalendarDays } from "lucide-react";

import { api } from "@/lib/api";
import type { Paciente } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { asArray, asNumber, asText, formatCurrency, matchesText } from "@/lib/safe";
import type { Evolucao, Faturamento } from "@/lib/types";

export const Route = createFileRoute("/pacientes")({
  head: () => ({ meta: [{ title: "Pacientes — FisioBot" }] }),
  component: PacientesPage,
});

function PacientesPage() {
  const [q, setQ] = useState("");
  const deferredQ = useDeferredValue(q);
  const [filtro, setFiltro] = useState<"todos" | "credito" | "pendente">("todos");
  const [items, setItems] = useState<Paciente[]>([]);
  const [selected, setSelected] = useState<Paciente | null>(null);

  useEffect(() => {
    let active = true;
    api.pacientes
      .list()
      .then((nextItems) => {
        if (active) setItems(asArray(nextItems));
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtrados = useMemo(() => {
    const base = deferredQ
      ? items.filter(
          (p) =>
            matchesText(p.nomeCompleto, deferredQ) ||
            matchesText(p.telefone, deferredQ) ||
            matchesText(p.cpf, deferredQ),
        )
      : items;
    if (filtro === "credito") return base.filter((p) => asNumber(p.creditoDisponivel) > 0);
    if (filtro === "pendente") return base.filter((p) => asNumber(p.totalPendente) > 0);
    return base;
  }, [items, filtro, deferredQ]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} de {items.length} pacientes
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/cadastro">
            <Plus className="h-4 w-4" /> Novo Cadastro
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, telefone ou CPF..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(["todos", "credito", "pendente"] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={filtro === k ? "default" : "outline"}
              onClick={() => setFiltro(k)}
            >
              {k === "todos" ? "Todos" : k === "credito" ? "Com credito do paciente" : "Com pendência"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((p) => (
          <button key={p.id} type="button" className="text-left" onClick={() => setSelected(p)}>
            <Card className="h-full p-4 transition-colors hover:bg-accent/40">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">
                    {asText(p.nomeCompleto) || "Paciente sem nome"}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {asText(p.telefone) || "-"}
                  </div>
                </div>
                {asNumber(p.creditoDisponivel) > 0 && (
                  <Badge className="bg-success text-success-foreground">
                    <CreditCard className="mr-1 h-3 w-3" /> {formatCurrency(p.creditoDisponivel)}
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {asNumber(p.totalAtendimentos)} atend. - último{" "}
                  {asText(p.ultimoAtendimento) || "-"}
                </span>
                {asNumber(p.totalPendente) > 0 && (
                  <span className="flex items-center gap-1 text-warning">
                    <AlertCircle className="h-3 w-3" /> {formatCurrency(p.totalPendente)}
                  </span>
                )}
              </div>
            </Card>
          </button>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum paciente encontrado.
          </div>
        )}
      </div>

      <PatientDrawer patient={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function PatientDrawer({ patient, onClose }: { patient: Paciente | null; onClose: () => void }) {
  const [financeiro, setFinanceiro] = useState<Faturamento[]>([]);
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);

  useEffect(() => {
    if (!patient?.id) return;
    let active = true;
    void Promise.allSettled([
      api.pacientes.financeiro(patient.id),
      api.pacientes.evolucoes(patient.id),
    ]).then(([financeiroResult, evolucoesResult]) => {
      if (!active) return;
      setFinanceiro(financeiroResult.status === "fulfilled" ? asArray(financeiroResult.value) : []);
      setEvolucoes(evolucoesResult.status === "fulfilled" ? asArray(evolucoesResult.value) : []);
    });
    return () => {
      active = false;
    };
  }, [patient?.id]);

  if (!patient) return null;

  const totalPago = asArray(financeiro)
    .filter((item) => asText(item.statusFinanceiro) === "pago")
    .reduce((sum, item) => sum + asNumber(item.valorPago || item.valorAtendimento), 0);
  const totalPendente = asArray(financeiro)
    .filter((item) => asText(item.statusFinanceiro) !== "pago")
    .reduce((sum, item) => sum + asNumber(item.valorAtendimento), 0);

  return (
    <div className="fixed inset-0 z-50 bg-background/20 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Fechar perfil"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-dvh w-[min(760px,100vw)] overflow-auto border-l bg-background p-6 shadow-2xl animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
            <div>
              <h2 className="text-2xl font-semibold">
                {asText(patient.nomeCompleto) || "Paciente sem nome"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {asText(patient.telefone) || "sem telefone"} · CPF {asText(patient.cpf) || "-"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{patient.ativo === false ? "Inativo" : "Ativo"}</Badge>
              <Button asChild size="sm" variant="outline">
                <Link to="/pacientes/$id/editar" params={{ id: patient.id }} onClick={onClose}>
                  Editar cadastro
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <MiniStat icon={<CreditCard className="h-4 w-4" />} label="Credito do paciente" value={formatCurrency(patient.creditoDisponivel)} />
          <MiniStat icon={<Wallet className="h-4 w-4" />} label="Pendente" value={formatCurrency(totalPendente || patient.totalPendente)} />
          <MiniStat icon={<FileText className="h-4 w-4" />} label="Pago" value={formatCurrency(totalPago || patient.totalPago)} />
          <MiniStat icon={<CalendarDays className="h-4 w-4" />} label="Atendimentos" value={String(asNumber(patient.totalAtendimentos))} />
        </div>

        <Tabs defaultValue="resumo" className="mt-2">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="evolucoes">Evoluções</TabsTrigger>
          </TabsList>
          <TabsContent value="resumo" className="space-y-3">
            <Card className="p-4">
              <h3 className="font-semibold">Resumo operacional</h3>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <Info label="Último atendimento">{asText(patient.ultimoAtendimento) || "-"}</Info>
                <Info label="Valor padrão">{formatCurrency(patient.valorPadraoAtendimento)}</Info>
                <Info label="Telefone">{asText(patient.telefone) || "-"}</Info>
                <Info label="Pendência">{formatCurrency(totalPendente || patient.totalPendente)}</Info>
              </dl>
            </Card>
          </TabsContent>
          <TabsContent value="cadastro">
            <Card className="p-4">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <Info label="Nome completo">{asText(patient.nomeCompleto) || "-"}</Info>
                <Info label="CPF">{asText(patient.cpf) || "-"}</Info>
                <Info label="Nascimento">{asText(patient.dataNascimento) || "-"}</Info>
                <Info label="Endereço">{asText(patient.endereco) || "-"}</Info>
                <Info label="Observações">{asText(patient.observacoes) || "-"}</Info>
              </dl>
            </Card>
          </TabsContent>
          <TabsContent value="financeiro" className="space-y-2">
            {asArray(financeiro).length === 0 && (
              <Card className="p-4 text-sm text-muted-foreground">Nenhum lançamento financeiro.</Card>
            )}
            {asArray(financeiro).map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-3 p-3">
                <div>
                  <div className="font-medium">{formatCurrency(item.valorPago || item.valorAtendimento)}</div>
                  <div className="text-xs text-muted-foreground">{asText(item.dataPagamento || item.data)}</div>
                </div>
                <Badge variant={asText(item.statusFinanceiro) === "pago" ? "default" : "secondary"}>
                  {asText(item.statusFinanceiro) || "pendente"}
                </Badge>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="evolucoes" className="space-y-2">
            {asArray(evolucoes).length === 0 && (
              <Card className="p-4 text-sm text-muted-foreground">Nenhuma evolução registrada.</Card>
            )}
            {asArray(evolucoes).map((item) => (
              <Card key={item.id} className="p-3">
                <div className="text-xs text-muted-foreground">{asText(item.data)}</div>
                <p className="mt-1 text-sm">{asText(item.texto)}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </aside>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
