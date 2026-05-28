import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/crm/atividades")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
