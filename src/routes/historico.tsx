import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/historico")({
  head: () => ({ meta: [{ title: "Histórico e auditoria — FisioBot" }] }),
  component: () => <PagePlaceholder title="Histórico e auditoria" description="Tela prevista no pipeline FisioBot." />,
});
