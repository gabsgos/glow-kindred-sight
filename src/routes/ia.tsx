import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/ia")({
  head: () => ({ meta: [{ title: "IA / Comando rápido — FisioBot" }] }),
  component: () => <PagePlaceholder title="IA / Comando rápido" description="Tela prevista no pipeline FisioBot." />,
});
