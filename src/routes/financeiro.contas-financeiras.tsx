import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Wallet, Landmark, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { caixaApi } from "@/lib/api";
import { asArray, asNumber, asText, formatCurrency } from "@/lib/safe";
import type { ContaFinanceira } from "@/lib/types";

export const Route = createFileRoute("/financeiro/contas-financeiras")({
  head: () => ({ meta: [{ title: "Contas financeiras - FisioBot" }] }),
  component: ContasFinanceirasPage,
});

const BRL = formatCurrency;

const TIPO_ICONE: Record<ContaFinanceira["tipo"], React.ComponentType<{ className?: string }>> = {
  caixa: Wallet,
  banco: Landmark,
  cartao: CreditCard,
};

function ContasFinanceirasPage() {
  const [contas, setContas] = useState<ContaFinanceira[]>([]);
  const [modal, setModal] = useState(false);

  async function load() {
    setContas(asArray(await caixaApi.contas()));
  }
  useEffect(() => {
    void load();
  }, []);

  const total = useMemo(() => asArray(contas).reduce((s, c) => s + asNumber(c.saldo), 0), [contas]);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Contas financeiras</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de contas (caixa, banco, cartão) usadas nos lançamentos.
          </p>
        </div>
        <Button onClick={() => setModal(true)}>
          <Plus className="mr-2 size-4" /> Nova conta
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground">Saldo total consolidado</div>
          <div className="mt-1 text-3xl font-semibold">{BRL(total)}</div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {asArray(contas).map((c) => {
          const Icon = TIPO_ICONE[c.tipo] ?? Wallet;
          return (
            <Card key={c.id}>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  {asText(c.nome) || "Conta sem nome"}
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await caixaApi.removeConta(c.id);
                    await load();
                  }}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-xs text-muted-foreground capitalize">{asText(c.tipo)}</div>
                <div className="text-2xl font-semibold">{BRL(c.saldo)}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <NovaContaModal open={modal} onOpenChange={setModal} onCreated={load} />
    </div>
  );
}

function NovaContaModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: () => void;
}) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<ContaFinanceira["tipo"]>("caixa");
  const [saldo, setSaldo] = useState("0");

  async function salvar() {
    if (!nome) return;
    await caixaApi.addConta({ nome, tipo, saldo: asNumber(saldo) });
    onOpenChange(false);
    setNome("");
    setSaldo("0");
    onCreated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova conta financeira</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Nome</Label>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-1">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as ContaFinanceira["tipo"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="banco">Banco</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label>Saldo inicial</Label>
              <Input
                type="number"
                step="0.01"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={salvar}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
