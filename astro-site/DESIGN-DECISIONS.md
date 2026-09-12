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

## Fixed — mobile navigation

The live site hides `.nav-links` below 760–860px on **12 of 13 pages with no
replacement**: on a phone the primary navigation simply does not exist. That
is a pre-existing defect, not something the port introduced.

`Nav.astro` now renders a real toggle button — `type="button"`,
`aria-expanded`, `aria-controls`, `aria-label`, 44×44px hit target — that
reveals the links as a stacked panel. Escape closes it and returns focus to
the button; following a link closes it too.

Two deliberate choices:

- **Progressive enhancement.** CSS collapses the menu only when the nav
  carries a `js` class, which the script adds. If the script never runs the
  links stay visible (stacked) rather than becoming unreachable — failure
  falls back to *more* navigation, not none.
- **The policy nav is untouched.** It carries two links and already keeps its
  CTA visible on small screens, so it needs no toggle.

Cost: one 1.4KB inline script. The pages still ship no external JS and no
framework runtime.

## Information architecture — language coverage

The first deliberate IA change of the migration, made on request.

`#languages` was 89 words on the homepage while four substantial language
pages already existed (957–1122 words each). Moving those 89 words to their
own URL unchanged would have created a thin page competing with all four, so
it became a **hub** instead: `/language-coverage`, 552 words, carrying the
three availability tiers plus signposts to every language page.

All copy is drawn from what the site already published — the tiers verbatim
from `index.html`, the page summaries from each target's own `og:description`.
Nothing about capability or availability was invented.

The homepage keeps a 43-word teaser linking out, following the pattern
`#about` already set. Nothing linked to `#languages` from another page, so
no inbound links broke; the anchor still exists for the two same-page links.

The header gained a **Languages dropdown** listing the hub and the four
language pages, which also surfaces pages that were previously reachable only
from body copy. The standalone "Speech data" nav item folded into it.

`/language-coverage` is new, so it needs no redirect; it was added to
`sitemap.xml` (now 14 URLs).

## Information architecture — services

Same treatment as the language hub, same reasoning.

`#services` was 201 words on the homepage covering five services. Three had
substantial dedicated pages (1015 / 965 / 1182 words); **two had no page
anywhere on the site** — corpus licensing (18 words) and translation &
localisation (20 words).

`/services` is now a 517-word hub: the three linked services in a card grid,
the two unlinked ones described at the length the homepage described them, and
a short "which service do you need" mapping. All copy is carried over verbatim
from `index.html` and the three target pages' own `og:description` values.

The homepage keeps a 37-word teaser. **Its `id="services"` is deliberately
preserved** — the header's Services item moved to `/services`, but the anchor
is cheap to keep and any external link to `/#services` still lands.

Still outstanding, and not something this migration can fix: corpus licensing
and translation & localisation have 38 words between them across the whole
site. Turning them into real pages needs facts — terms, formats, language
pairs, turnaround — that only the owner has. Nothing was invented to fill
the gap.

## Homepage hero redesign — "Night Atlas"

Chosen from four directions presented as mockups. The brief was a full-width
hero; the deciding observation was that the commissioned illustration is a
**dark** piece whose left 55% is deliberately empty. The previous hero faded
it into light paper, which paid for artwork the page then hid.

What changed:

- The illustration is now the ground, edge to edge, with a left-to-right scrim
  tuned to its composition so the empty region becomes the text well.
- The hero's bottom edge carries the **three-tier language band**, as in the
  approved mockup — availability is the first question buyers ask and no
  competitor answers it above the fold. Each tier links to
  `/language-coverage`.
- The band runs edge to edge, but its inner grid sits on the shell measure, so
  the first tier starts on the same line as the logo and headline. (An earlier
  pass put the tiers in a separate row below the hero; reverted on request.)
- **The three proof points were removed from the homepage** on request, to
  avoid two consecutive three-item rows. The copy still exists in the
  pre-Astro `index.html` at the repo root and in git history if it is ever
  wanted back — most naturally as a band further down the page.
- The headline is capped at 660px and sized below the global scale
  (`clamp(2rem, 4.1vw, 3.05rem)`) so it stays inside the artwork's calm left
  region rather than crossing the face.

### Image pipeline — do not point the hero at the raw PNG

The source artwork is 3.6 MB (2560×1440) and would have been the LCP element.
It is now served as AVIF/WebP with a JPEG fallback, art-directed to the
portrait crop below 760px. **38 KB at 1920px**, against 3.6 MB. Regenerate
with:

```sh
for w in 1280 1920 2560; do
  sips -Z $w bsg-home-hero-illustration.png --out r$w.png
  cwebp  -q 74 r$w.png -o hero-$w.webp
  avifenc -q 52 -s 6 r$w.png hero-$w.avif
done
sips -Z 1920 -s format jpeg -s formatOptions 76 bsg-home-hero-illustration.png --out hero-1920.jpg
```

