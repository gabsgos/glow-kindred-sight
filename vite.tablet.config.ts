import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const useBackend = process.env.VITE_FISIOBOT_USE_BACKEND ?? "1";
const appRoutes = new Set([
  "/",
  "/dashboard",
  "/agenda",
  "/pacientes",
  "/evolucoes",
  "/financeiro",
  "/relatorios",
  "/recursos",
  "/usuarios",
  "/onboarding",
  "/cadastro",
  "/register",
  "/auth",
  "/recover",
  "/recuperar-senha",
  "/debug-intents",
  "/app-login",
]);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    {
      name: "fisiobot-tablet-spa-fallback",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url || "/", "http://localhost");
          if (!appRoutes.has(url.pathname)) {
            next();
            return;
          }
          const htmlPath = path.resolve(dirname, "tablet.index.html");
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(fs.readFileSync(htmlPath, "utf8"));
        });
      },
    },
  ],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5099",
      "/healthz": "http://127.0.0.1:5099",
      "/whatsapp": "http://127.0.0.1:5099",
    },
  },
  define: {
    "import.meta.env.VITE_FISIOBOT_USE_BACKEND": JSON.stringify(useBackend),
  },
  build: {
    outDir: "dist-tablet",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(dirname, "tablet.index.html"),
        react: path.resolve(dirname, "tablet.react.html"),
      },
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
