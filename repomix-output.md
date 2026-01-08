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
          image.png
        jarda.png
  components/
    home/
      AboutBio.astro
      AboutUs.astro
      BenefitsRow.astro
  content/
    sections/
      about/
        bio/
          col1.mdoc
          col2.mdoc
      about.json
  pages/
    index.astro
  content.config.ts
keystatic.config.ts
```

# Files

## File: src/components/home/AboutBio.astro
```
---
import { DocumentRenderer } from "@keystatic/core/renderer";

interface Props {
  bio: {
    heading: string;
    col1: unknown; // Markdoc JSON structure
    col2: unknown; // Markdoc JSON structure
    image: string;
  };
}

const { bio } = Astro.props;

// Extract text content from Markdoc structure as fallback
function extractTextFromMarkdoc(markdoc: any): string {
  if (!markdoc || typeof markdoc !== "object") return "";

  if (markdoc.type === "text" && typeof markdoc.text === "string") {
    return markdoc.text;
  }

  if (markdoc.content && Array.isArray(markdoc.content)) {
    return markdoc.content.map(extractTextFromMarkdoc).join("");
  }

  if (markdoc.content && typeof markdoc.content === "object") {
    return extractTextFromMarkdoc(markdoc.content);
  }

  return "";
}

const col1Text = extractTextFromMarkdoc(bio.col1);
const col2Text = extractTextFromMarkdoc(bio.col2);

// Determine layout based on image availability
const hasImage = bio.image && bio.image !== null;
---

<!-- Heading extracted from grid -->
<h2
  class="text-2xl font-brand-heading text-brand-dark uppercase mb-6 text-center"
>
  {bio.heading}
</h2>

<div
  class={`grid grid-cols-1 lg:grid-cols-${hasImage ? "3" : "2"} gap-5 items-start`}
>
  <!-- Col 1: Markdoc Text -->
  <div class="text-sm font-book text-brand-dark leading-relaxed">
    <!-- Fallback text rendering instead of DocumentRenderer -->
    <div class="text-sm font-book text-brand-dark leading-relaxed">
      {col1Text}
    </div>
  </div>

  <!-- Col 2: Markdoc Text -->
  <div class="text-sm font-book text-brand-dark leading-relaxed">
    <!-- Fallback text rendering instead of DocumentRenderer -->
    <div class="text-sm font-book text-brand-dark leading-relaxed">
      {col2Text}
    </div>
  </div>

  <!-- Col 3: The Bleed Image (conditional) -->
  {
    hasImage && (
      <div class="relative flex items-end h-full">
        <img
          src={bio.image}
          alt=""
          class="w-full h-auto object-contain -mb-24 lg:-mb-32 scale-110 origin-bottom"
        />
      </div>
    )
  }
</div>
```

## File: src/components/home/AboutUs.astro
```
---
import { getEntry } from "astro:content";
import BenefitsRow from "./BenefitsRow.astro";
import AboutBio from "./AboutBio.astro";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";

const entry = await getEntry("about", "about");
if (!entry) return null;

const { benefits, bio } = entry.data;
---

<section class="bg-white rounded-[60px] relative overflow-hidden">
  <div class="container mx-auto px-6 py-24">
    <!-- Row 1: Benefits -->
    <BenefitsRow benefits={benefits} />

    <!-- Spacer -->
    <div class="h-24 lg:h-32"></div>

    <!-- Row 2: Bio -->
    <AboutBio bio={bio} />
  </div>

  <!-- Decorative hashtag glued to bottom center -->
  <div
    class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none"
  >
    <HashtagIcon className="w-[120px] h-auto text-brand-green" />
  </div>
</section>
```

## File: src/content/sections/about/bio/col1.mdoc
```
Jsme Síťovka – obsahová agentura, která věří, že dobrý obsah dokáže víc než reklama. Pomáháme značkám i jednotlivcům **zviditelnit se v digitálním světě** – mluvit jasně, autenticky a s dlouhodobým efektem.\
Nevyrábíme instantní posty ani prázdné kampaně. Tvoříme **obsah, který dává smysl – baví, vzdělává nebo prodává**. Každý příspěvek, článek i video má svůj účel, strategii a přidanou hodnotu.
```

## File: src/content/sections/about/bio/col2.mdoc
```
Zaměřujeme se hlavně na **LinkedIn**, kde pomáháme budovat **osobní i firemní značky**. Spravujeme profily, píšeme texty, vymýšlíme strategie a kampaně, které fungují. Umíme ale i další sociální sítě, blogy, články a spolupráce s influencery či UGC tvůrci.\
Od prvního nápadu až po publikaci **se postaráme o to, aby váš obsah byl vidět, slyšet a měl výsledky.**
```

## File: src/content/sections/about.json
```json
{
  "benefits": [
    {
      "iconId": "target",
      "titleHashtag": "#děláme",
      "titleRemainder": " obsah, který funguje",
      "description": "Spravujeme sociální sítě, tvoříme texty, fotky i videa, které baví lidi  a podporují značku."
    },
    {
      "iconId": "board",
      "titleHashtag": "#umíme",
      "titleRemainder": " zacílit správně",
      "description": "Nastavíme kampaně tak, aby oslovily ty, na kterých ti opravdu záleží — bez plýtvání rozpočtem."
    },
    {
      "iconId": "light",
      "titleHashtag": "#jsme",
      "titleRemainder": " kreativní a féroví",
      "description": "Kombinujeme nápady s daty, držíme krok s trendy a mluvíme s tebou lidsky, ne agenturně."
    }
  ],
  "bio": {
    "heading": "O nás",
    "image": "@/assets/images/about/bio/image.png"
  }
}
```

## File: src/components/home/BenefitsRow.astro
```
---
import BenefitCard from "./BenefitCard.astro";

