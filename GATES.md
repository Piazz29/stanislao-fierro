# Gates: demo sito Stanislao Fierro Architetto (Astro + Tailwind)

OWNS: src/**, public/**, scripts/**, astro.config.mjs, package.json, package-lock.json, images-map.json, GATES.md, PRODUCT.md, DESIGN.md

Scope: demo trilingue IT/DE/EN con sole immagini reali del sito attuale, 7 pagine, scheda Magnago completa, SEO/a11y/performance verificati.

- [x] G0: this ledger states outcomes that can fail
  CHECK: node /Users/julianpiazzi/.claude/skills/unlazy/scripts/gate-lint.mjs GATES.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=c5d088b7ca3423574f2fcced16b8c035a2e93df7f4d5a8612e994ed25a628903; exit=0; EXPECT=matched; output-sha256=120d392c221377725df1f0c3652ce288efeecab3a56f242dd5d07e150ecfa32d; output-bytes=1466; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G1: crawl is complete (every menu entry and every linked ?p= page fetched) and every reachable /public/ image is on disk and decodes
  CHECK: node scripts/verify/crawl.mjs
  EXPECT: CRAWL VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=561fdbdd621bcee53f82030f12b9e7f46777406c24d5f3b712a815d78fe0caaa; exit=0; EXPECT=matched; output-sha256=91ca7b44336a10a3583b8acb5542b7ef3fae8e3cb35d07e4760c8701ef6d72ff; output-bytes=152; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G2: images-map.json covers every downloaded file with page, project, type; every project attribution is backed by the project page image list or a re-measured pixel-hash match
  CHECK: node scripts/verify/images-map.mjs
  EXPECT: IMAGES MAP VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=b5843fa37eb079f5c280ea2a8ae1d356c030ad9d044c0a89a3351cab4b5796e5; exit=0; EXPECT=matched; output-sha256=d257a44eb0ef12083254253d1f2f6b1b9c39de75a692c2ad8f300e82a855ac30; output-bytes=131; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G3: production build succeeds
  CHECK: node scripts/verify/build.mjs
  EXPECT: BUILD VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=e3d7a3f4eeec8dfbe5b260159f67272ed795f446fd1368dd5890ed5eda007556; exit=0; EXPECT=matched; output-sha256=424cf1eb2d0ea9b09cb3a3048921f49e76e9bcfb8579cad38850194cd4274888; output-bytes=26; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G4: all 7 pages exist in it/de/en plus Magnago scheda in 3 languages, each with title, meta description, canonical, hreflang it/de/en/x-default, og:image, html lang
  CHECK: node scripts/verify/pages.mjs
  EXPECT: PAGES VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=c6ee171bbb4d6afc159adfaa6dd4de93940545f1a069382866a5e57430e6e303; exit=0; EXPECT=matched; output-sha256=421272b9137c478b5689ece21809c0701a8d60a947a248b15ec6faef7d252c09; output-bytes=40; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G5: every rendered image comes from src/assets/originali (no external, stock or placeholder image), photos have descriptive alt, AVIF and WebP sources are emitted, no srcset width exceeds the original's width
  CHECK: node scripts/verify/images-dist.mjs
  EXPECT: DIST IMAGES VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=84066e4ed56b49dbd5a4fdf95a843dc2b9966a6703b3ff2203d1689368e323b0; exit=0; EXPECT=matched; output-sha256=a5d51e5d6953bab01c0348ec841622ba2b27af5bdebde17d296f3bf1be83998d; output-bytes=121; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G6: content facts present: footer credit on every page, Baza photo credit Fernando Alda, contatti has address/phone/email/PEC/static map, schema.org JSON-LD with address and awards, concorsi register lists international competitions with placement
  CHECK: node scripts/verify/content.mjs
  EXPECT: CONTENT VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=1d3f12aac2784d63a6fac628cb7a3614222ce153ab8f07bc9cb1124c650e5934; exit=0; EXPECT=matched; output-sha256=9145cd68827b4803c7c49eea834d6159b2d2d1a6e573fcd75353301909cc6ae8; output-bytes=94; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G7: style bans hold: no Inter/Space Grotesk, no em dash or marketing words in rendered text, reduced-motion handled, focus-visible styled
  CHECK: node scripts/verify/bans.mjs
  EXPECT: BANS VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=b511abe7be578ec74618cd689e987e2f7ec76837cff0781af6199d39da68223f; exit=0; EXPECT=matched; output-sha256=fdfaafeabf649239505f720ea1ff7e4f3085d24b06e4a7e222847f96e3ea3f62; output-bytes=43; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G8: German and English pages carry translated UI and Magnago text (no Italian UI strings left in de/en pages)
  CHECK: node scripts/verify/i18n.mjs
  EXPECT: I18N VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=559621283e882a02b0bcdf04a44a8ecb886c5a734e4040e30fccdac7e3f9ec97; exit=0; EXPECT=matched; output-sha256=30f10810fc7db97cf1e8cc17c2e498f3fedd9bedf333373c91c917940d2d6077; output-bytes=42; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G9: Lighthouse mobile scores >= 95 in performance, accessibility, best-practices, SEO for home, opere and Magnago (built site)
  CHECK: node scripts/verify/lighthouse.mjs
  EXPECT: LIGHTHOUSE VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=03b445a2db4e13729422ae6d0ef29689ff23c0552ba03954061e52507d9247f2; exit=0; EXPECT=matched; output-sha256=bb7c4fd7fbfbe6f386eb06678f1039f8c06ccef3563eec1c7bd19d559cabb1f9; output-bytes=360; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G12: sketch-to-built reveal ships on the Baza, Tribunale, Università, Luson schede in it/de/en, built only from attributed images of that project, exposed as a labelled keyboard slider
  CHECK: node scripts/verify/reveal.mjs
  EXPECT: REVEAL MARKUP VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=76c39795b4df2028cb42ef1b7dcf05d891c24b476fb1bc7f6bd6799bc15cb517; exit=0; EXPECT=matched; output-sha256=b0c2a90a5d4d56565407b9e1a3b36a0b8db183e236cbf1f0c00d5c2c5dddf23c; output-bytes=47; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G13: reveal responds to pointer drag, touch drag (vertical scroll still possible), arrow/Home/End keys, plays its intro sweep once, and stays static at 50% under reduced motion
  CHECK: node scripts/verify/reveal-behaviour.mjs
  EXPECT: REVEAL BEHAVIOUR VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=e0c7665f8e0112a5d4d8e14f9080a682a73dae5a15b567218834022794585f79; exit=0; EXPECT=matched; output-sha256=ba80e9f85fc7ad4ff8ae717c12d4999982b6de8d0ba37b29121176a0bd28237f; output-bytes=554; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G14: Lighthouse mobile >= 95 in all four categories also on the Baza scheda and home after adding the reveal
  CHECK: node scripts/verify/lighthouse.mjs /opere/centro-formazione-baza/ /en/works/piazza-tribunale/
  EXPECT: LIGHTHOUSE VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=9bd2399c9c8e6a19676158ec9b0b31212123340c1d3977fbafe34866dd0fc7f3; exit=0; EXPECT=matched; output-sha256=7e8507c84abe8484cb3541ab6edaded77d4742b1993600555e6f4325f9ce36dc; output-bytes=616; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G15: reveal inspected at 1440 and 390 with screenshots at several divider positions; framing of each pair judged legible
  EVIDENCE: manual 2026-10-15: scripts/verify/reveal-shots.mjs, 40 fotogrammi (ingresso, 50%, solo schizzo, solo foto) per Baza, Tribunale, Università, Luson e home a 1440 e 390; coppie scelte per soggetto (sezione/volume, raggio di luce/luce dall'alto, pianta alberi/piazza dall'alto, gradini/gradini); corretto: maniglia tagliata ai bordi (ora sempre intera). Torre di Mosto esclusa: nessuno schizzo leggibile accanto a una foto

- [x] G16: tab icon and share images: favicon.ico 16/32/48, apple-touch 180, manifest icons, no Astro template icon left, every page links its own 1200x630 card in its language under 300 KB and newer than its content
  CHECK: node scripts/verify/brand.mjs
  EXPECT: BRAND VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=4c4a86dc8332c53767cab2a374dfd45ee22c43fe93fbb99e5f6c8e6707b35ad8; exit=0; EXPECT=matched; output-sha256=9f8c20df7c3b79bc9ae903307173e2ba2f172bd9474546020ef57ec0466d6439; output-bytes=65; shell=/bin/sh; cwd=/Users/julianpiazzi/Desktop/stanislao fierro; path=a38109ae3934/29 entries

- [x] G17: icon judged legible at 16 px on light and dark Chrome tabs; share cards reviewed in it/de/en including long titles and works without photos
  EVIDENCE: manual 2026-10-15: 4 varianti del simbolo provate su schede Chrome chiare e scure a 16/32/64/180 px (scripts/brand/proto.mjs), scelta E (SF in basso a sinistra + quadratino porfido); revisionate 18 tavole (home, sezioni, Baza DE, Magnago EN, Mazzini senza foto, Trieste, Messico DE, CasaNova DE, Riccione DE, Fuencarral DE, Mausoleo IT/EN); corretti: colonna etichette stretta, schizzo di Funes (progetto) usato per «Concorsi» sostituito con Mausoleo di Augusto, quadratino porfido sulla riga sbagliata, titoli tedeschi lunghi fuori colonna (ora adattati senza sillabare nomi propri)

- [x] G21: new home modelled on stanzza.design replaces the WebGL hero (former G18-G20 retired): timed loading screen (name splits around the thumbnails, closes and flies into the header) that hands over to a static full-screen hero, video slots fall back to images and are set in src/data/media.ts, no console errors and no horizontal overflow at 1440 and 390, static final state under reduced motion
  EVIDENCE: manual 2026-10-15: scripts/verify/loader-frames.mjs a 1440 e 390 (14 fotogrammi da 0,3 a 6,5 s, nessun errore, scorrimento sbloccato alla fine); scripts/verify/home-scroll.mjs a 390x844 (23 fotogrammi lungo tutta la pagina, overflow-x 0, NO ERRORS) e revisione in Chrome a 1298x924 di apertura, metodo, opere in evidenza, processo, notte, cifre, pubblicazioni, premi, concorsi, citazione, footer; Lighthouse home 98/96/100/100 (G9)

- [x] G10: every page inspected in the browser on desktop (1440) and mobile (390) with screenshots; defects found were fixed and re-inspected
  EVIDENCE: manual 2026-10-15: Playwright + Chrome di sistema, 1440x900 e 390x844 (scripts/verify/shots.mjs) su home, opere, scheda Magnago, concorsi, schizzi, studio, contatti, de/werke, en/competitions, de/werke/baza; build di produzione (astro preview): 0 errori console, 0 overflow orizzontale; 104 immagini caricate allo scroll, 0 risposte >=400; interazioni (scripts/verify/interactions.mjs) 20/20. Difetti trovati e corretti: header a capo, sizes con var() non valido, palco mobile vuoto, galleria Magnago rada, schizzo duplicato 453/472, numerazione tavole vs lightbox, multiply annullato dallo stacking context, Magnago ripetuta in evidenza, tavola 104 classificata come schizzo, LCP home 4.7s -> 2.0s

- [x] G11: German and English copy reviewed sentence by sentence for correctness and South Tyrol usage (Bozen, Silvius-Magnago-Platz)
  EVIDENCE: manual 2026-10-15: testo reso di de/ e en/ (home, scheda Magnago, studio, kontakt) riletto frase per frase; corretti «Eingetragen in die Architektenkammer», «Laboratorio 3», minuscole tedesche nel lead Werke; toponimi ufficiali: Bozen, Oberbozen, Lüsen, Gerichtsplatz, Universitätsplatz, Mazziniplatz, Silvius-Magnago-Platz, Montellostraße, WOBI. Revisione dell'autore, non di un madrelingua: da far rileggere prima della pubblicazione
