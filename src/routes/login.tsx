import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — FisioBot" }] }),
  component: () => <PagePlaceholder title="Entrar" description="Tela prevista no pipeline FisioBot." />,
});
