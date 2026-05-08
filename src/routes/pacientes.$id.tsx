import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, FileText, Wallet, CalendarDays } from "lucide-react";

import { api } from "@/lib/api";
import type { Evolucao, Faturamento, Paciente } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/pacientes/$id")({
  head: () => ({ meta: [{ title: "Paciente — FisioBot" }] }),
  component: PacienteDetail,
});

const brl = (v?: number) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function PacienteDetail() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Paciente | null>(null);
  const [fats, setFats] = useState<Faturamento[]>([]);
  const [evos, setEvos] = useState<Evolucao[]>([]);

  useEffect(() => {
    api.pacientes.get(id).then(setP);
    api.pacientes.financeiro(id).then(setFats);
    api.pacientes.evolucoes(id).then(setEvos);
  }, [id]);

  if (!p) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }

  const kpis = [
    { label: "Crédito", value: brl(p.creditoDisponivel), icon: CreditCard, tone: "text-success" },
    { label: "Pendente", value: brl(p.totalPendente), icon: Wallet, tone: "text-warning" },
    { label: "Pago total", value: brl(p.totalPago), icon: FileText, tone: "text-foreground" },
    { label: "Atendimentos", value: String(p.totalAtendimentos ?? 0), icon: CalendarDays, tone: "text-foreground" },
  ];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link to="/pacientes"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{p.nomeCompleto}</h1>
            <div className="mt-1 text-sm text-muted-foreground">
              {p.telefone ?? "Sem telefone"} · Valor padrão: {brl(p.valorPadraoAtendimento)}
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={p.ativo ? "default" : "secondary"}>{p.ativo ? "Ativo" : "Inativo"}</Badge>
            <Button size="sm" variant="outline">Registrar pagamento</Button>
            <Button size="sm">Nova evolução</Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-md border bg-background p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <k.icon className="h-3.5 w-3.5" /> {k.label}
              </div>
              <div className={`mt-1 text-lg font-semibold ${k.tone}`}>{k.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="evolucoes">
        <TabsList>
          <TabsTrigger value="evolucoes">Evoluções</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="dados">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="evolucoes" className="space-y-2">
          {evos.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhuma evolução registrada.
            </div>
          )}
          {evos.map((e) => (
            <Card key={e.id} className="p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{e.data} · {e.profissionalNome}</span>
              </div>
              <p className="mt-2 text-sm">{e.texto}</p>
              {e.conduta && <p className="mt-2 text-sm"><b>Conduta:</b> {e.conduta}</p>}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-2">
          {fats.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhum lançamento financeiro.
            </div>
          )}
          {fats.map((f) => (
            <Card key={f.id} className="flex items-center justify-between p-3">
              <div>
                <div className="text-sm font-medium">{f.data} · {brl(f.valorAtendimento)}</div>
                <div className="text-xs text-muted-foreground">
                  {f.formaPagamento ? `Pago via ${f.formaPagamento}` : "Sem pagamento"}
                </div>
              </div>
              <Badge
                className={
                  f.statusFinanceiro === "pago"
                    ? "bg-success text-success-foreground"
                    : f.statusFinanceiro === "pendente"
                      ? "bg-warning text-warning-foreground"
                      : ""
                }
              >
                {f.statusFinanceiro}
              </Badge>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dados">
          <Card className="p-4 text-sm">
            <dl className="grid gap-2 sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Telefone</dt><dd>{p.telefone ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">CPF</dt><dd>{p.cpf ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Nascimento</dt><dd>{p.dataNascimento ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Endereço</dt><dd>{p.endereco ?? "—"}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted-foreground">Observações</dt><dd>{p.observacoes ?? "—"}</dd></div>
            </dl>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}