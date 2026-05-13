import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/crm/leads")({
  head: () => ({ meta: [{ title: "Leads — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Leads" description="Captação de potenciais pacientes." />
  ),
});
