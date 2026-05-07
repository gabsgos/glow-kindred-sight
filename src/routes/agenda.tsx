import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import type { AgendaSlot } from "@/lib/types";
import { SlotCard } from "@/components/agenda/SlotCard";
import { AppointmentModal } from "@/components/agenda/AppointmentModal";

export const Route = createFileRoute("/agenda")({
  head: () => ({ meta: [{ title: "Agenda — FisioBot" }] }),
  component: AgendaPage,
});

const HOURS = Array.from({ length: 18 }, (_, i) => 5 + i); // 05:00 - 22:00
const WEEK_DATES = [
  { date: "2026-05-04", label: "Seg.", day: 4 },
  { date: "2026-05-05", label: "Ter.", day: 5 },
  { date: "2026-05-06", label: "Qua.", day: 6 },
  { date: "2026-05-07", label: "Qui.", day: 7, today: true },
  { date: "2026-05-08", label: "Sex.", day: 8 },
  { date: "2026-05-09", label: "Sáb.", day: 9 },
  { date: "2026-05-10", label: "Dom.", day: 10 },
];

function AgendaPage() {
  const [selected, setSelected] = useState<AgendaSlot | null>(null);
  const { data: slots = [], refetch } = useQuery({
    queryKey: ["agenda"],
    queryFn: () => api.agenda.list(),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, AgendaSlot[]>();
    for (const s of slots) {
      const key = `${s.data}__${parseInt(s.horaInicio, 10)}`;
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    }
    return map;
  }, [slots]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b bg-background px-4 py-3">
        <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm">HOJE</Button>
        <Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        <div className="ml-2 text-sm font-semibold">Maio, 2026</div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Visualização</span>
          <Select defaultValue="semana">
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Dia</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="lista">Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-2">
            <Search className="h-4 w-4" /> Buscar horários
          </Button>
          <Button variant="outline" size="icon" title="Novo atendimento">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Cancelamentos">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid flex-1 grid-cols-[64px_repeat(7,minmax(0,1fr))] overflow-auto">
        <div className="sticky top-0 z-10 border-b border-r bg-background" />
        {WEEK_DATES.map((d) => (
          <div
            key={d.date}
            className={`sticky top-0 z-10 border-b border-r bg-background py-3 text-center text-sm ${
              d.today ? "bg-primary/10 font-semibold text-primary" : ""
            }`}
          >
            {d.label} <span className="text-base font-bold">{d.day}</span>
          </div>
        ))}

        {HOURS.map((h) => (
          <>
            <div
              key={`h-${h}`}
              className="border-b border-r bg-background px-2 py-3 text-xs text-muted-foreground"
            >
              {String(h).padStart(2, "0")}:00
            </div>
            {WEEK_DATES.map((d) => {
              const cellSlots = grouped.get(`${d.date}__${h}`) ?? [];
              return (
                <div
                  key={`${d.date}-${h}`}
                  className={`min-h-[80px] space-y-1 border-b border-r p-1 ${
                    d.today ? "bg-primary/5" : ""
                  }`}
                >
                  {cellSlots.map((s) => (
                    <SlotCard key={s.id} slot={s} onClick={() => setSelected(s)} />
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>

      <AppointmentModal
        slot={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onConcluir={async () => {
          if (selected) {
            await api.agenda.concluir(selected.id);
            toast.success("Atendimento concluído.");
            setSelected(null);
            refetch();
          }
        }}
        onCancelar={async () => {
          if (selected) {
            await api.agenda.cancelar(selected.id);
            toast.message("Aula cancelada.");
            setSelected(null);
            refetch();
          }
        }}
      />
    </div>
  );
}