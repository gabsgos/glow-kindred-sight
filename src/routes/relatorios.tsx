import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/relatorios")({
  head: () => ({ meta: [{ title: "Relatórios — FisioBot" }] }),
  component: () => <PagePlaceholder title="Relatórios" description="Tela prevista no pipeline FisioBot." />,
});
