# Design system extraction — decision log

How the 13 hand-written pages were reconciled into one shared system, and
what was deliberately left for later. Phase 1 + 3 of the migration plan.

## What the originals actually looked like

Measured, not estimated:

| Group | Pages | Style block |
|---|---|---|
| Service baseline | 8 | **byte-identical** |
| `african-speech-data` | 1 | baseline + `.evidence`, larger `h1`, reformatted |
| `african-ai-training-data-types` | 1 | baseline minus the trust/related block |
| `about` | 1 | newest — merged logo rules, `--slate`, `.skip-link`, own patterns |
| `privacy-policy` | 1 | its own small document-page system |
| `index` | 1 | 295 lines, superset |

The consent script was **functionally identical on all 13** — the only
differences were indentation.

So the drift was far narrower than a first sample suggested. The base system
is well defined: it is what those 8 pages agree on.

## Applied — safe, zero visual change

1. **Global = the 8-page baseline.** It is the majority (12 of 13 pages sit
   at or near it) and the lowest-risk foundation.
2. **Dead logo rule dropped.** Every page shipped an Archivo text lock-up rule
   that the same page then overrode with `.logo{display:inline-flex !important}`
   plus `.logo-image`. All 13 render the image; the text rule was unreachable.
   Nav now carries the merged version with no `!important`.
3. **`--blue: #155C79` removed** — declared in most files, referenced in none.
4. **`--slate` and `--muted` promoted** to tokens; hard-coded `#4C5A51` and
   `#4A574F` now resolve through them.
5. **Consent script carried over verbatim** (`ConsentScript.astro`), still
   `is:inline` in `<head>`. It must run before any other script so
   `ga-disable-*` is set ahead of a measurement call. Do not bundle or defer
   it. It drives `CookieBanner.astro` by element id — the two change together.
6. **Footer has two real variants**, both preserved: `corporate` (index,
   about — legal + NDPC registration) and `service` (the rest).

## Applied — deliberate improvements

7. **`<meta charset>` moved ahead of the consent gate.** The live pages put
   it at byte ~4314; the spec requires it inside the first 1024 bytes. It is
   now at ~351. The gate is unaffected: meta tags are inert and it still
   precedes every script.
8. **Skip link on every page.** Only `about.html` had one. Invisible until
   focused, so no visual change.
9. **`<main id="main-content">` on every page.** 12 of 13 already had `<main>`;
   only `about` had the id the skip link needs.
10. **Homepage canonical stays `/`**, not `/index.html`, matching the live tag.

## URLs — extensionless, with 301s

**Decided change of direction.** The port originally preserved the live
`.html` URLs exactly (`build.format: 'file'`). That has been reversed by
choice: the site now serves extensionless URLs — `/privacy-policy`, not
`/privacy-policy.html`.

This is safe only because it ships with real redirects, which the GitHub Pages
host cannot do. It therefore **commits the site to Cloudflare Pages** (or
another host that honours `_redirects`). Deploying this build to GitHub Pages
would 404 every indexed URL.

What carries it:

- `build.format: 'directory'` — `about.astro` emits `about/index.html`,
  served at `/about`; `trailingSlash: 'never'` keeps canonicals bare.
- `public/_redirects` — 13 rules, one per previously indexed URL, all 301.
  Generated from the old `sitemap.xml`, so coverage is exact by construction.
  **This file must ship with every deploy.** Losing it breaks every inbound
  link and search result the site has.
- `public/sitemap.xml` — same 13 URLs, extensionless, with the hand-curated
  `lastmod` values carried over unchanged.
- Every internal link and `canonicalPath` rewritten in one pass.

Expect a few weeks of Search Console showing both URLs while Google follows
the redirects and swaps the indexed path. Do not remove the 301s after that —
external links and citations will keep using `.html` indefinitely.

## Deferred — genuine conflicts, NOT flattened

