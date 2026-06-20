import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, CalendarClock, FileText, Receipt, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AgendaSlot } from "@/lib/types";
import { asArray, asText } from "@/lib/safe";

function money(value?: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

function statusLabel(status: string) {
  if (status === "concluido") return "Evoluido";
  if (status === "cancelado") return "Cancelado";
  return "Aberto";
}

export function AppointmentModal({
  slot,
  open,
  onClose,
  onCancelar,
  onReagendar,
}: {
  slot: AgendaSlot | null;
  open: boolean;
  onClose: () => void;
  onCancelar: () => Promise<void> | void;
  onReagendar: (input: {
    data: string;
    horaInicio: string;
    horaFim?: string;
  }) => Promise<void> | void;
}) {
  const [tab, setTab] = useState("detalhes");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const patient = asArray(slot?.clientes)[0];
  const hasEvolution = Boolean(slot?.evolucao || patient?.temEvolucao);
  const canEdit = Boolean(slot?.podeEditar ?? (slot?.status === "aberto" && !hasEvolution));

  useEffect(() => {
    if (!slot) return;
    setNewDate(slot.data);
    setNewStart(slot.horaInicio);
    setNewEnd(slot.horaFim);
    setRescheduleOpen(false);
  }, [slot]);

  if (!slot || !open) return null;

  const pendingBilling = slot.statusFinanceiro === "pendente" || slot.temPendencia;
  const evolutionText = slot.evolucao || patient?.evolucao || "";

  return (
    <div className="fixed inset-0 z-50 bg-background/20 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Fechar atendimento"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-dvh w-[min(760px,100vw)] overflow-auto border-l bg-background p-6 shadow-2xl animate-in slide-in-from-right duration-200">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 pr-7">
            <div>
              <h2 className="text-xl font-semibold">{patient?.nomeCompleto || slot.servico}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" />
                <span>{asText(slot.data).split("-").reverse().join("/")}</span>
                <span>
                  {slot.horaInicio} as {slot.horaFim}
                </span>
                <span>{slot.profissionalNome || "FisioBot"}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={slot.status === "cancelado" ? "destructive" : "secondary"}>
                {statusLabel(slot.status)}
              </Badge>
              {pendingBilling && (
                <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
                  Faturamento pendente
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <InfoCard
            icon={<Receipt className="h-4 w-4" />}
            label="Valor"
            value={money(slot.valorAtendimento || patient?.valorAtendimento)}
          />
          <InfoCard
            icon={<AlertCircle className="h-4 w-4" />}
            label="Financeiro"
            value={slot.statusFinanceiro || patient?.statusFinanceiro || "pendente"}
          />
          <InfoCard
            icon={<FileText className="h-4 w-4" />}
            label="Evolucao"
            value={hasEvolution ? "registrada" : "nao registrada"}
          />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="evolucao">Evolucao</TabsTrigger>
            <TabsTrigger value="reagendar" disabled={!canEdit}>
              Reagendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-3">
            <div className="rounded-md border">
              <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
                    <UserRound className="h-4 w-4 text-primary" />
                    Paciente
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {patient?.nomeCompleto || "Sem paciente vinculado"}
                  </p>
                  {slot.observacao && (
                    <p className="mt-2 text-sm text-muted-foreground">{slot.observacao}</p>
                  )}
                </div>
                {patient?.pacienteId && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/pacientes/$id" params={{ id: patient.pacienteId }} onClick={onClose}>
                      Ver paciente
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            {!canEdit && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Cancelamento e reagendamento ficam bloqueados quando o atendimento ja tem evolucao
                registrada.
              </div>
            )}
          </TabsContent>

          <TabsContent value="evolucao">
            <div className="min-h-[160px] rounded-md border bg-muted/20 p-4 text-sm leading-6">
              {evolutionText || "Nenhuma evolucao registrada para este atendimento."}
            </div>
          </TabsContent>

          <TabsContent value="reagendar" className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Data</span>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(event) => setNewDate(event.target.value)}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Inicio</span>
                <Input
                  type="time"
                  value={newStart}
                  onChange={(event) => setNewStart(event.target.value)}
                />
              </label>
              <label className="space-y-1 text-sm">
                <span className="font-medium">Fim</span>
                <Input
                  type="time"
                  value={newEnd}
                  onChange={(event) => setNewEnd(event.target.value)}
                />
              </label>
            </div>
            <Button
              type="button"
              onClick={() => onReagendar({ data: newDate, horaInicio: newStart, horaFim: newEnd })}
              disabled={!newDate || !newStart}
            >
              Confirmar reagendamento
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button variant="destructive" onClick={onCancelar} disabled={!canEdit}>
            Cancelar atendimento
          </Button>
          <div className="flex flex-wrap gap-2">
            {canEdit && !rescheduleOpen && (
              <Button
                variant="outline"
                onClick={() => {
                  setTab("reagendar");
                  setRescheduleOpen(true);
                }}
              >
                Reagendar
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold capitalize">{value}</div>
    </div>
  );
}
