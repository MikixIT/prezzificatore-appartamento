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

Il deploy avviene automaticamente via GitHub Actions: build → push della cartella `dist` sul branch `gh-pages`.

**Configurazione obbligatoria** ([Settings → Pages](https://github.com/MikixIT/prezzificatore-appartamento/settings/pages)):

1. **Build and deployment → Source:** **Deploy from a branch**
2. **Branch:** `gh-pages` — cartella **`/ (root)`**
3. Salva, attendi 1–2 minuti dopo un workflow verde in **Actions**
4. Apri: **https://mikixit.github.io/prezzificatore-appartamento/**

### Errore `GET .../src/main.tsx 404`

Significa che Pages sta ancora servendo i file sorgente da `main`, non la build. Imposta il branch **`gh-pages`** come sopra, poi **Actions → Deploy to GitHub Pages → Run workflow**.

Nel sorgente pagina devi vedere `/prezzificatore-appartamento/assets/...`, mai `/src/main.tsx`.

## Test

```bash
npm test
```
