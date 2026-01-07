# AGENTS.md - Development Guidelines for Sitovka

## Build & Development Commands

### Core Commands
- `npm run dev` - Start development server at localhost:4321
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
└── utils/          # Utility functions and helpers

public/             # Static assets (images, fonts, etc.)
```

## Key Considerations

1. **Static Output**: Project configured for static site generation (`output: "static"`)
2. **Tailwind Integration**: Custom theme variables defined in `global.css`
3. **Keystatic CMS**: Headless CMS integration for content management
4. **No Build Tools**: Uses Astro's built-in tooling, no separate bundler config

## Development Workflow

1. Start development server: `npm run dev`
2. Check for TypeScript errors: `astro check`
3. Build for production: `npm run build`
4. Preview production build: `npm run preview`

## Security Notes

- Never commit `.env` files or sensitive data
- Validate all external inputs and API responses
- Use Astro's built-in XSS protection for user content
- Keep dependencies updated regularly