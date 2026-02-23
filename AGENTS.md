# AGENTS.md - Development Guidelines for Sitovka

## ⚠️ Development Protocol

**IMPORTANT: AI agents should NEVER run `npm run dev`.** Development servers run in background. Use build/preview commands only.

## Build & Development Commands

### Core Commands

- `npm run dev` - **NEVER USE** - Dev server runs in background
- `npm run build` - Build production static site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro -- --help` - Get Astro CLI help
- `npm run cleanup:images` - List unused image assets
- `npm run cleanup:images:delete` - Delete unused image assets

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

- **Stackbit (Netlify Visual Editor)** - Git-based CMS via `@stackbit/cms-git`
- **marked** - Markdown parser for rich text content
- **Framer Motion** - Animation library
- **Embla Carousel** - Carousel component
- **Radix UI** - Headless UI components (@radix-ui/react-tabs)
- **class-variance-authority** - Component variant utility
- **tailwind-merge** - Tailwind class merging utility
- **@astrojs/netlify** - Netlify adapter (required for static output)
- **vite-plugin-svgr** - SVG to React component transform

### Critical Infrastructure

**Netlify Adapter (astro.config.mjs)**

- Required for Netlify deployment
- Static output with adapter support
- Server config includes `allowedHosts` for Visual Editor security

**SVG Transform**

- Import pattern: `import Icon from "@/assets/icons/icon.svg?react"`
- Components receive React props (className, etc.)
- See footer component for social icons example

**Path Alias**

- `@/*` maps to `./src/*` (tsconfig.json)
- Use for all internal imports

## 🧠 Content Architecture

### 1. Storage Pattern: "Unified JSON"

We use **Page-Based Singletons**. Each page has one JSON file containing all its section data.

- Location: `src/content/pages/*.json`
- Homepage: `src/content/pages/homepage.json`
- Additional content: `src/content/testimonials/*.json`, `src/content/global/*.json`
- Loader: `glob` pattern in `src/content.config.ts`

### 2. Rich Text Strategy: "Markdown Strings"

Content is stored as **plain markdown strings** in JSON fields.

**Stackbit Config:**

```typescript
// stackbit.config.ts
{ name: "description", type: "markdown" }
```

**Storage:**

- Saved as raw markdown strings inside JSON
- Example: `"col1": "Some **bold** text and\\nnewline"`

### 3. Rendering Strategy: "marked.parse()"

**CRITICAL: Simple marked usage, no AST parsing**

We use `marked` to convert markdown strings to HTML.

**Correct Implementation:**

```astro
---
import { mdToHtml } from "@/utils/markdown";

const contentHtml = mdToHtml(contentString);
---

<div set:html={contentHtml} />
```

**Utility Location:** `src/utils/markdown.ts`

### 4. Image Strategy: "Asset References"

Images use Stackbit's image fields with specific directory structure.

**Stackbit Config:**

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
// Image objects from Stackbit have src, width, height, format
---

{item.image && <img src={item.image.src} alt={item.title} />}
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

## Stackbit / Netlify Visual Editor

### Configuration

**File:** `stackbit.config.ts`

- `ssgName: "custom"` for Astro framework
- `GitContentSource` for Git-based content management
- Models defined for Homepage, Footer, Testimonials
- Dev command: `astro dev --port {PORT} --host --allowed-hosts all`

### Visual Editor Annotations

Components use `data-sb-*` attributes for inline editing:

```astro
<div data-sb-object-id="src/content/pages/homepage.json">
  <h2 data-sb-field-path="about.heading">Title</h2>
  <div data-sb-field-path="about.col1" set:html={col1Html} />
</div>
```

**Required attributes:**

- `data-sb-object-id` - Path to the JSON file (must match Git path)
- `data-sb-field-path` - Dot-notation path to the field within the JSON

### Content Structure

**Homepage (Unified):**

- Single file: `src/content/pages/homepage.json`
- Contains: hero, about, services, caseStudies, clients, contacts, prefooter
- Each section is an object within the main JSON

**Testimonials (Separate files):**

- Multiple files: `src/content/testimonials/{name}.json`
- Each testimonial is its own file
- Referenced from homepage via ID

**Global (Footer):**

- Single file: `src/content/global/footer.json`
- Site-wide configuration

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
│   │   ├── services/
│   │   └── hero/
│   └── *.svg           # Logo files
├── components/
│   ├── home/           # Homepage section components
│   ├── layout/         # Header, Footer, Layout
│   └── ui/             # Reusable UI components
├── content/
│   ├── global/         # Site-wide settings (footer.json)
│   ├── pages/          # Page content (homepage.json)
│   └── testimonials/   # Testimonial entries
├── layouts/            # Page layout templates
├── styles/             # Global styles, Tailwind config
└── utils/              # Utility functions
    ├── cn.ts           # Tailwind class merging
    └── markdown.ts     # Markdown to HTML conversion
tests/                  # Future test location
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

**markdown.ts** - Markdown to HTML

```typescript
import { mdToHtml } from "@/utils/markdown";
// Converts markdown strings to HTML using marked
```

### Component Variants

**Button.tsx** - Uses class-variance-authority

- Variants: primary, outline, dark
- Sizes: default, sm, lg
- Supports both `<button>` and `<a>` elements

## Security Notes

- Never commit `.env` files or sensitive data
- `allowedHosts` is restricted to known domains (security fix for CVE-2025-24010)
- Use Astro's built-in XSS protection for user content
- Keep dependencies updated regularly

## Development Workflow

1. Check for TypeScript errors: `astro check`
2. Build for production: `npm run build`
3. Preview production build: `npm run preview`
4. Clean up unused assets: `npm run cleanup:images:delete`
