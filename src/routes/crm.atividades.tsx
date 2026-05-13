import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/crm/atividades")({
  head: () => ({ meta: [{ title: "Atividades — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Atividades" description="Ligações e follow-ups agendados." />
  ),
});
