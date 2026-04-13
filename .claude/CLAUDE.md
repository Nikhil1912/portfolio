# CLAUDE.md — Project Rules

## Project Overview

Personal website for Nikhil Mehra ("Code & Light"). Two-wing portfolio: Engineering (/work) and Photography (/gallery). See `DESIGN.md` for full design specification and `design_system.md` for the design system.

## Tech Stack

- **Framework:** Next.js 15 (App Router, static export where possible)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + React Testing Library (unit/component) · Playwright (E2E + visual via MCP)
- **Linting:** ESLint + Prettier
- **Photo Grid:** react-photo-album
- **Lightbox:** yet-another-react-lightbox (with zoom plugin)
- **Animations:** CSS + Intersection Observer (no framer-motion — achieved in CSS at zero bundle cost)
- **Image Processing:** sharp (build-time script)
- **Image Storage:** Cloudflare R2
- **Hosting:** Vercel
- **Contact Form:** Next.js Server Action + Resend
- **Fonts:** next/font (Space Grotesk + Manrope)

## Project Structure

Hybrid feature-based organization. Route files in `app/` are thin wrappers that import from `features/`. Shared code lives at the top level.

```
src/
├── app/                        # Next.js App Router — routing only
│   ├── layout.tsx              # Root layout (fonts, nav, footer)
│   ├── page.tsx                # Home — imports from features/home
│   ├── work/
│   │   └── page.tsx            # Imports from features/work
│   ├── gallery/
│   │   └── page.tsx            # Imports from features/gallery
│   └── contact/
│       └── page.tsx            # Imports from features/contact
│
├── features/                   # Feature modules (page-specific code)
│   ├── home/
│   │   ├── components/         # Hero, TrackTeaser, etc.
│   │   └── index.ts
│   ├── work/
│   │   ├── components/         # ExperienceCard, ProjectCard, SkillTag, WorkPage
│   │   ├── data/               # Experience and project data (typed constants)
│   │   └── index.ts
│   ├── gallery/
│   │   ├── components/         # PhotoGrid, LoadMoreButton, Lightbox wrapper, etc.
│   │   ├── hooks/              # usePhotoLoader, useLightbox, etc.
│   │   ├── utils/              # Photo URL builders, batch logic
│   │   └── index.ts
│   └── contact/
│       ├── components/         # ContactForm, SocialLinks, etc.
│       ├── actions/            # Server actions (form submission)
│       └── index.ts
│
├── components/                 # Shared components used across features
│   ├── ui/                     # Design system primitives: Button, Input, Select, SectionLabel, etc.
│   ├── layout/                 # NavBar, MobileMenu, Footer, ScrollReveal
│   └── index.ts
│
├── hooks/                      # Shared hooks (useMediaQuery, useScrollDirection, etc.)
├── utils/                      # Shared utilities (cn(), formatDate, etc.)
├── lib/                        # Third-party wrappers and configs (resend client, R2 client, etc.)
├── types/                      # Shared TypeScript types and interfaces
└── styles/                     # Global CSS, Tailwind theme tokens
```

### Structure Rules

- **Route files are thin.** `app/**/page.tsx` should contain at most a metadata export and a single component import from `features/`. No business logic in route files.
- **Feature folders own their components.** If a component is only used by one feature, it lives in that feature's `components/` folder. Only promote to `src/components/` when used by 2+ features.
- **Barrel exports.** Every feature folder and `src/components/` must have an `index.ts` re-exporting its public API. Import from the barrel, not from internal paths.
- **Co-location is fine.** Small helper components, type definitions, or constants that serve a single component can live in the same file.
- **No circular imports.** Features may import from `components/`, `hooks/`, `utils/`, `lib/`, and `types/`. Features must never import from each other. Shared code must never import from features.

## Coding Conventions

### TypeScript
- `strict: true` in `tsconfig.json`. No exceptions.
- Never use `any`. Use `unknown` and narrow, or define a proper type.
- Prefer `interface` for object shapes, `type` for unions/intersections/utilities.
- All exported functions and components must have typed parameters and return types.

### Components
- Named exports only. No default exports — **except** for Next.js route files (`layout.tsx`, `page.tsx`, `error.tsx`, `loading.tsx`) which must use `export default` as required by the framework.
- PascalCase filenames for components: `PhotoGrid.tsx`, `ExperienceCard.tsx`.
- camelCase for hooks: `usePhotoLoader.ts`.
- camelCase for utilities: `formatDate.ts`.
- Props interfaces are named `{ComponentName}Props` and defined immediately above the component in the same file.
- Keep components focused. If a component exceeds ~150 lines, consider splitting.

### Styling (Tailwind)
- Use Tailwind utility classes directly on elements. This is the primary styling method.
- For complex or repeated class combinations, extract to a `cn()` utility (clsx + tailwind-merge).
- Map all design system tokens from `design_system.md` into the Tailwind theme config (colors, spacing, typography, border-radius). Reference tokens by name, not raw hex values.
- Never use inline `style={{}}` unless dynamically computed (e.g., grid dimensions from aspect ratios).
- Never use CSS modules or styled-components.

### General
- Comments only where logic is non-obvious. No JSDoc on every function. No "this function does X" comments that restate the code.
- No dead code. No commented-out code. No unused imports.
- Prefer early returns over deeply nested conditionals.
- Use `const` by default. `let` only when reassignment is necessary. Never `var`.

## Testing

