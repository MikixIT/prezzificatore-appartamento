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

## Deploy su GitHub Pages

### Configurazione (una tantum)

In [Settings → Pages](https://github.com/MikixIT/prezzificatore-appartamento/settings/pages):

- **Source:** Deploy from a branch
- **Branch:** `gh-pages`
- **Folder:** `/ (root)`

### Pubblicare

```bash
npm install
npm run deploy
```

`npm run deploy` esegue la build di produzione e carica la cartella `dist` sul branch `gh-pages`.

### Anteprima build locale (path come su Pages)

```bash
npm run build
npm run preview
```

Apri l’URL indicato nel terminale.

### Errore `GET .../src/main.tsx 404`

Pages sta servendo i file da `main` invece della build. Verifica che il branch sia **`gh-pages`**, poi esegui di nuovo `npm run deploy` e attendi 1–2 minuti.

Nel sorgente della pagina devono comparire path tipo `/prezzificatore-appartamento/assets/...`, mai `/src/main.tsx`.

## Test

```bash
npm test
```
