This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
src/
  assets/
    images/
      about/
        bio/
          image.WEBP
      services/
        items/
          0/
            image.png
  components/
    home/
      AboutBio.astro
      ServiceCard.astro
      ServicesSection.astro
  content/
    sections/
      about.json
      services.json
  pages/
    index.astro
  content.config.ts
package.json
repomix-output.md
```

# Files

## File: src/components/home/ServicesSection.astro
```
---
import { getEntry } from "astro:content";
import Markdoc from "@markdoc/markdoc";
import ServiceCard from "./ServiceCard.astro";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";
import { PositionOverlay } from "@/components/ui/PositionOverlay";

const entry = await getEntry("services", "services");
if (!entry) return null;

const { headingHighlight, headingRemainder, introText, items } = entry.data;
const introHtml = Markdoc.renderers.html(
  Markdoc.transform(Markdoc.parse(introText)),
);
---

<section class="bg-brand-surface rounded-[60px] relative overflow-hidden">
  <div class="container mx-auto px-6 py-24">
    <!-- Header Area -->
    <div class="text-center mb-16 space-y-6">
      <h2 class="text-2xl font-brand-heading">
        <span class="text-brand-green">{headingHighlight}</span>
        <span class="text-brand-dark">{headingRemainder}</span>
      </h2>
      <div
        class="text-lg font-book text-brand-dark leading-relaxed max-w-245 mx-auto"
        set:html={introHtml}
      />
    </div>

    <!-- 4-Column Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item: any) => <ServiceCard item={item} />)}
    </div>
  </div>

  <!-- Decorative hashtag bottom center -->
  <PositionOverlay bottom="-10px">
    <HashtagIcon className="w-21 h-auto text-brand-green" />
  </PositionOverlay>
</section>
```

## File: src/components/home/AboutBio.astro
```
---
import Markdoc from "@markdoc/markdoc";

interface Props {
  bio: {
    heading: string;
    col1: string; // Inline Markdoc string
    col2: string; // Inline Markdoc string
    image: any; // Astro image object
  };
}

const { bio } = Astro.props;

// Render Markdoc strings to HTML
const col1Html = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(bio.col1)));
const col2Html = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(bio.col2)));

// Determine layout based on image availability
const hasImage = bio.image && bio.image !== null;

// Create unified content array
const contentItems = [
  { type: 'text' as const, html: col1Html },
  { type: 'text' as const, html: col2Html },
  ...(hasImage ? [{
    type: 'image' as const,
    src: bio.image.src,
    alt: ''
  }] : [])
];
---

<!-- Heading extracted from grid -->
<h2
  class="text-2xl font-brand-heading text-brand-dark uppercase mb-6 text-center"
>
  {bio.heading}
</h2>

{
  hasImage ? (
    <!-- 3-column layout (text + text + image) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
      {contentItems.map((item) => (
        item.type === 'image' ? (
          <div class="relative flex items-end h-full">
            <img
              src={item.src}
              alt={item.alt}
              class="w-full h-auto object-contain -mb-24 lg:-mb-32 scale-110 origin-bottom"
            />
          </div>
        ) : (
          <div class="text-sm font-book text-brand-dark leading-relaxed" set:html={item.html} />
        )
      ))}
    </div>
  ) : (
    <!-- 2-column layout (text + text only) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      {contentItems.map((item) => (
        <div class="text-sm font-book text-brand-dark leading-relaxed" set:html={item.html} />
      ))}
    </div>
  )
}
```

## File: src/components/home/ServiceCard.astro
```
---
import Markdoc from "@markdoc/markdoc";

interface Props {
  item: {
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
    title: string;
    description: string;
  };
}

const { item } = Astro.props;

// Render Markdoc description to HTML
const descriptionHtml = Markdoc.renderers.html(
  Markdoc.transform(Markdoc.parse(item.description))
);
---

<div class="flex flex-col space-y-5">
  {
    item.image ? (
      <img
        src={item.image.src}
        alt={item.title}
        class="w-full h-full rounded-[60px] max-h-[330px]"
      />
    ) : (
      <div class="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
        <span class="text-gray-400 text-sm">No image</span>
      </div>
    )
  }
  <div class="space-y-3">
    <h3 class="text-2xl font-brand-heading text-brand-dark">{item.title}</h3>
    <div 
      class="text-sm font-book text-brand-dark leading-relaxed"
      set:html={descriptionHtml}
    />
  </div>
