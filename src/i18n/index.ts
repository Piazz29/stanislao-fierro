export const langs = ['it', 'de', 'en'] as const;
export type Lang = (typeof langs)[number];
export type Tr = Record<Lang, string>;

export const langNames: Record<Lang, string> = { it: 'Italiano', de: 'Deutsch', en: 'English' };
export const htmlLang: Record<Lang, string> = { it: 'it-IT', de: 'de-IT', en: 'en' };
export const ogLocale: Record<Lang, string> = { it: 'it_IT', de: 'de_DE', en: 'en_GB' };

// Percorsi localizzati: stessa pagina, slug nella lingua del visitatore.
export const routes = {
  home: { it: '', de: '', en: '' },
  works: { it: 'opere', de: 'werke', en: 'works' },
  competitions: { it: 'concorsi', de: 'wettbewerbe', en: 'competitions' },
  sketches: { it: 'schizzi', de: 'skizzen', en: 'sketches' },
  studio: { it: 'studio', de: 'studio', en: 'studio' },
  contact: { it: 'contatti', de: 'kontakt', en: 'contact' },
} as const;
export type RouteKey = keyof typeof routes;

export function path(lang: Lang, key: RouteKey, slug?: string): string {
  const prefix = lang === 'it' ? '' : `/${lang}`;
  const seg = routes[key][lang];
  return `${prefix}/${seg ? `${seg}/` : ''}${slug ? `${slug}/` : ''}`;
}

