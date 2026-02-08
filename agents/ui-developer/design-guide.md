# vibesRX Design Guide

Internal design system reference for the `ui-developer` agent

---

## 1. Design Intent

vibesRX is not a lifestyle app.
It is a **tool**.

The UI should feel like:

- Professional DJ equipment
- Old-school medical instrumentation
- Retro-futuristic hardware

Authoritative. Calm. Precise.

This is intentionally **anti-vibes-coded**.

---

## 2. Core Aesthetic Pillars

### 2.1 Industrial Minimalism

- Flat surfaces
- Hard edges
- Clear hierarchy
- No ornamental UI

Everything should look engineered, calibrated, and intentional.

---

### 2.2 Retro-Future Hardware Feel

Inspired by:

- Teenage Engineering products
- 70s–80s futurism
- Concept cars and lab equipment

Rules:

- Prefer squared geometry
- Slightly chunky components are acceptable
- Avoid ultra-soft rounding

---

### 2.3 Medical Rx Influence

vibesRX borrows visual language from:

- Prescription pads
- Medical charts
- Lab readouts
- Diagnostic labels

This influence should appear in:

- Typography choices
- Labels
- Section headers
- Data presentation
- Microcopy tone

Not literal medical icons.
Abstract authority, not cosplay.

---

## 3. Typography System

### 3.1 Primary Typeface

**Geist** is the primary UI font.

Usage:

- Default UI text
- Navigation
- Labels
- Buttons

Geist should be used confidently, including heavier weights.

---

### 3.2 Bold Typography Rules

Bold typography is a **feature**, not an accent.

Use bold for:

- Section headers
- Key actions
- Primary data points
- System outputs

Avoid:

- Overusing light weights
- Decorative font mixing

If something matters, make it visually undeniable.

---

### 3.3 Monospace Typeface

Monospace fonts are encouraged where appropriate.

Use mono for:

- Track order indices
- BPM, energy, or timing data
- System-generated output
- Debug-style or diagnostic UI
- “Prescription-like” readouts

Rules:

- Mono should feel clinical, not hacker-themed
- No neon green terminal aesthetics
- Mono is for precision and trust

---

## 4. Layout and Structure

### 4.1 Layout Philosophy

- Simple vertical flow
- Strong section separation
- Generous negative space

Avoid:

- Dense dashboards
- Overlapping cards
- Visual noise

---

### 4.2 Panels and Surfaces

Think in **modules**, like hardware panels.

Panels should:

- Have clear boundaries
- Feel stackable
- Read well in grayscale

No floating shadows for decoration.
If separation is needed, use spacing or lines.

---

## 5. Color System

### 5.1 Base Palette

Dominates the UI.

- Near-black
- Off-white
- Industrial gray

80–90% of the interface should be neutral.

---

### 5.2 Accent Colors

Accent colors are **signals**, not decoration.

Examples:

- Safety orange
- Signal red
- Acid yellow
- Cyan or teal

Rules:

- 1–2 accent colors max per screen
- Accents indicate action, state, or output
- Never use accents for long-form text

If everything is highlighted, nothing is important.

---

## 6. Controls and Inputs

### Buttons

- Rectangular
- Minimal or no rounding
- No gradients
- No glow effects

Primary buttons should feel like:
A deliberate switch, not a playful tap.

---

### Sliders, Toggles, Selectors

- Inspired by audio gear and lab controls
- Clear active vs inactive states
- Strong contrast
- No iOS-style pill toggles

---

## 7. Motion and Feedback

### Motion Philosophy

Motion is functional.

Use motion to:

- Confirm reordering
- Show processing
- Indicate success or failure

Avoid:

- Bouncy easing
- Elastic animations
- Idle or decorative motion

Movement should feel mechanical and intentional.

---

## 8. DJ and System Metaphors

vibesRX is a **DJ brain**, not a playlist editor.

Abstract references are encouraged:

- Flow
- Energy progression
- Set structure
- Input → processing → output

Avoid:

- Literal turntables
- Fake knobs
- DJ clichés

Subtlety wins.

---

## 9. States and Messaging

### Empty States

Tone:

- Calm
- Confident
- Slightly directive

Example:
“No prescription loaded. Add a playlist.”

---

### Error States

- Direct
- Neutral
- No humor

Errors should feel like diagnostic readouts.

---

### Success States

- Brief
- One accent color
- Then disappear

Do not celebrate excessively.

---

## 10. Explicit Anti-Patterns

The `ui-developer` must not introduce:

- Glassmorphism
- Neumorphism
- Pastel gradients
- SaaS-style dashboards
- Soft marketing visuals
- Spotify-like UI patterns

If it resembles:

- Linear
- Notion
- Stripe Dashboard
- Spotify itself

It is incorrect.

---

## 11. Review Checklist

Before implementing or shipping UI changes:

1. Does this feel like hardware or lab equipment?
2. Can this screen survive without color?
3. Is bold typography doing real work?
4. Does mono typography improve clarity?
5. Is color signaling meaning or just aesthetics?
6. Does this feel authoritative and calm?

When in doubt, simplify.

---

## 12. Guiding Principle

vibesRX should feel like a **retro-future DJ prescription tool**.
Confident.
Minimal.
Engineered.

Design choices should earn their place.
