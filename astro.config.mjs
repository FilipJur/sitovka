import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://sitovka.netlify.app",
  output: "static",
  adapter: netlify(),
  integrations: [react()],
  server: {
    port: 4321,
    host: true, // Listens on all addresses (0.0.0.0)
    allowedHosts: true, // Allows all hosts (Required for dynamic preview URLs)
  },
  vite: {
    server: {
      // Fix for CORS/WebSocket errors in Netlify Visual Editor
      hmr: {
        protocol: "wss", // Force secure web sockets
        clientPort: 443, // The public port Netlify uses
      },
    },
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
