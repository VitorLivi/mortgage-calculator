import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/shared/components"),
      "@/interfaces": resolve(__dirname, "./src/shared/interfaces"),
      "@/utils": resolve(__dirname, "./src/shared/utils"),
      "@/hooks": resolve(__dirname, "./src/shared/hooks"),
      "@/types": resolve(__dirname, "./src/shared/types"),
      "@/features": resolve(__dirname, "./src/features"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          ui: ["clsx", "tailwind-merge"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.tsx",
    css: true,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
