---
name: premium-website-design-workflow
description: >-
  Master design intelligence and frontend engineering orchestrator for building or redesigning
  premium, award-grade websites and web applications. Activates the 11-step anti-slop design loop,
  enforces the project's DESIGN.md specification, selectively routes tasks across the custom skill
  library (Taste, UI/UX Pro Max, Impeccable, Superdesign, and animation extensions), and guarantees
  rigorous multi-viewport visual QA while strictly preserving existing framework code and functionality.
---

# Master Premium Website Design Workflow

This skill serves as the primary design director, design systems architect, and QA orchestrator for creating, redesigning, and polishing production-grade websites and web applications.

Before writing or modifying any code, the agent **MUST** follow this phased operational protocol:

---

## Phase 1: Load Central Design Intelligence

1. **Read the Master Specification:**
   Always inspect and read the central design manual located at:
   [DESIGN.md](file:///D:/skills%20for%20ai/DESIGN.md)
   
   If working inside an application project (e.g. Stackyr) that maintains its own local `DESIGN.md` or `PRODUCT.md`, read those project-specific files first, using `D:\skills for ai\DESIGN.md` as the overarching architectural standard and quality floor.

2. **Conduct the 10-Point Pre-Flight Project Analysis:**
   Inspect the target project and establish:
   * **Project Purpose & Conversion Goals:** What does success look like?
   * **Target Audience:** Who is using this, and what patterns do they trust?
   * **Brand Positioning:** What is the authentic aesthetic archetype?
   * **Existing Codebase & Stack:** Inspect `package.json`, framework configurations (React, Vite, Next.js, etc.), and active styling engines (Tailwind CSS, Vanilla CSS). **Never alter the foundational stack.**
   * **Existing Routes & Components:** Map existing architecture to prevent functional regressions.
   * **Information Hierarchy & Copy:** Identify the core message and eliminate filler text.
   * **User Journeys:** Map navigation from entry to action.
   * **Technical Constraints:** Browser compatibility, responsiveness, performance requirements.
   * **Reference Benchmarks & Anti-References:** What to emulate; what AI clichés to avoid.
   * **Accessibility & SEO Targets:** Target WCAG 2.2 AA and optimal Core Web Vitals.

---

## Phase 2: Dynamic Skill Routing Engine

Do not invoke all skills simultaneously. Select **only the smallest set of relevant skills** based on the current objective:

```text
Task Objective                      --> Activated Skill
---------------------------------------------------------------------------------------------
1. Art Direction & Anti-Slop Layout --> design-taste-frontend (D:\skills for ai\.agents\skills\design-taste-frontend\)
2. Design Tokens, Colors & Fonts   --> ui-ux-pro-max (D:\skills for ai\.agents\skills\ui-ux-pro-max\)
3. Design Critique & Craft Audit    --> impeccable (D:\skills for ai\.agent\skills\impeccable\)
4. Micro-Polish & Tactile Details   --> make-interfaces-feel-better (D:\skills for ai\.agents\skills\make-interfaces-feel-better\)
5. Visual Exploration & Canvas      --> superdesign (D:\skills for ai\.agents\skills\superdesign\)
6. Advanced Motion & Modern CSS     --> GOATED UI (frontend-atlas) & Web Animation Skills (on demand)
7. Usability & Agent Readiness QA   --> BASIC UX (basic-ux-audit / basic-ux-design) (on demand)
```

### Operational Rules for Skill Invocations:
* **For Art Direction:** Execute `design-taste-frontend` to pull researched layout directions and avoid generic centered-card templates.
* **For Design Systems:** Query `ui-ux-pro-max` (or run `python scripts/search.py "<product_type> <industry>" --design-system`) to get verified font pairings and semantic color palettes.
* **For Craft Polish:** Run `impeccable` commands (`impeccable detect` or check `reference/craft-floor.md`) to catch contrast errors, bad padding, and layout collisions.
* **For Micro-Polish & Tactile Details:** Follow `make-interfaces-feel-better` for concentric border radii (`outer = inner + padding`), optical alignment, interruptible CSS transitions, staggered entrances, and icon stroke consistency.
* **For Canvas Prototyping:** Use `superdesign` CLI (`superdesign iterate-design-draft`) when exploring visual variations.

---

## Phase 3: Define the Design System Contract

Before writing complete component JSX or templates, define the project's tokens in accordance with Section 5 of `DESIGN.md`:
1. **Semantic Color Scale:** Base surfaces, elevated panels, sunken inputs, high-contrast text, brand accents, and accessible state colors.
2. **Typography Geometry:** Display header scale using fluid `clamp()`, legible body line heights (`1.5–1.65`), and max line lengths (`60–75ch`).
3. **Spacing & Elevation:** 4px/8px modular spacing and crisp 1px borders rather than muddy box shadows.
4. **State Matrix:** Ensure all interactive elements account for Default, Hover, Focus-visible, Active, Loading, Disabled, and Empty states.

---

## Phase 4: Implementation & Tech Stack Preservation

1. **Stack Sanctity:** Build strictly within the user's existing stack (e.g., React + Vite + Tailwind CSS). Do not introduce extraneous runtime dependencies without explicit approval.
2. **True Functionality:** Every button, filter, tab, and form control must implement real interactivity or clear state changes. Never ship dead links (`href="#"`) or dummy non-functional controls.
3. **Performance-First Motion:**
   * Animate only `transform` and `opacity`.
   * Enforce `@media (prefers-reduced-motion: reduce)`.
   * Never hijack the native scrollbar or attach conflicting scroll observers.

---

## Phase 5: Mandatory Multi-Viewport Visual QA

Before declaring any website task complete, inspect the rendered application across three mandatory viewports:
* **Desktop:** `1440 × 900`
* **Tablet:** `768 × 1024`
* **Mobile:** `390 × 844`

Verify that:
1. No unintended horizontal overflow or scrollbars exist.
2. Mobile touch targets meet the minimum `44 × 44px` area.
3. Typography scales gracefully without awkward wrapping.
4. Color contrast meets WCAG 2.2 AA (minimum 4.5:1 for body copy).
5. The browser console is free of runtime errors and broken assets.

---

## Phase 6: Iteration & Completion Gate

Follow the 11-step iteration loop from `DESIGN.md`. A project is only signed off when all 6 points of the **Definition of Done** are verified. If the task scope changes materially, re-read the relevant sections of `DESIGN.md` before proceeding.
