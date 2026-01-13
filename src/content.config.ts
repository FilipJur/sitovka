import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
        col1: z.string(),
        col2: z.string(),
        image: image().optional(),
      }),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: "services.json", base: "src/content/sections" }),
  schema: ({ image }) =>
    z.object({
      headingHighlight: z.string().default(""),
      headingRemainder: z.string().default(""),
      introText: z.string().default(""),
      items: z
        .array(
          z.object({
            image: image().optional(),
            title: z.string(),
            description: z.string(),
          }),
        )
        .default([]),
    }),
});

const contacts = defineCollection({
  loader: glob({ pattern: "contacts.json", base: "src/content/sections" }),
  schema: ({ image }) =>
    z.object({
      heading: z.string(),
      introText: z.string(),
      team: z
        .array(
          z.object({
            name: z.string(),
            role: z.string().optional().default(""),
            email: z.string().optional().default(""),
            phone: z.string().optional().default(""),
            avatar: image().optional(),
            isFeatured: z.boolean().optional().default(false),
          }),
        )
        .default([]),
    }),
});

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

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: ({ image }) =>
    z.object({
      client: z.string(),
      quote: z.string(),
      logo: image().optional(),
    }),
});

export const collections = { about, services, contacts, footer, testimonials };
