import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar cadastro — FisioBot" }] }),
  component: () => <PagePlaceholder title="Criar cadastro" description="Tela prevista no pipeline FisioBot." />,
});
