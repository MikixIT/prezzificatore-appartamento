# prezzificatore-appartamento

Calcolatore preventivo per ristrutturazioni appartamento, realizzato con React, TypeScript e Vite.

## Demo

https://mikixit.github.io/prezzificatore-appartamento/

## Sviluppo locale

```bash
npm install
npm start
```

Apri http://localhost:5173/

## Build

```bash
npm run build
npm run preview
```

In produzione l'app è servita sotto `/prezzificatore-appartamento/`.

## GitHub Pages

Il deploy avviene automaticamente via GitHub Actions ad ogni push su `main`.

**Configurazione obbligatoria nel repository** ([Settings → Pages](https://github.com/MikixIT/prezzificatore-appartamento/settings/pages)):

1. **Build and deployment → Source:** seleziona **GitHub Actions** (non "Deploy from a branch")
2. Dopo un push su `main`, attendi che il workflow **Deploy to GitHub Pages** sia verde in **Actions**
3. Apri l'URL con il path del repo: `https://mikixit.github.io/prezzificatore-appartamento/`

### Errore 404 su JS/CSS

Se la pagina è bianca o in console vedi 404 su `/src/main.tsx`, GitHub sta servendo i file sorgente invece della build. Imposta **Source → GitHub Actions** e rilancia il workflow da **Actions → Run workflow**.

Dopo il deploy corretto, `index.html` deve puntare a `/prezzificatore-appartamento/assets/...` e non a `/src/main.tsx`.

## Test

```bash
npm test
```
