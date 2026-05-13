import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/common/PagePlaceholder";

export const Route = createFileRoute("/agenda/grades")({
  head: () => ({ meta: [{ title: "Grades de horários — FisioBot" }] }),
  component: () => (
    <PagePlaceholder title="Grades de horários" description="Grades semanais por profissional/serviço." />
  ),
});
