import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

// Footer Schema
const footer = defineCollection({
  loader: glob({ pattern: "footer.json", base: "./src/content/global" }),
  schema: z.object({
    company: z.object({
      name: z.string(),
      street: z.string(),
      city: z.string(),
    }),
    legal: z.object({
      ico: z.string(),
      dic: z.string(),
      court: z.string(),
    }),
    bank: z.object({
      accountNumber: z.string(),
      swift: z.string(),
      iban: z.string().optional(),
    }),
    socials: z
      .object({
        facebook: z.string().url().nullable().optional(),
        instagram: z.string().url().nullable().optional(),
        x: z.string().url().nullable().optional(),
        linkedin: z.string().url().nullable().optional(),
        youtube: z.string().url().nullable().optional(),
      })
      .optional(),
  }),
});

// Homepage Schema
const homepage = defineCollection({
  loader: glob({ pattern: "home.json", base: "./src/content/pages" }),
  schema: z.object({
    heroHeadline: z.string().optional(),
    benefits: z
      .array(
        z.object({
          iconId: z.enum(["target", "board", "light"]),
          titleHashtag: z.string(),
          titleRemainder: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
  }),
});

// About Us Schema
const about = defineCollection({
  loader: glob({ pattern: "about.json", base: "src/content/sections" }),
  schema: ({ image }) =>
    z.object({
      benefits: z.array(
        z.object({
          iconId: z.enum(["target", "board", "light"]),
          titleHashtag: z.string(),
          titleRemainder: z.string(),
          description: z.string(),
        }),
      ),
      bio: z.object({
        heading: z.string(),
        col1: z.object({
          // ✅ markdoc.inline() stores { node: MarkdocNode }
          node: z.any(),
        }),
        col2: z.object({
          node: z.any(),
        }),
        image: image().optional(), // Resolver for @/assets - OPTIONAL
      }),
    }),
});

// Testimonials Schema
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: ({ image }) =>
    z.object({
      client: z.string(),
      quote: z.string(),
      logo: image().optional(),
    }),
});

// Services Schema
const services = defineCollection({
  loader: glob({ pattern: "services.json", base: "src/content/sections" }),
  schema: ({ image }) =>
    z.object({
      headingHighlight: z.string(),
      headingRemainder: z.string(),
      introText: z.object({
        // ✅ markdoc.inline() stores { node: MarkdocNode }
        node: z.any(),
      }),
      items: z.array(
        z.object({
          image: image().optional(),
          title: z.string(),
          description: z
            .object({
              // ✅ markdoc.inline() stores { node: MarkdocNode }
              node: z.any(),
            })
            .optional(),
        }),
      ),
    }),
});

export const collections = { footer, homepage, testimonials, about, services };
