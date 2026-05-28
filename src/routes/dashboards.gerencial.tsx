import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboards/gerencial")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
