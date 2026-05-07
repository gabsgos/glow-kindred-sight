import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/financeiro")({
  head: () => ({ meta: [{ title: "Financeiro — FisioBot" }] }),
  component: () => <PagePlaceholder title="Financeiro" description="Tela prevista no pipeline FisioBot." />,
});