The unused source PNGs were removed from `public/` (they still exist in the
repo root). Total image payload is now 1.4 MB, most of it the JPEG fallback
that modern browsers never download.

### Nav tone — resolved: one light header everywhere

The homepage briefly used a dark header so the bar read as part of the hero.
That was reverted, because it required inverting the logo to a white
silhouette, and the full-colour mark is wanted on every page.

The driver is measurable: **72% of the logo's wordmark is dark** (mean
luminance 59 of 255), so "BSG", "Data" and the tagline are near-black navy and
cannot sit on `#04131F` unaided. Of the four treatments considered — a paper
plate, a light bar, a full-height corner flag, and a frosted pill — the light
bar was chosen: it needs no logo treatment at all, and it restores a genuinely
identical header on all six pages (verified by hashing the rendered `<nav>`).

`navTone`, the `tone` prop and the whole `nav.dark` block are gone. The
accepted trade-off is a crisp light-to-dark seam directly beneath the bar, and
a sticky light header travelling over the dark hero on scroll.

### A scoped-style trap worth remembering

`.hero-inner > *` compiled to the **invalid** selector `.hero-inner>{...}` —
Astro's scoper drops the universal selector, and the whole rule with it. The
text-well cap silently never applied. Use explicit class selectors inside
scoped `<style>` blocks; do not rely on `*`.

## Mobile hero buttons

The two hero CTAs were sized to their labels with `flex-wrap: wrap`. Below
about 470px they no longer fit side by side, so the second dropped to its own
line at a different width — reading as a mistake rather than a hierarchy.

Chosen from four options (full-width stack, primary + text link, equal 50/50
pair, primary only): **full-width stack**. It fixes the defect without
touching copy, information architecture, or what a mobile visitor is offered
versus a desktop one.

Applied at `max-width: 560px`, matching the narrow-gutter breakpoint. Verified:

| width | result |
|---|---|
| 560px | both buttons 526px wide, stacked, on the gutter |
| 700px | side by side, content-sized — unchanged |
| 1440px | side by side at x=100 — unchanged |

`.btn` is `display: inline-block` globally, which would left-align the label
once stretched to full width, so the mobile rule also switches it to a
centred flex box.

## Header menu order

`Home · About · Services · Languages ▾ · Start a brief`. "Start a brief" stays
last as the call to action. Adding "Home" means the homepage now carries an
active marker in the menu, which previously only the logo did.

## One alignment line — `--shell-max` / `--shell-pad`

The header and the page content used to be measured independently, so nothing
lined up: the header sat on `min(1080px, 100% - 48px)` (no padding) while each
design system's `.wrap` used `max-width: 1080px` plus 24px padding. Content
started 24px inside the logo, and the hero was worse — see below.

Both now hang off two tokens in `base.css`:

```css
--shell-max: 1240px;   /* widened from 1080 — moves the logo outward */
--shell-pad: 24px;     /* 17px below 560px, matching the old narrow gutter */
```

`.nav-inner` and all three systems' `.wrap` use
`width: min(var(--shell-max), calc(100% - var(--shell-pad) * 2))` with auto
inline margins. At 1440px every element on every page starts at **x = 100**.
Widening the line is now a one-token change.

### Optical alignment of the logo

The logo PNG carries **43px of transparent padding** on its left edge (of
1200px), so its visible mark sat ~6.7px inside the shell line while every
other element sat on it. `.logo-image` now carries a matching negative
`margin-left` (-6.7px at 188px wide, -5.7px at the 158px mobile size). If the
logo asset is ever recropped, remove these.

### Three traps this exposed

1. **A flex item with `max-width` and auto margins shrinks to fit.**
   `.hero-inner` was 708px wide, centred at 366px instead of spanning the
   shell. Flex items need an explicit `width` here, not `max-width`.

2. **A percentage inside a custom property resolves against the element that
   *uses* it.** A `--gutter: max(24px, calc((100% - 1080px) / 2))` declared on
   `.hero` computed against each 480px-wide `.tier`, yielding 24px instead of
   180px. The ticker is now a full-bleed band with an inner grid on the shell
   measure — no custom-property arithmetic.

3. **A width cap on the same element as `.wrap` fights its auto margins and
   self-centres.** `.wrap policy-content` (820px) sat at x=330. Fixes: the
   policy page separates shell from reading measure in markup; `.faq` caps its
   children (`.faq > *`) rather than itself.

Also removed: three pages nested `.wrap` inside `.wrap`, double-insetting the
content.

### Knock-on worth knowing

The policy pages' `.wrap` was deliberately 900px for readability. It is now the
shared 1240px shell, with `.policy-content { max-width: 820px }` still capping
the text — so the reading measure is unchanged, but it is now left-aligned to
the shell rather than centred in the page.