</div>
```

## File: src/content/sections/about.json
```json
{
  "benefits": [
    {
      "iconId": "board",
      "titleHashtag": "#děláme",
      "titleRemainder": "obsah, který funguje",
      "description": "Spravujeme sociální sítě, tvoříme texty, fotky i videa, které baví lidi  a podporují značku."
    },
    {
      "iconId": "target",
      "titleHashtag": "#umíme",
      "titleRemainder": " zacílit správně",
      "description": "Nastavíme kampaně tak, aby oslovily ty, na kterých ti opravdu záleží — bez plýtvání rozpočtem."
    },
    {
      "iconId": "light",
      "titleHashtag": "#jsme",
      "titleRemainder": "kreativní  a féroví",
      "description": "Kombinujeme nápady s daty, držíme krok s trendy a mluvíme  s tebou lidsky, ne agenturně."
    }
  ],
  "bio": {
    "heading": "O nás",
    "col1": "Jsme Síťovka – obsahová agentura, která věří, že dobrý obsah dokáže víc než reklama. Pomáháme značkám i jednotlivcům **zviditelnit se v digitálním světě** – mluvit jasně, autenticky a s dlouhodobým efektem.\\\nNevyrábíme instantní posty ani prázdné kampaně. Tvoříme **obsah, který dává smysl – baví, vzdělává nebo prodává.** Každý příspěvek, článek i video má svůj účel, strategii a přidanou hodnotu.\n",
    "col2": "Zaměřujeme se hlavně na **LinkedIn**, kde pomáháme budovat **osobní i firemní značky**. Spravujeme profily, píšeme texty, vymýšlíme strategie a kampaně, které fungují. Umíme ale i další sociální sítě, blogy, články a spolupráce s influencery či UGC tvůrci.\\\nOd prvního nápadu až po publikaci se **postaráme o to, aby váš obsah byl vidět, slyšet a měl výsledky.**\n",
    "image": "@/assets/images/about/bio/image.WEBP"
  }
}
```

## File: src/content/sections/services.json
```json
{
  "headingHighlight": "Co umíme?",
  "headingRemainder": "Tvoříme obsah, který zaujme, vzdělává nebo prodává.",
  "introText": "Od nápadu po publikaci tvoříme obsah, který dává smysl lidem i algoritmům. Specializujeme se na **LinkedIn –** budujeme autentické **osobní i firemní značky**, připravujeme texty, vizuály, strategie a kampaně s výsledky. Zvládáme i **další sítě**, blogy, články a spolupráce s influencery či UGC tvůrci, každý formát využíváme  k zapamatovatelnému vyprávění vašeho příběhu.\n",
  "items": [
    {
      "image": "@/assets/images/services/items/0/image.png",
      "title": "#v čem jsme jiní",
      "description": "Specializujeme se na LinkedIn – tvoříme **obsah na míru** podle cílové skupiny a tone of voice, propojujeme kreativitu s daty a strategickým myšlením. Jsme lidský partner vaší značky, ne jen dodavatel."
    },
    {
      "image": "@/assets/images/services/items/1/image.jpg",
      "title": "#obsah",
      "description": "Vytváříme obsah, který funguje – od nápadu až po publikaci. Texty, fotky, videa, které baví, vzdělávají nebo prodávají."
    },
    {
      "image": "@/assets/images/services/items/2/image.png",
      "title": "#cílení",
      "description": "Nastavíme kampaně tak, aby oslovily ty, na kterých vám opravdu záleží – bez plýtvání rozpočtem."
    },
    {
      "image": "@/assets/images/services/items/3/image.jpg",
      "title": "#technologie",
      "description": "Využíváme moderní nástroje a technologie pro analýzu, optimalizaci a automatizaci vašeho obsahu."
    }
  ]
}
```

## File: src/pages/index.astro
```
---
import Layout from "../layouts/Layout.astro";
import AboutUs from "../components/home/AboutUs.astro";
import ServicesSection from "../components/home/ServicesSection.astro";
---

<Layout title="Sítovka.net | Marketingová Agentura">
  <!-- About Us Section (Benefits + Bio) -->
  <AboutUs />

  <!-- Services Section (Co umíme) -->
  <ServicesSection />

  <!-- Other sections will follow -->
</Layout>
```

## File: src/content.config.ts
```typescript
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
        col1: z.string(), // Inline Markdoc is a string
        col2: z.string(), // Inline Markdoc is a string
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
      introText: z.string(), // Inline Markdoc is a string
      items: z.array(
        z.object({
          image: image().optional(),
          title: z.string(),
          description: z.string(), // Inline Markdoc is a string
        }),
      ),
    }),
});

export const collections = { footer, homepage, testimonials, about, services };
```

## File: package.json
```json
{
  "name": "sitovka",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "cleanup:images": "node scripts/cleanup-images.js",
    "cleanup:images:delete": "node scripts/cleanup-images.js --delete"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.6",
    "@astrojs/netlify": "^6.6.3",
    "@astrojs/react": "^4.4.2",
    "@keystatic/astro": "^5.0.6",
    "@keystatic/core": "^0.5.48",
    "@markdoc/markdoc": "^0.5.4",
    "@radix-ui/react-tabs": "^1.1.13",
    "@tailwindcss/vite": "^4.1.18",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "astro": "^5.16.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.24.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^3.4.0",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3",
    "vite-plugin-svgr": "^4.5.0"
  },
  "devDependencies": {
    "prettier": "^3.7.4",
    "prettier-plugin-astro": "^0.14.1"
  }
}
```
