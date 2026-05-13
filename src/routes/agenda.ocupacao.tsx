import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/agenda/ocupacao")({
  head: () => ({ meta: [{ title: "Ocupação — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Ocupação" description="Heatmap de ocupação por dia e hora." />
  ),
});
