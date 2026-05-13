import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/dashboards/gerencial")({
  head: () => ({ meta: [{ title: "Dashboard Gerencial — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Dashboard Gerencial" description="KPIs estratégicos: LTV, Churn, CAC, Inadimplência." />
  ),
});
