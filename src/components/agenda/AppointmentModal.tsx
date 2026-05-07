import { useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AgendaSlot } from "@/lib/types";

export function AppointmentModal({
  slot,
  open,
  onClose,
  onConcluir,
  onCancelar,
}: {
  slot: AgendaSlot | null;
  open: boolean;
  onClose: () => void;
  onConcluir: () => void;
  onCancelar: () => void;
}) {
  const [tab, setTab] = useState("clientes");
  if (!slot) return null;
  const ocupacao = slot.capacidadeIlimitada
    ? `${slot.ocupacao} / ∞`
    : `${slot.ocupacao} / ${slot.capacidade ?? 0}`;
  const cancelados = slot.clientes.filter(
    (c) => c.situacao === "cancelado" || c.situacao === "desistente",
  );
  const ativos = slot.clientes.filter(
    (c) => c.situacao !== "cancelado" && c.situacao !== "desistente",
  );
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-xl">{slot.servico}</DialogTitle>
            <Button variant="link" size="sm">ALTERAR</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-muted-foreground">
            <span>{slot.data.split("-").reverse().join("/")}</span>
            <span>{slot.horaInicio} às {slot.horaFim}</span>
            <Button variant="link" size="sm" className="ml-auto">HISTÓRICO</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
            <Badge variant="outline" className="border-success text-success">Aberto</Badge>
            <span className="font-medium">{slot.servico.toUpperCase()}</span>
            <span className="text-muted-foreground">{slot.profissionalNome}</span>
            <span className="ml-auto rounded bg-muted px-2 py-0.5 text-xs font-semibold">
              {ocupacao}
            </span>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="clientes">Clientes / Leads ({ativos.length})</TabsTrigger>
            <TabsTrigger value="cancelados">
              Cancelados / Desistentes ({cancelados.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="clientes" className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Adicionar cliente com contrato</Button>
              <Button size="sm" variant="outline">Adicionar lead</Button>
              <Button size="sm" variant="outline">Adicionar cliente especial</Button>
            </div>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">Situação</th>
                    <th className="p-3">Origem</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {ativos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        Nenhum cliente neste atendimento.
                      </td>
                    </tr>
                  )}
                  {ativos.map((c) => (
                    <tr key={c.pacienteId} className="border-t">
                      <td className="p-3">
                        <div className="font-medium">{c.nomeCompleto}</div>
                        <button className="text-xs text-primary underline">
                          Adicionar evolução
                        </button>
                      </td>
                      <td className="p-3 capitalize">{c.situacao}</td>
                      <td className="p-3 capitalize">{c.origem}</td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Abrir perfil do cliente</DropdownMenuItem>
                            <DropdownMenuItem>Remover</DropdownMenuItem>
                            <DropdownMenuItem>Remover e gerar reagendamento</DropdownMenuItem>
                            <DropdownMenuItem>Marcar como desistente</DropdownMenuItem>
                            <DropdownMenuItem>Histórico</DropdownMenuItem>
                            <DropdownMenuItem>Adicionar evolução</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="cancelados">
            <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              {cancelados.length === 0
                ? "Nenhum cancelamento ou desistência."
                : cancelados.map((c) => c.nomeCompleto).join(", ")}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 flex-row justify-between sm:justify-between">
          <Button variant="destructive" onClick={onCancelar}>Cancelar aula</Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Fechar</Button>
            <Button
              onClick={onConcluir}
              style={{ backgroundColor: "var(--success)", color: "var(--success-foreground)" }}
            >
              Concluir aula
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}