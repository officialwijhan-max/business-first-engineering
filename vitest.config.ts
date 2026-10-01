import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests only exercise plain TS modules, so this stays independent of the
// app's TanStack Start / Nitro Vite config.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
