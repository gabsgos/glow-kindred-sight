import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, TrendingUp, Users, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { comissaoApi } from "@/lib/api";
import type { Comissao } from "@/lib/types";

export const Route = createFileRoute("/financeiro/comissao")({
  head: () => ({ meta: [{ title: "Comissão — FisioBot" }] }),
  component: ComissaoPage,
});

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ComissaoPage() {
  const [items, setItems] = useState<Comissao[]>([]);
  const [referencia, setReferencia] = useState<string>("todos");

  async function load() {
    setItems(await comissaoApi.list());
  }
  useEffect(() => {
    void load();
  }, []);

  const referencias = useMemo(
    () => Array.from(new Set(items.map((c) => c.referencia))).sort().reverse(),
    [items],
  );

  const visiveis = useMemo(() => {
    return items
      .filter((c) => (referencia === "todos" ? true : c.referencia === referencia))
      .sort((a, b) => (a.referencia + a.profissionalNome).localeCompare(b.referencia + b.profissionalNome))
      .reverse();
  }, [items, referencia]);

  const kpis = useMemo(() => {
    const pendente = visiveis.filter((c) => c.status === "pendente").reduce((s, c) => s + c.valor, 0);
    const pago = visiveis.filter((c) => c.status === "paga").reduce((s, c) => s + c.valor, 0);
    const profs = new Set(visiveis.map((c) => c.profissionalId)).size;
    const atend = visiveis.reduce((s, c) => s + c.atendimentos, 0);
    return { pendente, pago, profs, atend };
  }, [visiveis]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Comissão</h1>
          <p className="text-sm text-muted-foreground">
            Cálculo de comissão por profissional e atendimento.
          </p>
        </div>
        <Select value={referencia} onValueChange={setReferencia}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os meses</SelectItem>
            {referencias.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard icon={<TrendingUp className="size-4" />} label="A pagar" value={BRL(kpis.pendente)} tone="warn" />
        <KpiCard icon={<Check className="size-4" />} label="Pago" value={BRL(kpis.pago)} tone="success" />
        <KpiCard icon={<Users className="size-4" />} label="Profissionais" value={String(kpis.profs)} />
        <KpiCard icon={<CalendarIcon className="size-4" />} label="Atendimentos" value={String(kpis.atend)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Comissões</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead className="text-right">Atend.</TableHead>
                <TableHead className="text-right">Base</TableHead>
                <TableHead className="text-right">%</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.referencia}</TableCell>
                  <TableCell>{c.profissionalNome}</TableCell>
                  <TableCell className="text-right">{c.atendimentos}</TableCell>
                  <TableCell className="text-right">{BRL(c.baseCalculo)}</TableCell>
                  <TableCell className="text-right">{c.percentual}%</TableCell>
                  <TableCell className="text-right font-medium">{BRL(c.valor)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        c.status === "paga"
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : "bg-amber-500 text-white hover:bg-amber-500"
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {c.status === "pendente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          await comissaoApi.marcarPaga(c.id);
                          await load();
                        }}
                      >
                        <Check className="mr-1 size-3.5" /> Pagar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {visiveis.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                    Sem comissões para a referência selecionada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "success" | "warn" | "info";
}) {
  const toneClass =
    tone === "success" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "info" ? "text-sky-600" : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className={toneClass}>{icon}</span>
          {label}
        </div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}