import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import netlify from "@astrojs/netlify";

export default defineConfig({
  // 1. Revert to 'static' (Astro v5 handles dynamic routes automatically now)
  output: "static",

  // 2. Keep the adapter (Required for Keystatic's API routes to run on Netlify)
  adapter: netlify(),

  integrations: [react(), keystatic()],
  vite: {
    plugins: [
      tailwindcss(),
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: true,
          titleProp: true,
        },
        include: "**/*.svg?react",
      }),
    ],
  },
});
