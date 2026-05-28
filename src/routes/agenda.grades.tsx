import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/agenda/grades")({
  beforeLoad: () => {
    throw redirect({ to: "/agenda" });
  },
});
