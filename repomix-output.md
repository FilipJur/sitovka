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
public/
  favicon.svg
scripts/
  cleanup-images.js
src/
  assets/
    icons/
      board.svg
      facebook.svg
      hashtag.svg
      instagram.svg
      light.svg
      linkedin.svg
      target.svg
      x.svg
      youtube.svg
    images/
      about/
        bio/
          image.png
      services/
        items/
          1/
            image.jpg
          2/
            image.png
          3/
            image.jpg
    logo-white.svg
    logo.svg
  components/
    home/
      AboutBio.astro
      AboutUs.astro
      BenefitCard.astro
      BenefitsRow.astro
      ServiceCard.astro
      ServicesSection.astro
    layout/
      Footer.astro
      Header.astro
    ui/
      Button.tsx
      PositionOverlay.tsx
  content/
    global/
      footer.json
    pages/
      home.json
    testimonials/
      .gitkeep
  layouts/
    Layout.astro
  pages/
    index.astro
  styles/
    global.css
  types/
    svg.d.ts
  utils/
    cn.ts
  content.config.ts
  repomix-output.md
.gitignore
AGENTS.md
astro.config.mjs
IMAGE_UPLOAD_REFACTOR_GUIDE.md
keystatic.config.ts
package.json
prettier.config.cjs
README.md
tsconfig.json
```

# Files

## File: src/repomix-output.md
````markdown
This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
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
- Files matching these patterns are excluded: **/*.svg, .md/
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
assets/
  images/
    about/
      bio/
        image.png
    services/
      items/
        1/
          image.jpg
        2/
          image.png
        3/
          image.jpg
components/
  home/
    AboutBio.astro
    AboutUs.astro
    BenefitCard.astro
    BenefitsRow.astro
    ServiceCard.astro
    ServicesSection.astro
  layout/
    Footer.astro
    Header.astro
  ui/
    Button.tsx
    PositionOverlay.tsx
content/
  global/
    footer.json
  pages/
    home.json
  sections/
    services/
      items/
        0/
          description.mdoc
        1/
          description.mdoc
        2/
          description.mdoc
        3/
          description.mdoc
    about.json
    services.json
  testimonials/
    .gitkeep
layouts/
  Layout.astro
lib/
  utils.ts
pages/
  index.astro
styles/
  global.css
types/
  svg.d.ts
utils/
  cn.ts
content.config.ts
```

# Files

## File: components/home/AboutBio.astro
```
---
import Markdoc from "@markdoc/markdoc";
import { Image } from "astro:assets";

interface Props {
  bio: {
    heading: string;
    col1: string; // Inline Markdoc string
    col2: string; // Inline Markdoc string
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
  };
}

const { bio } = Astro.props;

// Render Markdoc strings to HTML
const col1Html = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(bio.col1)));
const col2Html = Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(bio.col2)));

// Determine layout based on image availability
const hasImage = bio.image !== undefined && bio.image !== null;

// Create unified content array
const contentItems = [
  { type: 'text' as const, html: col1Html },
  { type: 'text' as const, html: col2Html },
  ...(hasImage ? [{
    type: 'image' as const,
    src: bio.image?.src || '',
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
            {bio.image && (
              <Image
                {...bio.image}
                alt="Bio image"
                class="w-full h-auto object-contain -mb-24 lg:-mb-32 scale-110 origin-bottom"
              />
            )}
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

## File: components/home/AboutUs.astro
```
---
import { getEntry } from "astro:content";
import BenefitsRow from "./BenefitsRow.astro";
import AboutBio from "./AboutBio.astro";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";
import { PositionOverlay } from "@/components/ui/PositionOverlay";

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
  <PositionOverlay bottom="-10px">
    <HashtagIcon className="w-21 h-auto text-brand-green" />
  </PositionOverlay>
</section>
```

## File: components/home/BenefitCard.astro
```
---
import TargetIcon from "@/assets/icons/target.svg?react";
import BoardIcon from "@/assets/icons/board.svg?react";
import LightIcon from "@/assets/icons/light.svg?react";

interface Props {
  iconId: "target" | "board" | "light";
  hashtag: string;
  title: string;
  description: string;
}

const { iconId, hashtag, title, description } = Astro.props;

// Map the string ID to the actual SVGR component
const Icons = {
  target: TargetIcon,
  board: BoardIcon,
  light: LightIcon,
};

const IconComponent = Icons[iconId];
---

<div class="flex flex-row gap-5">
  <!-- Icon: 48px size as per w-12 -->
  <div class="text-brand-green h-12 w-12 min-w-fit">
    <IconComponent className="w-full h-full" />
  </div>

  <div class="space-y-5">
    <!-- H2: 28px (text-2xl) Bold Italic -->
    <h2 class="text-2xl font-brand-heading leading-tight text-brand-dark">
      <span class="text-brand-green">{hashtag}</span>
      {title}
    </h2>

    <!-- H3: 14px (text-sm) Book weight -->
    <h3 class="text-sm font-book text-brand-dark leading-relaxed">
      {description}
    </h3>
  </div>
</div>
```

## File: components/home/BenefitsRow.astro
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

## File: components/home/ServiceCard.astro
```
---
import Markdoc from "@markdoc/markdoc";
import { Image } from "astro:assets";

interface Props {
  item: {
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
    title: string;
    description?: string;
  };
}

const { item } = Astro.props;

// Render Markdoc description to HTML
const descriptionHtml = item.description
  ? Markdoc.renderers.html(Markdoc.transform(Markdoc.parse(item.description)))
  : "";
---

<div class="flex flex-col space-y-5">
  {
    item.image ? (
      <Image
        {...item.image}
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
    {
      item.description && (
        <div
          class="text-sm font-book text-brand-dark leading-relaxed"
          set:html={descriptionHtml}
        />
      )
    }
  </div>
</div>
```

## File: components/home/ServicesSection.astro
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

## File: components/layout/Footer.astro
```
---
// 1. Import Logo
import LogoWhite from "@/assets/logo-white.svg?react";

// 2. Import Social Icons from src/assets/icons/
import FacebookIcon from "@/assets/icons/facebook.svg?react";
import InstagramIcon from "@/assets/icons/instagram.svg?react";
import XIcon from "@/assets/icons/x.svg?react";
import LinkedInIcon from "@/assets/icons/linkedin.svg?react";
import YoutubeIcon from "@/assets/icons/youtube.svg?react";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";

// 3. Fetch footer data from CMS
import { getEntry } from "astro:content";
const footerEntry = await getEntry("footer", "footer");
const {
  company = {},
  legal = {},
  bank = {},
  socials = {},
} = footerEntry?.data || {};

// Social links data array
const socialLinksData = [
  {
    key: "facebook",
    href: socials?.facebook,
    icon: FacebookIcon,
    label: "Facebook",
  },
  {
    key: "instagram",
    href: socials?.instagram,
    icon: InstagramIcon,
    label: "Instagram",
  },
  { key: "x", href: socials?.x, icon: XIcon, label: "X" },
  {
    key: "linkedin",
    href: socials?.linkedin,
    icon: LinkedInIcon,
    label: "LinkedIn",
  },
  {
    key: "youtube",
    href: socials?.youtube,
    icon: YoutubeIcon,
    label: "YouTube",
  },
].filter((link) => link.href);

// Links from JSON (Col 4)
const footerLinks = [
  { name: "Úvod", href: "#" },
  { name: "Co umíme", href: "#co-umime" },
  { name: "Reference", href: "#reference" },
];
---

<!--
  Layout: Footer Card Style
  - rounded-[60px]: As requested
  - bg-brand-dark: #2D3143
  - pt-[90px]: Top padding as requested
-->
<footer
  class="bg-brand-dark text-white rounded-[60px] pt-22.5 overflow-hidden relative"
>
  <div class="container mx-auto px-10">
    <!-- ROW 1: Logo on the left -->
    <div class="flex justify-start">
      <a href="#" class="shrink-0 group" aria-label="Domů">
        <LogoWhite className="h-10 w-auto" aria-hidden="true" />
      </a>
    </div>

    <!-- GAP: 28px -->
    <div class="h-7"></div>

    <!-- ROW 2: 4 Columns -->
    <div
      class="ml-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr_1fr] gap-8 text-sm font-book leading-relaxed"
    >
      <!-- Col 1: Address -->
      <div class="space-y-1">
        <p class="text-base font-brand-heading">{company?.name || ""}</p>
        <p>{company?.street || ""}</p>
        <p>{company?.city || ""}</p>
      </div>

      <!-- Col 2: Legal -->
      <div class="space-y-1">
        <p>IČO: {legal?.ico || ""}</p>
        <p>DIČ: {legal?.dic || ""}</p>
        <p>{legal?.court || ""}</p>
      </div>

      <!-- Col 3: Bank -->
      <div class="space-y-1">
        <p>Číslo účtu: {bank?.accountNumber || ""}</p>
        <p>SWIFT: {bank?.swift || ""}</p>
        {bank?.iban && <p>IBAN: {bank?.iban}</p>}
      </div>

      <!-- Col 4: Links (Bold Italic 16px) -->
      <nav class="flex flex-col gap-2 md:items-end">
        {
          footerLinks.map((link) => (
            <a
              href={link.href}
              class="text-base font-brand-heading text-white hover:text-brand-green transition-colors w-fit"
            >
              {link.name}
            </a>
          ))
        }
      </nav>
    </div>

    <!-- GAP: 28px -->
    <div class="h-7"></div>

    <!-- ROW 3: Social Icons -->
    <div
      class="flex max-w-[300px] mx-auto items-center justify-between flex-wrap"
    >
      {
        socialLinksData.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            class="rounded-full border border-transparent hover:border-brand-green transition-all p-4"
          >
            <link.icon className="w-4 h-4" />
          </a>
        ))
      }
    </div>

    <div class="h-12"></div>

    <!-- ROW 4: Copyright | SVG | Cookies -->
    <div
      class="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-book -mb-6"
    >
      <span>© 2025 Síťovka</span>

      <!-- The small hashtag SVG requested in description -->
      <HashtagIcon className="w-20 h-25 text-brand-green" />

      <a href="/cookies" class="hover:text-brand-green transition-colors">
        Používáme cookies
      </a>
    </div>
  </div>
</footer>
```

## File: components/layout/Header.astro
```
---
// Import the Logo as a React component
// Note: We use the '?react' suffix because of vite-plugin-svgr
import Logo from "@/assets/logo.svg?react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface NavItem {
  name: string;
  href: string;
  variant?: "primary" | "outline" | "dark";
}

const navItems: NavItem[] = [
  { name: "Úvod", href: "#" },
  { name: "Co umíme", href: "#co-umime", variant: "outline" },
  { name: "Reference", href: "#reference", variant: "primary" },
  { name: "Kontakty", href: "#kontakty" },
];
---

<header
  class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white"
>
  <div class="container h-36 flex items-center justify-between">
    <!--
      1. LOGO
      Using SVGR component allows us to style the internal paths.
      The 'text-brand-dark' class fills the SVG because your logo.svg likely uses fill attributes.
      We add 'group' to animate color on hover.
    -->
    <a href="#" class="shrink-0 group" aria-label="Domů">
      <Logo className="h-10 w-auto" aria-hidden="true" />
    </a>

    <!--
      2. NAVIGATION & CTA
      Layout: Flex Row with gap-10
    -->
    <div class="flex items-center gap-10">
      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center">
        {
          navItems.map((item, index) => {
            const isLast = index === navItems.length - 1;
            const nextItem = navItems[index + 1];
            const needsMargin =
              !isLast &&
              (item.variant === undefined || nextItem.variant === undefined);
            const buttonGap = !isLast && item.variant && nextItem.variant;

            return item.variant ? (
              <Button
                href={item.href}
                variant={item.variant}
                textColor={
                  item.variant === "outline" ? "brand-dark" : undefined
                }
                className={cn(
                  "py-2.5",
                  needsMargin && "mr-5",
                  buttonGap && "mr-px",
                )}
              >
                {item.name}
              </Button>
            ) : (
              <a
                href={item.href}
                class={cn(
                  "text-base font-bold italic text-brand-dark hover:text-brand-green transition-colors",
                  needsMargin && "mr-5",
                )}
              >
                {item.name}
              </a>
            );
          })
        }
      </nav>

      <!--
        CTA BUTTON
        Using standardized Button component
      -->
      <div class="hidden md:block">
        <Button href="#poptavka" variant="dark" className="py-2.5">
          Poptávka
        </Button>
      </div>

      <!-- Mobile Menu Trigger (Inline SVG for now) -->
      <button
        class="md:hidden text-brand-dark p-2 hover:text-brand-green transition-colors"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"></path>
        </svg>
      </button>
    </div>
  </div>
</header>
```

## File: components/ui/Button.tsx
```typescript
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn"; // Importing from our local utils

