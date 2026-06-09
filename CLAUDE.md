# Claude AI Integration Guide

This project uses Figma Model Context Protocol (MCP) for design-to-code workflows.

## Quick Reference

**Full Documentation:** `.cursor/rules/design_system_rules.mdc`

## Tech Stack Summary

- **Framework:** React 19 + TypeScript 5.7
- **Build Tool:** Vite 6.3
- **Styling:** Tailwind CSS 4.1 (utility-first, inline classes)
- **Animation:** Motion 12.23 (Framer Motion fork)
- **UI Components:** Radix UI (Dialog, Slot)
- **Utilities:** class-variance-authority, clsx, tailwind-merge

## Key Patterns

### Component Structure
```tsx
import { useState } from "react";
import { motion } from "motion/react";

interface ComponentProps {
  title: string;
  variant?: "primary" | "secondary";
}

export default function Component({ title, variant = "primary" }: ComponentProps) {
  const [state, setState] = useState(false);
  
  return (
    <motion.div className="p-6 rounded-lg bg-white">
      {/* content */}
    </motion.div>
  );
}
```

### Styling Approach
- **Primary:** Tailwind utility classes (inline)
- **No CSS Modules** or component-specific CSS files
- Use `cn()` helper for conditional classes:
```tsx
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  'hover:classes'
)}>
```

### Animation Pattern
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 1
  }}
>
```

### Icon System
- **Storage:** `src/components/svg-icons-*.ts` (SVG path strings)
- **Naming:** `camelCase` with `Icon` suffix
- **Usage:**
```tsx
import icons from "./svg-icons-expanded";
<path d={icons.profileIcon} fill="currentColor" />
```

## Figma → Code Workflow

1. **Extract Design Tokens**
   - Colors → Tailwind utilities (`bg-slate-800`, `text-white`)
   - Typography → Tailwind text classes (`text-4xl font-bold`)
   - Spacing → Tailwind spacing scale (`p-8`, `gap-6`)

2. **Create Component Structure**
   - Define TypeScript interface for props
   - Use functional component with hooks
   - Apply Tailwind classes inline

3. **Handle Assets**
   - SVG icons → Extract path data → Add to `svg-icons-*.ts`
   - Images → Save to `src/assets/`, import in components
   - Inline SVGs for dynamic content

4. **Implement Animations**
   - Use Motion for complex animations
   - Use Tailwind `transition-*` for simple effects
   - Reference `AnimationPresets.ts` for spring physics values

5. **Responsive Design**
   - Mobile-first approach (no prefix = mobile)
   - Breakpoints: `md:` (768px), `lg:` (1024px), `xl:` (1280px)

## Common Tailwind Patterns

```tsx
// Layout
<div className="max-w-6xl mx-auto">                    // Centered container
<div className="flex gap-3">                           // Horizontal flex
<div className="flex flex-col gap-4">                  // Vertical flex
<div className="grid grid-cols-1 md:grid-cols-2">     // Responsive grid

// Cards
<div className="bg-white rounded-2xl shadow-lg p-8">

// Buttons
<button className="px-6 py-3 rounded-lg font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors">

// Gradients
<div className="bg-gradient-to-br from-slate-50 to-slate-100">
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ComponentName.tsx
│   ├── AnimationPresets.ts
│   └── svg-icons-*.ts
├── assets/             # Images, fonts
├── App.tsx             # Main app
├── index.css           # Global styles (Tailwind import)
└── main.tsx            # Entry point
```

## Development

```bash
pnpm run dev      # Start dev server (http://localhost:5173)
pnpm run build    # Build for production
pnpm run preview  # Preview production build
pnpm run lint     # Run ESLint
```

## Design Token Mapping

| Figma | Tailwind |
|-------|----------|
| Primary color | `bg-slate-800` |
| Secondary color | `bg-white` |
| H1 (48px, Bold) | `text-4xl font-bold` |
| H2 (32px, Bold) | `text-2xl font-bold` |
| Body (16px) | `text-base` |
| Small (14px) | `text-sm` |
| Padding 32px | `p-8` |
| Gap 12px | `gap-3` |
| Border radius 16px | `rounded-2xl` |

## Animation Presets

Reference `src/components/AnimationPresets.ts`:

```typescript
// Smooth (default)
{ stiffness: 260, damping: 20, mass: 1 }

// Bouncy
{ stiffness: 400, damping: 15, mass: 1 }

// Snappy
{ stiffness: 500, damping: 30, mass: 0.8 }

// Gentle
{ stiffness: 150, damping: 25, mass: 1.5 }
```

## File Naming

- **Components:** `PascalCase.tsx` (e.g., `Button.tsx`)
- **Utils/Config:** `camelCase.ts` (e.g., `animationPresets.ts`)
- **Types:** Define in component files or separate `.ts` files

## TypeScript Guidelines

- Use `interface` for component props
- Use `type` for unions/intersections
- Export interfaces that are used externally
- Make optional props explicit with `?`

```tsx
interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  children: React.ReactNode;
}
```

---

**For detailed documentation, see:** `.cursor/rules/design_system_rules.mdc`

