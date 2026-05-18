import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tsconfigPaths(),
      tanstackRouter(),
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@workspace/ui/lib": path.resolve(__dirname, "../../packages/ui/src/lib"),
        "@workspace/ui/components": path.resolve(__dirname, "../../packages/ui/src/components"),
        "@workspace/ui": path.resolve(__dirname, "../../packages/ui/src/components"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
        "/public": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      css: true,
    },
  };
});
