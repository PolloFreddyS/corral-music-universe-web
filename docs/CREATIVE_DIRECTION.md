# Creative direction — Corral Music Universe website

_Stage 1 deliverable · 2026-11-25_

## 1. Reference analysis

These sites were reviewed live on 2026-11-25: stonesthrow.com (home) and ninjatune.net (releases). 88rising.com refused automated access, so its notes below come from prior familiarity and are marked as such.

| | Stones Throw | Ninja Tune | 88rising *(from familiarity)* |
|---|---|---|---|
| **Hierarchy** | The homepage is a stack of editorial "stories". Each one has a one-line hook, a headline, a sentence of context and one or two verbs ("Buy Vinyl", "Full Story"). | The releases grid is the product: artwork, title and artist, then two verbs, LISTEN and BUY. | The hero is a campaign-sized artist moment, with artists ranked above releases. |
| **Typography** | Condensed, confident sans for headlines and plain body text. The words carry the voice. | Tiny uppercase utility type that lets the artwork do the talking. | Big bold display type and a fashion-label tone. |
| **Release layout** | Copy-led. Artwork sits beside each story. | A dense square-art grid with a repeated LISTEN/BUY pair. | Full-bleed hero media. |
| **Storytelling** | Strong. Every release gets a one-sentence reason to care. | Minimal. The grid relies on the artist's reputation. | Visual. Video and photography do the work. |
| **Navigation** | Shop-first (sale banners). | ARTISTS / RELEASES / SHOP / EVENTS. Short, and in capitals. | Artists, Music, Shop. |
| **Mobile** | Stories stack cleanly. | The grid drops to two columns, and the dual CTA stays thumb-sized. | Heavy media on a slow connection. |
| **CTA** | Multiple verbs per item. | The same two verbs on every item, which is predictable. | Campaign CTA. |

**What we take from them:** Stones Throw's one-line reason to listen, Ninja Tune's predictable square-art grid with a consistent CTA, and 88rising's confidence in letting one release own the first screen.
**What we leave out:** shop and sale clutter (we have nothing to sell), heavy video heroes (slow on the mobile connections our Instagram visitors arrive on), and the anonymous grid with no story attached (our differentiator *is* the story).

## 2. Two directions

### Direction A — "Liner Notes" ✅ recommended

**Concept.** Picture the inside sleeve of a record: dark paper, a serif headline, small-caps credits, and one red stamp. The poem and the amplifier share the same page. The logo and the artwork carry all the colour, and the interface is the quiet paper around them.

| Token | HEX | Use |
|---|---|---|
| Ink | `#0B0B0C` | page ground |
| Ink 2 / 3 | `#141416` / `#1D1D21` | alternating sections, surfaces |
| Line | `#2B2B30` | hairline rules |
| Bone | `#ECE6DA` | text (contrast 15.8:1 on Ink) |
| Bone dim | `#A9A296` | metadata (7.8:1; 7.3:1 on Ink 2) |
| Oxblood | `#B3261E` | the single action colour (white text 6.5:1) |
| Gold | `#C9A55A` | kickers, track numbers, fine rules (8.4:1) |
| Volt | `#4C86FF` | focus ring only (5.8:1) |

Oxblood, Gold and Volt are pulled from the logo's red, gold and electric blue at reduced saturation, so the mark stays the loudest thing on the page.

- **Type:** *Fraunces Variable* (optical-size serif) for titles, poems and the tagline, with the poem titles set in italic. *Archivo Variable* for interface, metadata and buttons. Both are self-hosted under the SIL OFL, so no request goes to Google. Fallbacks: Iowan Old Style / Palatino / Georgia, and Helvetica Neue / Arial / system-ui.
- **Grid:** a 1320 px container with a fluid gutter (16 → 40 px). Asymmetric two-column splits (≈1.05 : 1, 0.8 : 1.2) give elegant imbalance. Sections alternate Ink and Ink 2, with hairline borders. The music catalog is a square grid that auto-fills (four across, then two, then two on mobile).
- **Motion:**
  - Hero artwork reveals with a clip-path wipe; the copy rises in staggered lines.
  - Sections fade and rise on scroll (IntersectionObserver).
  - Cards lift on hover, platform names slide, and arrows nudge.
  - Astro view transitions smooth navigation, and artwork morphs between grid and detail through `view-transition-name`.
  - All motion is CSS, with no animation library. It is fully disabled under `prefers-reduced-motion`, and content is visible without JavaScript.
- **Artwork:** square, never cropped, with a soft drop shadow and no frames or filters. Placeholders are typographic tiles with a dashed "Official artwork pending" stamp, so they can never be mistaken for real covers.
- **Texture:** one 160 px SVG noise tile at 6 % opacity, the controlled grunge.
- **Accessibility:**
  - Body-text contrast is at least 7:1.
  - A 2 px blue focus ring is always visible.
  - Touch targets are at least 44 px, with a skip link.
  - Landmarks and headings are semantic, and the filters use `aria-pressed`.
  - Every new-tab link announces itself.
  - Language attributes are set on Spanish titles inside English pages.

### Direction B — "Amplifier"

**Concept.** A gig poster wheat-pasted on a wall: huge condensed sans, hard black and white, and an electric-blue accent. Loud, fast and youthful.

| Token | HEX |
|---|---|
| Black | `#000000` |
| Paper | `#F4F1EA` |
| Volt | `#2E6BFF` |
| Signal red | `#E3261B` |
| Grey | `#8C8C8C` |

- **Type:** Anton or Archivo Expanded at 900 weight, uppercase, for display; Inter for text. Fallback: Impact / Arial Narrow.
- **Grid:** a hard 12-column grid with overlapping elements, rotated stickers and full-bleed bands of type.
- **Motion:** marquee tickers, glitch hovers, shaking type.
- **Artwork:** high-contrast duotone treatments and tape or sticker frames.
- **Accessibility:** marquees need pause controls, and duotone covers misrepresent the owner's art.

### Why A

Direction B fights the logo: both are loud, and the rooster loses. It also undercuts the intimate, literary half of the brand, and it drifts toward the "gaming clan landing page" the brief rules out. Direction A gives the theatrical mark a dark stage to stand on, while the serif and the poem → song details carry the emotional, literary voice. It also ages better as real album art arrives.

## 3. Brand rules applied

- The official logo is used unaltered. Its derivatives are scaled copies: icons get a circular crop outside the gold ring, and the OG card centres the logo on Ink.
- No added glow, fire or cosmic textures. Restraint is deliberate.
- "Corral Music Universe" is always written exactly that way.
- Song titles, poem titles and the book title are never translated.
