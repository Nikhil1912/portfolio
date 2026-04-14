# PLAN.md — Implementation Plan

## Decisions Log

All architectural and tooling decisions made during planning. This is the canonical reference — if DESIGN.md or CLAUDE.md conflict with this table, update them to match.

| Decision | Choice | Rationale |
|---|---|---|
| Deployment model | Hybrid on Vercel (SSG + server action for contact) | Static pages for performance, server action avoids external form service |
| Animations | CSS + Intersection Observer | framer-motion is ~32KB for animations achievable in CSS. Add it only if we hit a wall. |
| Lightbox open transition | Simple fade/scale from center | Origin-aware expand is fragile and not supported by yet-another-react-lightbox OOTB. Revisit later. |
| Image placeholders | Base64 blur (20px wide, inlined) | Simpler than blurhash, no client-side decoder, works without JS. |
| Image pipeline phasing | Local placeholders -> sharp script -> R2 | Unblocks gallery UI development before infrastructure is ready. |
| Work page data model | Typed TypeScript constants | Site content updates are infrequent. No need for CMS or markdown files. |
| SkillRibbon | Removed | Skills shown contextually inline with each role/project convey more information than a collected dump. Ribbon added visual noise without informational value. |
| Section padding pattern | `px-8` on outer element, `max-w-[1200px] mx-auto` on inner div | Matches NavBar/Hero pattern; content aligns correctly at all viewport widths including >1200px. |
| Tailwind version | v4 | CSS-based config, faster builds, automatic content detection. |
| Contact form | Resend (notify owner + confirm visitor) | Free tier, stays in codebase, no external form service. |
| Photo categories | Metadata only, no filtering UI | Keep gallery simple. Can add filtering later if needed. |
| Testing | Ships with each PR | No testing debt. Codified in CLAUDE.md. |
| CI/CD | GitHub Actions (lint + typecheck + test) | Free for public repos. Runs on every PR. |
| Analytics | None | Add later if needed. |
| JS budget | 200KB gzipped per page | Relaxed from 150KB to give gallery page headroom. |
| Logo | NM Monogram (Concept B), monogram only in nav | Square frame, interlocked letters, shared stroke removed. |
| Design system enforcement | Tailwind theme tokens + component primitives + CLAUDE.md rules | Three layers: make wrong thing hard, right thing easy, violations visible. |
| Contact page heading color | `text-primary` (Forest Green) instead of neutral `on_surface` | User preference — matches the Work page heading. Deliberate exception to the "track colors don't cross" rule. |
| Contact page layout | Asymmetric split (context 40% left, form 60% right) instead of centered card | Centered card felt dated; split mirrors the TrackTeaser language and gives the page personality. |
| Contact social links | Removed social links section; replaced with scroll-to-footer anchor | Footer already has social links — duplication without value. A single `label-sm` anchor pointing to `#footer` is cleaner. |
| Node version | 22 (.nvmrc) | System default. |
| Package manager | npm | |
| Git remote auth | HTTPS + Personal Access Token | Work machine with work SSH config; per-repo identity for personal GitHub. |
| NavBar style | Solid background, shadow on scroll | Glassmorphism barely visible on neutral backgrounds, adds CSS complexity, feels dated. |
| Primary button style | Flat solid `primary` | Gradients add visual complexity; flat is more minimal (Linear, Vercel, Stripe precedent). |
| Hero animation | Single group fade-in | Per-element stagger (3 animations in first second) feels busy; single fade is more confident. |
| Surface tones | Max 3 per page | Simplify from 5-6 tones to: `surface`, `surface_container_low`, `surface_container_lowest`. |

---

## Prerequisites (User Action Items)

Items you need to do, organized by when they become blocking.

### Before Phase 1 (Blocks Everything)

- [ ] **Git setup:** Initialize repo, set HTTPS remote, configure per-repo identity
  ```bash
  cd /Users/mehran3/Repos/personal_website
  git init
  git remote add origin https://github.com/YOUR_USER/personal_website.git
  git config user.name "Your Name"
  git config user.email "your-personal@email.com"
  ```
