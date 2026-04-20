# Design Refinement Plan — Hero + Footer

## 1. Blunt Critique

### Hero

**Blobs are doing nothing.**
Three radial gradients at 0.07–0.10 opacity across 520–700px circles are imperceptible on a white background. They add 30 lines of CSS and zero visual value. Either commit to them (raise opacity to 0.14–0.18) or cut them entirely.

**The phone does not "break out."**
CLAUDE.md explicitly called for the phone mockup to break out of its container — "asymmetric layout," "phone breaking out." The current implementation uses `flex: 1` on both columns with `max-height: 580px` and `object-fit: contain`. The phone is fully contained, perfectly symmetrical. It looks like every SaaS template.

**The eyebrow label is generic.**
"Settlement App for Canada" in all-caps tracking reads like a category tag from a product directory. It adds no emotional weight and no personality. For a brand serving people who just moved to a new country, this is a missed moment.

**The vertical breathing room is insufficient.**
`pt-16 pb-16` (64px) on desktop for an 80px headline is tight. The hero needs to feel like it owns the screen. The top padding should account for the floating navbar height (67px) plus a generous gap — the content is currently sitting too close to the navbar.

**50/50 column split feels template-default.**
Both columns are `flex: 1`. There is no visual hierarchy between the text and the phone. On a wide desktop layout, the text and phone compete for equal weight rather than the headline commanding the space.

**H1 line breaks are accidental, not intentional.**
The three spans (`The all-in-one`, `newcomer`, `settlement app`) break the headline into mismatched line lengths with no typographic logic. "newcomer" alone on a line is particularly weak — a single word dangling.

**Subtext at `text-xl` (20px) is underpowered.**
For a hero supporting an 80px H1, 20px body copy feels like a footnote. It should feel like a confident secondary statement.

---

### Footer

**`text-blue-600` is browser-default blue.**
It signals "nothing was decided about link color." Against the ink/cream/red palette, generic blue looks like a template placeholder.

**The body copy is too long.**
Two dense paragraphs totaling ~200 words in the footer. Nobody reads this. It reads like a grant application, not a human product. Footers are for navigation and brand closure — not pitch copy.

**Copyright as a hyperlink is wrong.**
`© 2026 – Unify Social` wrapped in an `<a>` tag pointing to unifysocial.ca is unusual and slightly confusing. Copyright statements aren't conventionally clickable. If the goal is "link to homepage," a separate link achieves that without attaching it to the copyright.

**The footer heading (`3rem`) is undersized for its ambition.**
The CLAUDE.md describes a bold heading with a brand-red left border meant to anchor the footer. At 48px it's readable but doesn't carry the weight the copy deserves — especially "Your journey to Canada, _simplified._" which should feel like a closing statement.

**No visual transition from page content into footer.**
The footer starts abruptly. A subtle top border or background shift would signal "page end" and feel more resolved.

**The right column (Pages + Socials) has no visual relationship to the left.**
The link columns float to the right of the description text but don't visually connect to the heading above. On mobile they stack, which is fine, but on desktop the heading/description and the links feel like two unrelated blocks.

---

## 2. What "Premium" Means for This Site

Unify serves people who just arrived in a new country. They are hopeful, cautious, and overwhelmed. "Premium" here is not cold minimal or flashy — it is:

- **Trustworthy and warm.** Nothing should feel sharp, mechanical, or corporate.
- **Confident without being loud.** Brand red used as an accent, not a highlight reel. White space does the work.
- **Typographically deliberate.** Every line break, size, and weight choice looks like it was made on purpose.
- **Human-scaled.** Generous padding, readable type, nothing cramped.
- **Resolved.** Each section feels complete — it knows where it starts and ends.

Premium is NOT: more animations, more gradients, more visual complexity. It is *fewer, better decisions.*

---

## 3. Prioritized Hero Improvements

### P1 — Must fix

**1. Phone overflow / asymmetric presence**
Allow the phone to visually extend beyond its column. On desktop: negative `margin-bottom` so the phone bleeds into the next section, giving it momentum. Or: set the visual column to `flex: 0 0 45%` and give the phone `max-height: 640px` with `overflow: visible` on the parent, allowing it to push into the section's bottom padding.

**2. Increase vertical section padding**
Desktop: `pt-28 pb-0` (112px top, 0px bottom — let the phone overflow provide visual bottom weight). Mobile: `pt-20 pb-12`. The hero should feel like it has room.

**3. Fix H1 line breaks**
Force the break intentionally. Option A: Two lines — "The all-in-one newcomer" / "settlement app." Option B: Keep three lines but add visual weight — make "newcomer" larger or bold-italic. The current three-span split with mismatched lengths needs a decision.

### P2 — Should fix

