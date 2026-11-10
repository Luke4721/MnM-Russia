# MnM Travels, India for Russian travellers: design plan (v2, rebuilt from zero)

## Brief
- Subject: MnM Travels (Monks & Monkeys), a Delhi receiving operator since 2008, IATO member. Sells India to Russian speakers (B2C and D2C).
- Pages (kept from the old Vercel site): Главная, Направления (catalogue + package pages), Галерея, О нас, Блог, Контакты.
- Content: everything comes from the client's Drive: 177 packages (12X India, festival tours, weekly group tours, private tours, luxury trains, short trips, Nepal and Bhutan), 367 of their photos, visa memo, tourist memo, conditions. Source dump in `../Input`.
- Client constraint: no dark theme. Ground is always light.
- Language: Russian only.

## Concept: «Индия в цвете» (from grey to colour)
Moscow in winter is grey. India is the most saturated place a Russian traveller will ever stand in. The interface is the grey: snow white, cool, quiet, ink type. Colour belongs to India only: photographs and a handful of gulal pigments. Colour is never decoration, it is the thing that arrives.
- Signature: the hero is a WebGL "bloom": a monochrome frame in which colour spreads like Holi powder from a point (noise-edged radial reveal, new scene arrives grey and saturates behind the wavefront). Click or tap sets the origin of the next scene. Pointer adds a small saturation lens. Six real tours, one per scene, each linking to its package.
- The same verb ("bloom") returns: package covers and gallery photos reveal grey to colour on entry; the page transition is a pigment disc from the click point; month slices saturate when opened.
- Not forced 3D: no 3D object here; one 2D shader where it carries the concept, plain DOM everywhere else.
- Motion verb: bloom (radial, noisy, slow-out), settle with expo.out.

## Palette (named by role)
- snow `#F6F7FA` ground, paper `#FFFFFF`, ink `#15122B` (indigo-black), muted `#5F5C7A`, line `rgb(21 18 43 / .12)`
- action `#C4006B` (rani pink, AA with white)
- gulal pigments, used only for the bloom, month marks and tags: saffron `#FF8A1F`, turmeric `#F4B400`, magenta `#E5007E`, indigo `#3F3FD0`, teal `#00A89D`, leaf `#5DB32E`, vermilion `#E8421B`

## Type
Prata (display, Cyrillic, high contrast, set huge and tight) + Golos Text (UI and text, drawn for Cyrillic) + Tiro Devanagari Hindi (day numerals only, culturally correct digits ० १ २ ३).

## Layout system
12 columns, fluid gutters. Rhythm: hero split 5/7, manifesto, 12 vertical month slices, typographic collection index with floating preview, ticket cards, 4-step route rail, trust band, gallery strip, blog, form. Photos are rectangles; package cards are tickets (perforation + notches). One shape rule: 2px corners, ticket notches, circles for pigments.

## Interaction rules (one treatment per role)
- Primary buttons: ink button, a pigment sweeps in from the left with a skew, arrow travels.
- Nav: underline draws. Inline links: underline at rest rises to a band.
- Cards and tiles: image saturates and scales inside its frame; title underline draws.
- Idle: hero shader keeps a slow zoom and drifting noise; clocks tick; month slices breathe their colour.

## Honesty rules
- Prices only when the source is current (2026-27). Anything with 2019–2020 prices, past departure dates or no table shows "цена по запросу". Original tables are shown as published.
- No personal phone numbers of staff are published; only company contacts from the letterhead.
- Cancellation terms, surcharges and visa rules come verbatim from the client's documents with their date.