These are real value differences between pages. Flattening any of them would
change how a live page looks, so each stays a **page-scoped override** applied
when that page is ported in Phase 4. Global holds the majority value.

| Property | Global (12 pages) | Outlier |
|---|---|---|
| `.nav-inner` min-height | `68px` | `about`: `76px` |
| `h1` size / max-width | `clamp(2.45rem,5vw,4.6rem)` / `760px` | `about`: `4.65rem`/`770px` · `african-speech`: `4.75rem`/`750px` |
| `h2` / `h3` | `1.85rem` / `1.18rem` | `about`: `1.8rem` / `1.16rem` |
| `.hero` | no bottom border, `82px 0 54px` | `about`: adds `border-bottom`, `82px 0 58px` |
| `.hero-grid` columns | `1.18fr .82fr`, gap `48px` | `about`: `minmax(0,1.25fr) minmax(275px,.75fr)`, gap `52px` |
| `.section-head` copy | `.section-head p` | `about`: `.section-head>p:last-child` |
| Breakpoints | `800` / `560` | `about`: `880` / `760` / `560` |
| Body text | `16.5px` / `1.6` | `privacy-policy`: `16px` / `1.65` |

`--nav-min-h` is a token so the first row is a one-line override.

Once every page is ported and visually diffed, these can be revisited as a
single deliberate design pass. Doing it now would mean changing pages nobody
has looked at yet.

## Three systems, not one

Porting the homepage exposed something the service-page comparison could not:
**index.html is a separate design system**, not a variant of the service one.
Porting the privacy policy turned up a third. Each assigns different values to
the *same global selectors*.

| Selector | Service pages | Homepage |
|---|---|---|
| `section` | `padding: 74px 0` | `62px 0` |
| `h1` | `clamp(2.45rem,5vw,4.6rem)`, `-.025em` | `clamp(2.05rem,5vw,3.5rem)`, weight 900, stretch 105%, `-.01em` |
| `h2` | `clamp(1.85rem,3.2vw,3rem)` | `clamp(1.5rem,3vw,2.1rem)`, weight 800 |
| `h3` | `1.18rem` | `1.05rem`, weight 700 |
| `.eyebrow` | tracking `.09em`, weight 600 | tracking `.14em`, `margin-bottom:10px` |
| `.btn` | `12px 18px`, 1px green border, weight 700 | `13px 26px`, no border, weight 600 |
| `.wrap` | `min(1080px, 100% - 48px)`, no padding | `max-width:1080px` + `24px` padding |
| `.contact-band` | green gradient, radius 16px | flat `--green`, radius 14px |
| `.spec-grid` / `.spec-card` | 2-up, gradient fill, plain list | 1fr 1fr, white fill, 4px top rule, `▸` markers, dashed rows |
| focus offset | `3px` | `2px` |

And the policy document differs again from both:

| Selector | Service pages | Policy |
|---|---|---|
| `body` | `16.5px` / `1.6` | `16px` / `1.65` |
| `.wrap` | `min(1080px, 100% - 48px)` | `min(900px, 100% - 48px)` |
| `h1` | `clamp(2.45rem,5vw,4.6rem)` | `clamp(2.3rem,5vw,4rem)` |
| `h2` | `clamp(1.85rem,3.2vw,3rem)` | `1.35rem`, `margin: 34px 0 9px` |
| nav links | `.nav-links` | `.nav-actions`, last item boxed |

`.spec-card` is the dangerous one: **identical class name, entirely different
design.** A single shared stylesheet would have silently restyled the
homepage's delivery-standards cards.

So the CSS is layered by system rather than merged:

- `base.css` — tokens, reset, `body`, links, skip link. Loaded everywhere.
  Deliberately holds nothing the two systems disagree on.
- `service-system.css` — the 8-page baseline. Loaded by `ServiceLayout`.
- `home-system.css` — the homepage's own base. Loaded by `HomeLayout`.
- `policy-system.css` — long-form document base. Loaded by `PolicyLayout`.

