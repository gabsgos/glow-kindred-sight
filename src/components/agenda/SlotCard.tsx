import { CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { corDoServico } from "@/lib/mocks";
import type { AgendaSlot } from "@/lib/types";

export function SlotCard({ slot, onClick }: { slot: AgendaSlot; onClick: () => void }) {
  const cor = corDoServico(slot.servico);
  const ocupacao = slot.capacidadeIlimitada
    ? `${slot.ocupacao} / ∞`
    : `${slot.ocupacao} / ${slot.capacidade ?? 0}`;
  const concluido = slot.status === "concluido";
  const cancelado = slot.status === "cancelado";
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-md border border-white/10 p-2 text-left text-[11px] text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
      style={{
        backgroundColor: cancelado ? "var(--destructive)" : cor,
        opacity: cancelado ? 0.7 : 1,
      }}
    >
      <div className="font-medium leading-tight">
        {slot.horaInicio} - {slot.horaFim}
      </div>
      <div className="mt-0.5 line-clamp-2 leading-tight">{slot.servico}</div>
      <div className="mt-1 flex items-center gap-1">
        <span className="rounded bg-black/25 px-1.5 py-0.5 text-[10px] font-semibold">
          {ocupacao}
        </span>
        {concluido && <CheckCircle2 className="h-3 w-3" />}
        {slot.temPendencia && <AlertCircle className="h-3 w-3" />}
        {slot.clientes.some((c) => c.temEvolucao) && <FileText className="h-3 w-3" />}
      </div>
    </button>
  );
}