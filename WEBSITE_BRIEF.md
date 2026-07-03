# Shaddy Reinigung — Premium Website Brief

> Edit this document however you like. Once you're happy with it, we'll use it as the spec for the redesign ("face lift") of the live site.

## 1. Positioning

**What we're building:** Not "a cleaning company website." A **premium local service brand** that happens to do cleaning — the kind of site that makes a visitor in Karlsruhe think "these people are the real deal" in the first 3 seconds, before they've read a single word.

**One-sentence pitch:** *Shaddy Reinigung is the cleaning service Karlsruhe residents and businesses trust when "good enough" isn't good enough.*

**Who it's for:**
- Homeowners/renters who value their time and want it done right the first time
- Property managers and Airbnb hosts who need reliable, repeatable turnovers
- Offices, gyms, schools, and care facilities that need a dependable commercial partner

**What makes a $1M-feeling site different from a $10k one:**
- Every pixel looks intentional — no default stock-template energy
- Copy is confident and specific, never generic ("we clean your house good") 
- Trust is built through *evidence* (real numbers, real reviews, real photos, transparent pricing) not adjectives
- Feels fast and effortless on a phone, because that's where 80% of visitors are
- The booking flow feels like Calendly, not a 2009 contact form

---

## 2. Visual Identity

### Color direction
Current palette (teal `#0F766E` on warm stone `#1C1917`/`#FAFAF9`) is a good foundation — clean, trustworthy, slightly upscale without feeling clinical or "hospital blue." Keep it, but push contrast and depth:
- Deepen the dark sections so they feel premium, not just "dark mode slapped on"
- Use the teal *sparingly* as an accent, not a wash — let whitespace do the work
- Consider a warm neutral (soft gold/amber) as a tertiary accent for ratings/highlights only

### Typography
Keep the serif/sans pairing (DM Serif Display + Inter) — it's the right instinct: serif headlines read as "established," sans body reads as "modern and easy." Push it further:
- Bigger, bolder hero type — headlines should feel a little oversized, a little confident
- Tighter letter-spacing on headlines, generous line-height on body copy
- One consistent type scale used everywhere — no one-off font-sizes floating in inline styles

### Imagery
This is the single biggest lever for looking premium or looking cheap.
- Real photos of real jobs > generic stock photos of anonymous hands with spray bottles
- If real photos aren't available yet, curate stock tightly: consistent lighting, consistent color grade, no mismatched styles between sections
- Every image should be intentionally cropped for its container — no stretched, no oddly-zoomed
- Before/after should be *actually* before/after, or not framed as before/after at all

### Motion
Subtle, purposeful animation on scroll (already partially built) — but restrained. Premium brands don't bounce and spin things; they fade and settle. Motion should feel like quality control, not decoration.

---

## 3. Site Structure

Recommended order (funnel logic — build trust before asking for anything):

1. **Hero** — one clear promise + one clear CTA. No slideshow of unrelated messages; pick the strongest hook and commit.
2. **Services** — scannable, visual, each card answers "is this for me?" in 2 seconds
3. **Our Work** — visual proof, real job photos
4. **Testimonials** — real names, real specifics, real numbers ("200+ clients", not "many clients")
5. **Why Us / Business Info** — hours, area, guarantees, insurance — the practical trust layer
6. **Pricing** — transparent, no "contact us for pricing" unless truly custom
7. **Booking** — the conversion moment; must be fast and frictionless
8. **FAQ** — kill remaining objections before they become support emails
9. **Gallery** — supplementary, not load-bearing
10. **Contact / Footer** — every way to reach you, one click away

### Non-negotiables
- Single most important CTA ("Book Now") reachable from anywhere without scrolling, on every screen size
- Phone number and WhatsApp link visible without hunting
- No section should require horizontal scrolling or pinch-zoom on mobile, ever

---

## 4. Copywriting Voice

- **Confident, not salesy.** State facts. Let the facts sound impressive rather than dressing them up.
- **Specific over vague.** "48-hour booking, same-day for emergencies" beats "fast service."
- **Local.** Karlsruhe, Pforzheim, Rastatt, Bruchsal by name — this is a neighborhood business, own it.
- **Short sentences in hero/headlines. Slightly longer, warmer sentences in body copy.**
- German-first (primary market), with full English parity — never a half-translated page.

---

## 5. Trust & Conversion Elements

Ranked by impact, cheapest/highest-impact first:

1. **Real testimonials with names, ratings, and specific service used** (built, ready to use)
2. **Transparent hourly pricing by category** (built)
3. **Insurance / guarantee messaging** stated plainly, not buried in FAQ
4. **Response-time promise** ("we reply within 24 hours") stated in multiple places
5. **Visible service area** so people self-qualify instantly
6. **Photos that look like this specific business**, not stock imagery any competitor could use
7. **A booking form that feels like 60 seconds, not 5 minutes** — smart defaults, minimal required fields, clear price estimate as they fill it in

---

## 6. Technical / Performance Bar

- Sub-2-second load on a mid-range phone over 4G
- Every image properly sized/compressed for its actual display size
- No layout shift while the page loads (images have explicit dimensions or aspect-ratio reserved)
- Fully usable with JavaScript disabled for the core content (progressive enhancement for animations only)
- One CSS design system — no inline styles scattered through the HTML, no duplicate/dead selectors
- Passes a basic Lighthouse audit in the 90s across Performance, Accessibility, Best Practices, SEO

---

## 7. What "Facelift" Means Here

Not a rebuild from scratch — the bones (sections, copy, booking logic, translations, pricing data) are solid. The facelift is:

- A tighter, more premium visual system (spacing, type scale, color depth, imagery consistency)
- Trimming anything that feels like filler or leftover scaffolding
- Making the mobile experience feel first-class, not like a squeezed-down desktop site
- Sharpening the copy so every section pulls its weight toward a booking

---

## Your Notes

*(Edit below — add anything you want changed, added, or cut before we start the visual pass.)*

-
-
-
