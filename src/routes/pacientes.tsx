import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/pacientes")({
  head: () => ({ meta: [{ title: "Pacientes — FisioBot" }] }),
  component: () => <PagePlaceholder title="Pacientes" description="Tela prevista no pipeline FisioBot." />,
});
