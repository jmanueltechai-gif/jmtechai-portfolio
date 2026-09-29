# Portfolio Project Rules

## About this project
- Personal portfolio for JM Manuel, Operations & AI Automation specialist. Audience: recruiters and clients. Goal: get freelance/full-time opportunities in operations and AI automation.
- Live on Vercel (auto-deploys from GitHub). Stack: React 19, TypeScript, Vite 6; styling: plain CSS with custom properties/design tokens in `src/styles/tokens.css`.
- Commands: install `npm ci`, dev `npm run dev`, lint `npm run lint`, build `npm run build`.

## Design system (source of truth, do not deviate)
- Palette: bg #F4F4ED, surface #FBFBF7, text #0B1E3F (dark theme #EDF0F6), muted #5A6479 (dark theme rgba(237, 240, 246, 0.60)), accent #FF7A1A, border rgba(11, 30, 63, 0.14) (dark theme rgba(255, 255, 255, 0.09)).
- Fonts: headings Poppins, body Poppins (system sans-serif fallbacks).
- Type scale: `--fs-display: clamp(64px, 9vw, 128px)`; `--fs-h2: clamp(32px, 4vw, 56px)`; `--fs-h3: clamp(22px, 2vw, 28px)`; `--fs-body: 15px`; `--fs-eyebrow: 12px`; `--fs-nav: 15px`; line heights `--lh-tight: 0.95`, `--lh-heading: 1.25`, `--lh-body: 1.65`.
- Spacing: `--container-x: clamp(24px, 6vw, 96px)`; `--panel-x: clamp(20px, 4vw, 64px)`; `--section-pad-y: clamp(110px, 13vh, 170px)`; card radius 24px, pill radius 999px. No global spacing-step scale is defined; component spacing uses local values and `clamp()`.
- Motion: 200-300ms ease-out, scroll reveals fade + 16px translate, respect prefers-reduced-motion
- Vibe: Clean, professional, warm cream background with navy text and orange accents. Never use: purple gradients, glow blobs, identical 3-card rows, emoji icons, lorem ipsum.

## Working rules
1. Use design tokens (CSS variables / Tailwind config). No hardcoded colors or font sizes.
2. One scoped task per session. Never touch files outside the requested scope.
3. Never invent projects, metrics, or testimonials. Use marked placeholders like [ADD: outcome].
4. Do not add dependencies unless essential, and justify any you add.
5. Do not delete assets, env files, or config.
6. Do not ask questions unless fully blocked. Choose the simplest option and list it under assumptions.

## Definition of done
- Lint and production build pass.
- No horizontal scroll at 375px, 768px, 1440px.
- All images have alt text; text contrast is readable.
- CSS values match the design system above.
- Final report lists: files changed, PASS/FAIL checklist, placeholders, assumptions, recommended next task.

Unfilled details: None. Personal name, role, audience, and goal were provided in the request; all detected values are documented above.