- [ ] **GitHub PAT:** Create a fine-grained Personal Access Token scoped to this repo (Settings -> Developer Settings -> Fine-grained tokens). Git will prompt for it on first push.

### Before Phase 5 (Contact Page)

- [ ] **Resend account:** Sign up at resend.com. Verify a sending domain (or use sandbox for dev). Get API key.
- [ ] **Email address:** Decide where contact form submissions should be sent.

### Before Phase 7 (R2 Integration)

- [ ] **Cloudflare account:** Sign up (free). Create an R2 bucket. Get API credentials (Account ID, Access Key ID, Secret Access Key).
- [ ] **R2 bucket config:** Create a public bucket or configure a custom domain for image delivery.

### Before Phase 9 (Content & Launch)

- [ ] **Professional experience:** Roles, companies, dates, 1-2 sentence descriptions for each.
- [ ] **Projects:** 2-3 projects with names, descriptions, GitHub URLs, and screenshots.
- [ ] **Photos:** ~100 original photos (high-res) ready for processing. Decide which photo goes on the home page hero panel.
- [ ] **Resume PDF:** Final version for download.
- [ ] **Social URLs:** GitHub, LinkedIn, Instagram, and any others.
- [ ] **Domain name:** Purchased and DNS configured to point to Vercel.

---

## Phase 1: Scaffolding

> **PR #1** — Foundation: Next.js, Tailwind, fonts, design tokens, tooling, CI.

This PR establishes the project skeleton. After merging, every future PR builds on a working, linted, tested, CI-gated foundation.

### Tasks

- [x] Initialize Next.js 15 (App Router, TypeScript strict mode)
- [x] Configure Tailwind v4 with full design system token mapping:
  - Colors: all surface, primary, secondary, tertiary, outline, error tokens from `design_system.md`
  - Typography: `display-lg`, `headline-md`, `body-md`, `label-sm` as composite utilities (font family + size + weight + tracking + line-height)
  - Spacing: full scale from `design_system.md`
  - Border radius: `none`, `sm`, `md` per button spec
