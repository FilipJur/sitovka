import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import netlify from "@astrojs/netlify";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    hmr: {
      path: "/vite-hmr",
    },
    output: "static",
    adapter: netlify(),
    integrations: [react()],
  },
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
