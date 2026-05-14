import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentModal } from "@/components/financeiro/PaymentModal";
import { api } from "@/lib/api";
import type { Faturamento, Paciente } from "@/lib/types";

export const Route = createFileRoute("/financeiro")({
  head: () => ({ meta: [{ title: "Contas a receber — FisioBot" }] }),
  component: FinanceiroPage,
});

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function FinanceiroPage() {
  const [faturamentos, setFaturamentos] = useState<Faturamento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendente" | "pago">("todos");
  const [busca, setBusca] = useState("");
  const [pagModal, setPagModal] = useState<Paciente | null>(null);

  async function load() {
    const pacs = await api.pacientes.list();
    setPacientes(pacs);
    const all: Faturamento[] = [];
    for (const p of pacs) all.push(...(await api.pacientes.financeiro(p.id)));
    setFaturamentos(all);
  }

  useEffect(() => {
    void load();
  }, []);

  const kpis = useMemo(() => {
    const pendente = faturamentos
      .filter((f) => f.statusFinanceiro === "pendente")
      .reduce((s, f) => s + f.valorAtendimento, 0);
    const pago = faturamentos
      .filter((f) => f.statusFinanceiro === "pago")
      .reduce((s, f) => s + f.valorAtendimento, 0);
    const credito = pacientes.reduce((s, p) => s + p.creditoDisponivel, 0);
    const qtdPend = faturamentos.filter((f) => f.statusFinanceiro === "pendente").length;
    return { pendente, pago, credito, qtdPend };
  }, [faturamentos, pacientes]);

  const visiveis = useMemo(() => {
    const t = busca.toLowerCase().trim();
    return faturamentos
      .filter((f) => (filtro === "todos" ? true : f.statusFinanceiro === filtro))
      .filter((f) => (t ? f.nomeCompleto.toLowerCase().includes(t) : true))
      .sort((a, b) => b.data.localeCompare(a.data));
  }, [faturamentos, filtro, busca]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Contas a receber</h1>
          <p className="text-sm text-muted-foreground">
            Cobranças de pacientes, créditos e quitação de atendimentos.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard
          icon={<AlertCircle className="size-4" />}
          label="A receber"
          value={BRL(kpis.pendente)}
          tone="warn"
          hint={`${kpis.qtdPend} atendimento(s)`}
        />
        <KpiCard
          icon={<CheckCircle2 className="size-4" />}
          label="Recebido"
          value={BRL(kpis.pago)}
          tone="success"
        />
        <KpiCard
          icon={<Wallet className="size-4" />}
          label="Crédito de pacientes"
          value={BRL(kpis.credito)}
          tone="info"
        />
        <KpiCard
          icon={<CreditCard className="size-4" />}
          label="Pacientes com pendência"
          value={String(pacientes.filter((p) => (p.totalPendente ?? 0) > 0).length)}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Pacientes</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar paciente"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full md:w-56"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {pacientes.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
            >
              <div>
                <div className="font-medium">{p.nomeCompleto}</div>
                <div className="text-xs text-muted-foreground">
                  Pendente: {BRL(p.totalPendente ?? 0)} · Crédito: {BRL(p.creditoDisponivel)}
                </div>
              </div>
              <Button size="sm" onClick={() => setPagModal(p)}>
                Registrar pagamento
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Atendimentos faturados</CardTitle>
          <Select value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="pago">Pagos</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Forma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="whitespace-nowrap">{f.data}</TableCell>
                  <TableCell>{f.nomeCompleto}</TableCell>
                  <TableCell className="text-right">{BRL(f.valorAtendimento)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={f.statusFinanceiro === "pago" ? "default" : "secondary"}
                      className={
                        f.statusFinanceiro === "pago"
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : f.statusFinanceiro === "pendente"
                            ? "bg-amber-500 text-white hover:bg-amber-500"
                            : ""
                      }
                    >
                      {f.statusFinanceiro}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.formaPagamento ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
              {visiveis.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    Sem registros para o filtro atual.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentModal
        open={!!pagModal}
        onOpenChange={(o) => !o && setPagModal(null)}
        paciente={pagModal}
        onDone={load}
      />
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "success" | "warn" | "info";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "info"
          ? "text-sky-600"
          : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={toneClass}>{icon}</span>
          {label}
        </div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}