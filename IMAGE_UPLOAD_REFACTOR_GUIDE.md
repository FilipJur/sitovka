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
    class="w-full h-full rounded-[60px] max-h-[500px]"
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
