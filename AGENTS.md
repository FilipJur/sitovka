# AGENTS.md - Development Guidelines for Sitovka

## ⚠️ Development Protocol

**IMPORTANT: AI agents should NEVER run `npm run dev`.** Development servers run in background. Use build/preview commands only.

## Build & Development Commands

### Core Commands

- `npm run dev` - **NEVER USE** - Dev server runs in background
- `npm run build` - Build production static site to `./dist/`
  - Automatically runs `scripts/sync-keystatic-assets.js` first (via prebuild)
  - Fixes case sensitivity issues before building
- `npm run preview` - Preview production build locally
- `npm run astro -- --help` - Get Astro CLI help
- `npm run cleanup:images` - List unused image assets
- `npm run cleanup:images:delete` - Delete unused image assets
- `node scripts/sync-keystatic-assets.js` - Manual Keystatic asset sync (runs automatically)

**Build Process:**

1. `npm run prebuild` → Runs asset sync script
2. `npm run build` → Runs Astro build
3. `npm run preview` → Preview built site

### Testing & Quality

- `astro check` - TypeScript and Astro component validation
- Prettier + Prettier plugin for Astro are configured (prettier.config.cjs)

## Technology Stack

### Core Framework

- **Astro v5.16.6** - Static site generator with component islands
- **React v18.3.1** - Interactive components
- **TypeScript** - Strict mode enabled via astro/tsconfigs/strict
- **Tailwind CSS v4.1.18** - Utility-first CSS framework

### Key Dependencies

- **Keystatic** - Headless CMS integration
- **Markdoc** - Rich text processing (manual parsing required)
- **Framer Motion** - Animation library
- **Embla Carousel** - Carousel component
- **Radix UI** - Headless UI components (@radix-ui/react-tabs)
- **class-variance-authority** - Component variant utility
- **tailwind-merge** - Tailwind class merging utility
- **@astrojs/netlify** - Netlify adapter (required for Keystatic API routes)
- **vite-plugin-svgr** - SVG to React component transform

### Critical Infrastructure

**Netlify Adapter (astro.config.mjs)**

- Required for Keystatic's API routes to function on Netlify
- Static output with adapter support

**SVG Transform**

- Import pattern: `import Icon from "@/assets/icons/icon.svg?react"`
- Components receive React props (className, etc.)
- See footer component for social icons example

**Path Alias**

- `@/*` maps to `./src/*` (tsconfig.json)
- Use for all internal imports

**Keystatic Asset Sync (scripts/sync-keystatic-assets.js)**

- Runs automatically before build via `prebuild` script
- Fixes case sensitivity mismatches between JSON references and directories
- Creates missing directories (e.g., `src/assets/images/case-studies/`)
- Cleans up empty orphaned directories
- Warns about directories with assets but no matching JSON
- **Required for Netlify** - macOS filesystem is case-insensitive, Linux is case-sensitive

## 🧠 Content Architecture (CRITICAL)

### 1. Storage Pattern: "Unified JSON"

We use **Section-Based Singletons**. Each landing page section has one JSON file containing all its data.

- Location: `src/content/sections/*.json`
- Loader: `glob` pattern in `src/content.config.ts`
- Collections: `about`, `services`, `footer`, `testimonials`

### 2. Rich Text Strategy: "Inline Markdoc Strings"

To keep data in single JSON files, we use Keystatic's **Inline Markdoc** mode.

**
Keystatic Config:**

```typescript
// keystatic.config.ts
fields.markdoc.inline({ label: "Content" });
```

**Storage:**

- Saved as raw Markdoc/Markdown strings inside JSON
- Astro schema: `z.string()`

### 3. Image Strategy: "Asset References"

Images use Keystatic's image fields with specific directory structure.

**Keystatic Config:**

```typescript
fields.image({
  label: "Service Image",
  directory: "src/assets/images/services",
  publicPath: "@/assets/images/services/",
});
```

**Usage in Components:**

```astro
---
const { item } = Astro.props;
// Image is already processed by Astro
---

{item.image && <img src={item.image.src} alt={item.title} />}
```

### 4. Rendering Strategy: "Manual Parsing"

**CRITICAL: DO NOT USE DocumentRenderer**

We parse Markdoc strings manually because they are NOT AST objects.

**Correct Implementation:**

```astro
---
import Markdoc from "@markdoc/markdoc";

const contentString = "Your **markdoc** string";
const html = Markdoc.renderers.html(
  Markdoc.transform(Markdoc.parse(contentString)),
);
---

<div set:html={html} />
```

**Real Example (from AboutBio.astro):**

```astro
---
const col1Html = Markdoc.renderers.html(
  Markdoc.transform(Markdoc.parse(bio.col1)),
);
---

<div set:html={col1Html} />
```

### 5. Icon Strategy: "SVGR Mapping"

Icons are SVG files transformed to React components.

**File Location:** `src/assets/icons/*.svg`

**Import Pattern:**

```typescript
import TargetIcon from "@/assets/icons/target.svg?react";
```

**Component Usage:**

```astro
---
const Icons = {
  target: TargetIcon,
  board: BoardIcon,
  light: LightIcon,
};
const IconComponent = Icons[iconId];
---

<IconComponent className="w-12 h-12 text-brand-green" />
```

## Design Tokens (Tailwind v4)

### Colors

- `text-brand-green`, `bg-brand-green` - #00FF80
- `text-brand-dark`, `bg-brand-dark` - #2D3143
- `bg-brand-surface` - #F5F5F5

### Typography

- `font-brand-heading` - Bold + Italic (700)
- `font-book` - Regular (400)
- `font-bold` - Bold (700)
- `text-display` - 120px (hero headlines)
- `text-2xl` - 28px (section headers)
- `text-base` - 16px
- `text-sm` - 14px
- `text-xs` - 12px

### Layout

- `container` - Custom 1140px max-width
- `@` path alias to `src/`

## Project Structure

```
src/
├── assets/
│   ├── icons/          # SVG icons (transformed to React)
│   ├── images/         # Images organized by section
│   │   ├── about/
│   │   └── services/
│   └── *.svg           # Logo files
├── components/
│   ├── home/           # Homepage section components
│   ├── layout/         # Header, Footer, Layout
│   └── ui/             # Reusable UI components
├── content/
│   ├── global/         # Site-wide settings (footer.json)
│   └── sections/       # Section data (about.json, services.json)
├── layouts/            # Page layout templates
├── styles/             # Global styles, Tailwind config
└── utils/              # Utility functions
tests/                  # Future test location
scripts/                # Build scripts
dist/                   # Build output
```

## Code Patterns

### TypeScript Configuration

- Strict mode via `astro/tsconfigs/strict`
- JSX: `react-jsx` with React 18
- Path aliases: `@/*` → `./src/*`
- SVG types: `vite-plugin-svgr/client`

### Utility Functions

**cn.ts** - Tailwind class merging

```typescript
import { cn } from "@/utils/cn";
// Combines clsx and tailwind-merge for conditional classes
```

### Component Variants

**Button.tsx** - Uses class-variance-authority

- Variants: primary, outline, dark
- Sizes: default, sm, lg
- Supports both `<button>` and `<a>` elements

## Security Notes

- Never commit `.env` files or sensitive data
- Validate all external inputs and API responses
- Use Astro's built-in XSS protection for user content
- Keep dependencies updated regularly
- Keystatic uses local storage in dev, GitHub storage in production

## Development Workflow

1. Check for TypeScript errors: `astro check`
2. Build for production: `npm run build`
3. Preview production build: `npm run preview`
4. Clean up unused assets: `npm run cleanup:images:delete`
