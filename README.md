# Stanislao Fierro Architetto · demo

Demo del nuovo sito (Astro 7 + Tailwind 4), trilingue IT/DE/EN. Tutte le immagini sono quelle del sito attuale www.stanislaofierro.com.

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # sito statico in dist/
```

## Aggiungere un'opera

Ogni opera è un file YAML in `src/content/projects/`. Basta copiarne uno, rinominarlo (il nome del file diventa l'indirizzo: `/opere/<nome>/`) e compilare i campi; lo schema in `src/content.config.ts` segnala i campi mancanti alla build.

```yaml
title: { it: Piazza …, de: …platz, en: Piazza … }
year: 2024
place: { it: Bolzano, de: Bozen, en: Bolzano }
typology: spazi-pubblici        # spazi-pubblici | edifici-pubblici | residenziale | scuole | allestimenti
status: realizzato              # realizzato | concorso | progetto
competition: { year: 2022, result: { it: 1° premio, de: 1. Preis, en: 1st prize } }
cover: ../../assets/foto/nuova-piazza-01.jpg
gallery:
  - image: ../../assets/foto/nuova-piazza-01.jpg
    type: foto                  # foto | rendering | schizzo | disegno | tavola | plastico
    credit: Nome Fotografo
    alt: { it: …, de: …, en: … }
```

L'opera compare da sola nell'indice, nel registro dei concorsi (se ha `competition`), negli schizzi (immagini `type: schizzo`) e nelle tre lingue.

## Inserire i video della home

La home ha sei spazi video: l'apertura a tutto schermo e le cinque opere in evidenza. Finché un video non c'è, lo spazio mostra un'immagine (che poi fa da poster).

1. Copia il file in `public/video/` (MP4 H.264 o WebM, muto, circa 1920px di larghezza, possibilmente sotto i 10 MB).
2. In `src/data/media.ts` scrivi il percorso nel campo `video` dello spazio giusto, per esempio `video: '/video/apertura.mp4'`.

Il video parte da solo, muto e in loop; con «riduci movimento» attivo il sito resta comunque fermo sullo stato finale.

## Da dove vengono i contenuti

- `scripts/crawl/`: crawl del sito attuale (`crawl.mjs`), download delle immagini (`download.mjs`), registro delle opere con traduzioni (`registry.mjs`), testi (`texts.json`), testi alternativi (`alts.json`) e generatore dei file YAML e di `images-map.json` (`gen-content.mjs`).
- `images-map.json`: per ogni immagine scaricata, pagina di provenienza, progetto associato (solo se certo), tipo e prova dell'attribuzione.
- `src/data/site.ts`: biografia, pubblicazioni, conferenze, premi, concorsi senza scheda, slideshow.

## Verifiche

`GATES.md` elenca i controlli; ciascuno è uno script in `scripts/verify/` (crawl, mappa immagini, build, SEO, immagini, contenuti, divieti di stile, traduzioni, Lighthouse).
