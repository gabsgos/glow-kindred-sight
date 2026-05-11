import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Phone, CreditCard, AlertCircle } from "lucide-react";

import { api } from "@/lib/api";
import type { Paciente } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/pacientes")({
  head: () => ({ meta: [{ title: "Pacientes — FisioBot" }] }),
  component: PacientesPage,
});

function brl(v?: number) {
  return (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PacientesPage() {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "credito" | "pendente">("todos");
  const [items, setItems] = useState<Paciente[]>([]);

  useEffect(() => {
    api.pacientes.list(q).then(setItems);
  }, [q]);

  const filtrados = useMemo(() => {
    if (filtro === "credito") return items.filter((p) => p.creditoDisponivel > 0);
    if (filtro === "pendente") return items.filter((p) => (p.totalPendente ?? 0) > 0);
    return items;
  }, [items, filtro]);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            {filtrados.length} de {items.length} pacientes
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/cadastro">
            <Plus className="h-4 w-4" /> Novo paciente
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, telefone ou CPF..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(["todos", "credito", "pendente"] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={filtro === k ? "default" : "outline"}
              onClick={() => setFiltro(k)}
            >
              {k === "todos" ? "Todos" : k === "credito" ? "Com crédito" : "Com pendência"}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((p) => (
          <Link key={p.id} to="/pacientes/$id" params={{ id: p.id }}>
            <Card className="p-4 transition-colors hover:bg-accent/40">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{p.nomeCompleto}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {p.telefone ?? "—"}
                  </div>
                </div>
                {p.creditoDisponivel > 0 && (
                  <Badge className="bg-success text-success-foreground">
                    <CreditCard className="mr-1 h-3 w-3" /> {brl(p.creditoDisponivel)}
                  </Badge>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {p.totalAtendimentos ?? 0} atend. · último {p.ultimoAtendimento ?? "—"}
                </span>
                {(p.totalPendente ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-warning">
                    <AlertCircle className="h-3 w-3" /> {brl(p.totalPendente)}
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
        {filtrados.length === 0 && (
          <div className="col-span-full rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum paciente encontrado.
          </div>
        )}
      </div>
    </div>
  );
}