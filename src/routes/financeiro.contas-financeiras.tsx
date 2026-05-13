import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/financeiro/contas-financeiras")({
  head: () => ({ meta: [{ title: "Contas financeiras — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Contas financeiras" description="Cadastro de contas (caixa, banco, cartão)." />
  ),
});
