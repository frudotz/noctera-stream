import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from the root of https://noctera.stream, so the default base ("/") is correct.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    // The SSR bundle is only used at build time to prerender index.html.
    copyPublicDir: !isSsrBuild,
  },
}));
