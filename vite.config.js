import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [
      "devserver-preview--sitovka.netlify.app",
      ".netlify.app",
      ".stackbit.app",
      "localhost",
    ],
  },
});
