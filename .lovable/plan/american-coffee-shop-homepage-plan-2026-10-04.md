# American Coffee Shop — Homepage Plan

One-page website for American Coffee Shop (41 Prospect Rd, Oakland Park, FL 33334 · +1 954-772-8850). It follows your brief closely and never makes up facts.

## Sections (in order)
1. **Sticky top bar**: name, links (Home, Menu, About, Gallery, Location) and a "View Menu" button. On phones it becomes a menu icon that opens a drawer.
2. **Hero**: a large photo of breakfast and coffee, the headline "Good Food. Great Coffee. Feel Right at Home.", the supporting copy, "View Menu" plus "Get Directions" buttons, and an "Oakland Park, Florida" tag.
3. **Quick value strip**: Breakfast & Lunch · American + Latin Favorites · Coffee & Café Con Leche · Oakland Park Neighborhood Café.
4. **Food intro**: "Come Hungry. Leave Happy." with an editorial photo and an "Explore the Menu" button.
5. **A Few Favorites**: 8 cards (Cuban Coffee, Café Con Leche, Eggs Benedict, Omelettes, Pancakes, French Toast, Cuban Sandwich, Quesadilla). Each has a short, ingredient-free description. No prices.
6. **The Coffee Moment**: "Coffee Worth Sitting Down For." on a dark espresso background with a close-up photo.
7. **Your Neighborhood Table**: a large atmosphere image, marked as a sample until real photos are uploaded.
8. **Google reviews**: 4.7 stars from 763 Google reviews, plus themes customers mention (generous portions, friendly staff, Cuban coffee variety). No made-up quotes.
9. **Menu call to action**: "Something for Every Appetite." The button points to a visible [MENU LINK — ADD BEFORE LAUNCH] placeholder.
10. **Come Visit Us**: address, tap-to-call, Get Directions (Google Maps), an embedded map, and [BUSINESS HOURS — VERIFY].
11. **Final call to action**: "Breakfast, Lunch, Coffee — See You Soon."
12. **Footer**: name, address, phone, links, View Menu, and copyright. No social icons.
13. **Phone-only bottom bar**: Call · Directions · Menu, always within thumb reach.

## Look and feel
- Warm cream background, espresso and coffee-brown text, muted terracotta for buttons, golden-beige accents.
- Fraunces (warm serif) for headings and Figtree (clean sans) for body text and buttons.
- Large food photos, gently rounded cards, soft shadows and lots of breathing room. Sections fade in subtly as you scroll.

## Honesty and placeholders
- Generated photos are labeled as samples, with a small "[AUTHENTIC RESTAURANT PHOTO — UPLOAD]" tag.
- No hours, prices, online ordering, social links or testimonials are invented. Each one appears as a visible placeholder.
- The logo is a typographic wordmark, marked [LOGO — UPLOAD OFFICIAL ASSET].
- A placeholder checklist will be delivered at the end.

## Technical details
- Rewrite `src/routes/index.tsx` as the homepage, with section components in `src/components/site/`.
- Business facts live in one `src/lib/business.ts` constants file.
- Design tokens (oklch) go in `src/styles.css`, and fonts load via `<link>` in `__root.tsx`.
- Generate about 6 images into `src/assets/` (hero, intro, coffee, atmosphere, plus food cards; some cards reuse images).
- SEO: unique title and description, og/twitter tags, Restaurant JSON-LD with accurate address and phone (no hours), semantic headings, and alt text. Update root metadata away from the "Lovable App" defaults.
- Directions link: `https://www.google.com/maps/dir/?api=1&destination=41+Prospect+Rd,+Oakland+Park,+FL+33334`. The map uses a keyless Google Maps embed iframe.
- Accessibility: visible focus states, at least 44px tap targets, and support for reduced-motion settings.
