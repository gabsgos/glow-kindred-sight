import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/financeiro/comissao")({
  head: () => ({ meta: [{ title: "Comissão — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Comissão" description="Cálculo de comissão por profissional e atendimento." />
  ),
});
