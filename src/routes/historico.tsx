import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import type { AuditoriaItem } from "@/lib/types";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico e auditoria — FisioBot" }] }),
  component: HistoricoPage,
});

function HistoricoPage() {
  const [items, setItems] = useState<AuditoriaItem[]>([]);
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "sucesso" | "erro" | "pendente">("todos");

  useEffect(() => {
    void api.auditoria.list().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .filter((i) => filtro === "todos" || i.status === filtro)
      .filter(
        (i) =>
          !term ||
          i.mensagem.toLowerCase().includes(term) ||
          i.intent.toLowerCase().includes(term) ||
          i.usuario.toLowerCase().includes(term),
      )
      .sort((a, b) => b.dataHora.localeCompare(a.dataHora));
  }, [items, q, filtro]);

  return (
    <div className="p-6 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Histórico e auditoria</h1>
        <p className="text-sm text-muted-foreground">Registro completo de ações e comandos executados.</p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar mensagem, intent ou usuário..." className="pl-8" />
        </div>
        <Tabs value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="sucesso">Sucesso</TabsTrigger>
            <TabsTrigger value="pendente">Pendente</TabsTrigger>
            <TabsTrigger value="erro">Erro</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{filtered.length} eventos</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhum evento encontrado.</p>}
          {filtered.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-md border p-3">
              <StatusIcon status={a.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{a.intent}</span>
                  <Badge variant="outline" className="text-xs">{a.origem}</Badge>
                  <span className="text-xs text-muted-foreground">{a.usuario}</span>
                </div>
                <div className="text-sm mt-1 truncate">{a.mensagem}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.resultado}</div>
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(a.dataHora).toLocaleString("pt-BR")}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatusIcon({ status }: { status: AuditoriaItem["status"] }) {
  if (status === "sucesso") return <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />;
  if (status === "pendente") return <Clock className="h-4 w-4 text-amber-500 mt-0.5" />;
  return <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />;
}
