import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("node_modules/firebase")) {
            return "firebase";
          }

          if (id.includes("node_modules/react-icons")) {
            return "icons";
          }

          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run")) {
            return "router";
          }

          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