export const ui = {
  studioName: { it: 'Stanislao Fierro Architetto', de: 'Stanislao Fierro Architekt', en: 'Stanislao Fierro Architect' },
  skip: { it: 'Vai al contenuto', de: 'Zum Inhalt springen', en: 'Skip to content' },
  menu: { it: 'Menu', de: 'Menü', en: 'Menu' },
  close: { it: 'Chiudi', de: 'Schließen', en: 'Close' },
  langLabel: { it: 'Lingua', de: 'Sprache', en: 'Language' },
  mainNav: { it: 'Navigazione principale', de: 'Hauptnavigation', en: 'Main navigation' },
  nav: {
    works: { it: 'Opere', de: 'Werke', en: 'Works' },
    competitions: { it: 'Concorsi', de: 'Wettbewerbe', en: 'Competitions' },
    sketches: { it: 'Schizzi', de: 'Skizzen', en: 'Sketches' },
    studio: { it: 'Studio', de: 'Studio', en: 'Studio' },
    contact: { it: 'Contatti', de: 'Kontakt', en: 'Contact' },
  },
  // cartiglio
  project: { it: 'Opera', de: 'Werk', en: 'Work' },
  place: { it: 'Luogo', de: 'Ort', en: 'Location' },
  year: { it: 'Anno', de: 'Jahr', en: 'Year' },
  competition: { it: 'Concorso', de: 'Wettbewerb', en: 'Competition' },
  built: { it: 'Realizzazione', de: 'Ausführung', en: 'Completed' },
  area: { it: 'Superficie', de: 'Fläche', en: 'Area' },
  client: { it: 'Committente', de: 'Bauherr', en: 'Client' },
  with: { it: 'Con', de: 'Mit', en: 'With' },
  collaborators: { it: 'Collaboratori', de: 'Mitarbeit', en: 'Collaborators' },
  awards: { it: 'Riconoscimenti', de: 'Auszeichnungen', en: 'Awards' },
  press: { it: 'Pubblicazioni', de: 'Publikationen', en: 'Publications' },
  photos: { it: 'Fotografie', de: 'Fotografie', en: 'Photography' },
  typology: { it: 'Tipologia', de: 'Typologie', en: 'Type' },
  status: { it: 'Stato', de: 'Status', en: 'Status' },
  sheet: { it: 'Tav.', de: 'Bl.', en: 'Sh.' },
  // tipologie e stati
  typologies: {
    'spazi-pubblici': { it: 'Spazi pubblici', de: 'Öffentliche Räume', en: 'Public spaces' },
    'edifici-pubblici': { it: 'Edifici pubblici', de: 'Öffentliche Bauten', en: 'Public buildings' },
    residenziale: { it: 'Residenziale', de: 'Wohnbau', en: 'Housing' },
    scuole: { it: 'Scuole', de: 'Schulen', en: 'Schools' },
    allestimenti: { it: 'Allestimenti', de: 'Ausstellungen', en: 'Exhibitions' },
  },
  statuses: {
    realizzato: { it: 'Realizzati', de: 'Realisiert', en: 'Built' },
    concorso: { it: 'Concorsi', de: 'Wettbewerbe', en: 'Competitions' },
    progetto: { it: 'Progetti', de: 'Projekte', en: 'Projects' },
  },
  statusOne: {
    realizzato: { it: 'Realizzato', de: 'Realisiert', en: 'Built' },
    concorso: { it: 'Concorso', de: 'Wettbewerb', en: 'Competition' },
    progetto: { it: 'Progetto', de: 'Projekt', en: 'Project' },
  },
  imageTypes: {
    foto: { it: 'Foto', de: 'Foto', en: 'Photograph' },
    rendering: { it: 'Rendering di concorso', de: 'Wettbewerbsvisualisierung', en: 'Competition rendering' },
    schizzo: { it: 'Schizzo', de: 'Skizze', en: 'Sketch' },
    disegno: { it: 'Disegno', de: 'Zeichnung', en: 'Drawing' },
    tavola: { it: 'Tavola', de: 'Tafel', en: 'Board' },
    plastico: { it: 'Plastico', de: 'Modell', en: 'Model' },
    immagine: { it: 'Immagine di progetto', de: 'Projektbild', en: 'Project image' },
  },
  // home
  homeTitle: {
    it: 'Stanislao Fierro Architetto, Bolzano',
    de: 'Stanislao Fierro Architekt, Bozen',
    en: 'Stanislao Fierro Architect, Bolzano',
  },
  homeDescription: {
    it: 'Studio di architettura a Bolzano. Piazze, spazi pubblici ed edifici: Piazza Silvius Magnago, Piazza Tribunale, Baza. Premio Architettura Alto Adige 2019.',
    de: 'Architekturbüro in Bozen. Plätze, öffentliche Räume und Bauten: Silvius-Magnago-Platz, Gerichtsplatz, Baza. Architekturpreis Südtirol 2019.',
    en: 'Architecture practice in Bolzano. Squares, public spaces and buildings: Piazza Silvius Magnago, Piazza Tribunale, Baza. South Tyrol Architecture Award 2019.',
  },
  homeLead: {
    it: 'Piazze, basamenti, vuoti urbani. Progetti e opere dal 1989, in Alto Adige, in Italia e in Europa.',
    de: 'Plätze, Sockel, städtische Leerräume. Projekte und Bauten seit 1989, in Südtirol, Italien und Europa.',
    en: 'Squares, plinths, urban voids. Projects and buildings since 1989, in South Tyrol, Italy and across Europe.',
  },
  selected: { it: 'Opere in evidenza', de: 'Ausgewählte Werke', en: 'Selected works' },
  allWorks: { it: 'Tutte le opere', de: 'Alle Werke', en: 'All works' },
  awards2019: { it: 'Premio Architettura Alto Adige 2019', de: 'Architekturpreis Südtirol 2019', en: 'South Tyrol Architecture Award 2019' },
  awards2019Line: {
    it: 'Due opere premiate: Piazza Silvius Magnago, categoria Spazi aperti e infrastrutture e premio del pubblico; Edificio de Formación y Empleo a Baza, premio Architettura export.',
    de: 'Zwei Werke ausgezeichnet: Silvius-Magnago-Platz, Kategorie Freiräume und Infrastrukturen sowie Publikumspreis; Edificio de Formación y Empleo in Baza, Preis Architektur-Export.',
    en: 'Two works awarded: Piazza Silvius Magnago, Open Spaces and Infrastructure category and Public Choice award; Edificio de Formación y Empleo in Baza, Architecture Export award.',
  },
  slide: { it: 'Immagine', de: 'Bild', en: 'Image' },
  prev: { it: 'Precedente', de: 'Zurück', en: 'Previous' },
  next: { it: 'Successiva', de: 'Weiter', en: 'Next' },
  pause: { it: 'Pausa', de: 'Pause', en: 'Pause' },
  play: { it: 'Riprendi', de: 'Fortsetzen', en: 'Play' },
  archive: { it: 'Archivio dello studio', de: 'Archiv des Büros', en: 'Studio archive' },
  // opere
  worksTitle: { it: 'Opere', de: 'Werke', en: 'Works' },
  worksDescription: {
    it: 'Indice delle opere di Stanislao Fierro: spazi pubblici, edifici pubblici, residenze, scuole e allestimenti, con i concorsi in Italia e in Europa.',
    de: 'Werkverzeichnis von Stanislao Fierro: öffentliche Räume, öffentliche Bauten, Wohnbau, Schulen und Ausstellungen.',
    en: 'Index of works by Stanislao Fierro: public spaces, public buildings, housing, schools and exhibitions.',
  },
  filterTypology: { it: 'Tipologia', de: 'Typologie', en: 'Type' },
  filterStatus: { it: 'Stato', de: 'Status', en: 'Status' },
  all: { it: 'Tutte', de: 'Alle', en: 'All' },
  allStatus: { it: 'Tutti', de: 'Alle', en: 'All' },
  colYear: { it: 'Anno', de: 'Jahr', en: 'Year' },
  colWork: { it: 'Opera', de: 'Werk', en: 'Work' },
  colPlace: { it: 'Luogo', de: 'Ort', en: 'Location' },
  colType: { it: 'Tipologia', de: 'Typologie', en: 'Type' },
  colAward: { it: 'Riconoscimento', de: 'Auszeichnung', en: 'Recognition' },
  shown: { it: 'opere', de: 'Werke', en: 'works' },
  noResults: {
    it: 'Nessuna opera con questi criteri. Rimuovi un filtro.',
    de: 'Kein Werk entspricht diesen Kriterien. Entfernen Sie einen Filter.',
    en: 'No works match these criteria. Remove a filter.',
  },
  resetFilters: { it: 'Mostra tutte', de: 'Alle anzeigen', en: 'Show all' },
  // scheda
  backToWorks: { it: 'Indice delle opere', de: 'Werkverzeichnis', en: 'Index of works' },
  prevWork: { it: 'Opera precedente', de: 'Vorheriges Werk', en: 'Previous work' },
  nextWork: { it: 'Opera successiva', de: 'Nächstes Werk', en: 'Next work' },
  fromReport: { it: 'Dalla relazione di progetto', de: 'Aus dem Projektbericht', en: 'From the design report' },
  originalLanguage: {
    it: { it: 'testo originale', de: 'Originaltext auf Italienisch', en: 'original text in Italian' },
    de: { it: 'testo originale in tedesco', de: 'Originaltext', en: 'original text in German' },
    es: { it: 'testo originale in spagnolo', de: 'Originaltext auf Spanisch', en: 'original text in Spanish' },
  },
  noImages: {
    it: 'L’archivio online dello studio non conserva immagini di quest’opera.',
    de: 'Das Online-Archiv des Büros enthält keine Bilder dieses Werks.',
    en: 'The studio’s online archive holds no images of this work.',
  },
  images: { it: 'immagini', de: 'Bilder', en: 'images' },
  enlarge: { it: 'Ingrandisci', de: 'Vergrößern', en: 'Enlarge' },
  // concorsi
  compTitle: { it: 'Concorsi', de: 'Wettbewerbe', en: 'Competitions' },
  compDescription: {
    it: 'Registro dei concorsi di architettura di Stanislao Fierro dal 1992: primi premi, piazzamenti e finali in Italia, Spagna, Germania, Svizzera, Albania e Messico.',
    de: 'Verzeichnis der Architekturwettbewerbe von Stanislao Fierro seit 1992: erste Preise, Platzierungen und Finalteilnahmen in Italien, Spanien, Deutschland, der Schweiz, Albanien und Mexiko.',
    en: 'Register of architecture competitions by Stanislao Fierro since 1992: first prizes, placings and finals in Italy, Spain, Germany, Switzerland, Albania and Mexico.',
  },
  compLead: {
    it: 'Il concorso è il modo in cui lo studio lavora. Registro cronologico dal 1992.',
    de: 'Der Wettbewerb ist die Arbeitsweise des Büros. Chronologisches Verzeichnis seit 1992.',
    en: 'The competition is how the studio works. A chronological register since 1992.',
  },
  colResult: { it: 'Esito', de: 'Ergebnis', en: 'Result' },
  colCompetition: { it: 'Concorso', de: 'Wettbewerb', en: 'Competition' },
  international: { it: 'Internazionale', de: 'International', en: 'International' },
  firstPrizes: { it: 'primi premi', de: 'erste Preise', en: 'first prizes' },
  competitionsCount: { it: 'concorsi', de: 'Wettbewerbe', en: 'competitions' },
  countriesCount: { it: 'paesi', de: 'Länder', en: 'countries' },
  participation: { it: 'Partecipazione', de: 'Teilnahme', en: 'Entry' },
  onlyInternational: { it: 'Solo internazionali', de: 'Nur international', en: 'International only' },
  // schizzi
  sketchTitle: { it: 'Schizzi', de: 'Skizzen', en: 'Sketches' },
  sketchDescription: {
    it: 'Regesto degli schizzi di progetto di Stanislao Fierro: il disegno a mano come primo strumento del progetto.',
    de: 'Verzeichnis der Entwurfsskizzen von Stanislao Fierro: die Handzeichnung als erstes Werkzeug des Entwurfs.',
    en: 'A register of design sketches by Stanislao Fierro: drawing by hand as the first tool of the project.',
  },
  sketchLead: {
    it: 'Dallo schizzo alla costruzione. Il primo segno di ogni progetto è a mano.',
    de: 'Von der Skizze zum Bau. Der erste Strich jedes Projekts entsteht von Hand.',
    en: 'From sketch to construction. Every project begins with a line drawn by hand.',
  },
  lightboxLabel: { it: 'Schizzo ingrandito', de: 'Vergrößerte Skizze', en: 'Enlarged sketch' },
  // studio
  studioTitle: { it: 'Studio', de: 'Studio', en: 'Studio' },
  studioDescription: {
    it: 'Stanislao Fierro, architetto a Bolzano. Laurea IUAV 1988, professore incaricato di progettazione architettonica allo IUAV. Pubblicazioni, conferenze, studio con Nadine Saul.',
    de: 'Stanislao Fierro, Architekt in Bozen. Studium an der IUAV, Abschluss 1988, Lehrbeauftragter für Architekturentwurf an der IUAV. Publikationen, Vorträge, Büro mit Nadine Saul.',
    en: 'Stanislao Fierro, architect in Bolzano. Graduated from IUAV in 1988, lecturer in architectural design at IUAV. Publications, lectures, practice with Nadine Saul.',
  },
  profile: { it: 'Profilo', de: 'Profil', en: 'Profile' },
  teaching: { it: 'Insegnamento', de: 'Lehre', en: 'Teaching' },
  publications: { it: 'Pubblicazioni', de: 'Publikationen', en: 'Publications' },
  ownBooks: { it: 'Libri', de: 'Bücher', en: 'Books' },
  publishedIn: { it: 'Opere pubblicate in', de: 'Werke veröffentlicht in', en: 'Work published in' },
  lectures: { it: 'Conferenze', de: 'Vorträge', en: 'Lectures' },
  team: { it: 'Studio', de: 'Büro', en: 'Practice' },
  roles: { it: 'Incarichi', de: 'Ämter', en: 'Appointments' },
  portraitAlt: {
    it: 'Stanislao Fierro seduto sul basamento di un colonnato in pietra',
    de: 'Stanislao Fierro auf dem Sockel einer steinernen Kolonnade sitzend',
    en: 'Stanislao Fierro seated on the base of a stone colonnade',
  },
  studioMarkAlt: {
    it: 'Segno a mano libera in rosso, immagine della pagina Studio del sito attuale',
    de: 'Freihändiges rotes Zeichen, Bild der Studio-Seite der bisherigen Website',
    en: 'Freehand red mark, image from the Studio page of the current website',
  },
  // contatti
  contactTitle: { it: 'Contatti', de: 'Kontakt', en: 'Contact' },
  contactDescription: {
    it: 'Studio Stanislao Fierro, Via Montello 3, 39100 Bolzano. Tel. 0471 973896, stanislao.fierro@libero.it.',
    de: 'Büro Stanislao Fierro, Montellostraße 3, 39100 Bozen. Tel. +39 0471 973896, stanislao.fierro@libero.it.',
    en: 'Stanislao Fierro studio, Via Montello 3, 39100 Bolzano, Italy. Tel. +39 0471 973896, stanislao.fierro@libero.it.',
  },
  address: { it: 'Indirizzo', de: 'Adresse', en: 'Address' },
  phone: { it: 'Telefono', de: 'Telefon', en: 'Phone' },
  email: { it: 'Email', de: 'E-Mail', en: 'Email' },
  pec: { it: 'PEC', de: 'PEC (zertifizierte E-Mail)', en: 'PEC (certified email)' },
  vat: { it: 'P.IVA', de: 'MwSt.-Nr.', en: 'VAT no.' },
  register: { it: 'Ordine degli Architetti', de: 'Architektenkammer', en: 'Order of Architects' },
  mapAlt: {
    it: 'Mappa del quartiere di Gries a Bolzano con lo studio in Via Montello 3',
    de: 'Karte des Stadtteils Gries in Bozen mit dem Büro in der Montellostraße 3',
    en: 'Map of the Gries district of Bolzano showing the studio at Via Montello 3',
  },
  openMap: { it: 'Apri in OpenStreetMap', de: 'In OpenStreetMap öffnen', en: 'Open in OpenStreetMap' },
  // dallo schizzo alla costruzione
  heroHint: {
    it: 'Ogni immagine nasce dallo schizzo a mano dell’opera. Passando il cursore o il dito sulla foto si rivede il disegno.',
    de: 'Jedes Bild entsteht aus der Handskizze des Werks. Mit Maus oder Finger über dem Foto erscheint die Zeichnung wieder.',
    en: 'Each image grows out of the hand sketch of the work. Move the pointer or a finger over the photo to see the drawing again.',
  },
  revealTitle: { it: 'Dallo schizzo alla costruzione', de: 'Von der Skizze zum Bau', en: 'From sketch to construction' },
  revealSketch: { it: 'Schizzo', de: 'Skizze', en: 'Sketch' },
  revealBuilt: { it: 'Opera costruita', de: 'Gebautes Werk', en: 'Built work' },
  revealSlider: { it: 'Confronto tra schizzo e opera costruita', de: 'Vergleich zwischen Skizze und gebautem Werk', en: 'Comparison between sketch and built work' },
  revealHint: { it: 'Trascina la linea', de: 'Linie verschieben', en: 'Drag the line' },
  revealLead: {
    it: 'Il primo segno è a mano. La linea separa il disegno dall’edificio: spostala per passare dall’uno all’altro.',
    de: 'Der erste Strich entsteht von Hand. Die Linie trennt Zeichnung und Gebäude: Verschieben Sie sie, um vom einen zum anderen zu wechseln.',
    en: 'The first line is drawn by hand. The line divides drawing and building: move it to pass from one to the other.',
  },
  revealSource: {
    it: 'Dal titolo del suo scritto «Dallo schizzo alla costruzione», Galileo n. 183, 2008.',
    de: 'Nach dem Titel seines Aufsatzes „Dallo schizzo alla costruzione“, Galileo Nr. 183, 2008.',
    en: 'After the title of his essay “Dallo schizzo alla costruzione”, Galileo no. 183, 2008.',
  },
  // footer
  demoCredit: { it: 'Demo realizzata da AuralpDigital', de: 'Demo erstellt von AuralpDigital', en: 'Demo by AuralpDigital' },
  photoCredits: { it: 'Immagini dall’archivio dello studio', de: 'Bilder aus dem Archiv des Büros', en: 'Images from the studio archive' },
  notFound: { it: 'Pagina non trovata', de: 'Seite nicht gefunden', en: 'Page not found' },
} as const;

export function tr(v: Tr | Record<string, string>, lang: Lang): string {
  return (v as Record<string, string>)[lang];
}
