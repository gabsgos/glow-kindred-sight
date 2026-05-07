import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin / Debug — FisioBot" }] }),
  component: () => <PagePlaceholder title="Admin / Debug" description="Tela prevista no pipeline FisioBot." />,
});
