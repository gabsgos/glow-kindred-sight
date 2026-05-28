import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const useBackend = process.env.VITE_FISIOBOT_USE_BACKEND ?? "1";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
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