- [x] Set up `next/font` for Space Grotesk (400, 700) and Manrope (400, 500, 700)
- [x] Create directory structure per CLAUDE.md (app/, features/, components/, hooks/, utils/, lib/, types/, styles/)
- [x] Create empty route files: `app/page.tsx`, `app/work/page.tsx`, `app/gallery/page.tsx`, `app/contact/page.tsx`
- [x] Create root layout (`app/layout.tsx`) with font providers and minimal HTML structure
- [x] Set up `cn()` utility (clsx + tailwind-merge)
- [x] Configure ESLint + Prettier
- [x] Configure Vitest + React Testing Library
- [x] Set up GitHub Actions workflow (lint + typecheck + test on PR)
- [x] Add `.nvmrc` (Node 22)
- [x] Add `.gitignore` (node_modules, .next, .env*, etc.)
- [x] Update CLAUDE.md:
  - Add testing-with-PR rule
  - Add design system enforcement rules (no arbitrary values, no borders for sections, no shadows, track colors don't cross)
  - Update JS budget to 200KB
  - Replace framer-motion with CSS + Intersection Observer in tech stack
- [x] Verify: `npm run dev` serves a blank page, `npm run build` succeeds, `npm run lint` passes, `npm run test` passes (with placeholder test), CI runs green

### Acceptance Criteria

- All design system tokens from `design_system.md` are mapped to Tailwind theme — verify by inspecting the CSS `@theme` block
- Both fonts load without layout shift (check Network tab)
- CI pipeline triggers on PR and passes
- Directory structure matches CLAUDE.md spec
- TypeScript strict mode is on and `npm run typecheck` passes

---

## Phase 2: Shared Components

> **PR #2** — NavBar, MobileMenu, Footer, Button, SectionLabel, Input, ScrollReveal, NM Monogram.

The reusable building blocks. After this PR, all four pages can be composed from these primitives.

### Tasks

- [x] **NM Monogram:** Create SVG component — N and M interlocked in Space Grotesk geometry, shared vertical stroke removed, square frame. Monochrome (`on_surface`). Export as React component + SVG favicon (`public/icon.svg`).
- [x] **NavBar:** Fixed top bar, solid `surface` background. On scroll, add subtle bottom shadow (`rgba(26,28,27,0.04)`, 8px blur). Monogram left (links to /), nav links right ("Work", "Gallery", "Contact"). Active link: 2px underline, color matches current wing (green on /work, terracotta on /gallery, neutral elsewhere). Height ~64px.
- [x] **MobileMenu:** Hamburger icon on mobile (<1024px). Full-screen overlay with links stacked vertically, centered, in `headline-md`. Close button top-right. Slide-down transition.
- [x] **Footer:** Name, social links (placeholder URLs), copyright. `surface_container_low` background.
- [x] **Button:** Three variants — Primary (flat `primary` background, square corners), Secondary (terracotta, `md` rounding), Tertiary (no background, underline with `surface_tint` stroke). All with press animation (scale 0.98).
- [x] **SectionLabel:** `label-sm`, uppercase, +0.1em tracking. Accepts `track` prop ("engineering" | "photography") to set accent color.
- [x] **Input / Select / Textarea:** Bottom-border-only style using `outline_variant`. Focus transitions border to accent color. Labels associated via `<label>`.
- [x] **ScrollReveal:** Wrapper component using Intersection Observer + CSS animations. Fade-in + translate-up (400ms ease-out). Supports stagger delay prop. Respects `prefers-reduced-motion`.
- [x] **SocialLinks:** Icon + label for each platform. Horizontal on desktop, vertical on mobile.
- [x] Integrate NavBar + Footer into root layout
- [x] Write tests for all components:
  - NavBar: renders links, active state matches route, monogram links to home
  - MobileMenu: opens/closes, focus trap, escape to close
  - Button: renders all variants, click handler fires, keyboard accessible
  - ScrollReveal: respects reduced-motion preference
  - Input: focus state, label association, accessible name

### Acceptance Criteria

- NavBar renders on all route pages with correct active state coloring
- Mobile menu opens/closes, traps focus, dismisses on Escape
- All buttons meet WCAG AA contrast on their intended backgrounds
- ScrollReveal does nothing when `prefers-reduced-motion` is active
- All form inputs have accessible labels
- Monogram renders at favicon sizes without losing legibility
- All component tests pass

---

## Phase 3: Home Page

> **PR #3** — Hero section, two-track teaser, responsive layout, animations.

### Tasks

- [x] **Hero section:** "Nikhil" in `display-lg`, left-aligned with generous left padding. "Code & Light" in `headline-md`, offset right (asymmetry). 1-2 sentence intro in `body-md`, further offset. Single group fade-in with translate-up (~12px, 400ms ease-out) using ScrollReveal.
- [x] **TrackTeaser:** Asymmetric split — left panel (~45%) Engineering, right panel (~55%) Photography. Engineering: `surface_container_low` background, "The Work" label in `label-sm` Forest Green, placeholder image/texture. Photography: `surface_container_lowest` background, "The Gallery" label in `label-sm` Terracotta, placeholder hero photo. Both panels are full clickable links. On mobile: stack vertically, full width.
- [x] Panels fade in together after hero with subtle scale-up (0.97 -> 1.0).
- [x] `app/page.tsx` is a thin wrapper importing from `features/home/`.
- [x] Write tests:
  - Hero text renders
  - Both panels link to correct routes (/work, /gallery)
  - Panels are keyboard-navigable (Tab + Enter)

### Acceptance Criteria

- Visual asymmetry is obvious — this does not look like a 50/50 split
- Hero fade-in animation plays on load (and is disabled under reduced-motion)
- Mobile layout stacks cleanly with no horizontal overflow
- Both panels navigate to the correct routes
- Page JS < 200KB gzipped

---

## Phase 4: Work Page

> **PR #4** — Experience section, skills, project cards, resume download.

### Tasks

- [x] **Data layer:** Define TypeScript interfaces for Experience and Project. Create placeholder data in `features/work/data/` (2-3 experience entries, 2-3 projects with realistic-looking placeholder content).
- [x] **Page header:** "The Work" in `display-lg` Forest Green. Subtitle in `body-md`. Download Resume button (Primary variant, links to placeholder PDF).
- [x] **Experience section:** `surface_container_low` background zone. Current role gets prominence (company in `headline-md`, title in `body-md` bold, impact statement). Past roles compact (single row each). `spacing.8` between entries, no dividers. Skill tags inline near relevant roles.
- [x] **SkillTag:** Small `label-sm` tag on `surface_container_low` background.
- [x] ~~**SkillRibbon:**~~ Removed — see Decisions Log. Skills appear contextually inline with each role and project card instead.
- [x] **Projects section:** Back to base `surface` background. 2-3 project cards stacked vertically with `spacing.12` between. Each card: `surface_container_lowest` background, screenshot placeholder on one side + text on the other (alternating sides on desktop, stacked on mobile). Project name in `headline-md`, blurb in `body-md`, GitHub link as Tertiary button, tech tags below.
- [x] **Scroll animations:** Experience entries fade in on scroll (staggered 80ms). Project cards slide in from alternating sides (~20px translate + opacity).
- [x] `app/work/page.tsx` is a thin wrapper.
- [x] Write tests:
  - Experience entries render from data
  - Project cards render with correct links
  - Resume download button has correct href

### Acceptance Criteria

- Clear visual rhythm between Experience and Projects sections (background color shifts, not borders)
- Alternating project card layout visible on desktop
- No skill tag overflows its container
- Resume button triggers a download (placeholder file is fine)
- Page JS < 200KB gzipped

---

## Phase 5: Contact Page

> **PR #5** — Contact form, server action, Resend integration, social links.

**User prerequisite:** Resend account, API key, verified sending domain, target email address.

### Tasks

- [x] **Contact form:** Asymmetric split layout — context panel left (40%), form panel right (60%). Fields: Name (text), Email (email), Reason (select: "Freelance / Contract", "Photography Inquiry", "Just Saying Hi", "Other"), Message (textarea). All inputs use the shared Input/Select/Textarea components.
- [x] **Client-side validation:** Required fields, email format. Inline error messages below fields.
- [x] **Server action:** `features/contact/actions/sendMessage.ts`. Sends email via Resend to the configured address. Sends confirmation email to the visitor. Returns success/error. Note: Resend SDK returns `{ data, error }` — does not throw on failure; results must be checked explicitly.
- [x] **Success state:** Form replaced by confirmation message + SVG checkmark animation.
- [x] **Error state:** Inline error message below submit button in `error` color.
- [x] ~~**Alternative contact section:**~~ Replaced with a `text-label-sm` scroll anchor ("Or find me at the bottom of the page ↓") pointing to `#footer`. See Decisions Log.
- [x] **Page header:** "Get in Touch" in `display-lg` Forest Green. "The inbox is open." subtitle in `body-md`.
- [x] **Environment variables:** `RESEND_API_KEY`, `CONTACT_EMAIL_TO` — documented in `.env.example`.
- [x] `app/contact/page.tsx` is a thin wrapper.
- [x] Write tests:
  - Form validates required fields
  - Form validates email format
  - Submit calls server action (mock Resend)
  - Success state renders after submission
  - Error state renders on failure
  - Footer scroll hint renders with correct href

### Acceptance Criteria

- Form is fully keyboard-navigable (Tab through fields, Enter to submit)
- Validation errors are announced to screen readers (aria-live or aria-describedby)
- Server action does not expose API keys to the client
- Success/error states are visually distinct
- Page JS < 200KB gzipped

---

## Phase 6: Gallery Page (UI)

> **PR #6** — Photo grid, load-more, lightbox. All using placeholder/local images.

### Tasks

- [ ] **photos.json schema:** Define TypeScript interface. Create placeholder manifest with ~20 entries (use freely licensed placeholder photos or solid color images with varied aspect ratios).
- [ ] **PhotoGrid:** Justified row-based layout using `react-photo-album`. Target row heights: desktop ~280px, tablet ~240px, mobile ~200px. Gap: `spacing.2`. Grid area on `surface_container_low` background.
- [ ] **LoadMoreButton:** Initial load 16 photos. "Load More" Secondary button (Terracotta, centered). Each press loads next 16. Disappears when exhausted, replaced by "That's everything -- for now." in `label-sm`.
- [ ] **Lightbox:** Dynamic import of `yet-another-react-lightbox` + zoom plugin. Full-screen dark overlay. Photo at max viewport size, centered. Close button top-right, arrow nav, counter bottom-center. Keyboard nav (arrows, Escape). Swipe on mobile. Zoom (pinch on mobile, scroll on desktop). Open transition: fade/scale. Close: reverse.
- [ ] **Photo fade-in:** Grid images fade in (opacity 0 -> 1, 300ms) as they load.
- [ ] **Page header:** "The Gallery" in `display-lg` Terracotta. Optional subtitle in `body-md`.
- [ ] `app/gallery/page.tsx` is a thin wrapper.
- [ ] Write tests:
  - Grid renders correct number of initial photos (16)
  - Load More button loads next batch
  - Load More disappears when all photos loaded
  - Lightbox opens on photo click
  - Lightbox closes on Escape
  - Lightbox keyboard navigation (left/right arrows)

### Acceptance Criteria

- Grid handles mixed aspect ratios gracefully (no stretched or cropped images)
- Lightbox is dynamically imported (not in initial bundle — verify with bundle analyzer)
- Load More works correctly through all batches to exhaustion
- Lightbox traps focus and supports full keyboard navigation
- Gallery page JS < 200KB gzipped (including dynamic lightbox chunk loaded on interaction)
- Photos fade in smoothly as they load

---

## Phase 7: Image Pipeline

> **PR #7** — Sharp processing script, multi-size WebP generation, base64 blur placeholders, photos.json generation.

### Tasks

- [ ] **Processing script:** `scripts/process-photos.ts` — reads originals from a local `/originals` directory (gitignored), generates:
  - Thumbnail: 400px wide, WebP
  - Medium: 800px wide, WebP
  - Large: 1600px wide, WebP
  - Full: 2400px wide, WebP
  - Blur placeholder: 20px wide, base64 data URI
- [ ] **Manifest generation:** Script outputs/updates `public/photos.json` with id, title, category, aspect_ratio, placeholder (base64), and relative paths to each size.
- [ ] **npm script:** `npm run photos:process` runs the pipeline.
- [ ] **Output directory:** Processed images go to `public/photos/[id]/` (for local dev). Gitignored.
- [ ] **Update PhotoGrid** to use base64 placeholders from the manifest (blur-up effect).
- [ ] **Update `<img>` tags** to use `srcset` with all four sizes + `sizes` attribute for responsive delivery.
- [ ] Write tests:
  - Script generates correct number of variants per image
  - Script generates valid base64 placeholder
  - Script updates manifest with correct schema
  - Aspect ratio calculation is correct

### Acceptance Criteria

- Running `npm run photos:process` with sample originals produces all four sizes + placeholder
- Generated WebP files are significantly smaller than originals
- Blur placeholders display instantly while full images load
- `srcset` + `sizes` delivers appropriate image sizes at different viewports (verify in DevTools Network tab)

---

## Phase 8: R2 Integration

> **PR #8** — Cloudflare R2 upload, custom image loader, production image delivery.

**User prerequisite:** Cloudflare R2 bucket created, API credentials available.

### Tasks

- [ ] **R2 upload:** Extend `scripts/process-photos.ts` to upload processed images to R2 after generating them locally.
- [ ] **Environment variables:** `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` — documented in `.env.example`.
- [ ] **Custom image loader:** Configure Next.js image loader (or a utility function) to construct R2 URLs from photo ID + size.
- [ ] **Update photos.json:** URLs point to R2 public bucket instead of local paths.
- [ ] **Update PhotoGrid + Lightbox:** Source images from R2 URLs.
- [ ] **npm script update:** `npm run photos:process` now processes + uploads. Add `npm run photos:process --local-only` flag for dev without R2.
- [ ] Write tests:
  - Image loader constructs correct R2 URLs
  - Fallback behavior when R2 is unavailable (graceful error)

### Acceptance Criteria

- Photos load from R2 in production
- Local development still works without R2 credentials (local fallback)
- No image binaries committed to the repo
- CDN caching headers are set correctly on R2 objects

---

## Phase 9: Polish & Accessibility

> **PR #9** — Animation audit, accessibility audit, performance audit, cross-browser/device testing.

### Tasks

- [ ] **Animation audit:**
  - All scroll reveals fire correctly and at intended thresholds
  - Stagger timings feel natural (adjust if needed)
  - Page transitions (route changes) have a subtle crossfade
  - All animations disabled under `prefers-reduced-motion`
- [ ] **Accessibility audit:**
  - Full keyboard navigation test: every interactive element reachable via Tab, activatable via Enter/Space
  - Focus visible on all interactive elements
  - Lightbox focus trap works correctly
  - Mobile menu focus trap works correctly
  - All images have alt text
  - All form inputs have labels
  - ARIA landmarks: `<nav>`, `<main>`, `<footer>` on every page
  - Skip-to-content link
  - Run axe DevTools or similar on every page, fix all violations
- [ ] **Performance audit:**
  - Run Lighthouse on every page. Target: Performance >= 90, Accessibility >= 90, Best Practices >= 90
  - Verify gallery page JS < 200KB gzipped (check with bundle analyzer)
  - Verify all grid images lazy-load except first row
  - Verify base64 blur placeholders display before images load
  - Check Largest Contentful Paint on each page
- [ ] **Responsive testing:**
  - Test at 375px (iPhone SE), 768px (tablet), 1024px, 1440px
  - Verify no horizontal overflow on any page
  - Verify touch targets >= 44x44px on mobile
- [ ] **Cross-browser:**
  - Chrome, Firefox, Safari (desktop)
  - iOS Safari, Chrome Android (mobile)
- [ ] Fix all issues found

### Acceptance Criteria

- Lighthouse scores meet targets on all four pages
- Zero axe violations
- No visual regressions at any tested breakpoint
- Animations are completely absent under reduced-motion
- Gallery lightbox works on all tested browsers including mobile

---

## Phase 10: Content & Launch

> **PR #10** — Replace all placeholders with real content. Deploy to production.

**User prerequisite:** All content items from the Prerequisites section above.

### Tasks

- [ ] Replace placeholder experience data with real roles, companies, dates, descriptions
- [ ] Replace placeholder project data with real projects, screenshots, GitHub URLs
- [ ] Replace placeholder social URLs with real profiles
- [ ] Replace placeholder resume PDF with real file
- [ ] Process real photos through the pipeline (`npm run photos:process`)
- [ ] Select home page hero photo and update TrackTeaser
- [ ] Add camera/lens info to gallery subtitle (optional)
- [ ] Configure Vercel production deployment
- [ ] Set environment variables in Vercel (RESEND_API_KEY, CONTACT_EMAIL_TO, R2 credentials)
- [ ] Verify a sending domain in Resend and update the `from` address in `src/features/contact/actions/sendMessage.ts` (currently uses `onboarding@resend.dev` sandbox default)
- [ ] Configure custom domain in Vercel
- [ ] Final Lighthouse run on production
- [ ] Final manual test of all pages on production URL

### Acceptance Criteria

- All placeholder content is replaced
- Contact form sends emails successfully in production
- Photos load from R2 in production
- Custom domain works with HTTPS
- Lighthouse scores still meet targets on production

---

## Phase Dependency Graph

```
Phase 1 (Scaffolding)
  |
  v
Phase 2 (Shared Components)
  |
  +---> Phase 3 (Home)
  |       |
  +---> Phase 4 (Work)
  |       |
  +---> Phase 5 (Contact)  [needs Resend account]
  |       |
  +---> Phase 6 (Gallery UI)
          |
          v
        Phase 7 (Image Pipeline)
          |
          v
        Phase 8 (R2 Integration)  [needs R2 bucket]
          |
          v
        Phase 9 (Polish)
          |
          v
        Phase 10 (Launch)  [needs all content]
```

Phases 3-5 can be built in any order after Phase 2. Phase 6 must come before 7. The ordering above (Home -> Work -> Contact -> Gallery) gives the best review flow: simple pages first, complex pages last.