### Strategy
- **Unit tests** for all hooks, utilities, and non-trivial logic.
- **Component tests** for all shared UI components (`src/components/`). Test behavior and accessibility, not implementation details.
- **Integration tests** for key user flows within each feature:
  - Gallery: grid loads, "Load More" fetches next batch, lightbox opens/closes, zoom works.
  - Work: experience renders, project cards link correctly, PDF download triggers.
  - Contact: form validates, submits, shows success/error state.
  - Home: navigation to both wings works.
- **Visual/manual verification** via the Playwright MCP server — navigate pages, take screenshots, and inspect rendered output directly in Claude Code sessions. Use this to verify UI after implementing each page, especially layout, active states, and responsive behaviour. Run `npm run dev` first.
- **Skip trivial tests.** Don't test that a static heading renders. Test behavior, interaction, and conditional logic.

### Rules
- Unit/component framework: Vitest + React Testing Library.
- E2E framework: Playwright (`npm run test:e2e`). Config in `playwright.config.ts`. Uses installed Google Chrome (`channel: 'chrome'`) — no separate browser download needed.
- Test files live next to the code they test: `PhotoGrid.tsx` → `PhotoGrid.test.tsx`. E2E tests live in `e2e/`.
- Use `screen.getByRole` / `getByLabelText` over `getByTestId`. Test what the user sees.
- No snapshot tests. They add noise and break on any change.
- Mock external services (R2, Resend) in tests. Never mock internal modules unless absolutely necessary.
- All tests must pass before a PR is merged.
- **Tests ship with the PR.** Every PR that adds or changes behavior must include tests for that behavior. No testing debt.

## Git & Workflow

### Commits
- Follow conventional commits: `feat:`, `fix:`, `chore:`, `test:`, `style:`, `refactor:`, `docs:`.
- Keep commits atomic. One logical change per commit.
- Write commit messages that explain **why**, not what. The diff shows the what.

### Branches & PRs
- Branch from `main`. Use descriptive branch names: `feat/gallery-lightbox`, `fix/contact-form-validation`.
- Every change goes through a PR. No direct commits to `main`.
- PR descriptions must include: what changed, why, and how to test it.
- PRs must pass all tests and lint checks before review.
- Nikhil reviews all PRs before merge.

## Dependencies

- External libraries are allowed when they are well-maintained, solve a real problem, and are justified.
- Before adding a dependency, consider: Can this be done in <50 lines of code without the library? If yes, write it yourself.
- Pin major versions in `package.json`.
- Document why a non-obvious dependency was added in the PR description.
- Audit for bundle size impact. Prefer libraries that support tree-shaking.

## Accessibility

- Semantic HTML: use `<nav>`, `<main>`, `<article>`, `<section>`, `<button>`, etc. No `<div>` buttons.
- All interactive elements must be keyboard accessible (Tab, Enter, Escape).
- All images must have `alt` text (photos can use the title from `photos.json`).
- Form inputs must have associated `<label>` elements.
- Lightbox must trap focus and support Escape to close.
- Respect `prefers-reduced-motion` — disable all animations when active.
- Color contrast: meet WCAG AA (4.5:1 for body text, 3:1 for large text) for all text on background combinations defined in the design system.

## Performance

### Bundle Size
- Track bundle size on every PR. Use `@next/bundle-analyzer` to inspect.
- No single page's JS bundle should exceed 200KB gzipped (excluding images). Gallery page gets headroom for the dynamically loaded lightbox chunk.
- Lazy-load below-the-fold content: photo grid batches, lightbox component (dynamic import).

### Lighthouse
- Target scores on every page:
  - Performance: >= 90
  - Accessibility: >= 90
  - Best Practices: >= 90
  - SEO: >= 80 (not a priority, but shouldn't be broken)
- Run Lighthouse before each release. Log scores in PR description for any changes that affect page load.

### Images
- All photos served via the optimized pipeline (see DESIGN.md Section 7).
- Grid images are lazy-loaded. First row loads eagerly.
- Blur placeholders for all photos (blurhash in `photos.json`).
- Use `srcset` + `sizes` for responsive delivery.
- Never commit image binaries to the repo.

## Design System

All visual decisions are governed by `design_system.md`. Key rules to enforce:

### Enforcement Rules (violations are bugs)
- **No arbitrary Tailwind values.** Every color, spacing, or size must come from the design token set defined in `src/styles/globals.css`. No `bg-[#163526]`, `p-[17px]`, or `text-[0.8rem]`.
- **No borders for section separation.** Background color shifts only. No `border`, `border-t`, `divide-*`, or `hr` elements for layout sectioning.
- **No box-shadows for elevation.** Use tonal layering (`surface` → `surface-container-low` → `surface-container-lowest`). The only permitted shadow is the nav scroll shadow and the lightbox ambient shadow (both defined in `design_system.md`).
- **Track colors don't cross.** Forest Green (`primary`, `primary-container`) is for Engineering wing only (`/work`). Terracotta (`secondary`, `secondary-container`) is for Photography wing only (`/gallery`). Never use a track color outside its wing.
- **Typography scale is fixed.** Use `text-display-lg`, `text-headline-md`, `text-body-md`, `text-label-sm`. No ad-hoc `text-xl`, `text-2xl`, `font-bold`, or `leading-*` overrides.
- **Max 3 surface tones per page.** Use `surface` (default), `surface-container-low` (inset sections), `surface-container-lowest` (lifted cards). Do not introduce additional tones.
- **Space Grotesk + Manrope only.** No other fonts. Use `font-heading` for headings, `font-body` for body text.
