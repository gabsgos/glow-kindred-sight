import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/pendencias")({
  head: () => ({ meta: [{ title: "Pendências — FisioBot" }] }),
  component: () => <PagePlaceholder title="Pendências" description="Tela prevista no pipeline FisioBot." />,
});
