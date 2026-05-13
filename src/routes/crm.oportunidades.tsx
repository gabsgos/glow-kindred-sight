import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/crm/oportunidades")({
  head: () => ({ meta: [{ title: "Oportunidades — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Oportunidades" description="Funil de vendas (Kanban)." />
  ),
});
