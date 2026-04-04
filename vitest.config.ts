import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "node_modules",
      "src/extension/__tests__/e2e/**",
    ],
    alias: {
      // Jest compatibility shim
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
