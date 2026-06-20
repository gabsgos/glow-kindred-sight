import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { asNumber, asText, formatCurrency } from "@/lib/safe";
import type { Paciente } from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente | null;
  onDone?: () => void;
};

const FORMAS = [
  { value: "pix", label: "PIX" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "debito", label: "Debito" },
  { value: "cartao_credito", label: "Cartao credito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "outro", label: "Outro" },
];

export function PaymentModal({ open, onOpenChange, paciente, onDone }: Props) {
  const [modo, setModo] = useState<"valor" | "quantidade">("valor");
  const [valor, setValor] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [forma, setForma] = useState("pix");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setValor("");
      setQuantidade("1");
      setForma("pix");
      setModo("valor");
    }
  }, [open]);

  if (!paciente) return null;

  async function handleConfirmar() {
    if (!paciente) return;
    setLoading(true);
    try {
      if (modo === "valor") {
        const v = asNumber(valor);
        if (!v || v <= 0) {
          toast.error("Informe um valor válido.");
          setLoading(false);
          return;
        }
        const r = await api.pagamentos.porValor({
          pacienteId: paciente.id,
          valor: v,
          formaPagamento: forma,
        });
        toast.success(
          `${r.quitados.length} atendimento(s) quitado(s).${r.excedente ? ` Credito do paciente atualizado: ${formatCurrency(r.creditoFinal)}` : ""}`,
        );
      } else {
        const q = asNumber(quantidade);
        if (!q || q <= 0) {
          toast.error("Informe uma quantidade válida.");
          setLoading(false);
          return;
        }
        const r = await api.pagamentos.porQuantidade({
          pacienteId: paciente.id,
          quantidade: q,
          formaPagamento: forma,
        });
        toast.success(`${r.quitados.length} atendimento(s) quitado(s).`);
      }
      onDone?.();
      onOpenChange(false);
    } catch {
      toast.error("Falha ao registrar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar pagamento</DialogTitle>
          <DialogDescription>
            {asText(paciente.nomeCompleto)} - Credito do paciente:{" "}
            {formatCurrency(paciente.creditoDisponivel)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={modo} onValueChange={(v) => setModo(v as "valor" | "quantidade")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="valor">Por valor</TabsTrigger>
            <TabsTrigger value="quantidade">Por quantidade</TabsTrigger>
          </TabsList>

          <TabsContent value="valor" className="space-y-3 pt-3">
            <div className="space-y-1">
              <Label htmlFor="valor">Valor recebido (R$)</Label>
              <Input
                id="valor"
                type="number"
                inputMode="decimal"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex.: 400"
              />
              <p className="text-xs text-muted-foreground">
                Quita do mais antigo; excedente vira credito do paciente.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="quantidade" className="space-y-3 pt-3">
            <div className="space-y-1">
              <Label htmlFor="qtd">Quantidade de atendimentos</Label>
              <Input
                id="qtd"
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-1">
          <Label>Forma de pagamento</Label>
          <Select value={forma} onValueChange={setForma}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMAS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={loading}>
            {loading ? "Processando..." : "Confirmar pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
