import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "custom",
  nodeVersion: "18",

  // Astro dev server inside Visual Editor container
  devCommand: "node_modules/.bin/astro dev --port {PORT} --hostname 127.0.0.1",

  // Critical for Astro/Vite compatibility
  experimental: {
    ssg: {
      name: "Astro",
      logPatterns: {
        up: ["is ready", "astro"],
      },
      directRoutes: {
        "socket.io": "socket.io",
      },
      passthrough: ["/vite-hmr/**"],
    },
  },

  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: [
        "src/content/sections",
        "src/content/global",
        "src/content/testimonials",
      ],
      models: [
        // Hero Section
        {
          name: "Hero",
          type: "data",
          filePath: "src/content/sections/hero.json",
          fields: [
            {
              name: "cards",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "highlight", type: "string", required: true },
                  { name: "headline", type: "string", required: true },
                  { name: "description", type: "string", required: true },
                  { name: "image", type: "image" },
                  {
                    name: "theme",
                    type: "enum",
                    options: ["green", "white", "grey"],
                    default: "green",
                  },
                ],
              },
            },
          ],
        },

        // About Section
        {
          name: "About",
          type: "data",
          filePath: "src/content/sections/about.json",
          fields: [
            {
              name: "benefits",
              type: "list",
              items: {
                type: "object",
                fields: [
                  {
                    name: "iconId",
                    type: "enum",
                    options: ["target", "board", "light"],
                    default: "target",
                  },
                  { name: "titleHashtag", type: "string", required: true },
                  { name: "titleRemainder", type: "string", required: true },
                  { name: "description", type: "string", required: true },
                ],
              },
            },
            {
              name: "bio",
              type: "object",
              fields: [
                { name: "heading", type: "string", default: "O nás" },
                { name: "col1", type: "markdown" },
                { name: "col2", type: "markdown" },
                { name: "image", type: "image" },
              ],
            },
          ],
        },

        // Services Section
        {
          name: "Services",
          type: "data",
          filePath: "src/content/sections/services.json",
          fields: [
            { name: "headingHighlight", type: "string", default: "Co umíme?" },
            { name: "headingRemainder", type: "string" },
            { name: "introText", type: "markdown" },
            {
              name: "items",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "image", type: "image" },
                  { name: "title", type: "string", required: true },
                  { name: "description", type: "markdown" },
                ],
              },
            },
          ],
        },

        // Contacts Section
        {
          name: "Contacts",
          type: "data",
          filePath: "src/content/sections/contacts.json",
          fields: [
            { name: "heading", type: "string", default: "Kontakty" },
            { name: "introText", type: "markdown" },
            {
              name: "team",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "name", type: "string", required: true },
                  { name: "role", type: "string" },
                  { name: "email", type: "string" },
                  { name: "phone", type: "string" },
                  { name: "avatar", type: "image" },
                  { name: "isFeatured", type: "boolean", default: false },
                ],
              },
            },
          ],
        },

        // Case Studies Section
        {
          name: "CaseStudies",
          type: "data",
          filePath: "src/content/sections/case-studies.json",
          fields: [
            { name: "heading", type: "string", default: "Případové studie" },
            {
              name: "items",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "tabLabel", type: "string", required: true },
                  { name: "heading", type: "string", required: true },
                  { name: "description", type: "markdown" },
                  { name: "image", type: "image" },
                ],
              },
            },
          ],
        },

        // Prefooter Section
        {
          name: "Prefooter",
          type: "data",
          filePath: "src/content/sections/prefooter.json",
          fields: [{ name: "image", type: "image" }],
        },

        // Clients Section
        {
          name: "Clients",
          type: "data",
          filePath: "src/content/sections/clients.json",
          fields: [
            {
              name: "logos",
              type: "list",
              items: {
                type: "object",
                fields: [
                  { name: "name", type: "string" },
                  { name: "href", type: "string" },
                  { name: "logo", type: "image", required: true },
                ],
              },
            },
          ],
        },

        // Footer Configuration
        {
          name: "Footer",
          type: "data",
          filePath: "src/content/global/footer.json",
          fields: [
            {
              name: "company",
              type: "object",
              fields: [
                { name: "name", type: "string", required: true },
                { name: "street", type: "string", required: true },
                { name: "city", type: "string", required: true },
              ],
            },
            {
              name: "legal",
              type: "object",
              fields: [
                { name: "ico", type: "string", required: true },
                { name: "dic", type: "string", required: true },
                { name: "court", type: "string", required: true },
              ],
            },
            {
              name: "bank",
              type: "object",
              fields: [
                { name: "accountNumber", type: "string", required: true },
                { name: "swift", type: "string", required: true },
                { name: "iban", type: "string" },
              ],
            },
            {
              name: "socials",
              type: "object",
              fields: [
                { name: "facebook", type: "string" },
                { name: "instagram", type: "string" },
                { name: "x", type: "string" },
                { name: "linkedin", type: "string" },
                { name: "youtube", type: "string" },
              ],
            },
          ],
        },

        // Testimonials (as pages since they're individual files)
        {
          name: "Testimonial",
          type: "page",
          urlPath: "/testimonials/{slug}",
          filePath: "src/content/testimonials/{slug}.json",
          fields: [
            { name: "logo", type: "image" },
            { name: "content", type: "markdown", required: true },
            { name: "avatar", type: "image" },
            { name: "name", type: "string" },
            { name: "role", type: "string" },
          ],
        },
      ],
      assetsConfig: {
        referenceType: "relative",
        assetsDir: "src/assets",
        uploadDir: "images",
      },
    }),
  ],
});
