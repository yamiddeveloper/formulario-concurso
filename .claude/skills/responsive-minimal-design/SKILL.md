---
name: responsive-minimal-design
description: Design and build responsive, mobile-first web interfaces with a modern, minimalist aesthetic, applying concrete rules for visual hierarchy, spacing, typography, color, and accessibility. Use when creating or reworking a UI, landing page, dashboard, form, or component, and when the result needs to look clean, current, and work well on mobile. Triggers on requests like "make this responsive", "make it minimalist", "adapt this for mobile", "modernize this design", or "improve this screen's layout".
---

# Responsive, mobile-first, minimalist design

You are not a template generator. Before writing a single line of CSS, decide how this interface will feel on a 375px screen and on a 1440px screen. Minimalism is not "little content with random whitespace" — every element left on screen has to earn its place.

## Before coding, settle three things

1. **A hierarchy**: what should the eye see first? Everything else subordinates to that.
2. **A scale**: one sizing system for both typography and spacing (below). Never loose, one-off values.
3. **An accent**: at most one accent color over a neutral base. Minimalist doesn't mean colorless, it means disciplined about color.

If the brief gives no direction, pick a concrete palette and typeface yourself and state the choice explicitly before building — don't let the output default to "whatever the framework ships with."

## Mobile-first, not "responsive afterward"

Write the base CSS for a 375px viewport. `min-width` media queries only ever *add* complexity for larger screens, never the reverse.

```css
/* base = mobile */
.card { padding: 16px; font-size: 16px; }

/* complexity is added upward, never subtracted */
@media (min-width: 768px)  { .card { padding: 24px; } }
@media (min-width: 1200px) { .card { padding: 32px; } }
```

**Standard breakpoints** (use these; don't invent others unless content genuinely demands it):

| Name | Min width | Typical use |
|---|---|---|
| base | 0px | Mobile, single column |
| sm | 640px | Large phone / phablet |
| md | 768px | Tablet, 2 columns |
| lg | 1024px | Desktop, full nav |
| xl | 1280px | Large desktop, max-width content |

**Non-negotiable mobile rules:**
- Minimum tappable area: **44×44px** for any button, link, or clickable icon (Apple HIG / WCAG 2.5.5).
- Minimum body text: **16px** — anything smaller forces zoom on iOS and is hard to read.
- Never rely on `:hover` as the only interaction mechanism — it doesn't exist on touch.
- Critical content (primary CTA, nav) stays thumb-reachable: fixed top or bottom, not buried mid-page in a collapsed 3-column layout.
- Cap text container `max-width` on desktop (65–75 characters per line, ~600–720px) — never run body text edge to edge at 1440px.

## Spacing system (8pt grid)

One multiple, no exceptions: `4, 8, 12, 16, 24, 32, 48, 64, 96`. If you want "almost 16 but a bit more," the answer is 16 or 24, not 18.

- Small component padding (button, chip): 8–16px
- Card/section padding: 16–32px depending on viewport
- Space between large sections: 48–96px
- Gap between related elements: 8–12px; between distinct groups: 24px+

Whitespace is hierarchy, not filler: more space around something signals more importance or independence. Elements with identical spacing read as the same group.

## Typography

- **At most 2 type families** (one for display/headings, one for body — or a single family across several weights). Never 3+.
- **Modular scale**, not arbitrary sizes. Example scale (~1.25 ratio):
  `12 · 14 · 16 · 20 · 25 · 31 · 39 · 49px`
- **Weights**: 400 (regular) and 600–700 (bold) cover 95% of cases. Avoid 5 different weights on one screen.
- `line-height`: 1.5–1.6 for body paragraphs, 1.1–1.3 for large headings.
- Hierarchy comes from size + weight + color, in that priority order — not decoration (underlines, excessive caps, text shadows).

## Color

- Neutral base (2–3 shades of gray/white/black) + **one accent color** for primary actions and states. A second accent only if it encodes something semantically distinct (success/error/warning), with its own reserved palette.
- Minimum contrast **4.5:1** for normal text, **3:1** for large text (24px+) and UI components — WCAG AA. Verify it, don't assume it.
- Never convey information through color alone (an error shown only in red, with no icon or text).
- Avoid the default purple-to-blue gradient on white. If you use a gradient, keep it subtle (same color family, luminance shift, not a full hue jump) and purposeful, not decorative.

## Generic-AI anti-patterns — actively avoid these

- Inter/system-font + purple-to-blue gradient + 3 identical cards with icon, title, paragraph.
- Large diffuse shadows everywhere (`box-shadow: 0 20px 60px...`) without reason — use subtle shadows (`0 1px 3px`) or 1px borders, not both at once.
- Inconsistent border-radius between sibling components (a 4px button inside a 20px card).
- Decorative icons with no function, added just to "fill space" — if the icon doesn't aid scanning, drop it.
- Centering everything vertically and horizontally by default without considering reading flow.

## Checklist before shipping

- [ ] Works at 375px with no horizontal scroll or clipped text?
- [ ] Every clickable element is at least 44×44px on mobile?
- [ ] Text/background contrast passes 4.5:1?
- [ ] A quick glance makes clear what matters most on the screen?
- [ ] Spacing between elements follows the 8pt scale, no loose values?
- [ ] At most 2 type families and 1 accent color?
- [ ] `:focus-visible` (keyboard navigation) tested, not just `:hover`?
- [ ] The layout has a reason distinct from "whatever the framework defaults to"?

## When building in code

- CSS: use custom properties (`--space-*`, `--font-*`, `--color-*`) for the scale, not repeated one-off numbers.
- Components: same padding/radius/shadow for elements at the same hierarchical level — consistency across siblings matters more than perfecting each one in isolation.
- Test at least two widths (375px and 1280px) before calling it done, not only the viewport you're developing in.