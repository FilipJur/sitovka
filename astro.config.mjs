import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    output: "static",
    integrations: [react(), keystatic()],
    vite: {
        plugins: [tailwindcss()]
    }
});