import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/financeiro/contas-pagar")({
  head: () => ({ meta: [{ title: "Contas a pagar — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Contas a pagar" description="Despesas e contas a serem pagas pela clínica." />
  ),
});