Two things stay deliberately off the line: the 2nd and 3rd columns of any grid
(obviously), and `.policy-notice`, which is a centred callout (`text-align:
center`) rather than a left-aligned section.

## Unified header

The originals shipped **three different headers** — home (solid background, no
blur, its own padding, 860px breakpoint), service (sticky, translucent,
blurred, 68px, 800px breakpoint) and policy (`.nav-actions`, a boxed CTA, a
560px breakpoint) — and on top of that **every page declared its own link
set**, mostly in-page anchors. The header visibly changed as you moved
between pages.

Now there is one header everywhere, byte-identical across pages (verified by
hashing the rendered `<nav>`):

- **One treatment**, the majority one: sticky, translucent, blurred, 68px.
- **One menu**, `src/config/navigation.ts`. Every target is a real URL, since
  the same menu renders on every page — `#faq` would be dead everywhere but
  one. The two homepage anchors are absolute (`/#services`, `/#contact`).
- **One breakpoint**, 900px, raised from 800/860 because the shared menu is
  wider than any single page's used to be.
- `.nav-inner` carries **its own measure** (`min(1080px, 100% - 48px)`)
  instead of the page's `.wrap`, which differs per design system — the policy
  pages' `.wrap` is 900px, so reusing it would have made the header narrower
  there.

**What this trades away.** Service-page navs doubled as an in-page table of
contents (`#scope`, `#process`, `#faq`). A site-wide menu cannot do that.
If per-page section navigation is wanted back, it belongs as a secondary
in-page element, not in the header.

Also folded in: the policy header's boxed CTA became the standard green
emphasis on the last item, and the standalone "Speech data" link moved into
the Languages dropdown.

`Nav` owns the default (`links = SITE_NAV`); `Shell` passes the prop through
undefined rather than defaulting it to `[]`, which would silently override.

## Current-page indicator

The header marks where you are, using `aria-current="page"` — the correct
attribute, so screen readers announce it, and the styling hangs off the same
hook rather than a parallel class.

Rules:

- **Section links never light up.** `/#services` and `/#contact` point at part
  of a page, not a page; treating them as "current" would light up every
  homepage anchor at once.
- **A dropdown parent inherits from its children.** Landing on
  `/african-speech-data` marks both the child link and the `Languages` toggle
  (`data-current` — `aria-current` belongs on links, not on a button that
  opens a menu).
- **The logo carries it on `/`**, since the menu has no "Home" item and the
  logo is the only link home.
- Pages absent from the menu (`/privacy-policy`, reachable from the footer)
  correctly mark nothing.

Styling differs by context: desktop gets a green underline anchored 6px under
the text — deliberately not pinned to the bar's bottom edge, which would
depend on vertical-centring maths that changes with the bar height. Mobile
gets an inset left rule, because an underline would collide with the next row
in the stacked panel.

Trailing slashes are normalised before matching, so `/about/` still resolves
as current even though `trailingSlash: 'never'` means it should not occur.

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

`african-speech-data`, the first page through `ServiceLayout`:

- **Text content identical** — 957 words, plus the skip link.
- **Link set identical** once `.html` is normalised away.
- **Head tags and JSON-LD identical**, bar the intended extensionless
  canonical and `og:url`.
- **No leakage** from the home or policy systems.
- The deferred `h1` conflict was handled as designed: the shared system keeps
  the majority `clamp(2.45rem,5vw,4.6rem)/760px`, and this page overrides to
  `4.75rem/750px` in a scoped `<style>`. Astro's scoping wins on specificity,
  so no `!important` and no effect on other pages. `.language-status` and the
  three `.status-*` pills are unique to this page and live with it.

`about`, ported from the original `about.html`:

- **Body content below the header is byte-identical** — 933 words either side.
  The only whole-page difference is the unified header's larger menu and the
  skip link.
- **Head tags identical**, bar the extensionless canonical and `og:url`.
- The original carried no JSON-LD, so none was invented.
- Its contact block is worded differently from the shared `ContactDirect`
  component ("Start a dataset brief by email" vs "Prefer to write directly?"),
  so that markup stays local to the page rather than being forced into the
  component.
- `about.html` was the newest hand-written page and had drifted from the
  service baseline in a dozen small ways (`h1` 2.55/4.65/770, `h2` 1.8,
  `h3` 1.16, `.eyebrow` tracking, hero padding and grid, `.section-head`
  measure, `.contact-band` padding, 880/760 breakpoints). All of it is
  page-scoped, exactly as the deferred-conflicts table prescribes.

Ported: 5 of 13, plus two new hub pages (`/language-coverage`, `/services`).
Remaining: 8 service pages.

All three layouts are now exercised by a real page, so the remaining ports are
repetition rather than design work.

Both pages re-verified after the extensionless switch: text still identical to
the originals bar the skip link, canonicals now `/` and `/privacy-policy`, and
every one of the 13 old URLs has a 301.
