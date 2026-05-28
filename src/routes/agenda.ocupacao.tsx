import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/agenda/ocupacao")({
  beforeLoad: () => {
    throw redirect({ to: "/agenda" });
  },
});
