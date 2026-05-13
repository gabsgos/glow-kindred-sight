import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/dashboards/operacional")({
  head: () => ({ meta: [{ title: "Dashboard Operacional — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Dashboard Operacional" description="Ocupação de horários, no-show, atendimentos." />
  ),
});
