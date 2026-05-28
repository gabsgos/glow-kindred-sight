import { AlertCircle, CheckCircle2, Clock3, FileText, UserRound, XCircle } from "lucide-react";

import type { AgendaSlot } from "@/lib/types";
import { asArray } from "@/lib/safe";

const statusStyles = {
  aberto: {
    className: "border-sky-200 bg-sky-50 text-sky-950 hover:bg-sky-100",
    icon: <Clock3 className="h-3.5 w-3.5 text-sky-600" />,
    label: "Aberto",
  },
  concluido: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100",
    icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />,
    label: "Evoluido",
  },
  cancelado: {
    className: "border-rose-200 bg-rose-50 text-rose-950 opacity-80 hover:bg-rose-100",
    icon: <XCircle className="h-3.5 w-3.5 text-rose-600" />,
    label: "Cancelado",
  },
};

function money(value?: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

export function SlotCard({
  slot,
  compact = false,
  onClick,
}: {
  slot: AgendaSlot;
  compact?: boolean;
  onClick: () => void;
}) {
  const style = statusStyles[slot.status] ?? statusStyles.aberto;
  const clientes = asArray(slot.clientes);
  const patient = clientes[0];
  const hasBillingPending = slot.statusFinanceiro === "pendente" || slot.temPendencia;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border p-2 text-left text-xs shadow-sm transition focus:outline-none focus:ring-2 focus:ring-ring ${style.className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold leading-tight">
          {slot.horaInicio} - {slot.horaFim}
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-white/70 px-1.5 py-0.5 text-[10px] font-medium">
          {style.icon}
          {style.label}
        </span>
      </div>
      <div className="mt-1 line-clamp-1 font-medium">{patient?.nomeCompleto || slot.servico}</div>
      {!compact && (
        <div className="mt-1 line-clamp-1 text-[11px] opacity-80">
          {slot.servico} · {slot.profissionalNome || "FisioBot"}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className="inline-flex items-center gap-1 rounded bg-white/70 px-1.5 py-0.5">
          <UserRound className="h-3 w-3" />
          {slot.ocupacao || clientes.length}
        </span>
        <span className="rounded bg-white/70 px-1.5 py-0.5">{money(slot.valorAtendimento)}</span>
        {hasBillingPending && (
          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">
            <AlertCircle className="h-3 w-3" />
            Faturamento
          </span>
        )}
        {slot.evolucao || patient?.temEvolucao ? (
          <span className="inline-flex items-center gap-1 rounded bg-white/70 px-1.5 py-0.5">
            <FileText className="h-3 w-3" />
            Evolucao
          </span>
        ) : null}
      </div>
    </button>
  );
}
