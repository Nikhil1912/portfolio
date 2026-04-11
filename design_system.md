# Design System Specification: The Technical Curator
 
## 1. Overview & Creative North Star
The Creative North Star for this design system is **"Architectural Precision."** We are moving away from the literary feel of serifs toward a high-contrast, structural aesthetic that mirrors the intersection of a software engineer’s codebase and a photographer’s lens. 
 
To break the "template" look, this system rejects the rigid, centered grid in favor of **Intentional Asymmetry**. We use expansive whitespace (from our Spacing Scale) to create a sense of gallery-grade curation. Elements should feel "placed" rather than "poured" into a container. Overlapping typography and offset image containers are encouraged to create a sense of depth and movement, moving the brand from "standard blog" to "digital monograph."
 
## 2. Colors: Tonal Distinction
The palette is rooted in a refined neutral base (`#f9f9f7`), using color as a functional signifier to distinguish the two core tracks of the experience.
 
### Track Differentiation
- **Engineering (The Syntax):** Utilizes the Forest Green spectrum. Use `primary` (#163526) for headers and `primary_container` (#2d4c3b) for code blocks or technical callouts. 
- **Photography (The Aperture):** Utilizes the Terracotta spectrum. Use `secondary` (#944925) for gallery titles and `secondary_fixed_dim` (#ffb596) for subtle background accents in photo essays.
 
### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts.
*   **Implementation:** A `surface_container_low` section sitting on a `surface` background provides all the separation required. 
 
### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Limit to **3 surface tones per page** to avoid a patchwork of barely-distinguishable off-whites.
*   **The Base:** `surface` (#f9f9f7) — the default background.
*   **The Inset:** Use `surface_container_low` (#f4f4f1) for section differentiation and nested content areas.
*   **The Lift:** Use `surface_container_lowest` (#ffffff) for high-priority cards to create a soft, natural lift.
 
### Navigation & Overlays
For the fixed navigation bar, use a solid `surface` (#f9f9f7) background. On scroll, add a subtle bottom shadow (`rgba(26, 28, 27, 0.04)`, 8px blur) to separate the nav from content beneath it. Reserve `backdrop-filter` effects for overlays only (e.g., lightbox backdrop), not everyday UI chrome.
 
## 3. Typography: The Grotesque Edge
We have replaced the soft serif with **Space Grotesk** for headlines to reflect engineering precision, paired with **Manrope** for body text to maintain readability and modern warmth.
 
*   **Display-LG (Space Grotesk, 3.5rem):** Reserved for hero titles. Use tight letter-spacing (-0.04em) to emphasize the architectural "lock-up" of the characters.
*   **Headline-MD (Space Grotesk, 1.75rem):** The workhorse for section headers. Use `on_surface_variant` (#424843) to reduce visual noise in long-form technical articles.
*   **Body-MD (Manrope, 0.875rem):** The primary reading weight. Ensure a line-height of 1.6 for maximum breathability.
*   **Label-SM (Space Grotesk, 0.6875rem):** Used for metadata (e.g., ISO settings, Git commits). Always uppercase with +0.1em letter-spacing.
 
## 4. Elevation & Depth
We achieve hierarchy through **Tonal Layering** rather than traditional drop shadows.
 
*   **The Layering Principle:** Place a `surface_container_lowest` (#ffffff) card inside a `surface_container_low` (#f4f4f1) section to create depth without a single line of CSS `box-shadow`.
*   **Ambient Shadows:** When a "floating" effect is mandatory (e.g., a modal), use a tinted shadow: `rgba(26, 28, 27, 0.06)` with a `48px` blur. This mimics natural ambient light hitting a matte surface.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline_variant` at 15% opacity. Never use 100% opaque borders.
 
## 5. Components
 
### Buttons
- **Primary (The Engineer):** `primary` background with `on_primary` text. Square corners (`none` or `sm` rounding) to emphasize precision.
- **Secondary (The Photographer):** `secondary` background. Use `md` (0.375rem) rounding to feel slightly more "organic" than the technical buttons.
- **Tertiary:** No background. Underline using a 2px stroke of `surface_tint`.
 
### Cards & Lists
- **The Forbid Rule:** No horizontal dividers. Use the Spacing Scale (e.g., `spacing.8`) to separate list items.
- **Photography Cards:** Use `surface_container_low` with a large image bleed. 
- **Engineering Cards:** Use `surface_container_low` with a `label-sm` header to denote technical specs.
 
### Input Fields
- **Minimalist State:** Only a bottom border using `outline_variant`. On focus, the border transitions to `primary` (Green) for code-related inputs and `secondary` (Terracotta) for contact or creative inputs.
 
### Special Component: The "Metadata Ribbon"
A horizontal scrolling bar using `surface_container_low` that houses technical data (Camera Model, Shutter Speed, Language, Lines of Code). Typography: `label-sm` in `tertiary`.
 
## 6. Do's and Don'ts
 
### Do
- **Do** use intentional asymmetry. Align a headline to the left but offset the body text to the right by `spacing.16`.
- **Do** use the Forest Green (`primary`) and Terracotta (`secondary`) as "track anchors"—never mix them in the same section.
- **Do** leverage the `px` (1px) spacing token for microscopic alignment of "Ghost Borders" when necessary.
 
### Don't
- **Don't** use `Newsreader` or any serif font. The era of the "soft" curator is over; we are now in the era of the "technical" curator.
- **Don't** use standard Material Design elevations (Shadows 1-5). Use tonal shifts exclusively.
- **Don't** center-align large blocks of text. It breaks the architectural grid.