import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { api } from "@/lib/api";
import type { Pendencia } from "@/lib/types";

export const Route = createFileRoute("/pendencias")({
  head: () => ({ meta: [{ title: "Pendências — FisioBot" }] }),
  component: PendenciasPage,
});

function PendenciasPage() {
  const [items, setItems] = useState<Pendencia[]>([]);
  const [filtro, setFiltro] = useState<"abertas" | "todas">("abertas");
  const [cancelar, setCancelar] = useState<Pendencia | null>(null);

  async function load() {
    setItems(await api.pendencias.list());
  }

  useEffect(() => {
    void load();
  }, []);

  async function confirmar(p: Pendencia, opcaoId?: string) {
    await api.pendencias.confirmar(p.id, opcaoId);
    toast.success("Pendência confirmada.");
    void load();
  }

  async function cancelarPend() {
    if (!cancelar) return;
    await api.pendencias.cancelar(cancelar.id);
    toast.success("Pendência cancelada.");
    setCancelar(null);
    void load();
  }

  const visiveis = items.filter((p) => (filtro === "abertas" ? p.status === "aberta" : true));

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Pendências</h1>
          <p className="text-sm text-muted-foreground">
            Itens que aguardam confirmação humana antes de seguir.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filtro === "abertas" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro("abertas")}
          >
            Abertas
          </Button>
          <Button
            variant={filtro === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro("todas")}
          >
            Todas
          </Button>
        </div>
      </div>

      {visiveis.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Nenhuma pendência {filtro === "abertas" ? "aberta" : "registrada"}.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {visiveis.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="size-4 text-amber-500" />
                    {p.tipo.replace(/_/g, " ")}
                  </CardTitle>
                  <StatusBadge status={p.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{p.descricao}</p>
                {p.pacienteNome && (
                  <p className="text-xs text-muted-foreground">Paciente: {p.pacienteNome}</p>
                )}
                {p.status === "aberta" && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {p.opcoes && p.opcoes.length > 0 ? (
                      p.opcoes.map((op) => (
                        <Button
                          key={op.id}
                          size="sm"
                          variant="outline"
                          onClick={() => confirmar(p, op.id)}
                        >
                          {op.label}
                        </Button>
                      ))
                    ) : (
                      <Button size="sm" onClick={() => confirmar(p)}>
                        <CheckCircle2 className="mr-1 size-4" /> Confirmar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCancelar(p)}
                      className="text-destructive hover:text-destructive"
                    >
                      <XCircle className="mr-1 size-4" /> Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!cancelar}
        onOpenChange={(o) => !o && setCancelar(null)}
        title="Cancelar pendência?"
        description="A pendência será descartada e não disparará nenhuma ação."
        confirmLabel="Sim, cancelar"
        destructive
        onConfirm={cancelarPend}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: Pendencia["status"] }) {
  if (status === "aberta")
    return <Badge className="bg-amber-500 text-white hover:bg-amber-500">Aberta</Badge>;
  if (status === "confirmada")
    return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Confirmada</Badge>;
  return <Badge variant="secondary">Cancelada</Badge>;
}