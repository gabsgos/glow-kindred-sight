import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Início — FisioBot" }] }),
  component: () => <PagePlaceholder title="Início" description="Tela prevista no pipeline FisioBot." />,
});
