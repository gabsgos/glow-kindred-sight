import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/dashboards/crm")({
  head: () => ({ meta: [{ title: "Dashboard CRM — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Dashboard CRM" description="Funil de leads, conversão e oportunidades." />
  ),
});
