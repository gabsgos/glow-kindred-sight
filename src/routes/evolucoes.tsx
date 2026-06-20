import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { asArray, asText } from "@/lib/safe";
import type { Evolucao, Paciente } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/evolucoes")({
  head: () => ({ meta: [{ title: "Evoluções - FisioBot" }] }),
  component: EvolucoesPage,
});

type EstadoAudio = "ocioso" | "gravando" | "transcrevendo" | "pronto" | "erro";

function EvolucoesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<string>("");
  const [texto, setTexto] = useState("");
  const [conduta, setConduta] = useState("");
  const [evos, setEvos] = useState<Evolucao[]>([]);
  const [estado, setEstado] = useState<EstadoAudio>("ocioso");
  const [duracao, setDuracao] = useState(0);
  const tickRef = useRef<number | null>(null);
  const visibleEvos = useMemo(() => asArray(evos).slice(0, 80), [evos]);

  useEffect(() => {
    void Promise.allSettled([api.pacientes.list(), api.evolucoes.list()]).then(
      ([pacientesResult, evolucoesResult]) => {
        setPacientes(pacientesResult.status === "fulfilled" ? asArray(pacientesResult.value) : []);
        setEvos(evolucoesResult.status === "fulfilled" ? asArray(evolucoesResult.value) : []);
      },
    );
  }, []);

  useEffect(
    () => () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    },
    [],
  );

  function startRec() {
    setEstado("gravando");
    setDuracao(0);
    tickRef.current = window.setInterval(() => setDuracao((d) => d + 1), 1000);
  }

  function stopRec() {
    if (tickRef.current) window.clearInterval(tickRef.current);
    setEstado("transcrevendo");
    window.setTimeout(() => {
      setTexto(
        (current) =>
          `${current ? `${current}\n` : ""}Paciente realizou exercícios de fortalecimento e mobilidade. Boa evolução do quadro álgico.`,
      );
      setConduta("Manter protocolo. Reavaliar em 1 semana.");
      setEstado("pronto");
      toast.success("Áudio transcrito (simulação).");
    }, 1200);
  }

  async function salvar() {
    if (!pacienteId || !texto.trim()) {
      toast.error("Selecione um paciente e escreva a evolução.");
      return;
    }
    const pac = asArray(pacientes).find((p) => p.id === pacienteId);
    const novo = await api.evolucoes.create({
      pacienteId,
      pacienteNome: pac?.nomeCompleto,
      texto,
      conduta,
      data: new Date().toISOString().slice(0, 10),
      profissionalNome: "Cayo Uehara Lance",
    });
    setEvos((arr) => [novo, ...asArray(arr)]);
    setTexto("");
    setConduta("");
    setEstado("ocioso");
    setDuracao(0);
    toast.success("Evolução salva.");
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_360px] md:p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Evoluções</h1>
          <p className="text-sm text-muted-foreground">
            Registre por texto ou grave em áudio para transcrição automática.
          </p>
        </div>

        <Card className="space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="min-w-[220px] flex-1">
              <Select value={pacienteId} onValueChange={setPacienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {asArray(pacientes).map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {asText(p.nomeCompleto) || "Paciente sem nome"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <AudioButton estado={estado} duracao={duracao} onStart={startRec} onStop={stopRec} />
          </div>

          <Textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Descreva queixas, exercícios realizados e evolução do paciente..."
            rows={6}
          />
          <Textarea
            value={conduta}
            onChange={(e) => setConduta(e.target.value)}
            placeholder="Conduta / próximos passos"
            rows={3}
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {estado === "transcrevendo" ? "Transcrevendo áudio..." : "Pronto para salvar"}
            </span>
            <Button onClick={salvar} className="gap-2">
              <Save className="h-4 w-4" /> Salvar evolução
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Últimas evoluções</h2>
        <EvolutionHistoryList items={visibleEvos} />
      </div>
    </div>
  );
}

const EvolutionHistoryList = memo(function EvolutionHistoryList({ items }: { items: Evolucao[] }) {
  return (
    <>
      {items.map((e) => (
        <Card key={e.id} className="p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {asText(e.pacienteNome) || "Paciente sem nome"}
            </span>
            <span>{asText(e.data)}</span>
          </div>
          <p className="mt-1 line-clamp-3 text-sm">{asText(e.texto)}</p>
        </Card>
      ))}
    </>
  );
});

function AudioButton({
  estado,
  duracao,
  onStart,
  onStop,
}: {
  estado: EstadoAudio;
  duracao: number;
  onStart: () => void;
  onStop: () => void;
}) {
  if (estado === "gravando") {
    return (
      <Button variant="destructive" onClick={onStop} className="gap-2">
        <Square className="h-4 w-4" /> Parar {String(Math.floor(duracao / 60)).padStart(2, "0")}:
        {String(duracao % 60).padStart(2, "0")}
      </Button>
    );
  }
  if (estado === "transcrevendo") {
    return (
      <Button disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Transcrevendo...
      </Button>
    );
  }
  return (
    <Button variant="outline" onClick={onStart} className="gap-2">
      <Mic className="h-4 w-4" /> Gravar áudio
      {estado === "pronto" && (
        <Badge className="ml-1 gap-1">
          <Sparkles className="h-3 w-3" />
          ok
        </Badge>
      )}
    </Button>
  );
}
