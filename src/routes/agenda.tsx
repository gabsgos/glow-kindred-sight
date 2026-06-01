import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListChecks,
  RotateCcw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { AppointmentModal } from "@/components/agenda/AppointmentModal";
import { SlotCard } from "@/components/agenda/SlotCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { asArray, asSearchTerm, asText, matchesText } from "@/lib/safe";
import type { AgendaSlot } from "@/lib/types";

export const Route = createFileRoute("/agenda")({
  head: () => ({ meta: [{ title: "Agenda - FisioBot" }] }),
  component: AgendaPage,
});

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_LABELS = ["Dom.", "Seg.", "Ter.", "Qua.", "Qui.", "Sex.", "Sab."];
const MAX_WEEK_SLOTS = 160;
const MAX_SIDE_LIST = 80;

function isoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(next, diff);
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(date);
}

function AgendaPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selected, setSelected] = useState<AgendaSlot | null>(null);
  const [status, setStatus] = useState("todos");
  const [search, setSearch] = useState("");
  const gridRef = useRef<HTMLDivElement | null>(null);
  const initialScrollDoneRef = useRef(false);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        return {
          date,
          iso: isoDate(date),
          label: DAY_LABELS[date.getDay()],
          day: date.getDate(),
          today: isoDate(date) === isoDate(new Date()),
        };
      }),
    [weekStart],
  );
  const inicio = weekDays[0].iso;
  const fim = weekDays[6].iso;

  const {
    data: slots = [],
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["agenda", inicio, fim],
    queryFn: () => api.agenda.list(inicio, fim),
  });

  const weekSlots = useMemo(
    () => asArray(slots).filter((slot) => asText(slot.data) >= inicio && asText(slot.data) <= fim).slice(0, MAX_WEEK_SLOTS),
    [fim, inicio, slots],
  );

  const filteredSlots = useMemo(() => {
    const term = asSearchTerm(search);
    return weekSlots.filter((slot) => {
      if (status !== "todos" && slot.status !== status) return false;
      if (!term) return true;
      return (
        matchesText(slot.servico, term) ||
        matchesText(slot.profissionalNome, term) ||
        asArray(slot.clientes).some((client) => matchesText(client.nomeCompleto, term))
      );
    });
  }, [search, status, weekSlots]);

  const grouped = useMemo(() => {
    const map = new Map<string, AgendaSlot[]>();
    for (const slot of filteredSlots) {
      const key = `${asText(slot.data)}__${parseInt(asText(slot.horaInicio) || "0", 10)}`;
      const arr = map.get(key) ?? [];
      arr.push(slot);
      map.set(key, arr);
    }
    return map;
  }, [filteredSlots]);

  const totals = useMemo(() => {
    const safeSlots = weekSlots;
    const future = safeSlots.filter((slot) => asText(slot.data) >= isoDate(new Date())).length;
    const retro = safeSlots.length - future;
    const pending = safeSlots.filter(
      (slot) => slot.statusFinanceiro === "pendente" || slot.temPendencia,
    ).length;
    return { future, retro, pending };
  }, [weekSlots]);

  useEffect(() => {
    if (initialScrollDoneRef.current || !gridRef.current) return;
    const currentHour = new Date().getHours();
    gridRef.current.scrollTop = Math.max(0, currentHour - 1) * 92;
    initialScrollDoneRef.current = true;
  }, []);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-muted/20">
      <div className="border-b bg-background px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Hoje
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="min-w-[170px] text-sm font-semibold capitalize">
            {formatMonth(weekStart)}
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            {formatDate(weekDays[0].date)} - {formatDate(weekDays[6].date)}
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar paciente ou atendimento"
                className="h-9 w-[260px] pl-8"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="aberto">Abertos</SelectItem>
                <SelectItem value="concluido">Evoluidos</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RotateCcw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border bg-background px-2.5 py-1">
            Futuros: {totals.future}
          </span>
          <span className="rounded-md border bg-background px-2.5 py-1">
            Retroativos: {totals.retro}
          </span>
          <span className="rounded-md border bg-background px-2.5 py-1">
            Pendencia faturamento: {totals.pending}
          </span>
          {asArray(slots).length > weekSlots.length && (
            <span className="rounded-md border bg-warning/10 px-2.5 py-1 text-warning">
              Exibindo {weekSlots.length} de {asArray(slots).length} itens para proteger a tela.
            </span>
          )}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(760px,1fr)_320px]">
        <div ref={gridRef} className="grid min-h-0 grid-cols-[60px_repeat(7,minmax(128px,1fr))] overflow-auto">
          <div className="sticky top-0 z-10 border-b border-r bg-background" />
          {weekDays.map((day) => (
            <div
              key={day.iso}
              className={`sticky top-0 z-10 border-b border-r bg-background px-2 py-3 text-center text-sm ${
                day.today ? "bg-primary/10 font-semibold text-primary" : ""
              }`}
            >
              <div>{day.label}</div>
              <div className="text-lg font-semibold">{day.day}</div>
            </div>
          ))}

          {HOURS.map((hour) => (
            <Fragment key={`row-${hour}`}>
              <div className="border-b border-r bg-background px-2 py-3 text-xs text-muted-foreground">
                {String(hour).padStart(2, "0")}:00
              </div>
              {weekDays.map((day) => {
                const cellSlots = grouped.get(`${day.iso}__${hour}`) ?? [];
                return (
                  <div
                    key={`${day.iso}-${hour}`}
                    className={`min-h-[92px] space-y-1 border-b border-r p-1.5 ${
                      day.today ? "bg-primary/5" : "bg-background/70"
                    }`}
                  >
                    {cellSlots.map((slot) => (
                      <SlotCard key={slot.id} slot={slot} onClick={() => setSelected(slot)} />
                    ))}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>

        <aside className="hidden min-h-0 overflow-auto border-l bg-background p-4 xl:block">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ListChecks className="h-4 w-4 text-primary" />
            Atendimentos da semana
          </div>
          <div className="space-y-2">
            {filteredSlots.length === 0 && (
              <p className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                Nenhum atendimento no filtro atual.
              </p>
            )}
            {filteredSlots.slice(0, MAX_SIDE_LIST).map((slot) => (
              <SlotCard
                key={`list-${slot.id}`}
                slot={slot}
                compact
                onClick={() => setSelected(slot)}
              />
            ))}
            {filteredSlots.length > MAX_SIDE_LIST && (
              <p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                Mais {filteredSlots.length - MAX_SIDE_LIST} atendimentos ocultos na lista lateral.
              </p>
            )}
          </div>
        </aside>
      </div>

      <AppointmentModal
        slot={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onCancelar={async () => {
          if (!selected) return;
          await api.agenda.cancelar(selected.id);
          toast.message("Atendimento cancelado.");
          setSelected(null);
          refetch();
        }}
        onReagendar={async (input) => {
          if (!selected) return;
          await api.agenda.reagendar(selected.id, input);
          toast.success("Atendimento reagendado.");
          setSelected(null);
          refetch();
        }}
      />
    </div>
  );
}