// Defining the rules based on your Design System
const buttonVariants = cva(
  // Base styles (Shared by all)
  "inline-flex items-center justify-center rounded-full text-base font-bold italic transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none font-brand-heading",
  {
    variants: {
      variant: {
        // 1. Primary (Fill) - Green BG with matching border
        primary:
          "bg-brand-green text-brand-dark border-2 border-brand-green hover:bg-brand-dark hover:text-white hover:border-brand-dark hover:shadow-lg",

        // 2. Outline - Transparent BG with configurable border/text
        outline:
          "bg-transparent border-2 hover:bg-brand-green hover:text-brand-dark",

        // 3. Dark (From your Header)
        dark: "bg-brand-dark text-white border-2 border-brand-dark hover:bg-brand-green hover:text-brand-dark hover:border-brand-green hover:shadow-lg",
      },
      size: {
        default: "px-8 py-3", // Your standard padding
        sm: "px-6 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string; // If provided, renders as <a>
  textColor?:
    | "brand-green"
    | "brand-dark"
    | "brand-surface"
    | "white"
    | "black"; // Text color for outline variant
  borderColor?:
    | "brand-green"
    | "brand-dark"
    | "brand-surface"
    | "white"
    | "black"; // Border color for primary variant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      children,
      textColor,
      borderColor,
      ...props
    },
    ref,
  ) => {
    // Build dynamic classes for outline variant
    const outlineClasses =
      variant === "outline"
        ? cn(
            textColor ? `text-${textColor}` : "text-brand-green",
            borderColor ? `border-${borderColor}` : "border-brand-green",
          )
        : "";

    // Build dynamic classes for primary variant border
    const primaryBorderClass =
      variant === "primary" && borderColor ? `border-${borderColor}` : "";

    // Logic: Render as <a> link if href is present
    if (href) {
      return (
        <a
          href={href}
          className={cn(
            buttonVariants({ variant, size, className }),
            outlineClasses,
            primaryBorderClass,
          )}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    // Logic: Render as standard <button> otherwise
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          outlineClasses,
          primaryBorderClass,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
```

## File: components/ui/PositionOverlay.tsx
```typescript
import React from "react";
import { cn } from "../../utils/cn";

interface PositionOverlayProps {
  children: React.ReactNode;
  bottom?: string;
  left?: string;
  className?: string;
  pointerEvents?: "none" | "auto";
}

export const PositionOverlay: React.FC<PositionOverlayProps> = ({
  children,
  bottom = "0",
  left = "1/2",
  className,
  pointerEvents = "none",
}) => {
  const positionClasses = cn(
    "absolute",
    bottom === "0"
      ? "bottom-0"
      : bottom?.includes("px")
        ? ""
        : `bottom-${bottom}`,
    left === "1/2" ? "left-1/2" : left?.includes("px") ? "" : `left-${left}`,
    left === "1/2" && "-translate-x-1/2",
    bottom === "0" && "translate-y-1/2",
    pointerEvents === "none" ? "pointer-events-none" : "pointer-events-auto",
    className,
  );

  const inlineStyles: React.CSSProperties = {
    ...(bottom?.includes("px") && { bottom }),
    ...(left?.includes("px") && { left: left === "1/2" ? "50%" : left }),
  };

  return (
    <div className={positionClasses} style={inlineStyles}>
      {children}
    </div>
  );
};
```

## File: content/global/footer.json
```json
{
  "company": {
    "name": "Síťovka.net s.r.o.",
    "street": "Jaurisova 515/4",
    "city": "140 00 Praha 4"
  },
  "legal": {
    "ico": "24164879",
    "dic": "CZ24164879",
    "court": "Vedená u Městského soudu v Praze"
  },
  "bank": {
    "accountNumber": "6582068001/5500",
    "swift": "RZBCCZPP",
    "iban": ""
  },
  "socials": {
    "facebook": "https://facebook.com/",
    "instagram": "https://instagram.com/",
    "x": "https://x.com/",
    "linkedin": "https://linkedin.com/",
    "youtube": "https://youtube.com/"
  }
}
```

## File: content/pages/home.json
```json
{
  "heroHeadline": "Marketing, který zraje",
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
  ]
}
```

## File: content/sections/services/items/0/description.mdoc
```
Specializujeme se na LinkedIn – tvoříme **obsah na míru** podle cílové skupiny a tone of voice, propojujeme kreativitu s daty a strategickým myšlením. Jsme lidský partner vaší značky, ne jen dodavatel.
```

## File: content/sections/about.json
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
    "image": "@/assets/images/about/bio/image.png"
  }
}
```

## File: content/sections/services.json
```json
{
  "headingHighlight": "Co umíme?",
  "headingRemainder": "Tvoříme obsah, který zaujme, vzdělává nebo prodává.",
  "introText": "Od nápadu po publikaci tvoříme obsah, který dává smysl lidem i algoritmům. Specializujeme se na **LinkedIn –** budujeme autentické **osobní i firemní značky**, připravujeme texty, vizuály, strategie a kampaně s výsledky. Zvládáme i **další sítě**, blogy, články a spolupráce s influencery či UGC tvůrci, každý formát využíváme  k zapamatovatelnému vyprávění vašeho příběhu.\n",
  "items": [
    {
      "title": "#v čem jsme jiní"
    },
    {
      "image": "@/assets/images/services/items/1/image.jpg",
      "title": "#obsah"
    },
    {
      "image": "@/assets/images/services/items/2/image.png",
      "title": "#cílení"
    },
    {
      "image": "@/assets/images/services/items/3/image.jpg",
      "title": "#technologie"
    }
  ]
}
```

## File: layouts/Layout.astro
```
---
import "../styles/global.css";
// 1. Import the new component
import Header from "@/components/layout/Header.astro";
import Footer from "@/components/layout/Footer.astro";

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Agency Landing Page",
  description = "Marketing and Creative Agency",
} = Astro.props;
---

<!doctype html>
<html lang="cs" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Adobe Fonts / Typekit -->
    <link rel="stylesheet" href="https://use.typekit.net/rsm7rew.css" />

    <title>{title}</title>
  </head>
  <body class="bg-white text-brand-dark antialiased mx-5 mb-5">
    <!-- 2. Mount the Header -->
    <Header />

    <!-- 3. Add padding-top to main so content isn't hidden behind fixed header -->
    <main class="pt-36">
      <slot />
    </main>

    <!-- 4. Mount the Footer -->
    <Footer />
  </body>
</html>
```

## File: lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: pages/index.astro
```
---
import Layout from "../layouts/Layout.astro";
import AboutUs from "../components/home/AboutUs.astro";
import ServicesSection from "../components/home/ServicesSection.astro";
---

<Layout title="Sítovka.net | Marketingová Agentura">
  <main>
    <!-- We will add the Hero here later -->

    <!-- About Us Section (Benefits + Bio) -->
    <AboutUs />

    <!-- Services Section (Co umíme) -->
    <ServicesSection />

    <!-- Other sections will follow -->
  </main>
</Layout>
```

## File: styles/global.css
```css
@import "tailwindcss";

@theme {
  /* --- LAYOUT --- */
  --breakpoint-2xl: 71.25rem; /* 1140px - Custom container width */

  /* --- COLORS --- */
  --color-brand-green: #00ff80; /* Primary neon green */
  --color-brand-dark: #2d3143; /* Primary dark blue/charcoal */
  --color-brand-surface: #f5f5f5; /* Light gray backgrounds */

  /* --- TYPOGRAPHY: SIZES --- */
  /* These override/extend standard utilities like text-xs, text-2xl */
  --text-xs: 12px; /* Copyright/metadata */
  --text-sm: 14px; /* Body text */
  --text-base: 16px; /* Navigation, buttons, tags */
  --text-lg: 18px; /* Lead paragraphs */
  --text-2xl: 28px; /* Section headers */
  --text-display: 120px; /* Hero headlines */

  /* --- TYPOGRAPHY: FAMILY & WEIGHTS --- */
  /* Setting this as --font-sans makes it the default font for the site */
  --font-sans: "gotham", sans-serif;

  --font-weight-book: 400; /* Usage: font-book */
  --font-weight-bold: 700; /* Usage: font-bold */
}

/* --- CUSTOM CONTAINER UTILITY --- */
/* Override default container to use 1140px (71.25rem) as the default max-width */
@utility container {
  width: 100%;
  margin-inline: auto;
  padding-inline: 2rem;
  @media (width >= 40rem) {
    max-width: 40rem;
  }
  @media (width >= 48rem) {
    max-width: 48rem;
  }
  @media (width >= 64rem) {
    max-width: 64rem;
  }
  @media (width >= 80rem) {
    max-width: 71.75rem; /* 1140px - Custom default width */
  }
  @media (width >= 96rem) {
    max-width: 71.75rem; /* 1140px - Keep consistent at larger breakpoints */
  }
}

/* --- UTILITY CLASSES --- */
@layer utilities {
  .font-brand-heading {
    font-weight: 700;
    font-style: italic;
  }
}

/* --- BASE STYLES --- */
@layer base {
  body {
    /* Ensures the font applies globally */
    font-family: var(--font-sans);
    font-weight: var(--font-weight-book);
  }
}
::selection {
  background-color: var(--color-brand-green);
  color: var(--color-brand-dark);
}
```

## File: types/svg.d.ts
```typescript
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

## File: utils/cn.ts
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## File: content.config.ts
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
        col2: z.string(),
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
      introText: z.string(),
      items: z.array(
        z.object({
          image: image().optional(),
          title: z.string(),
          description: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { footer, homepage, testimonials, about, services };
```
````

## File: scripts/cleanup-images.js
````javascript
#!/usr/bin/env node

/**
 * Image Cleanup Script
 *
 * Scans src/assets/images for unused image files and optionally removes them.
 * Images are considered "used" if they're referenced in any JSON file under src/content.
 */

import {
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
} from "fs";
import { join, relative, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const ROOT_DIR = join(__dirname, "..");
const IMAGES_DIR = join(ROOT_DIR, "src", "assets", "images");
const CONTENT_DIR = join(ROOT_DIR, "src", "content");

// Image file extensions to consider
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
  ".tiff",
];

// ANSI color codes for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(colors.red, `❌ Error: ${message}`);
}

function success(message) {
  log(colors.green, `✅ ${message}`);
}

function info(message) {
  log(colors.cyan, `ℹ️  ${message}`);
}

function warning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

/**
 * Recursively find all files in a directory
 */
function findFiles(dir, extensions = []) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (stats.isFile()) {
      if (
        extensions.length === 0 ||
        extensions.includes(extname(item).toLowerCase())
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Find all image files in the assets directory
 */
function findAllImageFiles() {
  if (!existsSync(IMAGES_DIR)) {
    error(`Images directory not found: ${IMAGES_DIR}`);
    return [];
  }

  return findFiles(IMAGES_DIR, IMAGE_EXTENSIONS).map((path) => ({
    fullPath: path,
    relativePath: relative(ROOT_DIR, path),
  }));
}

/**
 * Find all JSON files in content directory
 */
function findAllJsonFiles() {
  if (!existsSync(CONTENT_DIR)) {
    error(`Content directory not found: ${CONTENT_DIR}`);
    return [];
  }

  return findFiles(CONTENT_DIR, [".json"]).map((path) => path);
}

/**
 * Extract image path from a JSON file
 */
function extractImagePathsFromJson(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);
    const paths = [];

    function findImagePaths(obj) {
      if (typeof obj !== "object" || obj === null) {
        return;
      }

      // Check if this object has an image property
      if (obj.image && typeof obj.image === "string") {
        paths.push(obj.image);
      }

      // Recursively search nested objects and arrays
      if (Array.isArray(obj)) {
        obj.forEach((item) => findImagePaths(item));
      } else {
        Object.values(obj).forEach((value) => findImagePaths(value));
      }
    }

    findImagePaths(data);
    return paths;
  } catch (err) {
    warning(`Could not parse JSON file: ${filePath}`);
    return [];
  }
}

/**
 * Get all image paths referenced in content JSON files
 */
function findReferencedImagePaths() {
  const jsonFiles = findAllJsonFiles();
  const referencedPaths = new Set();

  for (const jsonFile of jsonFiles) {
    const paths = extractImagePathsFromJson(jsonFile);
    paths.forEach((path) => referencedPaths.add(path));
  }

  return Array.from(referencedPaths);
}

/**
 * Normalize path for comparison
 */
function normalizePath(path) {
  return path
    .replace(/\\/g, "/") // Normalize Windows paths
    .replace(/^~\//, "@/") // Normalize tilde paths to @
    .replace(/^src\//, "@/"); // Make src/ paths relative to root
}

/**
 * Check if an image file is referenced in content
 */
function isImageReferenced(imageFile, referencedPaths) {
  const normalizedImagePath = normalizePath(imageFile.relativePath);

  for (const referencedPath of referencedPaths) {
    // Check exact match
    if (normalizePath(referencedPath) === normalizedImagePath) {
      return true;
    }

    // Check if referenced path matches the image file name
    const imageFileName = imageFile.relativePath.split("/").pop();
    if (referencedPath.includes(imageFileName)) {
      return true;
    }
  }

  return false;
}

/**
 * Ask for user confirmation
 */
async function askForConfirmation(question) {
  // Check if running in CI or non-interactive environment
  if (!process.stdin.isTTY || process.env.CI) {
    return false;
  }

  const readline = await import("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question + " (yes/no): ", (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "yes" || answer.toLowerCase() === "y");
    });
  });
}

/**
 * Delete unused image files
 */
async function deleteUnusedImages(unusedImages) {
  if (unusedImages.length === 0) {
    success("No unused images to delete.");
    return;
  }

  info(`Found ${unusedImages.length} unused image(s):`);
  unusedImages.forEach((img) => {
    log(colors.magenta, `  - ${img.relativePath}`);
  });

  warning("This action cannot be undone!");

  const confirmed = await askForConfirmation(
    "Are you sure you want to delete these files?",
  );

  if (!confirmed) {
    info("Operation cancelled. No files were deleted.");
    return;
  }

  let deletedCount = 0;
  for (const img of unusedImages) {
    try {
      unlinkSync(img.fullPath);
      deletedCount++;
      success(`Deleted: ${img.relativePath}`);
    } catch (err) {
      error(`Failed to delete: ${img.relativePath} - ${err.message}`);
    }
  }

  success(`Successfully deleted ${deletedCount} unused image(s).`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const shouldDelete = args.includes("--delete") || args.includes("-d");

  log(colors.bold, "\n🔍 Scanning for unused images...\n");

  // Find all image files
  const allImages = findAllImageFiles();

  if (allImages.length === 0) {
    info("No image files found in assets directory.");
    process.exit(0);
  }

  info(`Found ${allImages.length} total image(s) in assets directory.`);

  // Find all referenced image paths
  const referencedPaths = findReferencedImagePaths();
  info(`Found ${referencedPaths.length} image reference(s) in content files.`);

  // Find unused images
  const unusedImages = allImages.filter(
    (img) => !isImageReferenced(img, referencedPaths),
  );

  if (unusedImages.length === 0) {
    success(
      "\n✨ No unused images found! All images are referenced in content.",
    );
    process.exit(0);
  }

  log(colors.yellow, "\n⚠️ Found unused images:\n");

  unusedImages.forEach((img) => {
    log(colors.red, `  ✗ ${img.relativePath}`);
  });

  log(colors.cyan, `\nTotal: ${unusedImages.length} unused image(s)\n`);

  if (shouldDelete) {
    log(colors.bold, "🗑️ Deleting unused images...\n");

    // If --delete flag is used without CI, ask for confirmation
    if (!process.env.CI && process.stdin.isTTY) {
      await deleteUnusedImages(unusedImages);
    } else {
      // In CI, delete without confirmation
      info("Running in CI mode, deleting without confirmation...");

      let deletedCount = 0;
      for (const img of unusedImages) {
        try {
          unlinkSync(img.fullPath);
          deletedCount++;
          success(`Deleted: ${img.relativePath}`);
        } catch (err) {
          error(`Failed to delete: ${img.relativePath} - ${err.message}`);
        }
      }

      success(`\n✨ Successfully deleted ${deletedCount} unused image(s).`);
    }
  } else {
    log(colors.cyan, "\n💡 To delete these files, run:");
    log(colors.bold, "   npm run cleanup:images -- --delete\n");
    process.exit(0);
  }
}

// Run the script
main().catch((err) => {
  error(`Uncaught error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
````

## File: src/assets/icons/board.svg
````
<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 40.05C2.9 40.05 1.95833 39.6583 1.175 38.875C0.391667 38.0917 0 37.15 0 36.05V8.05C0 6.95 0.391667 6.00833 1.175 5.225C1.95833 4.44167 2.9 4.05 4 4.05H21.85L17.85 8.05H4V36.05H32V22.15L36 18.15V36.05C36 37.15 35.6083 38.0917 34.825 38.875C34.0417 39.6583 33.1 40.05 32 40.05H4ZM12 28.05V19.55L30.35 1.2C30.75 0.8 31.2 0.5 31.7 0.3C32.2 0.1 32.7 0 33.2 0C33.7333 0 34.2417 0.1 34.725 0.3C35.2083 0.5 35.65 0.8 36.05 1.2L38.85 4.05C39.2167 4.45 39.5 4.89167 39.7 5.375C39.9 5.85833 40 6.35 40 6.85C40 7.35 39.9083 7.84167 39.725 8.325C39.5417 8.80833 39.25 9.25 38.85 9.65L20.5 28.05H12ZM16 24.05H18.8L30.4 12.45L29 11.05L27.55 9.65L16 21.2V24.05Z" fill="#2D3143"/>
</svg>
````

## File: src/assets/icons/facebook.svg
````
<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.95858 11.4904V19.7647H3.15767V11.4904H0V8.1354H3.15767V6.91472C3.15767 2.38287 5.05082 0 9.05639 0C10.2844 0 10.5914 0.197355 11.2638 0.358162V3.67664C10.511 3.54507 10.299 3.47198 9.51688 3.47198C8.58858 3.47198 8.09154 3.73512 7.63836 4.25409C7.18517 4.77306 6.95858 5.67212 6.95858 6.95858V8.14271H11.2638L10.1089 11.4977H6.95858V11.4904Z" fill="white"/>
</svg>
````

## File: src/assets/icons/hashtag.svg
````
<svg width="85" height="65" viewBox="0 0 85 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M65.5669 15.3043L59.492 32.7609H42.2058L48.2806 15.3043H65.5669ZM36.8307 48.0652H54.1169L48.0421 65.7609H30.7558L36.8307 48.0652ZM75.2357 32.7609L81.3106 15.3043L70.942 0H53.6558L32.5529 15.3043L26.478 32.7609H14.0739L10.0187 48.0652H21.1029L15.0281 65.7609H4.05519L0 81.0652H9.65295L3.45089 99H19.1946L25.3966 81.0652H42.6829L36.4808 99H52.2245L58.4266 81.0652H70.942L74.9972 65.7609H63.7858L69.8606 48.0652H80.9448L85 32.7609H75.2198H75.2357Z" fill="#00FF80"/>
</svg>
````

## File: src/assets/icons/instagram.svg
````
<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.1095 16.9412H2.83165C1.2732 16.9412 0 15.668 0 14.1095V2.83165C0 1.2732 1.2732 0 2.83165 0H14.1095C15.668 0 16.9412 1.2732 16.9412 2.83165V14.1095C16.9412 15.6749 15.6749 16.9412 14.1095 16.9412Z" fill="white"/>
<path d="M8.47433 12.8227C7.31245 12.8227 6.22014 12.3704 5.39917 11.5495C4.5782 10.7285 4.12598 9.63621 4.12598 8.47433C4.12598 7.31245 4.5782 6.22014 5.39917 5.39917C6.22014 4.57821 7.31245 4.12598 8.47433 4.12598C9.63621 4.12598 10.7285 4.57821 11.5495 5.39917C12.3705 6.22014 12.8227 7.31245 12.8227 8.47433C12.8227 9.63621 12.3705 10.7285 11.5495 11.5495C10.7216 12.3704 9.63621 12.8227 8.47433 12.8227ZM8.47433 5.05131C6.58888 5.05131 5.0513 6.58193 5.0513 8.47433C5.0513 10.3598 6.58192 11.8973 8.47433 11.8973C10.3598 11.8973 11.8973 10.3667 11.8973 8.47433C11.8904 6.58888 10.3598 5.05131 8.47433 5.05131Z" fill="#2D3143"/>
<path d="M13.6699 3.98329C14.131 3.98329 14.5048 3.60949 14.5048 3.14838C14.5048 2.68728 14.131 2.31348 13.6699 2.31348C13.2088 2.31348 12.835 2.68728 12.835 3.14838C12.835 3.60949 13.2088 3.98329 13.6699 3.98329Z" fill="#2D3143"/>
</svg>
````

## File: src/assets/icons/light.svg
````
<svg width="29" height="40" viewBox="0 0 29 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 40C13.6333 40 12.85 39.7917 12.15 39.375C11.45 38.9583 10.9 38.4 10.5 37.7C9.4 37.7 8.45833 37.3083 7.675 36.525C6.89167 35.7417 6.5 34.8 6.5 33.7V26.6C4.53333 25.3 2.95833 23.5833 1.775 21.45C0.591667 19.3167 0 17 0 14.5C0 10.4667 1.40833 7.04167 4.225 4.225C7.04167 1.40833 10.4667 0 14.5 0C18.5333 0 21.9583 1.40833 24.775 4.225C27.5917 7.04167 29 10.4667 29 14.5C29 17.0667 28.4083 19.4 27.225 21.5C26.0417 23.6 24.4667 25.3 22.5 26.6V33.7C22.5 34.8 22.1083 35.7417 21.325 36.525C20.5417 37.3083 19.6 37.7 18.5 37.7C18.1 38.4 17.55 38.9583 16.85 39.375C16.15 39.7917 15.3667 40 14.5 40ZM10.5 33.7H18.5V31.9H10.5V33.7ZM10.5 29.9H18.5V28H10.5V29.9ZM10.1 24H13V18.6L8.6 14.2L10.7 12.1L14.5 15.9L18.3 12.1L20.4 14.2L16 18.6V24H18.9C20.7 23.1333 22.1667 21.8583 23.3 20.175C24.4333 18.4917 25 16.6 25 14.5C25 11.5667 23.9833 9.08333 21.95 7.05C19.9167 5.01667 17.4333 4 14.5 4C11.5667 4 9.08333 5.01667 7.05 7.05C5.01667 9.08333 4 11.5667 4 14.5C4 16.6 4.56667 18.4917 5.7 20.175C6.83333 21.8583 8.3 23.1333 10.1 24Z" fill="#2D3143"/>
</svg>
````

## File: src/assets/icons/linkedin.svg
````
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.46295 6.49951H0.333008V19.6697H4.46295V6.49951Z" fill="white"/>
<path d="M15.6346 6.21417C15.4824 6.19513 15.3206 6.18562 15.1588 6.1761C12.8465 6.08094 11.5428 7.45124 11.086 8.04124C10.9623 8.20301 10.9052 8.29817 10.9052 8.29817V6.53771H6.95605V19.7078H10.9052H11.086C11.086 18.3661 11.086 17.0339 11.086 15.6921C11.086 14.9689 11.086 14.2457 11.086 13.5224C11.086 12.6279 11.0194 11.6763 11.4666 10.858C11.8473 10.1728 12.5324 9.83024 13.3032 9.83024C15.5871 9.83024 15.6346 11.8952 15.6346 12.0855C15.6346 12.095 15.6346 12.1046 15.6346 12.1046V19.7649H19.7646V11.172C19.7646 8.23156 18.2706 6.49964 15.6346 6.21417Z" fill="white"/>
<path d="M2.39803 4.79606C3.72242 4.79606 4.79606 3.72243 4.79606 2.39803C4.79606 1.07363 3.72242 0 2.39803 0C1.07363 0 0 1.07363 0 2.39803C0 3.72243 1.07363 4.79606 2.39803 4.79606Z" fill="white"/>
</svg>
````

## File: src/assets/icons/target.svg
````
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 40C17.2333 40 14.6333 39.475 12.2 38.425C9.76667 37.375 7.65 35.95 5.85 34.15C4.05 32.35 2.625 30.2333 1.575 27.8C0.525 25.3667 0 22.7667 0 20C0 17.2333 0.525 14.6333 1.575 12.2C2.625 9.76667 4.05 7.65 5.85 5.85C7.65 4.05 9.76667 2.625 12.2 1.575C14.6333 0.525 17.2333 0 20 0C22.7667 0 25.3667 0.525 27.8 1.575C30.2333 2.625 32.35 4.05 34.15 5.85C35.95 7.65 37.375 9.76667 38.425 12.2C39.475 14.6333 40 17.2333 40 20C40 22.7667 39.475 25.3667 38.425 27.8C37.375 30.2333 35.95 32.35 34.15 34.15C32.35 35.95 30.2333 37.375 27.8 38.425C25.3667 39.475 22.7667 40 20 40ZM20 36C24.4667 36 28.25 34.45 31.35 31.35C34.45 28.25 36 24.4667 36 20C36 15.5333 34.45 11.75 31.35 8.65C28.25 5.55 24.4667 4 20 4C15.5333 4 11.75 5.55 8.65 8.65C5.55 11.75 4 15.5333 4 20C4 24.4667 5.55 28.25 8.65 31.35C11.75 34.45 15.5333 36 20 36ZM20 32C16.6667 32 13.8333 30.8333 11.5 28.5C9.16667 26.1667 8 23.3333 8 20C8 16.6667 9.16667 13.8333 11.5 11.5C13.8333 9.16667 16.6667 8 20 8C23.3333 8 26.1667 9.16667 28.5 11.5C30.8333 13.8333 32 16.6667 32 20C32 23.3333 30.8333 26.1667 28.5 28.5C26.1667 30.8333 23.3333 32 20 32ZM20 28C22.2 28 24.0833 27.2167 25.65 25.65C27.2167 24.0833 28 22.2 28 20C28 17.8 27.2167 15.9167 25.65 14.35C24.0833 12.7833 22.2 12 20 12C17.8 12 15.9167 12.7833 14.35 14.35C12.7833 15.9167 12 17.8 12 20C12 22.2 12.7833 24.0833 14.35 25.65C15.9167 27.2167 17.8 28 20 28ZM20 24C18.9 24 17.9583 23.6083 17.175 22.825C16.3917 22.0417 16 21.1 16 20C16 18.9 16.3917 17.9583 17.175 17.175C17.9583 16.3917 18.9 16 20 16C21.1 16 22.0417 16.3917 22.825 17.175C23.6083 17.9583 24 18.9 24 20C24 21.1 23.6083 22.0417 22.825 22.825C22.0417 23.6083 21.1 24 20 24Z" fill="#2D3143"/>
</svg>
````

## File: src/assets/icons/x.svg
````
<svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.40633 0H0L7.59569 9.98052L0.485899 18.3529H3.77083L9.14821 12.0206L13.9231 18.2948H20.3294L12.513 8.02421L12.5269 8.04192L19.2569 0.116591H15.972L10.9741 6.00205L6.40633 0ZM3.53618 1.74791H5.53056L16.7932 16.5467H14.7989L3.53618 1.74791Z" fill="white"/>
</svg>
````

## File: src/assets/icons/youtube.svg
````
<svg width="26" height="17" viewBox="0 0 26 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.036 16.9412H4.0934C1.82643 16.9412 0 14.9363 0 12.4703V4.47087C0 1.99485 1.83561 0 4.0934 0H21.036C23.3029 0 25.1294 2.00487 25.1294 4.47087V12.4703C25.1386 14.9463 23.3029 16.9412 21.036 16.9412Z" fill="white"/>
<path d="M17.0101 8.34534L9.88281 4.23535V12.4553L17.0101 8.34534Z" fill="#2D3143"/>
</svg>
````

## File: src/assets/logo-white.svg
````
<svg width="177" height="39" viewBox="0 0 177 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.6557 3.67498L14.2052 7.86676H10.0777L11.5282 3.67498H15.6557ZM8.79421 11.5417H12.9217L11.4712 15.7909H7.3437L8.79421 11.5417ZM17.9643 7.86676L19.4149 3.67498L16.9391 0H12.8116L7.77278 3.67498L6.32226 7.86676H3.36048L2.39221 11.5417H5.03883L3.58831 15.7909H0.968274L0 19.4659H2.30487L0.823984 23.7725H4.58317L6.06406 19.4659H10.1916L8.71067 23.7725H12.4699L13.9507 19.4659H16.9391L17.9074 15.7909H15.2304L16.6809 11.5417H19.3275L20.2958 7.86676H17.9605H17.9643Z" fill="#00FF80"/>
<path d="M19.9844 20.3237L23.2879 17.51C24.8523 19.2327 26.5914 20.1514 28.8697 20.1514C30.6354 20.1514 31.915 19.3207 31.915 18.0574C31.915 17.0813 31.205 16.507 28.528 15.416C25.9383 14.3518 23.6296 12.9469 23.6296 9.99161C23.6296 5.88788 27.2749 3.36133 31.5467 3.36133C34.9642 3.36133 37.326 4.54038 39.0081 6.34725L35.9894 9.39059C34.4781 7.98568 33.1415 7.2392 31.205 7.2392C29.2684 7.2392 28.3001 8.27279 28.3001 9.27575C28.3001 10.34 29.0976 10.7955 31.8011 11.9171C34.5351 13.0388 36.5855 14.4169 36.5855 17.3416C36.5855 21.5601 32.8567 24.0293 28.6685 24.0293C24.8257 24.0293 21.864 22.766 19.9844 20.3275V20.3237Z" fill="white"/>
<path d="M41.8822 8.3529H46.2109L42.11 23.7419H37.7812L41.8822 8.3529ZM47.2931 1.57715L50.9384 3.21175L46.3552 6.65704H42.71L47.2931 1.57715Z" fill="white"/>
<path d="M47.1797 20.9819C47.1797 20.3503 47.2936 19.7493 47.4645 19.0602L49.3137 12.0854H47.4911L48.4859 8.35301H50.3085L51.3604 4.41772H55.6891L54.6373 8.35301H58.2256L57.2308 12.0854H53.6424L51.9337 18.5473C51.8768 18.7769 51.8198 19.064 51.8198 19.2363C51.8198 19.8105 52.1919 20.1551 52.9893 20.1551C53.6728 20.1551 54.4968 19.9828 55.2107 19.6689L54.2158 23.3707C53.3615 23.7726 52.2527 24.0023 51.0832 24.0023C48.4631 24.0023 47.1835 22.6816 47.1835 20.9858L47.1797 20.9819ZM58.199 0.769531H61.5861V0.857579L58.3395 6.74138H56.6308L58.1952 0.769531H58.199Z" fill="white"/>
<path d="M57.6289 16.9624C57.6289 12.3686 61.559 8.06201 66.4573 8.06201C70.9835 8.06201 73.8048 11.0747 73.8048 15.1823C73.8048 19.776 69.8747 24.0826 64.9764 24.0826C60.4502 24.0826 57.6289 21.0661 57.6289 16.9624ZM69.5596 15.2971C69.5596 13.0577 68.2192 11.7944 66.256 11.7944C63.6094 11.7944 61.8703 14.6655 61.8703 16.8475C61.8703 19.0295 63.2107 20.3502 65.1739 20.3502C67.8205 20.3502 69.5596 17.4792 69.5596 15.2971Z" fill="white"/>
<path d="M75.5713 8.35303H80.014L80.6974 18.6009L86.7615 8.35303H91.4016L81.3506 23.8569H77.4205L75.5713 8.35303Z" fill="white"/>
<path d="M94.8221 2.7832H99.1508L96.246 13.6359L102.424 8.3531H108.063L100.689 14.3517L104.019 23.7383H99.1774L97.013 17.2228L94.8221 19.0029L93.569 23.7421H89.2402L94.8221 2.7832Z" fill="white"/>
<path d="M105.386 19.8908C105.386 16.3307 108.264 14.3516 111.962 14.3516C113.614 14.3516 114.981 14.6387 116.265 15.0406L116.322 14.8416C116.409 14.497 116.492 14.1525 116.492 13.6931C116.492 12.6289 115.752 11.8863 113.618 11.8863C112.137 11.8863 110.656 12.2576 109.547 12.717L108.864 9.27167C110.428 8.61324 112.365 8.18066 114.529 8.18066C118.63 8.18066 120.707 9.90331 120.707 12.916C120.707 13.7199 120.567 14.4664 120.366 15.2435L118.118 23.7419H113.929L114.385 21.9618C113.162 23.2825 111.624 24.029 109.828 24.029C107.182 24.029 105.386 22.3064 105.386 19.8947V19.8908ZM115.524 17.9385L115.638 17.5366C114.898 17.2494 113.846 16.9891 112.79 16.9891C110.994 16.9891 109.688 17.9079 109.688 19.4008C109.688 20.3502 110.455 21.0393 111.681 21.0393C113.477 21.0393 115.042 19.6037 115.524 17.9385Z" fill="white"/>
<path d="M123.358 19.1445H127.972L126.749 23.7383H122.136L123.358 19.1445Z" fill="#00FF80"/>
<path d="M134.294 8.35303H138.623L138.198 9.96083C139.28 8.98466 140.647 8.06592 142.356 8.06592C145.09 8.06592 146.855 9.75794 146.855 12.5448C146.855 13.4061 146.601 14.4971 146.343 15.4733L144.152 23.742H139.823L142.071 15.301C142.185 14.8723 142.272 14.2981 142.272 13.9229C142.272 12.6903 141.501 12.028 140.165 12.028C138.456 12.028 137.347 13.2607 136.861 15.0981L134.552 23.7382H130.224L134.294 8.3492V8.35303Z" fill="#00FF80"/>
<path d="M152.433 17.5674C152.573 19.3781 153.655 20.5839 155.934 20.5839C157.073 20.5839 158.068 20.2394 159.321 19.3513L161.314 22.0501C159.947 23.1985 158.041 24.0904 155.447 24.0904C151.062 24.0904 148.385 21.5065 148.385 17.2573C148.385 13.0081 151.973 8.06982 157.441 8.06982C161.398 8.06982 163.676 10.6538 163.676 14.0685C163.676 15.1595 163.391 16.396 162.905 17.5712H152.425L152.433 17.5674ZM152.831 14.8417H159.465C159.548 14.5546 159.605 14.2101 159.605 13.8388C159.605 12.5755 158.865 11.5725 157.099 11.5725C155.136 11.5725 153.541 12.8932 152.827 14.8456L152.831 14.8417Z" fill="#00FF80"/>
<path d="M165.362 20.9817C165.362 20.3501 165.476 19.749 165.647 19.06L167.496 12.0852H165.674L166.669 8.35277H168.491L169.547 4.41748H173.876L172.82 8.35277H176.408L175.413 12.0852H171.825L170.116 18.547C170.059 18.7767 170.002 19.0638 170.002 19.2361C170.002 19.8103 170.375 20.1548 171.172 20.1548C171.855 20.1548 172.679 19.9826 173.393 19.6687L172.398 23.3704C171.544 23.7724 170.435 24.0021 169.266 24.0021C166.646 24.0021 165.366 22.6814 165.366 20.9855L165.362 20.9817Z" fill="#00FF80"/>
<path d="M20.7206 37.2168L21.1383 36.7192C21.761 37.2896 22.361 37.5728 23.1887 37.5728C24.0165 37.5728 24.5215 37.1441 24.5215 36.5469V36.5278C24.5215 35.9689 24.2216 35.6511 22.9647 35.3832C21.5901 35.0807 20.956 34.6329 20.956 33.6414V33.6261C20.956 32.6767 21.7838 31.98 22.9229 31.98C23.7963 31.98 24.419 32.2288 25.0266 32.7226L24.6317 33.2471C24.0773 32.7915 23.5191 32.5925 22.904 32.5925C22.1255 32.5925 21.6319 33.0212 21.6319 33.5648V33.5801C21.6319 34.1505 21.9395 34.4683 23.2571 34.7515C24.5899 35.0425 25.205 35.5363 25.205 36.4589V36.4742C25.205 37.5078 24.3507 38.1815 23.1622 38.1815C22.2129 38.1815 21.4345 37.8638 20.7168 37.2168H20.7206Z" fill="white"/>
<path d="M26.9209 32.064H29.1612C30.513 32.064 31.4015 32.7875 31.4015 33.978V33.9933C31.4015 35.2949 30.3232 35.9648 29.0511 35.9648H27.5968V38.0932H26.9209V32.064ZM29.0739 35.3485C30.0649 35.3485 30.7143 34.8125 30.7143 34.0201V34.0048C30.7143 33.1435 30.0725 32.6956 29.1081 32.6956H27.5968V35.3485H29.0739Z" fill="white"/>
<path d="M32.9629 32.064H37.2879V32.6841H33.6388V34.7436H36.9043V35.3638H33.6388V37.4731H37.3296V38.0932H32.9629V32.064Z" fill="white"/>
<path d="M38.7646 35.0962V35.0808C38.7646 33.3735 40.0291 31.9609 41.791 31.9609C42.877 31.9609 43.5263 32.3476 44.1224 32.918L43.6592 33.4194C43.1542 32.9371 42.5922 32.5926 41.7796 32.5926C40.4544 32.5926 39.4633 33.6798 39.4633 35.0655V35.0847C39.4633 36.4819 40.462 37.5729 41.7796 37.5729C42.5998 37.5729 43.139 37.2552 43.7123 36.704L44.1566 37.1442C43.5339 37.7835 42.8504 38.2046 41.7644 38.2046C40.0367 38.2046 38.7646 36.8341 38.7646 35.1038V35.0962Z" fill="white"/>
<path d="M45.7363 32.064H46.4122V38.0932H45.7363V32.064Z" fill="white"/>
<path d="M50.7185 32.022H51.3527L54.079 38.0972H53.3538L52.6513 36.5047H49.3933L48.6833 38.0972H47.9922L50.7185 32.022ZM52.3855 35.8922L51.0261 32.8144L49.6591 35.8922H52.3855Z" fill="white"/>
<path d="M55.5859 32.064H56.2618V37.4654H59.6299V38.0932H55.5859V32.064Z" fill="white"/>
<path d="M61.2744 32.064H61.9503V38.0932H61.2744V32.064Z" fill="white"/>
<path d="M63.6513 37.2168L64.0689 36.7192C64.6917 37.2896 65.2916 37.5728 66.1194 37.5728C66.9472 37.5728 67.4522 37.1441 67.4522 36.5469V36.5278C67.4522 35.9689 67.1522 35.6511 65.8954 35.3832C64.5208 35.0807 63.8867 34.6329 63.8867 33.6414V33.6261C63.8867 32.6767 64.7145 31.98 65.8536 31.98C66.727 31.98 67.3497 32.2288 67.9572 32.7226L67.5623 33.2471C67.0079 32.7915 66.4498 32.5925 65.8346 32.5925C65.0562 32.5925 64.5626 33.0212 64.5626 33.5648V33.5801C64.5626 34.1505 64.8701 34.4683 66.1878 34.7515C67.5206 35.0425 68.1357 35.5363 68.1357 36.4589V36.4742C68.1357 37.5078 67.2813 38.1815 66.0928 38.1815C65.1435 38.1815 64.3651 37.8638 63.6475 37.2168H63.6513Z" fill="white"/>
<path d="M71.3065 32.6918H69.2979V32.064H73.9987V32.6918H71.99V38.0932H71.3065V32.6918Z" fill="white"/>
<path d="M75.5938 32.0641H79.9187V32.6842H76.2696V34.7437H79.5352V35.3639H76.2696V37.4732H79.9605V38.0933H75.5938V32.0641ZM78.3467 30.418L79.0226 30.728L78.0391 31.5281H77.4923L78.3467 30.418Z" fill="white"/>
<path d="M84.5547 32.064H85.1888L88.9594 36.8989V32.064H89.6163V38.0932H89.0771L85.2154 33.1473V38.0932H84.5585V32.064H84.5547Z" fill="white"/>
<path d="M93.8543 32.022H94.4884L97.2148 38.0972H96.4895L95.787 36.5047H92.5291L91.819 38.0972H91.1279L93.8543 32.022ZM95.5212 35.8922L94.1619 32.8144L92.7949 35.8922H95.5212Z" fill="white"/>
<path d="M101.243 37.2168L101.661 36.7192C102.283 37.2896 102.883 37.5728 103.711 37.5728C104.539 37.5728 105.044 37.1441 105.044 36.5469V36.5278C105.044 35.9689 104.744 35.6511 103.487 35.3832C102.113 35.0807 101.478 34.6329 101.478 33.6414V33.6261C101.478 32.6767 102.306 31.98 103.445 31.98C104.319 31.98 104.941 32.2288 105.549 32.7226L105.154 33.2471C104.6 32.7915 104.042 32.5925 103.426 32.5925C102.648 32.5925 102.154 33.0212 102.154 33.5648V33.5801C102.154 34.1505 102.462 34.4683 103.78 34.7515C105.112 35.0425 105.727 35.5363 105.727 36.4589V36.4742C105.727 37.5078 104.873 38.1815 103.685 38.1815C102.735 38.1815 101.957 37.8638 101.239 37.2168H101.243Z" fill="white"/>
<path d="M107.497 32.0641H108.173V38.0933H107.497V32.0641ZM108.42 30.418L109.096 30.728L108.112 31.5281H107.565L108.42 30.418Z" fill="white"/>
<path d="M111.845 32.6918H109.836V32.064H114.537V32.6918H112.528V38.0932H111.845V32.6918Z" fill="white"/>
<path d="M116.14 32.064H120.465V32.6841H116.816V34.7436H120.081V35.3638H116.816V37.4731H120.506V38.0932H116.14V32.064ZM118.619 31.528H118.004L117.062 30.5098H117.678L118.319 31.0266L118.961 30.5098H119.561L118.619 31.528Z" fill="white"/>
</svg>
````

## File: src/assets/logo.svg
````
<svg width="177" height="39" viewBox="0 0 177 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.6557 3.67498L14.2052 7.86676H10.0777L11.5282 3.67498H15.6557ZM8.79421 11.5417H12.9217L11.4712 15.7909H7.3437L8.79421 11.5417ZM17.9643 7.86676L19.4149 3.67498L16.9391 0H12.8116L7.77278 3.67498L6.32226 7.86676H3.36048L2.39221 11.5417H5.03883L3.58831 15.7909H0.968274L0 19.4659H2.30487L0.823984 23.7725H4.58317L6.06406 19.4659H10.1916L8.71067 23.7725H12.4699L13.9507 19.4659H16.9391L17.9074 15.7909H15.2304L16.6809 11.5417H19.3275L20.2958 7.86676H17.9605H17.9643Z" fill="#00FF80"/>
<path d="M19.9844 20.3234L23.2879 17.5098C24.8523 19.2324 26.5914 20.1511 28.8697 20.1511C30.6354 20.1511 31.915 19.3204 31.915 18.0572C31.915 17.081 31.205 16.5068 28.528 15.4158C25.9383 14.3516 23.6296 12.9467 23.6296 9.99135C23.6296 5.88763 27.2749 3.36108 31.5467 3.36108C34.9642 3.36108 37.326 4.54013 39.0081 6.347L35.9894 9.39034C34.4781 7.98543 33.1415 7.23895 31.205 7.23895C29.2684 7.23895 28.3001 8.27254 28.3001 9.2755C28.3001 10.3397 29.0976 10.7953 31.8011 11.9169C34.5351 13.0385 36.5855 14.4166 36.5855 17.3413C36.5855 21.5599 32.8567 24.029 28.6685 24.029C24.8257 24.029 21.864 22.7657 19.9844 20.3272V20.3234Z" fill="#2D3143"/>
<path d="M41.8827 8.35293H46.2114L42.1105 23.7419H37.7817L41.8827 8.35293ZM47.2936 1.57718L50.9389 3.21178L46.3557 6.65707H42.7104L47.2936 1.57718Z" fill="#2D3143"/>
<path d="M47.1797 20.9818C47.1797 20.3502 47.2936 19.7492 47.4645 19.0601L49.3137 12.0853H47.4911L48.4859 8.35293H50.3085L51.3604 4.41763H55.6891L54.6373 8.35293H58.2256L57.2308 12.0853H53.6424L51.9337 18.5472C51.8768 18.7769 51.8198 19.064 51.8198 19.2362C51.8198 19.8104 52.1919 20.155 52.9893 20.155C53.6728 20.155 54.4968 19.9827 55.2107 19.6688L54.2158 23.3706C53.3615 23.7725 52.2527 24.0022 51.0832 24.0022C48.4631 24.0022 47.1835 22.6815 47.1835 20.9857L47.1797 20.9818ZM58.199 0.769447H61.5861V0.857495L58.3395 6.74129H56.6308L58.1952 0.769447H58.199Z" fill="#2D3143"/>
<path d="M57.6294 16.9623C57.6294 12.3686 61.5595 8.06199 66.4578 8.06199C70.984 8.06199 73.8053 11.0747 73.8053 15.1823C73.8053 19.776 69.8752 24.0826 64.9769 24.0826C60.4507 24.0826 57.6294 21.0661 57.6294 16.9623ZM69.5601 15.2971C69.5601 13.0577 68.2197 11.7944 66.2565 11.7944C63.6099 11.7944 61.8708 14.6655 61.8708 16.8475C61.8708 19.0295 63.2112 20.3502 65.1743 20.3502C67.821 20.3502 69.5601 17.4791 69.5601 15.2971Z" fill="#2D3143"/>
<path d="M75.5708 8.35292H80.0135L80.697 18.6008L86.761 8.35292H91.4011L81.3501 23.8568H77.42L75.5708 8.35292Z" fill="#2D3143"/>
<path d="M94.8225 2.78303H99.1513L96.2465 13.6357L102.424 8.35292H108.063L100.689 14.3516L104.019 23.7381H99.1779L97.0135 17.2226L94.8225 19.0027L93.5695 23.7419H89.2407L94.8225 2.78303Z" fill="#2D3143"/>
<path d="M105.386 19.8908C105.386 16.3307 108.264 14.3516 111.963 14.3516C113.615 14.3516 114.982 14.6387 116.265 15.0406L116.322 14.8416C116.409 14.497 116.493 14.1525 116.493 13.6931C116.493 12.6289 115.752 11.8863 113.618 11.8863C112.138 11.8863 110.657 12.2576 109.548 12.717L108.864 9.27167C110.429 8.61324 112.365 8.18066 114.53 8.18066C118.631 8.18066 120.708 9.90331 120.708 12.916C120.708 13.7199 120.567 14.4664 120.366 15.2435L118.118 23.7419H113.93L114.385 21.9618C113.163 23.2825 111.625 24.029 109.829 24.029C107.182 24.029 105.386 22.3064 105.386 19.8947V19.8908ZM115.525 17.9385L115.639 17.5366C114.898 17.2494 113.846 16.9891 112.791 16.9891C110.995 16.9891 109.688 17.9079 109.688 19.4008C109.688 20.3502 110.455 21.0393 111.682 21.0393C113.478 21.0393 115.042 19.6037 115.525 17.9385Z" fill="#2D3143"/>
<path d="M123.358 19.1444H127.971L126.749 23.7381H122.135L123.358 19.1444Z" fill="#00FF80"/>
<path d="M134.294 8.35293H138.623L138.198 9.96073C139.28 8.98456 140.647 8.06582 142.356 8.06582C145.09 8.06582 146.855 9.75784 146.855 12.5447C146.855 13.406 146.601 14.497 146.343 15.4732L144.152 23.7419H139.823L142.071 15.3009C142.185 14.8722 142.272 14.298 142.272 13.9228C142.272 12.6902 141.501 12.0279 140.165 12.0279C138.456 12.0279 137.347 13.2606 136.861 15.098L134.552 23.7381H130.224L134.294 8.3491V8.35293Z" fill="#00FF80"/>
<path d="M152.433 17.5672C152.574 19.3779 153.656 20.5837 155.934 20.5837C157.073 20.5837 158.068 20.2392 159.321 19.3511L161.315 22.0499C159.948 23.1983 158.041 24.0903 155.448 24.0903C151.062 24.0903 148.385 21.5063 148.385 17.2571C148.385 13.0079 151.974 8.06964 157.441 8.06964C161.398 8.06964 163.676 10.6536 163.676 14.0683C163.676 15.1593 163.392 16.3958 162.906 17.571H152.425L152.433 17.5672ZM152.832 14.8416H159.465C159.549 14.5545 159.606 14.2099 159.606 13.8386C159.606 12.5753 158.865 11.5724 157.1 11.5724C155.137 11.5724 153.542 12.8931 152.828 14.8454L152.832 14.8416Z" fill="#00FF80"/>
<path d="M165.362 20.9818C165.362 20.3502 165.476 19.7492 165.647 19.0601L167.496 12.0853H165.674L166.669 8.35293H168.491L169.547 4.41763H173.876L172.82 8.35293H176.408L175.413 12.0853H171.825L170.116 18.5472C170.059 18.7769 170.002 19.064 170.002 19.2362C170.002 19.8104 170.375 20.155 171.172 20.155C171.855 20.155 172.679 19.9827 173.393 19.6688L172.398 23.3706C171.544 23.7725 170.435 24.0022 169.266 24.0022C166.646 24.0022 165.366 22.6815 165.366 20.9857L165.362 20.9818Z" fill="#00FF80"/>
<path d="M20.7211 37.2168L21.1388 36.7192C21.7615 37.2896 22.3615 37.5729 23.1892 37.5729C24.017 37.5729 24.522 37.1441 24.522 36.5469V36.5278C24.522 35.9689 24.2221 35.6511 22.9652 35.3832C21.5906 35.0808 20.9565 34.6329 20.9565 33.6414V33.6261C20.9565 32.6767 21.7843 31.98 22.9234 31.98C23.7968 31.98 24.4195 32.2288 25.0271 32.7226L24.6322 33.2471C24.0778 32.7916 23.5196 32.5925 22.9044 32.5925C22.126 32.5925 21.6324 33.0212 21.6324 33.5648V33.5801C21.6324 34.1505 21.94 34.4683 23.2576 34.7515C24.5904 35.0425 25.2055 35.5363 25.2055 36.4589V36.4742C25.2055 37.5078 24.3512 38.1815 23.1627 38.1815C22.2134 38.1815 21.4349 37.8638 20.7173 37.2168H20.7211Z" fill="#2D3143"/>
<path d="M26.9219 32.0642H29.1622C30.514 32.0642 31.4025 32.7877 31.4025 33.9783V33.9936C31.4025 35.2951 30.3241 35.9651 29.0521 35.9651H27.5978V38.0935H26.9219V32.0642ZM29.0749 35.3487C30.0659 35.3487 30.7152 34.8128 30.7152 34.0204V34.0051C30.7152 33.1437 30.0735 32.6959 29.109 32.6959H27.5978V35.3487H29.0749Z" fill="#2D3143"/>
<path d="M32.9629 32.0642H37.2879V32.6844H33.6388V34.7439H36.9043V35.364H33.6388V37.4733H37.3296V38.0935H32.9629V32.0642Z" fill="#2D3143"/>
<path d="M38.7651 35.0961V35.0808C38.7651 33.3734 40.0296 31.9609 41.7915 31.9609C42.8775 31.9609 43.5268 32.3475 44.1229 32.9179L43.6597 33.4194C43.1546 32.937 42.5927 32.5925 41.7801 32.5925C40.4549 32.5925 39.4638 33.6797 39.4638 35.0654V35.0846C39.4638 36.4818 40.4625 37.5729 41.7801 37.5729C42.6003 37.5729 43.1395 37.2551 43.7128 36.7039L44.1571 37.1441C43.5344 37.7834 42.8509 38.2045 41.7649 38.2045C40.0372 38.2045 38.7651 36.834 38.7651 35.1037V35.0961Z" fill="#2D3143"/>
<path d="M45.7368 32.0642H46.4127V38.0935H45.7368V32.0642Z" fill="#2D3143"/>
<path d="M50.7185 32.0221H51.3527L54.079 38.0973H53.3538L52.6513 36.5048H49.3933L48.6833 38.0973H47.9922L50.7185 32.0221ZM52.3855 35.8923L51.0261 32.8145L49.6591 35.8923H52.3855Z" fill="#2D3143"/>
<path d="M55.5864 32.0642H56.2623V37.4657H59.6304V38.0935H55.5864V32.0642Z" fill="#2D3143"/>
<path d="M61.2749 32.0642H61.9508V38.0935H61.2749V32.0642Z" fill="#2D3143"/>
<path d="M63.6517 37.2168L64.0694 36.7192C64.6922 37.2896 65.2921 37.5729 66.1199 37.5729C66.9477 37.5729 67.4527 37.1441 67.4527 36.5469V36.5278C67.4527 35.9689 67.1527 35.6511 65.8959 35.3832C64.5213 35.0808 63.8872 34.6329 63.8872 33.6414V33.6261C63.8872 32.6767 64.7149 31.98 65.8541 31.98C66.7274 31.98 67.3502 32.2288 67.9577 32.7226L67.5628 33.2471C67.0084 32.7916 66.4502 32.5925 65.8351 32.5925C65.0567 32.5925 64.5631 33.0212 64.5631 33.5648V33.5801C64.5631 34.1505 64.8706 34.4683 66.1882 34.7515C67.521 35.0425 68.1362 35.5363 68.1362 36.4589V36.4742C68.1362 37.5078 67.2818 38.1815 66.0933 38.1815C65.144 38.1815 64.3656 37.8638 63.6479 37.2168H63.6517Z" fill="#2D3143"/>
<path d="M71.307 32.692H69.2983V32.0642H73.9992V32.692H71.9905V38.0935H71.307V32.692Z" fill="#2D3143"/>
<path d="M75.5938 32.0642H79.9187V32.6844H76.2696V34.7439H79.5352V35.364H76.2696V37.4733H79.9605V38.0935H75.5938V32.0642ZM78.3467 30.4181L79.0226 30.7282L78.0391 31.5283H77.4923L78.3467 30.4181Z" fill="#2D3143"/>
<path d="M84.5552 32.0642H85.1893L88.9599 36.8991V32.0642H89.6168V38.0935H89.0776L85.2159 33.1476V38.0935H84.559V32.0642H84.5552Z" fill="#2D3143"/>
<path d="M93.8543 32.0221H94.4884L97.2148 38.0973H96.4895L95.787 36.5048H92.5291L91.819 38.0973H91.1279L93.8543 32.0221ZM95.5212 35.8923L94.1619 32.8145L92.7949 35.8923H95.5212Z" fill="#2D3143"/>
<path d="M101.244 37.2168L101.661 36.7192C102.284 37.2896 102.884 37.5729 103.712 37.5729C104.539 37.5729 105.044 37.1441 105.044 36.5469V36.5278C105.044 35.9689 104.745 35.6511 103.488 35.3832C102.113 35.0808 101.479 34.6329 101.479 33.6414V33.6261C101.479 32.6767 102.307 31.98 103.446 31.98C104.319 31.98 104.942 32.2288 105.55 32.7226L105.155 33.2471C104.6 32.7916 104.042 32.5925 103.427 32.5925C102.648 32.5925 102.155 33.0212 102.155 33.5648V33.5801C102.155 34.1505 102.462 34.4683 103.78 34.7515C105.113 35.0425 105.728 35.5363 105.728 36.4589V36.4742C105.728 37.5078 104.874 38.1815 103.685 38.1815C102.736 38.1815 101.957 37.8638 101.24 37.2168H101.244Z" fill="#2D3143"/>
<path d="M107.498 32.0642H108.173V38.0935H107.498V32.0642ZM108.42 30.4181L109.096 30.7282L108.113 31.5283H107.566L108.42 30.4181Z" fill="#2D3143"/>
<path d="M111.845 32.692H109.836V32.0642H114.537V32.692H112.529V38.0935H111.845V32.692Z" fill="#2D3143"/>
<path d="M116.14 32.0642H120.465V32.6844H116.816V34.7439H120.081V35.364H116.816V37.4733H120.506V38.0935H116.14V32.0642ZM118.619 31.5283H118.004L117.062 30.51H117.678L118.319 31.0268L118.961 30.51H119.561L118.619 31.5283Z" fill="#2D3143"/>
</svg>
````

## File: src/components/home/BenefitCard.astro
````
---
import TargetIcon from "@/assets/icons/target.svg?react";
import BoardIcon from "@/assets/icons/board.svg?react";
import LightIcon from "@/assets/icons/light.svg?react";

interface Props {
  iconId: "target" | "board" | "light";
  hashtag: string;
  title: string;
  description: string;
}

const { iconId, hashtag, title, description } = Astro.props;

// Map the string ID to the actual SVGR component
const Icons = {
  target: TargetIcon,
  board: BoardIcon,
  light: LightIcon,
};

const IconComponent = Icons[iconId];
---

<div class="flex flex-row gap-5">
  <!-- Icon: 48px size as per w-12 -->
  <div class="text-brand-green h-12 w-12 min-w-fit">
    <IconComponent className="w-full h-full" />
  </div>

  <div class="space-y-5">
    <!-- H2: 28px (text-2xl) Bold Italic -->
    <h2 class="text-2xl font-brand-heading leading-tight text-brand-dark">
      <span class="text-brand-green">{hashtag}</span>
      {title}
    </h2>

    <!-- H3: 14px (text-sm) Book weight -->
    <h3 class="text-sm font-book text-brand-dark leading-relaxed">
      {description}
    </h3>
  </div>
</div>
````

## File: src/components/home/ServicesSection.astro
````
---
import { DocumentRenderer } from '@keystatic/core/renderer';
import { getEntry } from "astro:content";
import Markdoc from "@markdoc/markdoc";
import ServiceCard from "./ServiceCard.astro";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";
import { PositionOverlay } from "@/components/ui/PositionOverlay";

const entry = await getEntry("services", "services");
if (!entry) return null;

const { headingHighlight, headingRemainder, introText, items } = entry.data;
const introAst = Markdoc.parse(introText);
---

<section class="bg-brand-surface rounded-[60px] relative overflow-hidden">
  <div class="container mx-auto px-6 py-24">
    <!-- Header Area -->
    <div class="text-center mb-16 space-y-6">
      <h2 class="text-2xl font-brand-heading">
        <span class="text-brand-green">{headingHighlight}</span>
        <span class="text-brand-dark">{headingRemainder}</span>
      </h2>
      <div class="text-lg font-book text-brand-dark leading-relaxed max-w-245 mx-auto">
        <DocumentRenderer document={introAst} />
      </div>
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
````

## File: src/components/ui/PositionOverlay.tsx
````typescript
import React from "react";
import { cn } from "../../utils/cn";

interface PositionOverlayProps {
  children: React.ReactNode;
  bottom?: string;
  left?: string;
  className?: string;
  pointerEvents?: "none" | "auto";
}

export const PositionOverlay: React.FC<PositionOverlayProps> = ({
  children,
  bottom = "0",
  left = "1/2",
  className,
  pointerEvents = "none",
}) => {
  const positionClasses = cn(
    "absolute",
    bottom === "0"
      ? "bottom-0"
      : bottom?.includes("px")
        ? ""
        : `bottom-${bottom}`,
    left === "1/2" ? "left-1/2" : left?.includes("px") ? "" : `left-${left}`,
    left === "1/2" && "-translate-x-1/2",
    bottom === "0" && "translate-y-1/2",
    pointerEvents === "none" ? "pointer-events-none" : "pointer-events-auto",
    className,
  );

  const inlineStyles: React.CSSProperties = {
    ...(bottom?.includes("px") && { bottom }),
    ...(left?.includes("px") && { left: left === "1/2" ? "50%" : left }),
  };

  return (
    <div className={positionClasses} style={inlineStyles}>
      {children}
    </div>
  );
};
````

## File: src/types/svg.d.ts
````typescript
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
````

## File: src/utils/cn.ts
````typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
````

## File: IMAGE_UPLOAD_REFACTOR_GUIDE.md
````markdown
# Image Upload Migration Guide: From Handler Workaround to Native Astro Image

## 🎯 Overview

This document explains how to migrate from the current `handleServiceImage()` workaround to the technically correct implementation using Astro's native `<Image />` component with Keystatic.

**Status**: Handler workaround currently in place. Full refactor needed to use proper Astro image optimization.

---

## ❌ Current Problems

### 1. Handler Workaround Adds Unnecessary Complexity

```typescript
// Current: src/utils/imageHandler.ts
export function handleServiceImage(
  image: any,
): { src: string; alt: string } | null {
  if (!image) return null;

  let imageSrc: string | undefined;

  if (typeof image === "string") {
    imageSrc = image; // Strings should not reach components
  } else if (typeof image === "object" && "src" in image) {
    imageSrc = image.src; // This should be the ONLY path
  } else {
    imageSrc = image.src || image.path || image.url || image.filename;
  }

  if (!imageSrc) return null;

  return {
    src: imageSrc,
    alt: "Service image",
  };
}
```

**Why this is wrong:**

- Astro's `image()` helper should return metadata objects, not strings
- Components should receive `{ src, width, height, format }` directly
- No need for string-to-object coercion
- Bypasses Astro's built-in `<Image />` component

### 2. Components Using `<img />` Instead of `<Image />`

```typescript
// Current: src/components/home/ServiceCard.astro
const imageData = handleServiceImage(item.image);
// ...
<img src={imageData.src} alt={item.title} />  // ❌ Not optimized
```

**What we lose:**

- Automatic image optimization (WebP, AVIF generation)
- Responsive image generation (srcset, sizes)
- Automatic width/height for CLS prevention
- Lazy loading
- Format best practices

### 3. Type Mismatch Issues

**Expected (TypeScript interface):**

```typescript
interface Props {
  image?: {
    src: string;
    width: number;
    height: number;
    format: string;
  };
}
```

**Actual data coming in:**

```typescript
// From JSON files:
"image": "@/assets/images/services/items/1/image.jpg"  // <-- STRING, not object
```

**Components currently accept:**

```typescript
const imageData = handleServiceImage(item.image); // Accepts ANYTHING
```

**Why:** Either Astro's `image()` helper is broken OR manual JSON editing bypassed the helper.

### 4. Inconsistent Schema Implementation

| Content Type | Keystatic Config | Content Schema          | Status              |
| ------------ | ---------------- | ----------------------- | ------------------- |
| Services     | `fields.image()` | `image().optional()`    | ✅ Correct          |
| About Bio    | `fields.image()` | `image().optional()`    | ✅ Correct          |
| Testimonials | `fields.image()` | `z.string().optional()` | ❌ **INCONSISTENT** |

**Impact:** Testimonials can't use `<Image />` component and break consistency.

---

## ✅ The Correct Implementation

### Expected Architecture

```
1. Keystatic Admin Upload
   ↓ Saves to: src/assets/images/[section]/[filename].ext
   ↓ Writes to JSON: "@/assets/images/[section]/[filename].ext"

2. Astro's image() Helper (content.config.ts)
   ↓ Resolves path → metadata object
   ↓ Returns: { src, width, height, format }

3. Components Receive Metadata Object
   ↓ Directly pass to <Image />

4. Astro <Image /> Component
   ↓ Generates optimized images at build time
   ↓ Creates responsive srcset
   ↓ Outputs: /_astro/[filename].[hash].webp
```

### Code Changes Required

#### 1. Update ServiceCard.astro

**Before:**

```typescript
---
import { handleServiceImage } from "../../utils/imageHandler";

interface Props {
  item: {
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
    title: string;
    description?: string;
  };
}

const { item } = Astro.props;
const imageData = handleServiceImage(item.image);
---

{item.image ? (
  <img src={imageData.src} alt={item.title} />
) : (
  <div class="fallback">No image</div>
)}
```

**After:**

```typescript
---
import { Image } from 'astro:assets';

interface Props {
  item: {
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
    title: string;
    description?: string;
  };
}

const { item } = Astro.props;
---

{item.image ? (
  <Image
    {...item.image}
    alt={item.title}
    class="w-full h-full rounded-[60px] max-h-[330px]"
  />
) : (
  <div class="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
    <span class="text-gray-400 text-sm">No image</span>
  </div>
)}
```

#### 2. Update AboutBio.astro

**Current issue:** Uses `<img />` instead of `<Image />`

**Identify usage:**

```typescript
// Line 48 in src/components/home/AboutBio.astro
<img
  src={item.src}
  alt={item.alt}
  class="w-full h-auto object-contain -mb-24 lg:-mb-32 scale-110 origin-bottom"
/>
```

**Change to:**

```typescript
import { Image } from 'astro:assets';

<Image
  src={item.src}
  alt={item.alt}
  width={item.width}
  height={item.height}
  class="w-full h-auto object-contain -mb-24 lg:-mb-32 scale-110 origin-bottom"
/>
```

**Note:** Need to verify `item.width/height` exist or get from parent `bio.image` object.

#### 3. Delete Handler File

```bash
rm src/utils/imageHandler.ts
```

**Also remove imports from:**

- `src/components/home/ServiceCard.astro`
- Any other files importing imageHandler

#### 4. Fix Testimonials Schema

**File:** `src/content.config.ts` line 81

**Before:**

```typescript
logo: z.string().optional(),
```

**After:**

```typescript
logo: image().optional(),
```

**Why:** Even though testimonials aren't implemented yet, schema should be correct for future use.

---

## 📝 Todos for Future Developers

### Before Starting Refactor

1. **Verify Astro's `image()` Helper Behavior**
   - Add temporary logging to ServiceCard:

   ```typescript
   console.log("Raw item.image type:", typeof item.image);
   console.log("Raw item.image value:", item.image);
   ```

   - Check browser console to see if objects or strings arrive
   - If strings: Astro's `image()` helper isn't resolving correctly
   - If objects: Helper works, purely a handler removal task

2. **Test with Fresh Upload**
   - Upload a NEW image via Keystatic Admin at `/keystatic`
   - Check what format appears in JSON file
   - Should be: `{"image": "@/assets/.../image.jpg"}` (string in JSON)
   - But component should receive: `{ src, width, height, format }` (object)

3. **Check for Manual JSON Editing**
   - Search for `"image": "@/assets/...` patterns in JSON files
   - If you see metadata objects instead, someone manually edited the files
   - This would break the `image()` helper chain

### During Refactor

**Order of operations:**

1. Fix testimonial schema in `content.config.ts`
2. Update ServiceCard.astro to use `<Image />` directly
3. Update AboutBio.astro to use `<Image />` directly
4. Verify build works: `npm run build`
5. Verify images display correctly in dev: `npm run dev`
6. Delete `src/utils/imageHandler.ts`
7. Remove handler imports from components

### After Refactor

1. **Remove Unused Images**

   ```bash
   # These files appear unused in the codebase:
   rm src/assets/images/about/jarda.png
   rm src/assets/images/services/service1.jpg
   ```

2. **Verify All Images Work**
   - Check About Us bio image renders
   - Check all 4 service items images render
   - Check console for 404 errors

3. **Update Documentation**
   - Delete/replace IMAGE_UPLOAD_PROBLEM_SOLUTION.md (if exists)
   - Delete/replace IMAGE_UPLOAD_QUICK_GUIDE.md (if exists)
   - Point to this document as the source of truth

4. **Test Edge Cases**
   - Remove image path from JSON → Should show fallback
   - Upload new image via Keystatic → Should work automatically
   - Change image dimensions → Should be detected by `image()` helper

---

## 🎯 Benefits After Migration

### Performance

- ✅ Automatic WebP/AVIF generation
- ✅ Responsive srcset for multiple screen sizes
- ✅ Lazy loading out of the box
- ✅ CLS prevention with automatic width/height

### Code Quality

- ✅ Type safety with proper TypeScript interfaces
- ✅ No custom handlers or workarounds
- ✅ Consistent pattern across all components
- ✅ Cleaner, more maintainable codebase

### Developer Experience

- ✅ Use Astro features as intended
- ✅ No mental overhead of handler logic
- ✅ Standard documentation applies
- ✅ Easier onboarding for new developers

---

## 🔍 Debugging Issues

### If images don't render after refactor:

**Problem:** Astro's `image()` helper returns strings instead of objects

**Solution:** Check if one of these occurred:

1. Manual JSON editing broke the schema
2. JSON files not processed through content collections (using `import` directly)
3. Astro `image()` helper has a bug

**Temporary workaround until root cause fixed:**

```typescript
// ServiceCard.astro
const imageMeta = typeof item.image === 'string'
  ? await getImage({ src: item.image })  // Manual resolution
  : item.image;  // Already an object

<Image {...imageMeta} alt={item.title} />
```

### If type errors occur:

1. Check TypeScript config in `tsconfig.json` includes image types
2. Run `astro check` to verify content collection types
3. Ensure `image()` is imported from `astro:content` schema:

   ```typescript
   import { defineCollection } from "astro:content";
   import { z } from "astro/zod";

   const services = defineCollection({
     schema: ({ image }) =>
       z.object({
         image: image().optional(), // Must use image() helper
       }),
   });
   ```

### If testimonial logos break after schema fix:

**Expected:** New schema requires logos to use `image()`, will expect uploaded images

**Migration needed:**

- Create test testimonial in Keystatic
- Upload logo
- Verify it appears in `src/assets/clients/`
- Update any hardcoded logo paths to use the new structure

---

## 📚 Related Documentation

- [Astro Images Guide](https://docs.astro.build/en/guides/images/)
- [Images in Content Collections](https://docs.astro.build/en/guides/images/#images-in-content-collections)
- [Keystatic Image Fields](https://keystatic.com/docs/image)
- [Component Props Reference](https://docs.astro.build/en/reference/modules/astro-assets/#image-)

---

## 🚀 Quick Reference

### Wrong Pattern (Current)

```typescript
// Schema
image: z.string().optional()

// Component
import { handleServiceImage } from '...';
const imageData = handleServiceImage(item.image);
<img src={imageData.src} />
```

### Right Pattern (Target)

```typescript
// Schema
image: image().optional()

// Component
import { Image } from 'astro:assets';
<Image {...item.image} alt="..." />
```

---

## 🎓 Key Insights

### Why Handler Existed

The `handleServiceImage()` handler was a **workaround** for one of these scenarios:

1. **Astro's `image()` helper didn't work properly** - returning strings instead of objects
2. **JSON files were manually edited** - bypassing the content collection system
3. **Images loaded directly via import** - instead of through `getEntry()` or content APIs

### Why It's Wrong

- **Defeats purpose** of `image()` helper's metadata generation
- **Bypasses optimization** that `<Image />` provides automatically
- **Adds maintenance burden** of custom type coercion
- **Breaks type safety** by accepting `any` and returning union types

### The Fix

Remove handler entirely. Trust Astro's content collection system and `image()` helper to:

1. Validate image paths
2. Resolve paths to metadata objects
3. Provide proper TypeScript types
4. Enable `<Image />` component to work natively

---

## 📝 Migration Checklist

- [ ] Verify `image()` helper returns objects (add logging)
- [ ] Fix testimonial schema in `content.config.ts`
- [ ] Update ServiceCard.astro to use `<Image />`
- [ ] Update AboutBio.astro to use `<Image />`
- [ ] Remove `src/utils/imageHandler.ts`
- [ ] Remove handler imports from all components
- [ ] Run `npm run build` - verify no TypeScript errors
- [ ] Run `npm run dev` - verify images display correctly
- [ ] Upload new image via Keystatic - verify it works
- [ ] Remove unused images: `jarda.png`, `service1.jpg`
- [ ] Test fallbacks by removing image paths
- [ ] Update or delete old documentation files
- [ ] Verify on production/staging build

---

**Document Version:** 1.0  
**Created:** 2026-01-09  
**Astro Version:** 5.16.6  
**Keystatic Version:** 0.5.48  
**Status:** Ready for Implementation
````

## File: prettier.config.cjs
````
module.exports = {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      parser: "astro",
    },
  ],
};
````

## File: README.md
````markdown
# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
````

## File: public/favicon.svg
````
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="1000" height="1000"><g clip-path="url(#SvgjsClipPath1101)"><rect width="1000" height="1000" fill="#ffffff"></rect><g transform="matrix(5.084745762711864,0,0,5.084745762711864,50,400.8474576271186)"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="177" height="39"><svg width="177" height="39" viewBox="0 0 177 39" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.6557 3.67498L14.2052 7.86676H10.0777L11.5282 3.67498H15.6557ZM8.79421 11.5417H12.9217L11.4712 15.7909H7.3437L8.79421 11.5417ZM17.9643 7.86676L19.4149 3.67498L16.9391 0H12.8116L7.77278 3.67498L6.32226 7.86676H3.36048L2.39221 11.5417H5.03883L3.58831 15.7909H0.968274L0 19.4659H2.30487L0.823984 23.7725H4.58317L6.06406 19.4659H10.1916L8.71067 23.7725H12.4699L13.9507 19.4659H16.9391L17.9074 15.7909H15.2304L16.6809 11.5417H19.3275L20.2958 7.86676H17.9605H17.9643Z" fill="#00FF80"></path>
<path d="M19.9844 20.3234L23.2879 17.5098C24.8523 19.2324 26.5914 20.1511 28.8697 20.1511C30.6354 20.1511 31.915 19.3204 31.915 18.0572C31.915 17.081 31.205 16.5068 28.528 15.4158C25.9383 14.3516 23.6296 12.9467 23.6296 9.99135C23.6296 5.88763 27.2749 3.36108 31.5467 3.36108C34.9642 3.36108 37.326 4.54013 39.0081 6.347L35.9894 9.39034C34.4781 7.98543 33.1415 7.23895 31.205 7.23895C29.2684 7.23895 28.3001 8.27254 28.3001 9.2755C28.3001 10.3397 29.0976 10.7953 31.8011 11.9169C34.5351 13.0385 36.5855 14.4166 36.5855 17.3413C36.5855 21.5599 32.8567 24.029 28.6685 24.029C24.8257 24.029 21.864 22.7657 19.9844 20.3272V20.3234Z" fill="#2D3143"></path>
<path d="M41.8827 8.35293H46.2114L42.1105 23.7419H37.7817L41.8827 8.35293ZM47.2936 1.57718L50.9389 3.21178L46.3557 6.65707H42.7104L47.2936 1.57718Z" fill="#2D3143"></path>
<path d="M47.1797 20.9818C47.1797 20.3502 47.2936 19.7492 47.4645 19.0601L49.3137 12.0853H47.4911L48.4859 8.35293H50.3085L51.3604 4.41763H55.6891L54.6373 8.35293H58.2256L57.2308 12.0853H53.6424L51.9337 18.5472C51.8768 18.7769 51.8198 19.064 51.8198 19.2362C51.8198 19.8104 52.1919 20.155 52.9893 20.155C53.6728 20.155 54.4968 19.9827 55.2107 19.6688L54.2158 23.3706C53.3615 23.7725 52.2527 24.0022 51.0832 24.0022C48.4631 24.0022 47.1835 22.6815 47.1835 20.9857L47.1797 20.9818ZM58.199 0.769447H61.5861V0.857495L58.3395 6.74129H56.6308L58.1952 0.769447H58.199Z" fill="#2D3143"></path>
<path d="M57.6294 16.9623C57.6294 12.3686 61.5595 8.06199 66.4578 8.06199C70.984 8.06199 73.8053 11.0747 73.8053 15.1823C73.8053 19.776 69.8752 24.0826 64.9769 24.0826C60.4507 24.0826 57.6294 21.0661 57.6294 16.9623ZM69.5601 15.2971C69.5601 13.0577 68.2197 11.7944 66.2565 11.7944C63.6099 11.7944 61.8708 14.6655 61.8708 16.8475C61.8708 19.0295 63.2112 20.3502 65.1743 20.3502C67.821 20.3502 69.5601 17.4791 69.5601 15.2971Z" fill="#2D3143"></path>
<path d="M75.5708 8.35292H80.0135L80.697 18.6008L86.761 8.35292H91.4011L81.3501 23.8568H77.42L75.5708 8.35292Z" fill="#2D3143"></path>
<path d="M94.8225 2.78303H99.1513L96.2465 13.6357L102.424 8.35292H108.063L100.689 14.3516L104.019 23.7381H99.1779L97.0135 17.2226L94.8225 19.0027L93.5695 23.7419H89.2407L94.8225 2.78303Z" fill="#2D3143"></path>
<path d="M105.386 19.8908C105.386 16.3307 108.264 14.3516 111.963 14.3516C113.615 14.3516 114.982 14.6387 116.265 15.0406L116.322 14.8416C116.409 14.497 116.493 14.1525 116.493 13.6931C116.493 12.6289 115.752 11.8863 113.618 11.8863C112.138 11.8863 110.657 12.2576 109.548 12.717L108.864 9.27167C110.429 8.61324 112.365 8.18066 114.53 8.18066C118.631 8.18066 120.708 9.90331 120.708 12.916C120.708 13.7199 120.567 14.4664 120.366 15.2435L118.118 23.7419H113.93L114.385 21.9618C113.163 23.2825 111.625 24.029 109.829 24.029C107.182 24.029 105.386 22.3064 105.386 19.8947V19.8908ZM115.525 17.9385L115.639 17.5366C114.898 17.2494 113.846 16.9891 112.791 16.9891C110.995 16.9891 109.688 17.9079 109.688 19.4008C109.688 20.3502 110.455 21.0393 111.682 21.0393C113.478 21.0393 115.042 19.6037 115.525 17.9385Z" fill="#2D3143"></path>
<path d="M123.358 19.1444H127.971L126.749 23.7381H122.135L123.358 19.1444Z" fill="#00FF80"></path>
<path d="M134.294 8.35293H138.623L138.198 9.96073C139.28 8.98456 140.647 8.06582 142.356 8.06582C145.09 8.06582 146.855 9.75784 146.855 12.5447C146.855 13.406 146.601 14.497 146.343 15.4732L144.152 23.7419H139.823L142.071 15.3009C142.185 14.8722 142.272 14.298 142.272 13.9228C142.272 12.6902 141.501 12.0279 140.165 12.0279C138.456 12.0279 137.347 13.2606 136.861 15.098L134.552 23.7381H130.224L134.294 8.3491V8.35293Z" fill="#00FF80"></path>
<path d="M152.433 17.5672C152.574 19.3779 153.656 20.5837 155.934 20.5837C157.073 20.5837 158.068 20.2392 159.321 19.3511L161.315 22.0499C159.948 23.1983 158.041 24.0903 155.448 24.0903C151.062 24.0903 148.385 21.5063 148.385 17.2571C148.385 13.0079 151.974 8.06964 157.441 8.06964C161.398 8.06964 163.676 10.6536 163.676 14.0683C163.676 15.1593 163.392 16.3958 162.906 17.571H152.425L152.433 17.5672ZM152.832 14.8416H159.465C159.549 14.5545 159.606 14.2099 159.606 13.8386C159.606 12.5753 158.865 11.5724 157.1 11.5724C155.137 11.5724 153.542 12.8931 152.828 14.8454L152.832 14.8416Z" fill="#00FF80"></path>
<path d="M165.362 20.9818C165.362 20.3502 165.476 19.7492 165.647 19.0601L167.496 12.0853H165.674L166.669 8.35293H168.491L169.547 4.41763H173.876L172.82 8.35293H176.408L175.413 12.0853H171.825L170.116 18.5472C170.059 18.7769 170.002 19.064 170.002 19.2362C170.002 19.8104 170.375 20.155 171.172 20.155C171.855 20.155 172.679 19.9827 173.393 19.6688L172.398 23.3706C171.544 23.7725 170.435 24.0022 169.266 24.0022C166.646 24.0022 165.366 22.6815 165.366 20.9857L165.362 20.9818Z" fill="#00FF80"></path>
<path d="M20.7211 37.2168L21.1388 36.7192C21.7615 37.2896 22.3615 37.5729 23.1892 37.5729C24.017 37.5729 24.522 37.1441 24.522 36.5469V36.5278C24.522 35.9689 24.2221 35.6511 22.9652 35.3832C21.5906 35.0808 20.9565 34.6329 20.9565 33.6414V33.6261C20.9565 32.6767 21.7843 31.98 22.9234 31.98C23.7968 31.98 24.4195 32.2288 25.0271 32.7226L24.6322 33.2471C24.0778 32.7916 23.5196 32.5925 22.9044 32.5925C22.126 32.5925 21.6324 33.0212 21.6324 33.5648V33.5801C21.6324 34.1505 21.94 34.4683 23.2576 34.7515C24.5904 35.0425 25.2055 35.5363 25.2055 36.4589V36.4742C25.2055 37.5078 24.3512 38.1815 23.1627 38.1815C22.2134 38.1815 21.4349 37.8638 20.7173 37.2168H20.7211Z" fill="#2D3143"></path>
<path d="M26.9219 32.0642H29.1622C30.514 32.0642 31.4025 32.7877 31.4025 33.9783V33.9936C31.4025 35.2951 30.3241 35.9651 29.0521 35.9651H27.5978V38.0935H26.9219V32.0642ZM29.0749 35.3487C30.0659 35.3487 30.7152 34.8128 30.7152 34.0204V34.0051C30.7152 33.1437 30.0735 32.6959 29.109 32.6959H27.5978V35.3487H29.0749Z" fill="#2D3143"></path>
<path d="M32.9629 32.0642H37.2879V32.6844H33.6388V34.7439H36.9043V35.364H33.6388V37.4733H37.3296V38.0935H32.9629V32.0642Z" fill="#2D3143"></path>
<path d="M38.7651 35.0961V35.0808C38.7651 33.3734 40.0296 31.9609 41.7915 31.9609C42.8775 31.9609 43.5268 32.3475 44.1229 32.9179L43.6597 33.4194C43.1546 32.937 42.5927 32.5925 41.7801 32.5925C40.4549 32.5925 39.4638 33.6797 39.4638 35.0654V35.0846C39.4638 36.4818 40.4625 37.5729 41.7801 37.5729C42.6003 37.5729 43.1395 37.2551 43.7128 36.7039L44.1571 37.1441C43.5344 37.7834 42.8509 38.2045 41.7649 38.2045C40.0372 38.2045 38.7651 36.834 38.7651 35.1037V35.0961Z" fill="#2D3143"></path>
<path d="M45.7368 32.0642H46.4127V38.0935H45.7368V32.0642Z" fill="#2D3143"></path>
<path d="M50.7185 32.0221H51.3527L54.079 38.0973H53.3538L52.6513 36.5048H49.3933L48.6833 38.0973H47.9922L50.7185 32.0221ZM52.3855 35.8923L51.0261 32.8145L49.6591 35.8923H52.3855Z" fill="#2D3143"></path>
<path d="M55.5864 32.0642H56.2623V37.4657H59.6304V38.0935H55.5864V32.0642Z" fill="#2D3143"></path>
<path d="M61.2749 32.0642H61.9508V38.0935H61.2749V32.0642Z" fill="#2D3143"></path>
<path d="M63.6517 37.2168L64.0694 36.7192C64.6922 37.2896 65.2921 37.5729 66.1199 37.5729C66.9477 37.5729 67.4527 37.1441 67.4527 36.5469V36.5278C67.4527 35.9689 67.1527 35.6511 65.8959 35.3832C64.5213 35.0808 63.8872 34.6329 63.8872 33.6414V33.6261C63.8872 32.6767 64.7149 31.98 65.8541 31.98C66.7274 31.98 67.3502 32.2288 67.9577 32.7226L67.5628 33.2471C67.0084 32.7916 66.4502 32.5925 65.8351 32.5925C65.0567 32.5925 64.5631 33.0212 64.5631 33.5648V33.5801C64.5631 34.1505 64.8706 34.4683 66.1882 34.7515C67.521 35.0425 68.1362 35.5363 68.1362 36.4589V36.4742C68.1362 37.5078 67.2818 38.1815 66.0933 38.1815C65.144 38.1815 64.3656 37.8638 63.6479 37.2168H63.6517Z" fill="#2D3143"></path>
<path d="M71.307 32.692H69.2983V32.0642H73.9992V32.692H71.9905V38.0935H71.307V32.692Z" fill="#2D3143"></path>
<path d="M75.5938 32.0642H79.9187V32.6844H76.2696V34.7439H79.5352V35.364H76.2696V37.4733H79.9605V38.0935H75.5938V32.0642ZM78.3467 30.4181L79.0226 30.7282L78.0391 31.5283H77.4923L78.3467 30.4181Z" fill="#2D3143"></path>
<path d="M84.5552 32.0642H85.1893L88.9599 36.8991V32.0642H89.6168V38.0935H89.0776L85.2159 33.1476V38.0935H84.559V32.0642H84.5552Z" fill="#2D3143"></path>
<path d="M93.8543 32.0221H94.4884L97.2148 38.0973H96.4895L95.787 36.5048H92.5291L91.819 38.0973H91.1279L93.8543 32.0221ZM95.5212 35.8923L94.1619 32.8145L92.7949 35.8923H95.5212Z" fill="#2D3143"></path>
<path d="M101.244 37.2168L101.661 36.7192C102.284 37.2896 102.884 37.5729 103.712 37.5729C104.539 37.5729 105.044 37.1441 105.044 36.5469V36.5278C105.044 35.9689 104.745 35.6511 103.488 35.3832C102.113 35.0808 101.479 34.6329 101.479 33.6414V33.6261C101.479 32.6767 102.307 31.98 103.446 31.98C104.319 31.98 104.942 32.2288 105.55 32.7226L105.155 33.2471C104.6 32.7916 104.042 32.5925 103.427 32.5925C102.648 32.5925 102.155 33.0212 102.155 33.5648V33.5801C102.155 34.1505 102.462 34.4683 103.78 34.7515C105.113 35.0425 105.728 35.5363 105.728 36.4589V36.4742C105.728 37.5078 104.874 38.1815 103.685 38.1815C102.736 38.1815 101.957 37.8638 101.24 37.2168H101.244Z" fill="#2D3143"></path>
<path d="M107.498 32.0642H108.173V38.0935H107.498V32.0642ZM108.42 30.4181L109.096 30.7282L108.113 31.5283H107.566L108.42 30.4181Z" fill="#2D3143"></path>
<path d="M111.845 32.692H109.836V32.0642H114.537V32.692H112.529V38.0935H111.845V32.692Z" fill="#2D3143"></path>
<path d="M116.14 32.0642H120.465V32.6844H116.816V34.7439H120.081V35.364H116.816V37.4733H120.506V38.0935H116.14V32.0642ZM118.619 31.5283H118.004L117.062 30.51H117.678L118.319 31.0268L118.961 30.51H119.561L118.619 31.5283Z" fill="#2D3143"></path>
</svg></svg></g></g><defs><clipPath id="SvgjsClipPath1101"><rect width="1000" height="1000" x="0" y="0" rx="250" ry="250"></rect></clipPath></defs></svg>
````

## File: src/components/home/AboutBio.astro
````
---
import { DocumentRenderer } from '@keystatic/core/renderer';
import Markdoc from "@markdoc/markdoc";
import { Image } from "astro:assets";

interface Props {
  bio: {
    heading: string;
    col1: string; // Inline Markdoc string
    col2: string; // Inline Markdoc string
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
  };
}

const { bio } = Astro.props;

// Parse Markdoc strings to AST
const col1Ast = Markdoc.parse(bio.col1);
const col2Ast = Markdoc.parse(bio.col2);

// Determine layout based on image availability
const hasImage = bio.image !== undefined && bio.image !== null;
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
      <div class="text-sm font-book text-brand-dark leading-relaxed">
        <DocumentRenderer document={col1Ast} />
      </div>
      <div class="text-sm font-book text-brand-dark leading-relaxed">
        <DocumentRenderer document={col2Ast} />
      </div>
      <div class="relative flex items-end h-full">
        {bio.image && (
          <Image
            {...bio.image}
            alt="Bio image"
            class="w-full h-auto object-contain -mb-24 lg:-mb-32 scale-110 origin-bottom"
          />
        )}
      </div>
    </div>
  ) : (
    <!-- 2-column layout (text + text only) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      <div class="text-sm font-book text-brand-dark leading-relaxed">
        <DocumentRenderer document={col1Ast} />
      </div>
      <div class="text-sm font-book text-brand-dark leading-relaxed">
        <DocumentRenderer document={col2Ast} />
      </div>
    </div>
  )
}
````

## File: src/components/home/AboutUs.astro
````
---
import { getEntry } from "astro:content";
import BenefitsRow from "./BenefitsRow.astro";
import AboutBio from "./AboutBio.astro";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";
import { PositionOverlay } from "@/components/ui/PositionOverlay";

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
  <PositionOverlay bottom="-10px">
    <HashtagIcon className="w-21 h-auto text-brand-green" />
  </PositionOverlay>
</section>
````

## File: src/components/home/BenefitsRow.astro
````
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
````

## File: src/components/home/ServiceCard.astro
````
---
import { DocumentRenderer } from '@keystatic/core/renderer';
import Markdoc from "@markdoc/markdoc";
import { Image } from "astro:assets";

interface Props {
  item: {
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
    title: string;
    description?: string;
  };
}

const { item } = Astro.props;

// Parse Markdoc description to AST
const descriptionAst = item.description ? Markdoc.parse(item.description) : null;
---

<div class="flex flex-col space-y-5">
  {
    item.image ? (
      <Image
        {...item.image}
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
    {
      descriptionAst && (
        <div class="text-sm font-book text-brand-dark leading-relaxed">
          <DocumentRenderer document={descriptionAst} />
        </div>
      )
    }
  </div>
</div>
````

## File: src/content/global/footer.json
````json
{
  "company": {
    "name": "Síťovka.net s.r.o.",
    "street": "Jaurisova 515/4",
    "city": "140 00 Praha 4"
  },
  "legal": {
    "ico": "24164879",
    "dic": "CZ24164879",
    "court": "Vedená u Městského soudu v Praze"
  },
  "bank": {
    "accountNumber": "6582068001/5500",
    "swift": "RZBCCZPP",
    "iban": ""
  },
  "socials": {
    "facebook": "https://facebook.com/",
    "instagram": "https://instagram.com/",
    "x": "https://x.com/",
    "linkedin": "https://linkedin.com/",
    "youtube": "https://youtube.com/"
  }
}
````

## File: src/content/pages/home.json
````json
{
  "heroHeadline": "Marketing, který zraje",
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
  ]
}
````

## File: .gitignore
````
# build output
dist/
# generated types
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*


# environment variables
.env
.env.production

# macOS-specific files
.DS_Store

# jetbrains setting folder
.idea/

# Local Netlify folder
.netlify
````

## File: src/components/ui/Button.tsx
````typescript
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn"; // Importing from our local utils

// Defining the rules based on your Design System
const buttonVariants = cva(
  // Base styles (Shared by all)
  "inline-flex items-center justify-center rounded-full text-base font-bold italic transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none font-brand-heading",
  {
    variants: {
      variant: {
        // 1. Primary (Fill) - Green BG with matching border
        primary:
          "bg-brand-green text-brand-dark border-2 border-brand-green hover:bg-brand-dark hover:text-white hover:border-brand-dark hover:shadow-lg",

        // 2. Outline - Transparent BG with configurable border/text
        outline:
          "bg-transparent border-2 hover:bg-brand-green hover:text-brand-dark",

        // 3. Dark (From your Header)
        dark: "bg-brand-dark text-white border-2 border-brand-dark hover:bg-brand-green hover:text-brand-dark hover:border-brand-green hover:shadow-lg",
      },
      size: {
        default: "px-8 py-3", // Your standard padding
        sm: "px-6 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string; // If provided, renders as <a>
  textColor?:
    | "brand-green"
    | "brand-dark"
    | "brand-surface"
    | "white"
    | "black"; // Text color for outline variant
  borderColor?:
    | "brand-green"
    | "brand-dark"
    | "brand-surface"
    | "white"
    | "black"; // Border color for primary variant
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      href,
      children,
      textColor,
      borderColor,
      ...props
    },
    ref,
  ) => {
    // Build dynamic classes for outline variant
    const outlineClasses =
      variant === "outline"
        ? cn(
            textColor ? `text-${textColor}` : "text-brand-green",
            borderColor ? `border-${borderColor}` : "border-brand-green",
          )
        : "";

    // Build dynamic classes for primary variant border
    const primaryBorderClass =
      variant === "primary" && borderColor ? `border-${borderColor}` : "";

    // Logic: Render as <a> link if href is present
    if (href) {
      return (
        <a
          href={href}
          className={cn(
            buttonVariants({ variant, size, className }),
            outlineClasses,
            primaryBorderClass,
          )}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    // Logic: Render as standard <button> otherwise
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          outlineClasses,
          primaryBorderClass,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
````

## File: AGENTS.md
````markdown
# AGENTS.md - Development Guidelines for Sitovka

## Build & Development Commands

### Core Commands
- `npm run dev` - Start development server at localhost:4321 (⚠️ **NEVER run this command - dev server runs in background**)
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally
- `npm run astro -- --help` - Get Astro CLI help

### Testing & Quality
- No test framework configured - add tests as needed
- No linting/formatting configured - consider adding ESLint/Prettier
- Use `astro check` for TypeScript and Astro component validation

## Technology Stack

### Core Framework
- **Astro** - Static site generator with component islands
- **React** - Interactive components (v19.2.3)
- **TypeScript** - Strict mode enabled via astro/tsconfigs/strict
- **Tailwind CSS** - Utility-first CSS framework (v4.1.18)

### Key Dependencies
- **Keystatic** - Headless CMS integration
- **Framer Motion** - Animation library
- **Embla Carousel** - Carousel component
- **Radix UI** - Headless UI components

## Design Tokens

### Color Palette
- `--color-brand-green`: #00FF80 - Primary neon green for accents, highlights, emphasis
- `--color-brand-dark`: #2D3143 - Dark blue/charcoal for text and dark backgrounds
- `--color-brand-surface`: #F5F5F5 - Light gray for section backgrounds

### Typography Scale
- `--text-xs`: 12px - Copyright text, metadata
- `--text-sm`: 14px - Body text
- `--text-base`: 16px - Navigation, buttons, tags
- `--text-lg`: 18px - Lead paragraphs
- `--text-2xl`: 28px - Section headers
- `--text-display`: 120px - Hero headlines

### Typography Weights
- `--font-weight-book`: 400 - Regular body text
- `--font-weight-bold`: 700 - Headlines and emphasis

### Utility Classes
- `.font-brand-heading` - Bold + italic combination for headers

### Font Family
- Primary: "gotham" (via Adobe Fonts/Typekit)
- Fallback: sans-serif
- Available variants: Book, Book Italic, Bold, Bold Italic

## Code Style Guidelines

### Astro Components (.astro files)
```astro
---
// Component Script (TypeScript)
import Layout from '../layouts/Layout.astro';
const { title } = Astro.props;
---

<!-- Component Template (HTML + JSX-like syntax) -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

### React Components (.tsx files)
```tsx
import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  onClick 
}) => {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800'
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Import Conventions
- **Absolute imports**: Use `@/` prefix for src directory imports
- **Component imports**: Group by type (React, Astro, utilities)
- **CSS imports**: Import global styles in layout components only
- **Type imports**: Use `import type` for TypeScript types

### Naming Conventions
- **Components**: PascalCase (e.g., `Navigation.astro`, `Button.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `cn.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **Files**: Match component name (e.g., `components/Header.astro`)

### Error Handling
```typescript
// Always handle errors explicitly
try {
  const data = await fetchData();
  return { data };
} catch (error) {
  console.error('Failed to fetch data:', error);
  // Return appropriate fallback or error state
  return { data: null, error: 'Failed to load data' };
}
```

### TypeScript Configuration
- Strict mode enabled via `astro/tsconfigs/strict`
- JSX configured for React (`react-jsx`)
- Include all files except `dist/`

## Project Structure

```
src/
├── pages/          # Astro pages (file-based routing)
├── components/     # Reusable Astro/React components
├── layouts/        # Page layout templates
├── styles/         # Global styles and Tailwind config
├── utils/          # Utility functions and helpers
└── content/        # CMS content (Keystatic)
    ├── global/     # Site-wide data
    ├── pages/      # Page-specific content
    └── testimonials/ # Collections

public/             # Static assets (images, fonts, etc.)
```

## Key Considerations

1. **Static Output**: Project configured for static site generation (`output: "static"`)
2. **Tailwind Integration**: Custom theme variables defined in `global.css`
3. **Keystatic CMS**: Headless CMS integration for content management
4. **No Build Tools**: Uses Astro's built-in tooling, no separate bundler config

## Content Management (Keystatic CMS)

### Content Structure
```
src/content/
├── global/           # Site-wide data (Header, Footer, SEO)
│   └── footer.json   # Address, Bank, Legal info
├── pages/            # Content specific to a URL
│   └── home.json     # Hero slides, "About" text, CTA text
└── testimonials/     # Repeatable content (Collections)
    ├── seva.json
    ├── bigmat.json
    └── ...
```

### CMS Configuration Files
- `keystatic.config.ts` - Keystatic admin UI schema definition
- `src/content.config.ts` - Astro content collection schemas with Zod validation

### Content Access Pattern
```astro
---
import { getEntry } from 'astro:content';
const footerData = await getEntry('footer', 'footer');
const { company, legal, bank } = footerData.data;
---
```

### CMS Access
- Local development: `/keystatic` route for content editing
- Production: Switch `storage.kind` from `'local'` to `'github'` in `keystatic.config.ts`

## Development Workflow

1. Start development server: `npm run dev`
2. Check for TypeScript errors: `astro check`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

**Note:** Use `glob` loader for content collections (not `file` loader) to avoid build issues

## Security Notes

- Never commit `.env` files or sensitive data
- Validate all external inputs and API responses
- Use Astro's built-in XSS protection for user content
- Keep dependencies updated regularly
````

## File: src/layouts/Layout.astro
````
---
import "../styles/global.css";
// 1. Import the new component
import Header from "@/components/layout/Header.astro";
import Footer from "@/components/layout/Footer.astro";

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Agency Landing Page",
  description = "Marketing and Creative Agency",
} = Astro.props;
---

<!doctype html>
<html lang="cs" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Adobe Fonts / Typekit -->
    <link rel="stylesheet" href="https://use.typekit.net/rsm7rew.css" />

    <title>{title}</title>
  </head>
  <body class="bg-white text-brand-dark antialiased mx-5 mb-5">
    <!-- 2. Mount the Header -->
    <Header />

    <!-- 3. Add padding-top to main so content isn't hidden behind fixed header -->
    <main class="pt-36">
      <slot />
    </main>

    <!-- 4. Mount the Footer -->
    <Footer />
  </body>
</html>
````

## File: src/pages/index.astro
````
---
import Layout from "../layouts/Layout.astro";
import AboutUs from "../components/home/AboutUs.astro";
import ServicesSection from "../components/home/ServicesSection.astro";
---

<Layout title="Sítovka.net | Marketingová Agentura">
  <main>
    <!-- We will add the Hero here later -->

    <!-- About Us Section (Benefits + Bio) -->
    <AboutUs />

    <!-- Services Section (Co umíme) -->
    <ServicesSection />

    <!-- Other sections will follow -->
  </main>
</Layout>
````

## File: src/styles/global.css
````css
@import "tailwindcss";

@theme {
  /* --- LAYOUT --- */
  --breakpoint-2xl: 71.25rem; /* 1140px - Custom container width */

  /* --- COLORS --- */
  --color-brand-green: #00ff80; /* Primary neon green */
  --color-brand-dark: #2d3143; /* Primary dark blue/charcoal */
  --color-brand-surface: #f5f5f5; /* Light gray backgrounds */

  /* --- TYPOGRAPHY: SIZES --- */
  /* These override/extend standard utilities like text-xs, text-2xl */
  --text-xs: 12px; /* Copyright/metadata */
  --text-sm: 14px; /* Body text */
  --text-base: 16px; /* Navigation, buttons, tags */
  --text-lg: 18px; /* Lead paragraphs */
  --text-2xl: 28px; /* Section headers */
  --text-display: 120px; /* Hero headlines */

  /* --- TYPOGRAPHY: FAMILY & WEIGHTS --- */
  /* Setting this as --font-sans makes it the default font for the site */
  --font-sans: "gotham", sans-serif;

  --font-weight-book: 400; /* Usage: font-book */
  --font-weight-bold: 700; /* Usage: font-bold */
}

/* --- CUSTOM CONTAINER UTILITY --- */
/* Override default container to use 1140px (71.25rem) as the default max-width */
@utility container {
  width: 100%;
  margin-inline: auto;
  padding-inline: 2rem;
  @media (width >= 40rem) {
    max-width: 40rem;
  }
  @media (width >= 48rem) {
    max-width: 48rem;
  }
  @media (width >= 64rem) {
    max-width: 64rem;
  }
  @media (width >= 80rem) {
    max-width: 71.75rem; /* 1140px - Custom default width */
  }
  @media (width >= 96rem) {
    max-width: 71.75rem; /* 1140px - Keep consistent at larger breakpoints */
  }
}

/* --- UTILITY CLASSES --- */
@layer utilities {
  .font-brand-heading {
    font-weight: 700;
    font-style: italic;
  }
}

/* --- BASE STYLES --- */
@layer base {
  body {
    /* Ensures the font applies globally */
    font-family: var(--font-sans);
    font-weight: var(--font-weight-book);
  }
}
::selection {
  background-color: var(--color-brand-green);
  color: var(--color-brand-dark);
}
````

## File: keystatic.config.ts
````typescript
import { config, fields, singleton, collection } from "@keystatic/core";

export default config({
  storage: { kind: "local" },

  singletons: {
    // About Us Section (Benefits + Bio)
    about: singleton({
      label: "2. O Nás",
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
            col1: fields.markdoc.inline({ label: "Column 1 (Rich Text)" }),
            col2: fields.markdoc.inline({ label: "Column 2 (Rich Text)" }),
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

    // Services Section (Co umíme)
    services: singleton({
      label: "3. Co umíme",
      path: "src/content/sections/services",
      format: { data: "json" },
      schema: {
        headingHighlight: fields.text({
          label: "Heading Green Part",
          defaultValue: "Co umíme?",
        }),
        headingRemainder: fields.text({ label: "Heading Dark Part" }),
        introText: fields.markdoc.inline({ label: "Intro Text (18px)" }),
        items: fields.array(
          fields.object({
            image: fields.image({
              label: "Service Image",
              directory: "src/assets/images/services",
              publicPath: "@/assets/images/services/",
            }),
            title: fields.text({ label: "Title" }),
            description: fields.markdoc.inline({
              label: "Description",
            }),
          }),
          {
            label: "Services Grid",
            itemLabel: (props) => props.fields.title.value,
          },
        ),
      },
    }),
    // Global Footer Configuration
    footer: singleton({
      label: "Patička",
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
````

## File: tsconfig.json
````json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
    },
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "types": ["vite-plugin-svgr/client"],
    "moduleResolution": "bundler",
  },
}
````

## File: src/components/layout/Footer.astro
````
---
// 1. Import Logo
import LogoWhite from "@/assets/logo-white.svg?react";

// 2. Import Social Icons from src/assets/icons/
import FacebookIcon from "@/assets/icons/facebook.svg?react";
import InstagramIcon from "@/assets/icons/instagram.svg?react";
import XIcon from "@/assets/icons/x.svg?react";
import LinkedInIcon from "@/assets/icons/linkedin.svg?react";
import YoutubeIcon from "@/assets/icons/youtube.svg?react";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";

// 3. Fetch footer data from CMS
import { getEntry } from "astro:content";
const footerEntry = await getEntry("footer", "footer");
const {
  company = {},
  legal = {},
  bank = {},
  socials = {},
} = footerEntry?.data || {};

// Social links data array
const socialLinksData = [
  {
    key: "facebook",
    href: socials?.facebook,
    icon: FacebookIcon,
    label: "Facebook",
  },
  {
    key: "instagram",
    href: socials?.instagram,
    icon: InstagramIcon,
    label: "Instagram",
  },
  { key: "x", href: socials?.x, icon: XIcon, label: "X" },
  {
    key: "linkedin",
    href: socials?.linkedin,
    icon: LinkedInIcon,
    label: "LinkedIn",
  },
  {
    key: "youtube",
    href: socials?.youtube,
    icon: YoutubeIcon,
    label: "YouTube",
  },
].filter((link) => link.href);

// Links from JSON (Col 4)
const footerLinks = [
  { name: "Úvod", href: "#" },
  { name: "Co umíme", href: "#co-umime" },
  { name: "Reference", href: "#reference" },
];
---

<!--
  Layout: Footer Card Style
  - rounded-[60px]: As requested
  - bg-brand-dark: #2D3143
  - pt-[90px]: Top padding as requested
-->
<footer
  class="bg-brand-dark text-white rounded-[60px] pt-22.5 overflow-hidden relative"
>
  <div class="container mx-auto px-10">
    <!-- ROW 1: Logo on the left -->
    <div class="flex justify-start">
      <a href="#" class="shrink-0 group" aria-label="Domů">
        <LogoWhite className="h-10 w-auto" aria-hidden="true" />
      </a>
    </div>

    <!-- GAP: 28px -->
    <div class="h-7"></div>

    <!-- ROW 2: 4 Columns -->
    <div
      class="ml-4 grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr_1fr] gap-8 text-sm font-book leading-relaxed"
    >
      <!-- Col 1: Address -->
      <div class="space-y-1">
        <p class="text-base font-brand-heading">{company?.name || ""}</p>
        <p>{company?.street || ""}</p>
        <p>{company?.city || ""}</p>
      </div>

      <!-- Col 2: Legal -->
      <div class="space-y-1">
        <p>IČO: {legal?.ico || ""}</p>
        <p>DIČ: {legal?.dic || ""}</p>
        <p>{legal?.court || ""}</p>
      </div>

      <!-- Col 3: Bank -->
      <div class="space-y-1">
        <p>Číslo účtu: {bank?.accountNumber || ""}</p>
        <p>SWIFT: {bank?.swift || ""}</p>
        {bank?.iban && <p>IBAN: {bank?.iban}</p>}
      </div>

      <!-- Col 4: Links (Bold Italic 16px) -->
      <nav class="flex flex-col gap-2 md:items-end">
        {
          footerLinks.map((link) => (
            <a
              href={link.href}
              class="text-base font-brand-heading text-white hover:text-brand-green transition-colors w-fit"
            >
              {link.name}
            </a>
          ))
        }
      </nav>
    </div>

    <!-- GAP: 28px -->
    <div class="h-7"></div>

    <!-- ROW 3: Social Icons -->
    <div
      class="flex max-w-[300px] mx-auto items-center justify-between flex-wrap"
    >
      {
        socialLinksData.map((link) => (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            class="rounded-full border border-transparent hover:border-brand-green transition-all p-4"
          >
            <link.icon className="w-4 h-4" />
          </a>
        ))
      }
    </div>

    <div class="h-12"></div>

    <!-- ROW 4: Copyright | SVG | Cookies -->
    <div
      class="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-book -mb-6"
    >
      <span>© 2025 Síťovka</span>

      <!-- The small hashtag SVG requested in description -->
      <HashtagIcon className="w-20 h-25 text-brand-green" />

      <a href="/cookies" class="hover:text-brand-green transition-colors">
        Používáme cookies
      </a>
    </div>
  </div>
</footer>
````

## File: src/content.config.ts
````typescript
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
        col2: z.string(),
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
      introText: z.string(),
      items: z.array(
        z.object({
          image: image().optional(),
          title: z.string(),
          description: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { footer, homepage, testimonials, about, services };
````

## File: astro.config.mjs
````
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import netlify from "@astrojs/netlify";

export default defineConfig({
  // 1. Revert to 'static' (Astro v5 handles dynamic routes automatically now)
  output: "static",

  // 2. Keep the adapter (Required for Keystatic's API routes to run on Netlify)
  adapter: netlify(),

  integrations: [react(), keystatic()],
  vite: {
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
````

## File: src/components/layout/Header.astro
````
---
// Import the Logo as a React component
// Note: We use the '?react' suffix because of vite-plugin-svgr
import Logo from "@/assets/logo.svg?react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface NavItem {
  name: string;
  href: string;
  variant?: "primary" | "outline" | "dark";
}

const navItems: NavItem[] = [
  { name: "Úvod", href: "#" },
  { name: "Co umíme", href: "#co-umime", variant: "outline" },
  { name: "Reference", href: "#reference", variant: "primary" },
  { name: "Kontakty", href: "#kontakty" },
];
---

<header
  class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white"
>
  <div class="container h-36 flex items-center justify-between">
    <!--
      1. LOGO
      Using SVGR component allows us to style the internal paths.
      The 'text-brand-dark' class fills the SVG because your logo.svg likely uses fill attributes.
      We add 'group' to animate color on hover.
    -->
    <a href="#" class="shrink-0 group" aria-label="Domů">
      <Logo className="h-10 w-auto" aria-hidden="true" />
    </a>

    <!--
      2. NAVIGATION & CTA
      Layout: Flex Row with gap-10
    -->
    <div class="flex items-center gap-10">
      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center">
        {
          navItems.map((item, index) => {
            const isLast = index === navItems.length - 1;
            const nextItem = navItems[index + 1];
            const needsMargin =
              !isLast &&
              (item.variant === undefined || nextItem.variant === undefined);
            const buttonGap = !isLast && item.variant && nextItem.variant;

            return item.variant ? (
              <Button
                href={item.href}
                variant={item.variant}
                textColor={
                  item.variant === "outline" ? "brand-dark" : undefined
                }
                className={cn(
                  "py-2.5",
                  needsMargin && "mr-5",
                  buttonGap && "mr-px",
                )}
              >
                {item.name}
              </Button>
            ) : (
              <a
                href={item.href}
                class={cn(
                  "text-base font-bold italic text-brand-dark hover:text-brand-green transition-colors",
                  needsMargin && "mr-5",
                )}
              >
                {item.name}
              </a>
            );
          })
        }
      </nav>

      <!--
        CTA BUTTON
        Using standardized Button component
      -->
      <div class="hidden md:block">
        <Button href="#poptavka" variant="dark" className="py-2.5">
          Poptávka
        </Button>
      </div>

      <!-- Mobile Menu Trigger (Inline SVG for now) -->
      <button
        class="md:hidden text-brand-dark p-2 hover:text-brand-green transition-colors"
        aria-label="Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-8 h-8"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"></path>
        </svg>
      </button>
    </div>
  </div>
</header>
````

## File: package.json
````json
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
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "astro": "^5.16.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.24.9",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
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
````
