import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

import { api } from "@/lib/api";
import type { ComandoIaResposta } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ia")({
  head: () => ({ meta: [{ title: "IA / Comando rápido — FisioBot" }] }),
  component: IaPage,
});

const SUGESTOES = [
  "Michelle pagou 400 pix",
  "Atendimento Marcos hoje 9h, treino de marcha",
  "Quanto Bernardo deve?",
  "#ram",
];

type Item = { id: string; comando: string; resp: ComandoIaResposta; ts: string };

function IaPage() {
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<Item[]>([]);

  async function enviar(cmd?: string) {
    const c = (cmd ?? texto).trim();
    if (!c) return;
    setLoading(true);
    const resp = await api.ia.comando(c);
    setHistorico((h) => [
      { id: `cmd_${Date.now()}`, comando: c, resp, ts: new Date().toISOString() },
      ...h,
    ]);
    setTexto("");
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-primary" /> IA / Comando rápido
        </h1>
        <p className="text-sm text-muted-foreground">
          Digite linguagem natural ou comandos de debug com <code className="rounded bg-muted px-1">#</code>.
        </p>
      </div>

      <Card className="p-3">
        <form
          onSubmit={(e) => { e.preventDefault(); enviar(); }}
          className="flex gap-2"
        >
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="ex: Michelle pagou 400 pix"
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="gap-2">
            <Send className="h-4 w-4" /> Enviar
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1">
          {SUGESTOES.map((s) => (
            <Button key={s} variant="outline" size="sm" onClick={() => enviar(s)} disabled={loading}>
              {s}
            </Button>
          ))}
        </div>
      </Card>

      <div className="space-y-2">
        {historico.length === 0 && (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Nenhum comando ainda. Tente uma sugestão acima.
          </div>
        )}
        {historico.map((item) => (
          <Card key={item.id} className="space-y-2 p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{item.comando}</span>
              <span>{new Date(item.ts).toLocaleTimeString("pt-BR")}</span>
            </div>
            <div className="flex items-start gap-2">
              <StatusIcon status={item.resp.status} />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {item.resp.intent}
                  <Badge variant="outline" className="text-xs">{item.resp.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.resp.mensagem}</p>
                {item.resp.pendencia?.opcoes && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.resp.pendencia.opcoes.map((o) => (
                      <Button key={o.id} size="sm" variant="outline">{o.label}</Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: ComandoIaResposta["status"] }) {
  if (status === "sucesso") return <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />;
  if (status === "pendente") return <Clock className="mt-0.5 h-4 w-4 text-warning" />;
  return <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />;
}