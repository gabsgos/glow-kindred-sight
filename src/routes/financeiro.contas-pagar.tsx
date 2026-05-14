import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Check, Trash2, AlertCircle, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { contasPagarApi, caixaApi } from "@/lib/api";
import type { ContaFinanceira, ContaPagar } from "@/lib/types";

export const Route = createFileRoute("/financeiro/contas-pagar")({
  head: () => ({ meta: [{ title: "Contas a pagar — FisioBot" }] }),
  component: ContasPagarPage,
});

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const CATEGORIAS = ["Aluguel", "Utilidades", "Insumos", "Folha", "Manutenção", "Marketing", "Impostos", "Outros"];

function ContasPagarPage() {
  const [items, setItems] = useState<ContaPagar[]>([]);
  const [contas, setContas] = useState<ContaFinanceira[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "pendentes" | "pagas" | "vencidas">("todas");
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);

  async function load() {
    setItems(await contasPagarApi.list());
    setContas(await caixaApi.contas());
  }
  useEffect(() => {
    void load();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const visiveis = useMemo(() => {
    const t = busca.toLowerCase().trim();
    return items
      .filter((c) => {
        if (filtro === "pendentes") return !c.pago;
        if (filtro === "pagas") return c.pago;
        if (filtro === "vencidas") return !c.pago && c.vencimento < today;
        return true;
      })
      .filter((c) =>
        t
          ? c.descricao.toLowerCase().includes(t) ||
            c.fornecedor?.toLowerCase().includes(t) ||
            c.categoria.toLowerCase().includes(t)
          : true,
      )
      .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  }, [items, filtro, busca, today]);

  const kpis = useMemo(() => {
    const pendente = items.filter((c) => !c.pago).reduce((s, c) => s + c.valor, 0);
    const pago = items.filter((c) => c.pago).reduce((s, c) => s + c.valor, 0);
    const vencidas = items.filter((c) => !c.pago && c.vencimento < today);
    return { pendente, pago, qtdVencidas: vencidas.length, valorVencido: vencidas.reduce((s, c) => s + c.valor, 0) };
  }, [items, today]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Contas a pagar</h1>
          <p className="text-sm text-muted-foreground">
            Despesas e contas a serem pagas pela clínica.
          </p>
        </div>
        <Button onClick={() => setModal(true)}>
          <Plus className="mr-2 size-4" /> Nova despesa
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard icon={<AlertCircle className="size-4" />} label="A pagar" value={BRL(kpis.pendente)} tone="warn" />
        <KpiCard icon={<CheckCircle2 className="size-4" />} label="Pagas" value={BRL(kpis.pago)} tone="success" />
        <KpiCard icon={<CalendarIcon className="size-4" />} label="Vencidas" value={String(kpis.qtdVencidas)} tone="warn" hint={BRL(kpis.valorVencido)} />
        <KpiCard icon={<CheckCircle2 className="size-4" />} label="Total registros" value={String(items.length)} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Despesas</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              placeholder="Buscar (descrição, fornecedor, categoria)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="md:w-72"
            />
            <Select value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
              <SelectTrigger className="md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="pendentes">Pendentes</SelectItem>
                <SelectItem value="vencidas">Vencidas</SelectItem>
                <SelectItem value="pagas">Pagas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((c) => {
                const venc = !c.pago && c.vencimento < today;
                return (
                  <TableRow key={c.id}>
                    <TableCell className={`whitespace-nowrap ${venc ? "text-amber-600 font-medium" : ""}`}>
                      {c.vencimento}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{c.descricao}</div>
                      {c.recorrente && <div className="text-xs text-muted-foreground">recorrente</div>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.categoria}</TableCell>
                    <TableCell className="text-muted-foreground">{c.fornecedor ?? "—"}</TableCell>
                    <TableCell className="text-right">{BRL(c.valor)}</TableCell>
                    <TableCell>
                      {c.pago ? (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">paga</Badge>
                      ) : venc ? (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500">vencida</Badge>
                      ) : (
                        <Badge variant="secondary">pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!c.pago && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              await contasPagarApi.marcarPaga(c.id);
                              await load();
                            }}
                          >
                            <Check className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            await contasPagarApi.remove(c.id);
                            await load();
                          }}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {visiveis.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    Sem despesas para o filtro atual.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NovaDespesaModal
        open={modal}
        onOpenChange={setModal}
        contas={contas}
        onCreated={load}
      />
    </div>
  );
}

function NovaDespesaModal({
  open,
  onOpenChange,
  contas,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  contas: ContaFinanceira[];
  onCreated: () => void;
}) {
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>(CATEGORIAS[0]);
  const [fornecedor, setFornecedor] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState(new Date().toISOString().slice(0, 10));
  const [contaId, setContaId] = useState<string>("");

  async function salvar() {
    if (!descricao || !valor) return;
    await contasPagarApi.create({
      descricao,
      categoria,
      fornecedor: fornecedor || undefined,
      valor: Number(valor),
      vencimento,
      pago: false,
      contaId: contaId || undefined,
    });
    onOpenChange(false);
    setDescricao("");
    setFornecedor("");
    setValor("");
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova despesa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Descrição</Label>
            <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Fornecedor</Label>
              <Input value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="grid gap-1">
              <Label>Valor</Label>
              <Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Vencimento</Label>
              <Input type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Conta</Label>
              <Select value={contaId} onValueChange={setContaId}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {contas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={salvar}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
    tone === "success" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "info" ? "text-sky-600" : "text-foreground";
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