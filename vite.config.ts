import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from the root of https://noctera.stream, so the default base ("/") is correct.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: isSsrBuild
    ? {
        // The SSR bundle is only used at build time to prerender the pages.
        copyPublicDir: false,
      }
    : {
        // The manifest tells scripts/prerender.mjs which hashed files to inline or link.
        manifest: true,
        rollupOptions: {
          input: {
            index: "index.html",
            "copy-link": "src/client/copy-link.ts",
          },
        },
      },
}));
