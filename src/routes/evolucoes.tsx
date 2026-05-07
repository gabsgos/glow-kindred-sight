import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/evolucoes")({
  head: () => ({ meta: [{ title: "Evoluções — FisioBot" }] }),
  component: () => <PagePlaceholder title="Evoluções" description="Tela prevista no pipeline FisioBot." />,
});
