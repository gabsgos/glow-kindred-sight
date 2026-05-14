import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShoppingCart, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
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
import { vendasApi, api } from "@/lib/api";
import type { MetodoPagamento, Paciente, Venda } from "@/lib/types";

export const Route = createFileRoute("/financeiro/vendas")({
  head: () => ({ meta: [{ title: "Vendas — FisioBot" }] }),
  component: VendasPage,
});

const BRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const METODOS: MetodoPagamento[] = ["Dinheiro", "Pix", "C. Crédito", "C. Débito", "Cheque", "Depósito bancário"];

function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [profissionais, setProfissionais] = useState<{ id: string; nome: string }[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "ativa" | "concluida" | "cancelada">("todas");
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);

  async function load() {
    setVendas(await vendasApi.list());
    setPacientes(await api.pacientes.list());
    setProfissionais(await api.profissionais());
  }
  useEffect(() => {
    void load();
  }, []);

  const visiveis = useMemo(() => {
    const t = busca.toLowerCase().trim();
    return vendas
      .filter((v) => (filtro === "todas" ? true : v.status === filtro))
      .filter((v) => (t ? v.pacienteNome.toLowerCase().includes(t) || v.pacote.toLowerCase().includes(t) : true));
  }, [vendas, filtro, busca]);

  const kpis = useMemo(() => {
    const ativas = vendas.filter((v) => v.status === "ativa");
    const total = vendas.filter((v) => v.status !== "cancelada").reduce((s, v) => s + v.valorFinal, 0);
    const ticket = vendas.length ? total / vendas.filter((v) => v.status !== "cancelada").length : 0;
    return {
      total,
      ativas: ativas.length,
      qtd: vendas.length,
      ticket,
    };
  }, [vendas]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Vendas</h1>
          <p className="text-sm text-muted-foreground">
            Pacotes de sessões e vendas avulsas.
          </p>
        </div>
        <Button onClick={() => setModal(true)}>
          <Plus className="mr-2 size-4" /> Nova venda
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard icon={<TrendingUp className="size-4" />} label="Faturamento" value={BRL(kpis.total)} tone="success" />
        <KpiCard icon={<ShoppingCart className="size-4" />} label="Vendas ativas" value={String(kpis.ativas)} tone="info" />
        <KpiCard icon={<CheckCircle2 className="size-4" />} label="Total registros" value={String(kpis.qtd)} />
        <KpiCard icon={<TrendingUp className="size-4" />} label="Ticket médio" value={BRL(kpis.ticket)} />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Histórico de vendas</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              placeholder="Buscar paciente ou pacote"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="md:w-64"
            />
            <Select value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
              <SelectTrigger className="md:w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="ativa">Ativas</SelectItem>
                <SelectItem value="concluida">Concluídas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Pacote</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visiveis.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="whitespace-nowrap">{v.data}</TableCell>
                  <TableCell>{v.pacienteNome}</TableCell>
                  <TableCell>
                    <div>{v.pacote}</div>
                    <div className="text-xs text-muted-foreground">{v.quantidadeSessoes} sessões</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {v.formaPagamento}
                    {v.parcelas > 1 && ` · ${v.parcelas}x`}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>{BRL(v.valorFinal)}</div>
                    {v.desconto > 0 && (
                      <div className="text-xs text-muted-foreground">desc. {BRL(v.desconto)}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        v.status === "ativa"
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : v.status === "cancelada"
                            ? "bg-rose-500 text-white hover:bg-rose-500"
                            : ""
                      }
                      variant={v.status === "concluida" ? "secondary" : "default"}
                    >
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {v.status === "ativa" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          await vendasApi.cancelar(v.id);
                          await load();
                        }}
                      >
                        <XCircle className="size-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {visiveis.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                    Sem vendas para o filtro atual.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NovaVendaModal
        open={modal}
        onOpenChange={setModal}
        pacientes={pacientes}
        profissionais={profissionais}
        onCreated={load}
      />
    </div>
  );
}

function NovaVendaModal({
  open,
  onOpenChange,
  pacientes,
  profissionais,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  pacientes: Paciente[];
  profissionais: { id: string; nome: string }[];
  onCreated: () => void;
}) {
  const [pacienteId, setPacienteId] = useState("");
  const [pacote, setPacote] = useState("Pacote de sessões");
  const [quantidade, setQuantidade] = useState("10");
  const [valorTotal, setValorTotal] = useState("2000");
  const [desconto, setDesconto] = useState("0");
  const [forma, setForma] = useState<MetodoPagamento>("Pix");
  const [parcelas, setParcelas] = useState("1");
  const [vendedorId, setVendedorId] = useState("");

  async function salvar() {
    if (!pacienteId) return;
    const pac = pacientes.find((p) => p.id === pacienteId);
    const vend = profissionais.find((p) => p.id === vendedorId);
    const total = Number(valorTotal);
    const desc = Number(desconto);
    await vendasApi.create({
      pacienteId,
      pacienteNome: pac?.nomeCompleto ?? "—",
      pacote,
      quantidadeSessoes: Number(quantidade),
      valorTotal: total,
      desconto: desc,
      valorFinal: total - desc,
      formaPagamento: forma,
      parcelas: Number(parcelas),
      data: new Date().toISOString().slice(0, 10),
      vendedorId: vend?.id,
      vendedorNome: vend?.nome,
      status: "ativa",
    });
    onOpenChange(false);
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova venda</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Paciente</Label>
            <Select value={pacienteId} onValueChange={setPacienteId}>
              <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>
                {pacientes.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nomeCompleto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Pacote</Label>
              <Input value={pacote} onChange={(e) => setPacote(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Sessões</Label>
              <Input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="grid gap-1">
              <Label>Valor total</Label>
              <Input type="number" step="0.01" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Desconto</Label>
              <Input type="number" step="0.01" value={desconto} onChange={(e) => setDesconto(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>Parcelas</Label>
              <Input type="number" value={parcelas} onChange={(e) => setParcelas(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Forma de pagamento</Label>
              <Select value={forma} onValueChange={(v) => setForma(v as MetodoPagamento)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {METODOS.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Vendedor</Label>
              <Select value={vendedorId} onValueChange={setVendedorId}>
                <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                <SelectContent>
                  {profissionais.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
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