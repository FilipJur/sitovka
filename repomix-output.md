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
scripts/
  cleanup-images.js
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
    sections/
      about.json
      services.json
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

## File: src/components/home/BenefitCard.astro
````astro
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

## File: src/content/testimonials/.gitkeep
````

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
````javascript
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

## File: src/components/home/BenefitsRow.astro
````astro
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

## File: src/components/home/AboutUs.astro
````astro
---
import { getEntry } from "astro:content";
import BenefitsRow from "./BenefitsRow.astro";
import AboutBio from "./AboutBio.astro";
import HashtagIcon from "@/assets/icons/hashtag.svg?react";
import { PositionOverlay } from "@/components/ui/PositionOverlay";

const entry = await getEntry("about", "about");

// Robust defensive guard
if (!entry || !entry.data) {
  console.warn("About section data missing or corrupted.");
  return null;
}

const { benefits = [], bio } = entry.data;
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

## File: src/components/home/ServicesSection.astro
````astro
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

## File: src/components/home/AboutBio.astro
````astro
---
import Markdoc from "@markdoc/markdoc";

interface Props {
  bio: {
    heading: string;
    col1: string;
    col2: string;
    image?: any;
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
````

## File: src/components/home/ServiceCard.astro
````astro
---
import { DocumentRenderer } from '@keystatic/core/renderer';
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

const descriptionNode = Markdoc.parse(item.description);
const descriptionTree = Markdoc.transform(descriptionNode);
const descriptionElements = (descriptionTree && typeof descriptionTree === 'object' && 'children' in descriptionTree) ? descriptionTree.children : [];

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
    <div class="text-sm font-book text-brand-dark leading-relaxed">
      <DocumentRenderer document={descriptionElements as any} />
    </div>
  </div>
</div>
````

## File: src/content/sections/about.json
````json
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
````

## File: src/content/sections/services.json
````json
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
````

## File: src/layouts/Layout.astro
````astro
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

## File: src/pages/index.astro
````astro
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

## File: src/components/layout/Footer.astro
````astro
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

type FooterData = {
  company: { name: string; street: string; city: string };
  legal: { ico: string; dic: string; court: string };
  bank: { accountNumber: string; swift: string; iban?: string };
  socials?: {
    facebook?: string | null;
    instagram?: string | null;
    x?: string | null;
    linkedin?: string | null;
    youtube?: string | null;
  };
};

const { company, legal, bank, socials } = (footerEntry?.data as FooterData) || {
  company: { name: "", street: "", city: "" },
  legal: { ico: "", dic: "", court: "" },
  bank: { accountNumber: "", swift: "" },
};

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

## File: astro.config.mjs
````javascript
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
````astro
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

## File: src/content.config.ts
````typescript
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
      headingHighlight: z.string(),
      headingRemainder: z.string(),
      introText: z.string(),
      items: z.array(
        z.object({
          image: image().optional(),
          title: z.string(),
          description: z.string(),
        }),
      ),
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

export const collections = { about, services, footer, testimonials };
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
````
