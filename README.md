# prezzificatore-appartamento

**Instant renovation estimates for apartments.**

A minimal quote calculator: enter surfaces, rooms, and systems — get a live total with an expandable cost breakdown. Built with React, TypeScript, and Vite.

[**Live demo →**](https://mikixit.github.io/prezzificatore-appartamento/)

---

## Features

- Real-time estimate as you type
- Stepper inputs and optional systems (electrical, plumbing, heating, gas)
- Waterproofing, door frames, A/C, false ceiling
- Itemized breakdown (IVA excluded)
- Mobile-first UI

## Local development

```bash
npm install
npm start
```

Open http://localhost:5173/

## Deploy (GitHub Pages)

**One-time setup** — [Settings → Pages](https://github.com/MikixIT/prezzificatore-appartamento/settings/pages):

| Setting | Value |
|--------|--------|
| Source | Deploy from a branch |
| Branch | `gh-pages` |
| Folder | `/ (root)` |

**Publish:**

```bash
npm run deploy
```

Builds `dist` and pushes it to the `gh-pages` branch.

**Preview production build locally:**

```bash
npm run build
npm run preview
```

## Tests

```bash
npm test
```

## Stack

React · TypeScript · Vite · SCSS modules · Vitest
