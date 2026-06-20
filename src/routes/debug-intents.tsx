import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bot, Bug, CreditCard, Send, Trash2, UserRound, WalletCards } from "lucide-react";

import { api } from "@/lib/api";
import { asArray, formatCurrency } from "@/lib/safe";
import type { DebugIntentResult } from "@/lib/intentDebug";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/debug-intents")({
  head: () => ({ meta: [{ title: "Debug intents - FisioBot" }] }),
  component: DebugIntentsPage,
});

type DebugMessage = {
  id: string;
  text: string;
  result: DebugIntentResult;
  createdAt: string;
};

const STORAGE_KEY = "fisiobot.debugIntents.messages";

const SAMPLES = [
  "Michelle Rossini pagou 200 no cartao",
  "Michelle Rossini pagou 200 no credito",
  "Michelle Rossini pagou 100 com credito do paciente",
  "Michelle Rossini pagou 100 no debito",
  "Michelle Rossini pagou 100 com o que sobrou do saldo",
];

function loadHistory(): DebugMessage[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return asArray(parsed).filter((item): item is DebugMessage => Boolean(item?.id && item?.text));
  } catch {
    return [];
  }
}

function saveHistory(items: DebugMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
}

function DebugIntentsPage() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<DebugMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const selected = messages[0]?.result ?? null;

  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  const totals = useMemo(() => {
    const items = asArray(messages);
    return {
      total: items.length,
      pendente: items.filter((item) => item.result.status === "pendente").length,
      erro: items.filter((item) => item.result.status === "erro").length,
    };
  }, [messages]);

  async function sendMessage(value?: string) {
    const content = (value ?? text).trim();
    if (!content || loading) return;
    setLoading(true);
    try {
      const result = await api.ia.debugIntent(content);
      setMessages((current) => [
        {
          id: `debug_${Date.now()}`,
          text: content,
          result,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setText("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-2rem)] gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <main className="flex min-h-[720px] flex-col overflow-hidden rounded-md border bg-muted/20">
        <header className="flex items-center justify-between border-b bg-background px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bug className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-base font-semibold">Debug intents</h1>
              <p className="text-xs text-muted-foreground">Local parser</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{totals.total} testes</Badge>
            <Button size="sm" variant="outline" onClick={() => setMessages([])} disabled={!messages.length}>
              <Trash2 className="mr-1 h-4 w-4" /> Limpar
            </Button>
          </div>
        </header>

        <section className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex h-full min-h-[360px] items-center justify-center text-sm text-muted-foreground">
              Nenhuma mensagem local.
            </div>
          )}
          {messages.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className="ml-auto max-w-[78%] rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <UserRound className="h-3.5 w-3.5" />
                  <span>{new Date(item.createdAt).toLocaleTimeString("pt-BR")}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap">{item.text}</p>
              </div>
              <div className="mr-auto max-w-[86%] rounded-md border bg-background px-3 py-2 text-sm shadow-sm">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <Badge variant={item.result.status === "erro" ? "destructive" : "outline"}>
                    {item.result.status}
                  </Badge>
                  <Badge variant="secondary">{item.result.intent}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {(item.result.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-muted-foreground">{item.result.mensagem}</p>
                <div className="mt-2 grid gap-2 text-xs md:grid-cols-2">
                  <DebugChip icon={<CreditCard className="h-3.5 w-3.5" />} label="Forma" value={item.result.extracted.formaPagamento || "-"} />
                  <DebugChip icon={<WalletCards className="h-3.5 w-3.5" />} label="Credito paciente" value={item.result.extracted.usarCreditoPaciente ? "sim" : "nao"} />
                </div>
              </div>
            </div>
          ))}
        </section>

        <footer className="border-t bg-background p-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {SAMPLES.map((sample) => (
              <Button key={sample} size="sm" variant="outline" onClick={() => void sendMessage(sample)} disabled={loading}>
                {sample}
              </Button>
            ))}
          </div>
          <form
            className="flex items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Mensagem local"
              className="min-h-12 resize-none"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !text.trim()} className="h-12">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </footer>
      </main>

      <aside className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-center text-sm">
            <MiniStat label="Total" value={String(totals.total)} />
            <MiniStat label="Pendentes" value={String(totals.pendente)} />
            <MiniStat label="Erros" value={String(totals.erro)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Intent atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {selected ? (
              <>
                <Field label="Intent" value={selected.intent} />
                <Field label="Confidence" value={`${(selected.confidence * 100).toFixed(0)}%`} />
                <Field label="Paciente" value={selected.extracted.pacienteNome || "-"} />
                <Field label="Valor" value={selected.extracted.valor ? formatCurrency(selected.extracted.valor) : "-"} />
                <Field label="Termo" value={selected.extracted.termoPagamento || "-"} />
                <Field label="Forma" value={selected.extracted.formaPagamento || "-"} />
                <Field label="Credito disponivel" value={formatCurrency(selected.extracted.creditoPacienteDisponivel)} />
                <Field label="Motivo" value={selected.extracted.motivo || "-"} />
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Caminho</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.path.map((step) => (
                      <Badge key={step} variant="outline" className="text-[11px]">
                        {step}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Sem intent selecionada.</p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function DebugChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border px-2 py-1">
      <span className="flex items-center gap-1 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-2">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b pb-2 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[190px] text-right font-medium">{value}</span>
    </div>
  );
}
