import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/financeiro/vendas")({
  head: () => ({ meta: [{ title: "Vendas — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Vendas" description="Pacotes de sessões e vendas avulsas." />
  ),
});