interface Props {
  benefits: Array<{
    iconId: "target" | "board" | "light";
    titleHashtag: string;
    titleRemainder: string;
    description: string;
  }>;
}

const { benefits } = Astro.props;
---

<div class="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-22.5">
  {
    benefits.map((benefit) => (
      <BenefitCard
        iconId={benefit.iconId}
        hashtag={benefit.titleHashtag}
        title={benefit.titleRemainder}
        description={benefit.description}
      />
    ))
  }
</div>
```

## File: src/pages/index.astro
```
---
import Layout from "../layouts/Layout.astro";
import AboutUs from "../components/home/AboutUs.astro";
---

<Layout title="Sítovka.net | Marketingová Agentura">
  <main>
    <!-- We will add the Hero here later -->

    <!-- About Us Section (Benefits + Bio) -->
    <AboutUs />

    <!-- Other sections will follow -->
  </main>
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
  schema: z.object({
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
      col1: z.unknown(), // Markdoc JSON
      col2: z.unknown(),
      image: z.string().nullable(),
    }),
  }),
});

// Testimonials Schema
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: z.object({
    client: z.string(),
    quote: z.string(),
    logo: z.string().optional(),
  }),
});

export const collections = { footer, homepage, testimonials, about };
```

## File: keystatic.config.ts
```typescript
import { config, fields, singleton, collection } from "@keystatic/core";

export default config({
  storage: { kind: "local" },

  singletons: {
    // Global Footer Configuration
    footer: singleton({
      label: "Footer Info",
      path: "src/content/global/footer",
      format: { data: "json" },
      schema: {
        company: fields.object(
          {
            name: fields.text({ label: "Company Name" }),
            street: fields.text({ label: "Street" }),
            city: fields.text({ label: "City" }),
          },
          { label: "Address" },
        ),
        legal: fields.object(
          {
            ico: fields.text({ label: "IČO" }),
            dic: fields.text({ label: "DIČ" }),
            court: fields.text({ label: "Court Registration" }),
          },
          { label: "Legal Info" },
        ),
        bank: fields.object(
          {
            accountNumber: fields.text({ label: "Account Number" }),
            swift: fields.text({ label: "SWIFT" }),
            iban: fields.text({ label: "IBAN" }),
          },
          { label: "Bank Details" },
        ),
        socials: fields.object(
          {
            facebook: fields.url({ label: "Facebook URL" }),
            instagram: fields.url({ label: "Instagram URL" }),
            x: fields.url({ label: "X (Twitter) URL" }),
            linkedin: fields.url({ label: "LinkedIn URL" }),
            youtube: fields.url({ label: "YouTube URL" }),
          },
          { label: "Social Media Links" },
        ),
      },
    }),

    // About Us Section (Benefits + Bio)
    about: singleton({
      label: "About Us",
      path: "src/content/sections/about",
      format: { data: "json" },
      schema: {
        benefits: fields.array(
          fields.object({
            iconId: fields.select({
              label: "Icon",
              options: [
                { label: "Target", value: "target" },
                { label: "Board", value: "board" },
                { label: "Light", value: "light" },
              ],
              defaultValue: "target",
            }),
            titleHashtag: fields.text({ label: "Highlight (e.g. #děláme)" }),
            titleRemainder: fields.text({ label: "Title Text" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          {
            label: "Benefits Row",
            itemLabel: (props) =>
              props.fields.titleHashtag.value +
              " " +
              props.fields.titleRemainder.value,
          },
        ),
        bio: fields.object(
          {
            heading: fields.text({
              label: "Row Heading",
              defaultValue: "O nás",
            }),
            col1: fields.markdoc({ label: "Column 1 (Rich Text)" }),
            col2: fields.markdoc({ label: "Column 2 (Rich Text)" }),
            image: fields.image({
              label: "Bleed Image (The Man)",
              directory: "src/assets/images/about",
              publicPath: "@/assets/images/about/",
            }),
          },
          { label: "Bio Section" },
        ),
      },
    }),
  },

  collections: {
    // Testimonials (Repeatable items)
    testimonials: collection({
      label: "Testimonials",
      slugField: "client",
      path: "src/content/testimonials/*",
      format: { data: "json" },
      schema: {
        client: fields.text({ label: "Client Name" }),
        quote: fields.text({ label: "Quote", multiline: true }),
        logo: fields.image({
          label: "Client Logo",
          directory: "src/assets/clients",
          publicPath: "@/assets/clients/",
        }),
      },
    }),
  },
});
```
