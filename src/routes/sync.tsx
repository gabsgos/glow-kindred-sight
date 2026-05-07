import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/sync")({
  head: () => ({ meta: [{ title: "Sincronização — FisioBot" }] }),
  component: () => <PagePlaceholder title="Sincronização" description="Tela prevista no pipeline FisioBot." />,
});
