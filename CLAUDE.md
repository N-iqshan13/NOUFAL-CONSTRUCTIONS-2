# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Site overview

Single-page marketing site for **Noufal Constructions**. Three files: [index.html](index.html), [styles.css](styles.css), [script.js](script.js). No build step — open directly in browser or serve with:

```powershell
python -m http.server 8080
```

Positioning: **premium, elegant residential portfolio** (custom homes, renovations, interiors). Light "warm ivory" luxury aesthetic — editorial layout, Cormorant Garamond display serif + Montserrat sans, refined bronze accent. The page is built around a filterable **project portfolio with a lightbox** as the centerpiece (the primary goal is showcasing work, not lead-gen).

Fonts load from Google Fonts. Icons are **inline SVG only** (no icon CDN). `index.html` links `styles.css?v=5` / `script.js?v=5` — bump the `?v=` query when changing those files.

## Design tokens

All visual constants live in `:root` at the top of [styles.css](styles.css). Light palette with a bronze accent:

| Token | Value | Role |
|---|---|---|
| `--bg` / `--bg-alt` | `#FAF8F4` / `#F2ECE3` | Warm ivory backgrounds (alternating sections) |
| `--bg-deep` | `#1C1A17` | Near-black warm — stats, testimonial, footer, lightbox, primary button |
| `--gold` / `--gold-deep` / `--gold-soft` | `#A67C45` / `#8A6536` / `#C9A877` | Bronze accent (eyebrows, headings on dark, hovers) |
| `--ink` / `--ink-soft` / `--ink-mute` | charcoal → muted | Body text hierarchy on light |
| `--on-dark` / `--on-dark-mute` | `#F3EEE6` → muted | Text on dark sections |
| `--line` / `--line-dark` | `#E4DCD0` / `#34302A` | Hairlines (light / dark) |
| `--maxw` | `1240px` | Container max-width |
| `--r` | `2px` | Border radius (sharp/editorial) |
| `--ease` | `cubic-bezier(0.16,1,0.3,1)` | Spring-like easing for transitions |

## Page sections (top-to-bottom)

| `id` | CSS class | Background | Notes |
|---|---|---|---|
| `#hero-anchor` | `.hero` | full-bleed image | Bottom-aligned content over gradient scrim; `min-height:100svh` |
| _(stats)_ | `.stats` | `--bg-deep` | 4 counter cells, hairline dividers; `#heroStats` triggers counters |
| `#portfolio` | `.portfolio` | `--bg` | **Centerpiece.** 12-col editorial grid, `.project` cards w/ `span-*`/`tall`/`wide`; filter bar + lightbox |
| `#about` | `.about` | `--bg-alt` | 2-col: image + `.about-badge` / philosophy text + signature |
| `#process` | `.process` | `--bg` | 4-col steps with top-border + floating `.step-num` |
| `#testimonial` | `.testimonial` | `--bg-deep` | Centered client quote, stars |
| `#contact` | `.contact` | `--bg-alt` | 2-col: info list + form card |

## CSS architecture

- Styles are organized top-to-bottom in section order, matching HTML.
- Responsive breakpoints: `1024px` (lightbox stacks), `900px` (tablet — drawer nav, grids collapse, portfolio → 6-col), `540px` (mobile — full-width everything).
- Scroll reveal: `[data-reveal]` → `.revealed`; optional `data-delay="1..3"` staggers via `transition-delay`. Reduced-motion users get content shown immediately (JS fallback + media query).
- Portfolio spans (`.span-7/-5/-6/-4/-8` on a 12-col grid) all collapse to `span 6` then full-width down the breakpoints.

## JavaScript patterns

All in [script.js](script.js) — no dependencies:

- **Header scroll state**: `IntersectionObserver` on `#hero-anchor`; adds `.scrolled` to header when hero leaves viewport (avoids scroll listener).
- **Stat counters**: `IntersectionObserver` on `#heroStats` (threshold 0.3) → `requestAnimationFrame` loop with ease-out-cubic `1-(1-t)³`. Runs once (`counted` flag).
- **Scroll reveal**: `IntersectionObserver` on `[data-reveal]` (threshold 0.12); unobserves after first trigger. Non-motion fallback reveals all.
- **Portfolio filter**: delegated click on `#filters`; toggles `.is-hidden` on `.project` by matching `data-filter` to each card's `data-category` (`new-homes` / `renovation` / `interior`).
- **Lightbox**: each `.project` is a keyboard-focusable button; click/Enter/Space reads `data-*` (name, cat, desc, img, loc, area, year, dur) into `#lightbox`. Closes on ×, backdrop click, or Esc; locks body scroll and restores focus.
- **Contact form**: Demo only — `e.preventDefault()`, client-side validation, shows `#formNote`. Replace the success block with a real `fetch()` to wire up a backend.

## Available design skills

Locked skills in [skills-lock.json](skills-lock.json) (sourced from `Leonxlnx/taste-skill`):

- `/design-taste-frontend` — primary design taste skill for this site
- `/high-end-visual-design` — premium visual quality guidance
- `/redesign-existing-projects` — use when restructuring existing sections
- `/industrial-brutalist-ui`, `/minimalist-ui` — alternative aesthetic directions
- `/image-to-code` — convert mockup images to HTML/CSS
