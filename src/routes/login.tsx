import { createFileRoute } from "@tanstack/react-router";
import { FisioBotLogin } from "./app-login";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar - FisioBot" }] }),
  component: FisioBotLogin,
});