The two system sheets are never loaded together, so their shared class names
cannot collide. Section-level CSS lives inside the component that owns it,
where Astro scopes it automatically.

Blocks genuinely shared by both systems — `ContactDirect`, `PolicyNotice` —
became components with their own scoped styles rather than being duplicated
into each sheet.

**Do not "unify" these systems as a cleanup.** They are three deliberate
designs. Merging them is a design decision for a human, taken after cutover.

`Nav` carries one variant per system (`.nav-links` for service, its own
spacing for home, `.nav-actions` for policy), and `Shell` exposes a named
`hero` slot so a page header can sit outside `<main>` where the original had
it there.

Note on verification: Astro inlines stylesheets under ~4KB into the page
rather than emitting a `<link>`. When checking which CSS a page ships, read
both the linked bundles **and** the inline `<style>` blocks, or a correctly
styled page will look like it is missing its stylesheet.

## File map

```
src/
├── types.ts                     NavLink, FooterVariant, SystemVariant
├── styles/
│   ├── base.css                 shared by both systems — tokens, reset, body
│   ├── service-system.css       service-page base + section patterns
│   └── home-system.css          homepage base
├── components/
│   ├── BaseHead.astro           charset, meta, OG/Twitter, canonical, fonts, favicon
│   ├── ConsentScript.astro      verbatim GA gate — inline, blocking, in <head>
│   ├── CookieBanner.astro       dialog markup + scoped styles
│   ├── Nav.astro                sticky nav — home | service variants
│   ├── Footer.astro             corporate | service variants
│   ├── JsonLd.astro             schema.org blocks
│   ├── ContactDirect.astro      email + WhatsApp route (both systems)
│   ├── PolicyNotice.astro       closing privacy teaser (both systems)
│   └── home/                    one component per homepage section
│       ├── Hero.astro           reg chip, headline, CTAs, proof strip
│       ├── Waveform.astro       decorative separator
│       ├── DataTypes.astro      #collect
│       ├── Services.astro       #services
│       ├── Process.astro        four commissioning steps
│       ├── Languages.astro      #languages
│       ├── Standards.astro      #specs
│       ├── Compliance.astro     #compliance
│       ├── Samples.astro        #samples
│       ├── AboutTeaser.astro    #about
│       └── ContactBand.astro    #contact
└── layouts/
    ├── Shell.astro              chrome, head, nav, footer — not used directly
    ├── ServiceLayout.astro      Shell + service-system.css
    └── HomeLayout.astro         Shell + home-system.css
```

Styles are placed by *who uses them*: a section's CSS lives in its component
and Astro scopes it; only what page content composes in slotted markup needs
to be global, and that is split by system.

## Page ports — verification

Built output vs the original `index.html`:

- **Text content identical** — 1277 words, the only addition being the skip link.
- **Link set identical** — 27 links, plus the skip link's `#main-content`.
- **JSON-LD identical** after parsing.
- **Head tags identical**, except asset paths that are now root-absolute.
- **No cross-system leakage**: the built CSS contains zero service-system
  selectors, and `.spec-card` resolves to the homepage design.

Sections were componentised, not split into pages — see the reasoning in the
migration discussion: every section is 25–201 words, and six of the ten already
have fuller dedicated pages that they link to.

`privacy-policy.html`, the first page through `PolicyLayout`:

- **Text content identical** — 1111 words, plus the skip link.
- **Link set identical** — 6 links, plus `#main-content`.
- **Head tags identical**, including the absence of `twitter:title` and
  `twitter:description` (this page never had them, so `BaseHead` makes both
  opt-in rather than defaulting them from the title).
- **No leakage** from the home or service systems.

Ported: 2 of 13. Remaining: about, and the 10 service pages.

Both pages re-verified after the extensionless switch: text still identical to
the originals bar the skip link, canonicals now `/` and `/privacy-policy`, and
every one of the 13 old URLs has a 301.
