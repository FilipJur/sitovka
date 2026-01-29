import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "static",
  adapter: netlify(),
  integrations: [react()],
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
    server: {
      host: "0.0.0.0",
      allowedHosts: [
        "devserver-preview--sitovka.netlify.app",
        ".netlify.app",
        ".stackbit.app",
        "localhost",
      ],
      hmr: {
        path: "/vite-hmr",
      },
    },
  },
});
