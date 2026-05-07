import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — FisioBot" }] }),
  component: () => <PagePlaceholder title="Configurações" description="Tela prevista no pipeline FisioBot." />,
});
