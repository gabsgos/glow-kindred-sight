import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/crm/oportunidades")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
