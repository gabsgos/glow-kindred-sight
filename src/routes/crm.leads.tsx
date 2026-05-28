import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/crm/leads")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
});