**4. Rethink the eyebrow**
Replace "Settlement App for Canada" with something that has emotional specificity. Options: "For newcomers arriving in Canada" — or remove it entirely. If removed, the H1 carries the full opening weight (which is fine at 80px).

**5. Subtext size**
Bump from `text-xl` (20px) to 22–24px. Add this to `@theme` as `--text-hero-sub` if not already present.

**6. Blob decision**
Either raise the blob opacity to `0.14`–`0.18` so they're actually perceptible, or remove all three. The current "invisible decoration" is worse than either committed choice. Visual check required — screenshot before deciding.

### P3 — Polish

**7. Column proportions on desktop**
Set text column to `flex: 0 0 52%` and phone to `flex: 0 0 48%`. Gives the headline more horizontal command.

**8. Phone drop-shadow**
Current: `drop-shadow(0 24px 40px rgba(23,22,22,0.14))`. Slightly raise offset and opacity: `drop-shadow(0 32px 48px rgba(23,22,22,0.18))` for more lift. Visual check required.

---

## 4. Prioritized Footer Improvements

### P1 — Must fix

**1. Fix link colors**
Replace `text-blue-600` with `text-ink` (or `text-text`) for default state, `hover:text-brand` for hover. This anchors the footer in the site's color system instead of browser defaults.

**2. Cut body copy**
Reduce to 2–3 sentences max. The footer is not the place for a full product description. Suggested trim:
> "Unify is a digital platform helping newcomers settle in Canada with confidence — through curated resources, AI-powered guidance, and a community of people who understand the journey."

**3. Fix copyright bar**
Remove the `<a>` wrapper from the copyright text. Keep it as plain text: `© 2026 – Unify Social`. If a homepage link is desired, add it as a separate element.

### P2 — Should fix

**4. Increase footer heading size**
Bump `text-marquee` from `3rem` to `3.5rem` (add `--text-footer-heading: 3.5rem` to `@theme`). The heading with its brand-red border should feel like a statement, not a label.

**5. Add top separator to footer**
Add `border-t border-gray-100` (or a 1px brand-faint rule) to the `<footer>` element. Signals visual page closure.

**6. Tighten the heading border treatment**
Current: `border-left: 3px solid var(--color-brand); padding-left: 20px`. This is fine structurally but 20px left padding is modest — increase to 24px. The border should feel like it belongs to the brand, not like a blockquote.

### P3 — Polish

**7. Footer link column alignment on desktop**
Consider adding `pt-2` to the link columns so they align with the body text top rather than the heading top. Currently the "Pages" label aligns with the top of the heading, which creates awkward vertical rhythm.

**8. Section label styling**
"Pages" and "Socials" — currently `text-sm tracking-wide uppercase`. Fine, but the label color is `text-ink`. Since these are structural labels (not content), consider `text-muted` to reduce visual noise.

---

## 5. Guardrails — What Must NOT Change

- **Structure:** Two-column hero layout, left-text/right-phone arrangement, footer heading + body + links + copyright bar
- **Copy:** H1, subtext, eyebrow (unless eyebrow is explicitly removed per P2), footer heading, copyright text — no copy changes without Savar sign-off
- **Animation approach:** CSS-only, existing keyframes are good — no new animation libraries
- **Tokens:** All values must go through `@theme` in `global.css` — no arbitrary Tailwind values
- **Files not in scope:** Navbar, BaseLayout, global.css (except adding tokens), any section other than Hero and Footer
- **Dark mode:** Not in scope, never in scope
- **React/Framer Motion/JS animation libraries:** Never

---

## 6. Implementation Checklist

```
Hero
 [ ] Fix H1 line break logic (deliberate two- or three-line split)
 [ ] Increase section top padding (desktop: pt-28, mobile: pt-20)
 [ ] Add --text-hero-sub token to @theme if bumping subtext size
 [ ] Bump subtext to text-hero-sub (22–24px)
 [ ] Decide on eyebrow: rewrite or remove
 [ ] Adjust column flex proportions (text: 52%, phone: 48%)
 [ ] Allow phone overflow on desktop (negative margin-bottom or overflow-visible)
 [ ] Blob decision: raise opacity to 0.14–0.18 OR remove all three
 [ ] Visual check: screenshot hero against Framer reference
 [ ] npm run build — verify clean

Footer
 [ ] Replace text-blue-600 with text-ink / hover:text-brand on all links
 [ ] Cut body copy to 2–3 sentences
 [ ] Remove <a> wrapper from copyright text
 [ ] Add --text-footer-heading token to @theme (3.5rem)
 [ ] Bump footer heading to text-footer-heading
 [ ] Add border-t border-gray-100 to <footer> element
 [ ] Increase footer-heading padding-left from 20px to 24px
 [ ] Adjust link column section label color to text-muted
 [ ] Visual check: screenshot footer
 [ ] npm run build — verify clean
```
