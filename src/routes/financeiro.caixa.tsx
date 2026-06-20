import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ListChecks,
  FileSpreadsheet,
  Lock,
  Banknote,
  CreditCard,
  Receipt,
  Building2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { caixaApi } from "@/lib/api";
import { asArray, asNumber, asText, formatCurrency, formatDecimal } from "@/lib/safe";
import type { Caixa, ContaFinanceira, LancamentoCaixa, MetodoPagamento } from "@/lib/types";

export const Route = createFileRoute("/financeiro/caixa")({
  head: () => ({ meta: [{ title: "Caixa — FisioBot" }] }),
  component: CaixaPage,
});

const brl = formatCurrency;

const fmtData = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return asText(iso) || "-";
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
};

const METODOS: MetodoPagamento[] = [
  "Dinheiro",
  "Cartao credito",
  "Debito",
  "Cheque",
  "Transferencia",
  "Pix",
];

function CaixaPage() {
  const [caixa, setCaixa] = useState<Caixa | null>(null);
  const [lanc, setLanc] = useState<LancamentoCaixa[]>([]);
  const [contas, setContas] = useState<ContaFinanceira[]>([]);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [modal, setModal] = useState<null | "entrada" | "saida" | "transferencia" | "abrir">(null);

  const refresh = async () => {
    const c = await caixaApi.caixaAtual();
    setCaixa(c);
    setContas(asArray(await caixaApi.contas()));
    if (c) setLanc(asArray(await caixaApi.lancamentos(c.id)));
    else setLanc([]);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const totais = useMemo(() => {
    const grupo = (m: MetodoPagamento) =>
      asArray(lanc)
        .filter((l) => l.tipo === "entrada" && l.metodo === m)
        .reduce((s, l) => s + asNumber(l.valor), 0);
    const dinheiro = grupo("Dinheiro");
    const credito = grupo("Cartao credito");
    const debito = grupo("Debito");
    const cheque = grupo("Cheque");
    const deposito = grupo("Transferencia") + grupo("Pix");
    const entradas = dinheiro + credito + debito + cheque + deposito;
    const saidas = asArray(lanc)
      .filter((l) => l.tipo === "saida")
      .reduce((s, l) => s + asNumber(l.valor), 0);
    const saldoTotal = asNumber(caixa?.saldoInicial) + entradas - saidas;
    return { dinheiro, credito, debito, cheque, deposito, entradas, saidas, saldoTotal };
  }, [lanc, caixa]);

  const paginas = Math.max(1, Math.ceil(asArray(lanc).length / porPagina));
  const slice = asArray(lanc).slice((pagina - 1) * porPagina, pagina * porPagina);

  const exportCsv = () => {
    const linhas = [
      ["Data", "Origem", "Método", "Tipo", "Valor"].join(";"),
      ...asArray(lanc).map((l) =>
        [fmtData(l.data), l.origem, l.metodo, l.tipo, formatDecimal(l.valor, 2)].join(";"),
      ),
    ].join("\n");
    const blob = new Blob([linhas], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `caixa_${caixa?.id ?? "atual"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fecharCaixa = async () => {
    if (!caixa) return;
    await caixaApi.fecharCaixa(caixa.id);
    toast.success("Caixa fechado.");
    await refresh();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Caixa</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={fecharCaixa} disabled={!caixa}>
            <Lock className="mr-1 h-4 w-4" /> Fechar caixa
          </Button>
          <Button size="sm" onClick={() => setModal("entrada")} disabled={!caixa}>
            <ArrowDownToLine className="mr-1 h-4 w-4" /> Entrada
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setModal("saida")} disabled={!caixa}>
            <ArrowUpFromLine className="mr-1 h-4 w-4" /> Saída
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setModal("transferencia")}
            disabled={!caixa}
          >
            <ArrowLeftRight className="mr-1 h-4 w-4" /> Transferência
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv}>
            <FileSpreadsheet className="mr-1 h-4 w-4" /> Espelho
          </Button>
          <Button size="sm" variant="outline">
            <ListChecks className="mr-1 h-4 w-4" /> Listar caixas
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        {/* painel lateral */}
        <div className="space-y-3">
          <Card>
            <CardContent className="space-y-2 p-4 text-sm">
              <Linha label="Situação">
                {caixa ? (
                  <Badge variant="outline" className="border-success/40 text-success">
                    Aberto
                  </Badge>
                ) : (
                  <Badge variant="outline">Fechado</Badge>
                )}
              </Linha>
              <Linha label="Responsável">{caixa?.responsavel ?? "—"}</Linha>
              <Linha label="Conta financeira">{caixa?.contaNome ?? "—"}</Linha>
              <Linha label="Data de abertura">{caixa ? fmtData(caixa.dataAbertura) : "—"}</Linha>
              <Linha label="Saldo inicial em dinheiro">
                <span className="font-medium">{brl(caixa?.saldoInicial ?? 0)}</span>
              </Linha>
              {!caixa && (
                <Button size="sm" className="mt-2 w-full" onClick={() => setModal("abrir")}>
                  <Plus className="mr-1 h-4 w-4" /> Abrir caixa
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-success">
                (+) Entradas
                <span className="float-right text-foreground">{brl(totais.entradas)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 p-4 pt-0 text-sm">
              <MetodoLinha
                icon={Banknote}
                cor="text-success"
                label="Dinheiro"
                valor={totais.dinheiro}
              />
              <MetodoLinha icon={CreditCard} label="Cartao credito" valor={totais.credito} />
              <MetodoLinha icon={CreditCard} label="Debito" valor={totais.debito} />
              <MetodoLinha icon={Receipt} label="Cheque" valor={totais.cheque} />
              <MetodoLinha icon={Building2} label="Transferencia / Pix" valor={totais.deposito} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold text-destructive">
                (-) Saídas
                <span className="float-right text-foreground">{brl(totais.saidas)}</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">Dinheiro em caixa</span>
              <span className="font-semibold">
                {brl(totais.dinheiro + (caixa?.saldoInicial ?? 0))}
              </span>
            </CardContent>
          </Card>
          <Card className="border-primary/40">
            <CardContent className="flex items-center justify-between p-4">
              <span className="text-sm font-medium">Saldo total</span>
              <span className="text-lg font-semibold text-primary">{brl(totais.saldoTotal)}</span>
            </CardContent>
          </Card>
        </div>

        {/* tabela de lançamentos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-base">Lançamentos</CardTitle>
            <Button variant="ghost" size="sm" onClick={refresh}>
              <RefreshCw className="mr-1 h-4 w-4" /> Atualizar
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slice.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Sem lançamentos.
                    </TableCell>
                  </TableRow>
                )}
                {slice.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap text-xs">{fmtData(l.data)}</TableCell>
                    <TableCell>{l.origem}</TableCell>
                    <TableCell>{l.metodo}</TableCell>
                    <TableCell>
                      <span
                        className={
                          l.tipo === "entrada"
                            ? "text-success"
                            : l.tipo === "saida"
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }
                      >
                        {l.tipo === "entrada"
                          ? "Entrada"
                          : l.tipo === "saida"
                            ? "Saída"
                            : "Transferência"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">{brl(l.valor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t p-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Exibir</span>
                <Select
                  value={String(porPagina)}
                  onValueChange={(v) => {
                    setPorPagina(Number(v));
                    setPagina(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span>
                {(pagina - 1) * porPagina + 1}–{Math.min(pagina * porPagina, lanc.length)} de{" "}
                {lanc.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagina === 1}
                  onClick={() => setPagina(pagina - 1)}
                >
                  ‹
                </Button>
                <span className="px-2">
                  {pagina}/{paginas}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagina === paginas}
                  onClick={() => setPagina(pagina + 1)}
                >
                  ›
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LancamentoModal
        open={modal === "entrada" || modal === "saida" || modal === "transferencia"}
        tipo={(modal as "entrada" | "saida" | "transferencia") ?? "entrada"}
        caixaId={caixa?.id}
        onClose={() => setModal(null)}
        onSaved={() => {
          setModal(null);
          void refresh();
        }}
      />

      <AbrirCaixaModal
        open={modal === "abrir"}
        contas={contas}
        onClose={() => setModal(null)}
        onSaved={() => {
          setModal(null);
          void refresh();
        }}
      />
    </div>
  );
}

function Linha({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b py-1.5 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function MetodoLinha({
  icon: Icon,
  cor,
  label,
  valor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  cor?: string;
  label: string;
  valor: number;
}) {
  return (
    <div className="flex items-center justify-between rounded border px-2 py-1.5">
      <span className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${cor ?? "text-muted-foreground"}`} />
        {label}
      </span>
      <span>{brl(valor)}</span>
    </div>
  );
}

function LancamentoModal({
  open,
  tipo,
  caixaId,
  onClose,
  onSaved,
}: {
  open: boolean;
  tipo: "entrada" | "saida" | "transferencia";
  caixaId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState<MetodoPagamento>("Dinheiro");
  const [origem, setOrigem] = useState("Avulso");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (open) {
      setValor("");
      setMetodo("Dinheiro");
      setOrigem(tipo === "transferencia" ? "Transferência entre contas" : "Avulso");
      setDescricao("");
    }
  }, [open, tipo]);

  const salvar = async () => {
    const v = asNumber(valor);
    if (!caixaId || !v || v <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    await caixaApi.addLancamento({
      caixaId,
      data: new Date().toISOString(),
      origem,
      metodo,
      tipo,
      valor: v,
      descricao,
    });
    toast.success("Lançamento registrado.");
    onSaved();
  };

  const titulo =
    tipo === "entrada" ? "Nova entrada" : tipo === "saida" ? "Nova saída" : "Transferência";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Valor</Label>
            <Input
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Método</Label>
            <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPagamento)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METODOS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Origem</Label>
            <Input value={origem} onChange={(e) => setOrigem(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Descrição</Label>
            <Input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={salvar}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AbrirCaixaModal({
  open,
  contas,
  onClose,
  onSaved,
}: {
  open: boolean;
  contas: ContaFinanceira[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [contaId, setContaId] = useState("");
  const [responsavel, setResponsavel] = useState("CW REHAB");
  const [saldoInicial, setSaldoInicial] = useState("0");

  useEffect(() => {
    if (open && contas[0]) setContaId(contas[0].id);
  }, [open, contas]);

  const salvar = async () => {
    if (!contaId) return;
    await caixaApi.abrirCaixa({
      responsavel,
      contaId,
      saldoInicial: asNumber(saldoInicial),
    });
    toast.success("Caixa aberto.");
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Abrir caixa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label>Responsável</Label>
            <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Conta financeira</Label>
            <Select value={contaId} onValueChange={setContaId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contas.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Saldo inicial em dinheiro</Label>
            <Input
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(e.target.value)}
              inputMode="decimal"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={salvar}>Abrir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
