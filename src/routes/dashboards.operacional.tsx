import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboards/operacional")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
