# DESIGN.md — Nikhil's Personal Website

## 1. Vision

A personal website for **Nikhil Mehra** — software engineer and photographer — built around the tagline **"Code & Light."**

The site is structured as two distinct "wings" sharing a common entry point: an **Engineering wing** (/work) anchored in Forest Green, and a **Photography wing** (/gallery) anchored in Terracotta. The aesthetic follows the "Architectural Precision" north star defined in `design_system.md`: high-contrast, structural, asymmetric, and gallery-grade.

This is not a blog. It is a digital monograph — a curated presentation of professional work and creative output.

---

## 2. Site Map

```
/                   Home — the threshold
/work               Engineering wing (resume + projects)
/gallery            Photography wing (photo grid + lightbox)
/contact            Contact form + social links
```

Four pages. No nested routes. Clean and flat.

---

## 3. Page Designs

### 3.1 Home (`/`)

**Purpose:** Introduce Nikhil, present the tagline, and fork the visitor toward either wing.

**Color:** Neutral base (`surface` #f9f9f7). Both Forest Green and Terracotta appear as accents to hint at the two tracks, but neither dominates. The home page is a clean foyer — the color commitment happens when you enter a wing.

**Layout (top to bottom):**

1. **Hero Section**
   - Name: "Nikhil" in `Display-LG` (Space Grotesk, 3.5rem, -0.04em tracking), aligned left with generous left padding (~`spacing.16`).
   - Tagline: "Code & Light" in `Headline-MD` (Space Grotesk, 1.75rem), color `on_surface_variant` (#424843), positioned below and slightly offset to the right of the name (intentional asymmetry).
   - A brief 1-2 sentence intro in `Body-MD` (Manrope), further offset. Something like: "Software engineer by trade, photographer by instinct. I build web applications and chase light."
   - Large vertical whitespace below the hero (`spacing.20` or more) to let it breathe.

2. **The Fork — Two-Track Teaser**
   - A visually asymmetric split: left panel (~45% width) for Engineering, right panel (~55%) for Photography.
   - **Engineering panel:** `surface_container_low` (#f4f4f1) background. A project screenshot or abstract code texture. Section label "The Work" in `Label-SM` (uppercase, +0.1em spacing) with Forest Green `primary` (#163526) color. Clicking anywhere navigates to /work.
   - **Photography panel:** `surface_container_lowest` (#ffffff) background. A single hero photograph (landscape, edge-to-edge bleed within the panel). Section label "The Gallery" in `Label-SM` with Terracotta `secondary` (#944925) color. Clicking anywhere navigates to /gallery.
   - On mobile: panels stack vertically (Engineering first, then Photography). Each takes full width.

3. **Footer**
   - Minimal: name, social links (GitHub, LinkedIn, Instagram), copyright.
   - `surface_container_low` (#f4f4f1) background. Text in `on_surface_variant`.

**Animations:**
- Hero content (name, tagline, intro) fades in as a single group with a subtle translate-up (~12px, 400ms ease-out).
- The two panels fade in together after the hero, with a subtle scale-up from 0.97 to 1.0.

---

### 3.2 Work (`/work`) — Engineering Wing

**Purpose:** Present professional experience and personal projects. This is the resume page.

**Color:** Forest Green as the accent throughout. Background remains `surface` (#f9f9f7) with `surface_container_low` (#f4f4f1) for section differentiation and `surface_container_lowest` (#ffffff) for lifted cards.

**Layout (top to bottom):**

1. **Page Header**
   - "The Work" in `Display-LG`, Forest Green `primary` (#163526).
   - A one-liner subtitle in `Body-MD`: "What I build, and where I've built it."
   - Download Resume button: Primary Engineer button style (flat `primary` background, square corners, `on_primary` text). Downloads a PDF.

2. **Experience Section**
   - Background: `surface_container_low` (#f4f4f1) to create a distinct zone.
   - Section label: "Experience" in `Label-SM`, uppercase, Forest Green.
   - **Current role** gets prominence: company name in `Headline-MD`, title in `Body-MD` bold, 1-2 sentence impact statement in `Body-MD` regular. All left-aligned.
   - **Past roles** (2-3): compact treatment. Each is a single row or tight card — company, title, timeframe, one sentence. Stacked vertically with `spacing.8` between them (no dividers, per the design system "Forbid Rule").
   - The overall feel is a clean, sparse timeline — not a dense CV.

3. **Skills**
   - No dedicated "Skills" header competing for attention. Skills appear as small inline tags near the experience entries and below each project card.
   - Implementation: a horizontal flow of `label-sm` tags on `surface_container_lowest` (#ffffff) backgrounds with `on_surface_variant` text. Tags cluster near the role/project where the skill is most relevant.
   - No collected skills ribbon — inline tags per role convey more context than a decontextualised dump.

4. **Projects Section**
   - Background: back to base `surface` to create rhythm.
   - Section label: "Projects" in `Label-SM`, uppercase, Forest Green.
   - 2-3 project cards, stacked vertically (not a grid — intentional, to give each project room to breathe).
   - Each card:
     - `surface_container_lowest` (#ffffff) background (the "Lift" layer — sits above the base).
     - Screenshot/thumbnail on one side, text on the other (alternating left/right for visual rhythm on desktop; stacked on mobile).
     - Project name in `Headline-MD`.
     - Short blurb (2-3 sentences) in `Body-MD`.
     - GitHub link as a Tertiary button (underline style with `surface_tint` stroke).
     - Tech tags in `Label-SM` below the blurb.
   - Spacing: `spacing.12` between cards.

**Animations:**
- Experience entries fade in as they scroll into view (staggered, 80ms apart).
- Project cards slide in from alternating sides (left card from left, right card from right) — subtle, ~20px translate with opacity fade.

---

### 3.3 Gallery (`/gallery`) — Photography Wing

**Purpose:** Showcase Nikhil's street and landscape photography in a browsable, immersive format.

**Color:** Terracotta as the accent. Page header uses `secondary` (#944925). Background is `surface` with `surface_container_low` for the grid area.

**Layout (top to bottom):**

1. **Page Header**
   - "The Gallery" in `Display-LG`, Terracotta `secondary` (#944925).
   - Optional one-liner: "Street scenes and landscapes. Shot on [camera name]." in `Body-MD`, `on_surface_variant`.

2. **Photo Grid**
   - **Grid style: Justified/row-based layout** (uniform row heights, variable image widths based on aspect ratio). This respects each photo's natural proportions while maintaining structural rhythm — fits the "Architectural Precision" ethos better than a masonry layout.
   - Library: `react-photo-album` handles this layout well.
   - Responsive columns:
     - Desktop (>=1024px): target row height ~280px, images naturally fill 3-4 per row.
     - Tablet (>=768px): target row height ~240px, 2-3 per row.
     - Mobile (<768px): target row height ~200px, 1-2 per row (portraits go full-width).
   - Gap between images: `spacing.2` (0.5rem) — tight, to feel like a contact sheet / gallery wall.
   - Background of grid area: `surface_container_low` (#f4f4f1).

3. **"Load More" Button**
   - Initial load: 16 photos.
   - Button at the bottom, centered: "Load More" in Secondary button style (Terracotta, `md` rounding).
   - Each press loads the next 16.
   - When all photos are loaded, button disappears. A subtle end marker: "That's everything — for now." in `Label-SM`, `on_surface_variant`.

4. **Lightbox (Overlay)**
   - Triggered by clicking/tapping any photo.
   - **Full-screen dark overlay** — near-black background (`rgba(26, 28, 27, 0.95)`).
   - Photo displayed at maximum size that fits the viewport, centered.
   - **Swipe navigation** (mobile) and arrow keys / arrow buttons (desktop) to move between photos.
   - **Pinch-to-zoom** (mobile) and scroll-to-zoom or click-to-zoom (desktop). Zoom should allow at least 2x.
   - Minimal chrome: close button (top-right), left/right arrows (sides), photo counter "12 / 87" in `Label-SM` (bottom-center).
   - No EXIF data, no titles in the lightbox — just the image.
   - **Swipe down to dismiss** (mobile).
   - Library: `yet-another-react-lightbox` with its zoom plugin.

   **Lightbox transitions:**
   - Open: photo expands from its grid position to full-screen (origin-aware animation, ~300ms ease-out).
   - Close: reverse of open, or simple fade-out.
   - Between photos: crossfade (~200ms) or horizontal slide.

**Animations:**
- Photos in the grid fade in as they load (opacity 0 → 1 over 300ms).
- "Load More" batch fades in as a group.

---

### 3.4 Contact (`/contact`)

**Purpose:** Let people reach out — whether for freelance inquiries, photography bookings, or just to connect.

**Color:** Forest Green (`primary`) for the page heading — deliberate exception to the track-neutral default, matches the Work page heading. See Decisions Log in PLAN.md. Body content is otherwise neutral (`surface` base).

**Layout:**

1. **Page Header**
   - "Get in Touch" in `Display-LG`, Forest Green `primary` (#163526).
   - Subtitle: "The inbox is open." in `Body-MD`, `on_surface_variant`. Short and distinct from the left panel copy.

2. **Asymmetric Split**
   - Full-width container (max 1200px), split into two panels side by side on desktop. Stacks vertically on mobile.
   - **Left panel (~40%):** `surface_container_low` (#f4f4f1) background. Contains:
     - "Let's talk." in `Headline-MD`.
     - Body copy covering photography inquiries, conversations, and a subtle hint toward the right professional opportunity.
     - Scroll anchor at the bottom: "Or find me at the bottom of the page ↓" in `Label-SM`, links to `#footer`. Replaces a duplicate social links section — footer already carries those links.
   - **Right panel (~60%):** `surface_container_lowest` (#ffffff) background. Contains the contact form.
   - Fields (bottom border only, `outline_variant` style):
     - **Name** (text input)
     - **Email** (email input)
     - **Reason** (select): "Freelance / Contract", "Photography Inquiry", "Just Saying Hi", "Other"
     - **Message** (textarea, 5 rows)
   - Submit button: Primary style (flat `primary` background, square corners). Text: "Send Message".
   - On success: form replaced by confirmation message + animated SVG checkmark.
   - On error: inline error message below button in `error` color.

**Animations:**
- Split panel fades in on scroll (ScrollReveal, 100ms delay).
- Input focus: bottom border transitions to accent color (200ms ease-out).
- Submit button: scale 0.98 on click (`btn-press` utility).
- Success checkmark: SVG path draws in (stroke-dashoffset, 400ms ease-out).

---

## 4. Navigation

### Desktop (>=1024px)
- **Fixed top bar**, full-width.
- **Background:** Solid `surface` (#f9f9f7). On scroll (when content passes behind the nav), a subtle bottom shadow appears (`rgba(26, 28, 27, 0.04)`, 8px blur) to separate nav from content.
- Left: NM Monogram (serves as logo/home link).
- Right: nav links — "Work", "Gallery", "Contact" in `Body-MD`.
- **Active state:** A 2px underline below the active link. Color matches the current wing:
  - On /work: Forest Green (`primary` #163526)
  - On /gallery: Terracotta (`secondary` #944925)
  - On / and /contact: neutral (`on_surface` #1a1c1b)
- Nav height: ~64px. Padding: `spacing.4` vertical, `spacing.8` horizontal.

### Mobile (<1024px)
- Same solid bar, but only NM Monogram (left) and hamburger icon (right).
- Hamburger opens a **full-screen overlay menu:**
  - Background: `surface` at full opacity.
  - Links stacked vertically, centered, in `Headline-MD`.
  - Close button (X) top-right.
  - Transition: overlay slides down from top, ~300ms ease-out. Links stagger-fade in.

### Page Transitions
- When navigating between pages: a subtle crossfade (opacity transition, ~200ms). No dramatic route animations — keep it fast and clean.

---

## 5. Responsive Design Principles

| Breakpoint | Label | Behavior |
|---|---|---|
| < 768px | Mobile | Single column. Full-bleed images. Stacked layouts. Touch-optimized tap targets (min 44px). |
| 768px - 1023px | Tablet | Two-column where appropriate. Photo grid adjusts row height. |
| >= 1024px | Desktop | Full layouts as described. Asymmetric splits. Multi-column grids. |

**Global rules:**
- Max content width: 1200px, centered with auto margins.
- Body text never exceeds ~680px wide (for readability).
- Images are always responsive (`max-width: 100%`, `height: auto`).
- Spacing scales down on mobile: desktop `spacing.16` becomes mobile `spacing.8`, etc.
- Touch targets: all interactive elements are minimum 44x44px on mobile.
- **Surface tone limit:** Use at most 3 surface tones per page's content area: `surface` (#f9f9f7) as the default, `surface_container_low` (#f4f4f1) for inset sections, and `surface_container_lowest` (#ffffff) for lifted cards. Avoid a patchwork of barely-distinguishable off-whites.

---

## 6. Animation Guidelines

**Philosophy:** Animations should feel like natural physics — things fade in, settle into place, respond to touch. Never decorative or attention-seeking.

| Animation | Duration | Easing | Trigger |
|---|---|---|---|
| Scroll reveal (fade + translate-up) | 400ms | ease-out | Element enters viewport |
| Stagger between siblings | 80ms delay | — | Sequential |
| Page crossfade | 200ms | ease-in-out | Route change |
| Lightbox open | 300ms | ease-out | Photo click |
| Lightbox close | 200ms | ease-in | Close / swipe down |
| Hover scale (photo grid) | 200ms | ease-out | Mouse enter |
| Button press | 100ms | ease-in | Click / tap |
| Input focus border | 200ms | ease-out | Focus event |
| Mobile menu overlay | 300ms | ease-out | Hamburger click |

**Reduced motion:** Respect `prefers-reduced-motion`. When active, replace all animations with instant state changes (zero duration). No exceptions.

---

## 7. Image Strategy

### The Problem
~100 photos at 10-20MB each (growing archive). Must load fast, look sharp, and cost nearly nothing.

### The Pipeline

```
Original (10-20MB)
  ↓ [build-time script using sharp]
  ├── thumbnail  (400px wide, WebP, ~20-40KB)  — grid placeholder
  ├── medium     (800px wide, WebP, ~60-120KB)  — mobile full view
  ├── large      (1600px wide, WebP, ~150-300KB) — desktop grid / lightbox
  └── full       (2400px wide, WebP, ~300-600KB) — lightbox zoom
```

- **Format:** WebP primary, AVIF where supported, JPEG fallback.
- **Storage:** Cloudflare R2 bucket. Zero egress fees. Free tier: 10GB storage, 10M reads/month.
- **Delivery:** R2 public bucket URL or Cloudflare CDN in front of it.
- **Lazy loading:** All grid images use `loading="lazy"`. Only the first row (above the fold) loads eagerly.
- **Blur placeholder:** Generate a tiny (20px wide) blurred version of each photo at build time, inline as base64 in the HTML. Displays instantly while the real image loads (the "blur-up" technique).
- **`srcset`:** Each `<img>` provides `srcset` with thumbnail, medium, large, and full sizes. Browser picks the best fit.

### Photo Manifest
A `photos.json` file in the repo serves as the single source of truth:

```json
[
  {
    "id": "street-001",
    "title": "Morning Commute",
    "category": "street",
    "aspect_ratio": 1.5,
    "blurhash": "LKO2?U%2Tw=w]~RBVZRi...",
    "order": 1
  }
]
```

The build script reads this manifest, processes images, and generates the optimized variants. `next/image` is configured with a custom loader pointing to the R2 bucket.

### Upload Workflow
A CLI script: `npm run photos:process` — takes originals from a local `/originals` folder, generates all sizes, uploads to R2, and updates `photos.json`.

---

## 8. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | React + TypeScript. SSG for performance. Built-in image optimization as fallback. File-based routing for the 4 pages. |
| **Styling** | Tailwind CSS v4 | Design system tokens map directly to Tailwind theme config. Utility-first, zero runtime CSS. Responsive utilities built in. |
| **Photo Grid** | react-photo-album | Justified row layout. Lightweight. Handles responsive breakpoints. |
| **Lightbox** | yet-another-react-lightbox + zoom plugin | Full-screen gallery with swipe, keyboard nav, zoom. Actively maintained. |
| **Scroll Animations** | framer-motion (or CSS `@starting-style` + Intersection Observer) | Scroll-triggered reveals. Lightweight if we only import what we use. Could also go pure CSS for minimal bundle. |
| **Image Processing** | sharp (build-time script) | Generates WebP/AVIF variants at multiple sizes. Fast, battle-tested. |
| **Image Storage** | Cloudflare R2 | Zero egress. 10GB free. Scales cheaply as archive grows. |
| **Hosting** | Vercel (free tier) | Zero-config Next.js deploys. Edge CDN. Automatic preview deploys on PR. |
| **Contact Form** | Next.js Server Action + Resend | 100 emails/day free. No external form service. Stays in the codebase. |
| **Font Loading** | `next/font` | Self-hosts Space Grotesk + Manrope. No layout shift. No external requests. |

### Estimated Cost

| Item | Monthly Cost |
|---|---|
| Vercel Hosting (free tier) | $0 |
| Cloudflare R2 (free tier, <10GB) | $0 |
| Resend (free tier, <100 emails/day) | $0 |
| Domain (annual, amortized) | ~$1 |
| **Total** | **~$1/month** |

When the photo archive outgrows 10GB on R2: $0.015/GB/month. At 500 photos, that's maybe $0.50/month.

---

## 9. Logo Concepts

Since this is a text/code-driven project, here are three logo concepts described for implementation as SVG:

### Concept A: "The Bracket Aperture"
A minimal mark that merges a code bracket `{` with a camera aperture blade. The left half is a clean curly brace; the right half subtly morphs into a triangular aperture blade shape. Monochrome (uses `on_surface` #1a1c1b). Works at small sizes (favicon) and large (hero). This is the most "on-brand" option — it literally fuses code and photography.

### Concept B: "NM Monogram"
The letters N and M interlocked in Space Grotesk's geometric style, with the shared vertical stroke between N and M removed so they merge into one continuous form. Set in a square frame with tight padding. Feels architectural — like a stamp or a building cornerstone. Monochrome.

### Concept C: "Typographic Wordmark"
Simply "nikhil" in Space Grotesk, lowercase, with one subtle modification: the dot on the `i` is replaced with a small diamond or square — a nod to precision and intentionality. No icon, just type. The cleanest option; relies on typography alone. This is the lowest-risk, most versatile option.

**Recommendation:** Use **Concept B** (NM Monogram) as the nav identity and favicon. The interlocked letterforms feel architectural — consistent with the "Architectural Precision" north star — and work well at all sizes from favicon to hero.

---

## 10. Component Inventory

Components to build, derived from the page designs:

| Component | Used On | Notes |
|---|---|---|
| `NavBar` | All pages | Solid background, shadow-on-scroll, responsive, wing-aware accent color |
| `MobileMenu` | All pages (mobile) | Full-screen overlay, hamburger trigger |
| `Hero` | Home | Name + tagline + intro, staggered fade-in |
| `TrackTeaser` | Home | The asymmetric split panel (Engineering / Photography) |
| `SectionLabel` | Work, Gallery | `Label-SM` uppercase heading with track accent |
| `ExperienceCard` | Work | Role, company, timeframe, description |
| `SkillTag` | Work | Small inline tag, `Label-SM` on `surface_container_lowest` |
| `ProjectCard` | Work | Screenshot + blurb + GitHub link + tech tags |
| `PhotoGrid` | Gallery | Justified row layout via react-photo-album |
| `LoadMoreButton` | Gallery | Loads next batch, disappears when exhausted |
| `Lightbox` | Gallery | Full-screen overlay with zoom + swipe |
| `ContactForm` | Contact | Name, email, reason, message + submit |
| `SocialLinks` | Contact, Footer | Icon + label for each platform |
| `Footer` | All pages | Minimal: name, links, copyright |
| `ScrollReveal` | All pages | Wrapper component for scroll-triggered animations |

---

## 11. Open Items (To Resolve During Implementation)

- [ ] Exact photography to feature on the home page hero panel
- [ ] Project details (names, descriptions, screenshots, GitHub URLs) for the 2-3 projects
- [ ] Professional experience details (roles, companies, dates, descriptions)
- [ ] Social media profile URLs (GitHub, LinkedIn, Instagram, etc.)
- [ ] Domain name
- [ ] Camera/lens info for gallery subtitle (optional)
- [ ] Resume PDF content
