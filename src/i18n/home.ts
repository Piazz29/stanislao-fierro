// Testi della home e della nuova testata. Ogni frase si appoggia su fatti già presenti nel sito
// (biografia, registro dei concorsi, titoli degli scritti); niente cifre inventate.
import type { Tr } from './index';

const t = (it: string, de: string, en: string): Tr => ({ it, de, en });

export const h = {
  // testata
  menu: t('Menu', 'Menü', 'Menu'),
  close: t('Chiudi', 'Schließen', 'Close'),
  contactCta: t('Scrivi allo studio', 'Büro kontaktieren', 'Contact the studio'),
  menuLabel: t('Menu principale', 'Hauptmenü', 'Main menu'),

  // apertura
  heroTitle: t('Piazze, basamenti,|vuoti urbani.', 'Plätze, Sockel,|städtische Leerräume.', 'Squares, plinths,|urban voids.'),
  heroSub: t('Architettura a Bolzano dal 1989.', 'Architektur in Bozen seit 1989.', 'Architecture in Bolzano since 1989.'),
  heroVideoAlt: t(
    'Piazza Silvius Magnago a Bolzano: la piazza davanti al Palazzo della Provincia, rendering di concorso',
    'Silvius-Magnago-Platz in Bozen: der Platz vor dem Landhaus, Wettbewerbsvisualisierung',
    'Piazza Silvius Magnago in Bolzano: the square in front of the provincial government building, competition rendering',
  ),
  scrollHint: t('Scorri', 'Scrollen', 'Scroll'),
  loaderRole: t('Architetto · Bolzano · dal 1989', 'Architekt · Bozen · seit 1989', 'Architect · Bolzano · since 1989'),

  // metodo
  methodTag: t('Metodo', 'Methode', 'Method'),
  methodTitle: t('Progettare|è costruire.', 'Entwerfen|heißt bauen.', 'To design|is to build.'),
  methodLeft: t(
    'Piazze, edifici pubblici, scuole e residenze in Alto Adige, in Italia e in Europa. Quasi ogni opera dello studio nasce da un concorso.',
    'Plätze, öffentliche Bauten, Schulen und Wohnungen in Südtirol, Italien und Europa. Fast jedes Werk des Büros geht aus einem Wettbewerb hervor.',
    'Squares, public buildings, schools and housing in South Tyrol, Italy and across Europe. Almost every work of the studio begins with a competition.',
  ),
  methodRight: t(
    'Il vuoto tra gli edifici è trattato come architettura: un piano continuo, pochi elementi in pietra, la luce che li misura.',
    'Der Leerraum zwischen den Bauten wird als Architektur behandelt: eine durchgehende Fläche, wenige Elemente aus Stein, das Licht, das sie misst.',
    'The void between buildings is treated as architecture: a continuous plane, a few stone elements, the light that measures them.',
  ),

  // opere in evidenza
  featuredLabel: t('Opere in evidenza', 'Ausgewählte Werke', 'Selected works'),
  viewWork: t('Vedi l’opera', 'Werk ansehen', 'View work'),
  allWorks: t('Tutte le opere', 'Alle Werke', 'All works'),
  competition: t('Concorso', 'Wettbewerb', 'Competition'),
  completed: t('Realizzazione', 'Ausführung', 'Completed'),
  place: t('Luogo', 'Ort', 'Location'),

  // processo
  processTag: t('Processo', 'Prozess', 'Process'),
  processTitle: t('Dallo schizzo|alla costruzione.', 'Von der Skizze|zum Bau.', 'From sketch|to construction.'),
  processLead: t(
    'Quattro passaggi, sempre gli stessi. Il titolo viene da uno scritto di Stanislao Fierro, Galileo n. 183, 2008.',
    'Vier Schritte, immer dieselben. Der Titel stammt aus einem Aufsatz von Stanislao Fierro, Galileo Nr. 183, 2008.',
    'Four steps, always the same. The title comes from an essay by Stanislao Fierro, Galileo no. 183, 2008.',
  ),
  steps: [
    {
      title: t('Lo schizzo', 'Die Skizze', 'The sketch'),
      text: t(
        'Il primo segno è a mano: la sezione, il suolo, la luce. Lo schizzo fissa l’idea prima di ogni misura.',
        'Der erste Strich entsteht von Hand: Schnitt, Boden, Licht. Die Skizze hält die Idee vor jedem Maß fest.',
        'The first line is drawn by hand: section, ground, light. The sketch fixes the idea before any measurement.',
      ),
    },
    {
      title: t('Il concorso', 'Der Wettbewerb', 'The competition'),
      text: t(
        'Lo studio lavora per concorsi, in Italia e all’estero. Il primo premio a Siviglia è del 1992.',
        'Das Büro arbeitet über Wettbewerbe, in Italien und im Ausland. Der erste Preis in Sevilla stammt von 1992.',
        'The studio works through competitions, in Italy and abroad. The first prize in Seville dates from 1992.',
      ),
    },
    {
      title: t('Il progetto', 'Der Entwurf', 'The design'),
      text: t(
        'Piante, sezioni, dettagli. La tavola traduce lo schizzo in misure e materiali: pietra, ghiaia, luce.',
        'Grundrisse, Schnitte, Details. Der Plan übersetzt die Skizze in Maße und Materialien: Stein, Kies, Licht.',
        'Plans, sections, details. The drawing translates the sketch into dimensions and materials: stone, gravel, light.',
      ),
    },
    {
      title: t('L’opera', 'Das Werk', 'The building'),
      text: t(
        'Piazza Tribunale, Piazza Silvius Magnago, Baza: opere costruite dopo un concorso vinto.',
        'Gerichtsplatz, Silvius-Magnago-Platz, Baza: Werke, die nach einem gewonnenen Wettbewerb gebaut wurden.',
        'Piazza Tribunale, Piazza Silvius Magnago, Baza: buildings realised after a competition win.',
      ),
    },
  ],

  // tipologie, sezione notte
  nightTag: t('Tipologie', 'Typologien', 'Types of work'),
  nightTitle: t('Disegno a mano.|Concorso.|Costruzione.', 'Handzeichnung.|Wettbewerb.|Bau.', 'Drawing by hand.|Competition.|Construction.'),
  works: t('opere', 'Werke', 'works'),
  work: t('opera', 'Werk', 'work'),
  seeTypology: t('Vedi le opere', 'Werke ansehen', 'See the works'),
  typologyText: {
    'spazi-pubblici': t('Piazze, strade, centri storici e lungolaghi, da Bolzano a Tirana e Città del Messico.', 'Plätze, Straßen, Ortskerne und Seeufer, von Bozen bis Tirana und Mexiko-Stadt.', 'Squares, streets, historic centres and lakefronts, from Bolzano to Tirana and Mexico City.'),
    'edifici-pubblici': t('Biblioteche, musei, servizi e sedi pubbliche, in Alto Adige e in Spagna.', 'Bibliotheken, Museen, Dienstleistungs- und Verwaltungsbauten, in Südtirol und Spanien.', 'Libraries, museums, services and public offices, in South Tyrol and Spain.'),
    scuole: t('Scuole materne ed elementari, palestre e un centro agrario.', 'Kindergärten und Grundschulen, Turnhallen und ein landwirtschaftliches Zentrum.', 'Nursery and primary schools, gyms and an agricultural centre.'),
    residenziale: t('Alloggi IPES a Soprabolzano, abitazioni a Funes, l’isolato EA2 di CasaNova a Bolzano.', 'WOBI-Wohnungen in Oberbozen, Wohnhäuser in Villnöß, Baulos EA2 in CasaNova, Bozen.', 'IPES housing in Soprabolzano, homes in Funes, block EA2 in CasaNova, Bolzano.'),
    allestimenti: t('La mostra «Danza Architettura» a Bolzano.', 'Die Ausstellung „Tanz Architektur“ in Bozen.', 'The “Dance Architecture” exhibition in Bolzano.'),
  } as Record<string, Tr>,

  // cifre
  numbersTag: t('In cifre', 'In Zahlen', 'In figures'),
  numbersTitle: t('Lo studio.', 'Das Büro.', 'The practice.'),
  years: t('Anni di professione', 'Jahre Berufspraxis', 'Years in practice'),
  competitions: t('Concorsi', 'Wettbewerbe', 'Competitions'),
  firstPrizes: t('Primi premi', 'Erste Preise', 'First prizes'),
  countries: t('Paesi', 'Länder', 'Countries'),
  bioShort: t(
    'Stanislao Fierro, nato a Taurasi nel 1961, si laurea allo IUAV di Venezia nel 1988, dove dal 2005 è professore incaricato di progettazione architettonica.',
    'Stanislao Fierro, 1961 in Taurasi geboren, schließt 1988 an der IUAV Venedig ab, wo er seit 2005 Lehrbeauftragter für Architekturentwurf ist.',
    'Stanislao Fierro, born in Taurasi in 1961, graduated from IUAV Venice in 1988, where he has taught architectural design since 2005.',
  ),
  bioShort2: t(
    'Lo studio di Bolzano, in Via Montello, lavora con Nadine Saul.',
    'Das Büro in Bozen, in der Montellostraße, arbeitet mit Nadine Saul.',
    'The Bolzano studio, on Via Montello, works with Nadine Saul.',
  ),
  theStudio: t('Lo studio', 'Das Büro', 'The studio'),

  // pubblicazioni
  publishedIn: t('Opere pubblicate in', 'Werke veröffentlicht in', 'Work published in'),

  // premi
  awardsTag: t('Riconoscimenti', 'Auszeichnungen', 'Recognition'),
  awardsTitle: t('Premi.', 'Preise.', 'Awards.'),
  awardsFeatured: t(
    'Premio Architettura Alto Adige 2019: l’Edificio de Formación y Empleo a Baza riceve il premio Architettura export.',
    'Architekturpreis Südtirol 2019: das Edificio de Formación y Empleo in Baza erhält den Preis Architektur-Export.',
    'South Tyrol Architecture Award 2019: the Edificio de Formación y Empleo in Baza receives the Architecture Export award.',
  ),
  awardsFeaturedAlt: t(
    'Baza, il nuovo edificio bianco sulla piazza in pietra, foto di Fernando Alda',
    'Baza, der neue weiße Baukörper am steinernen Platz, Foto von Fernando Alda',
    'Baza, the new white building on the stone square, photo by Fernando Alda',
  ),

  // concorsi
  compTag: t('Concorsi', 'Wettbewerbe', 'Competitions'),
  compTitle: t('Registro dal 1992.', 'Verzeichnis seit 1992.', 'Register since 1992.'),
  showAll: t('Mostra tutti', 'Alle anzeigen', 'Show all'),

  // citazione
  quote: t('Per una architettura della costruzione.', 'Per una architettura della costruzione.', 'Per una architettura della costruzione.'),
  quoteSource: t(
    'Stanislao Fierro, dal titolo di una sua pubblicazione, Il Poligrafo, 2011',
    'Stanislao Fierro, nach dem Titel einer seiner Publikationen, Il Poligrafo, 2011',
    'Stanislao Fierro, after the title of one of his publications, Il Poligrafo, 2011',
  ),
  quoteCard: t(
    'Architetto a Bolzano. Professore incaricato di progettazione architettonica allo IUAV di Venezia. Redattore di «Turris Babel».',
    'Architekt in Bozen. Lehrbeauftragter für Architekturentwurf an der IUAV Venedig. Redakteur von „Turris Babel“.',
    'Architect in Bolzano. Lecturer in architectural design at IUAV Venice. Editor of “Turris Babel”.',
  ),
  studioLabel: t('Studio', 'Büro', 'Studio'),
  cityLabel: t('Città', 'Stadt', 'City'),

  // chiusura
  ctaTag: t('Contatti', 'Kontakt', 'Contact'),
  ctaTitle: t('Scrivi allo studio.', 'Schreiben Sie dem Büro.', 'Write to the studio.'),
  ctaText: t(
    'Via Montello 3, 39100 Bolzano. Per un incarico, un concorso o una pubblicazione.',
    'Montellostraße 3, 39100 Bozen. Für einen Auftrag, einen Wettbewerb oder eine Publikation.',
    'Via Montello 3, 39100 Bolzano. For a commission, a competition or a publication.',
  ),
  backToTop: t('Torna su', 'Nach oben', 'Back to top'),
  callUs: t('Telefono', 'Telefon', 'Phone'),
};

// divide un titolo su più righe al carattere «|»
export const lines = (s: string) => s.split('|');
