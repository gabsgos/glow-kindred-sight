import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboards/crm")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
