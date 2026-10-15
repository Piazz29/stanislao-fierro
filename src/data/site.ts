import type { Tr } from '../i18n';
import type { ImageMetadata } from 'astro';

import night from '../assets/originali/home/1494000674_immagine.jpg';
import bazaA from '../assets/originali/home/1493912194_immagine.jpg';
import universita from '../assets/originali/home/1493912858_immagine.jpg';
import magnagoSketch from '../assets/originali/pagine/foto/453_immagine.jpg';
import bazaSketch from '../assets/originali/pagine/foto/497_immagine.jpg';
import universitaSketch from '../assets/originali/pagine/foto/527_immagine.jpg';

const t = (it: string, de: string, en: string): Tr => ({ it, de, en });

export const studio = {
  name: 'Stanislao Fierro',
  partner: 'Nadine Saul',
  street: t('Via Montello 3', 'Montellostraße 3', 'Via Montello 3'),
  postal: '39100',
  city: t('Bolzano', 'Bozen', 'Bolzano'),
  region: t('Alto Adige', 'Südtirol', 'South Tyrol'),
  country: t('Italia', 'Italien', 'Italy'),
  phoneDisplay: '0471 973896',
  phoneIntl: '+390471973896',
  email: 'stanislao.fierro@libero.it',
  pec: 'stanislao.fierro@archiworldpec.it',
  vat: '01639010212',
  orderNumber: '599',
  geo: { lat: 46.5041488, lon: 11.3422821 },
};

// Slideshow home: coppie schizzo/foto della stessa opera (attribuzione certa); la foto cresce dai tratti dello schizzo.
export type Slide = { image: ImageMetadata; sketch: ImageMetadata; project: string; kind: 'foto' | 'rendering'; alt: Tr; sketchAlt: Tr; credit?: string };
export const slides: Slide[] = [
  {
    image: night, sketch: magnagoSketch, project: 'piazza-silvius-magnago', kind: 'rendering',
    alt: t('Piazza Silvius Magnago di sera: monoliti e sedute in pietra davanti al Palazzo della Provincia, rendering di concorso',
      'Silvius-Magnago-Platz am Abend: Monolithe und Sitzblöcke aus Stein vor dem Landhaus, Wettbewerbsvisualisierung',
      'Piazza Silvius Magnago at dusk: stone monoliths and seats in front of the provincial government building, competition rendering'),
    sketchAlt: t('Schizzo a mano della piazza con i blocchi di pietra', 'Handskizze des Platzes mit den Steinblöcken', 'Hand sketch of the square with its stone blocks'),
  },
  {
    image: bazaA, sketch: bazaSketch, project: 'centro-formazione-baza', kind: 'foto', credit: 'Fernando Alda',
    alt: t('Baza, l’edificio bianco si appoggia su un basamento in pietra al margine della città, luce radente al tramonto',
      'Baza, der weiße Baukörper ruht auf einem Steinsockel am Stadtrand, Streiflicht bei Sonnenuntergang',
      'Baza, the white volume rests on a stone base at the edge of the town, low evening light'),
    sketchAlt: t('Schizzo di sezione: il nuovo edificio tra la città alta e la città bassa', 'Schnittskizze: der Neubau zwischen Ober- und Unterstadt', 'Section sketch: the new building between the upper and lower town'),
  },
  {
    image: universita, sketch: universitaSketch, project: 'piazza-universita', kind: 'foto',
    alt: t('Piazza Università a Bolzano: alberi da fiore e sedute circolari su pavimentazione in pietra',
      'Universitätsplatz in Bozen: blühende Bäume und runde Sitzbänke auf Steinpflaster',
      'Piazza Università in Bolzano: flowering trees and round benches on stone paving'),
    sketchAlt: t('Schizzo in pianta della piazza: la trama degli alberi e delle sedute', 'Grundrissskizze des Platzes: das Raster aus Bäumen und Sitzbänken', 'Plan sketch of the square: the grid of trees and benches'),
  },
];

// Concorsi dalla biografia del sito attuale che non hanno una scheda progetto.
export type CompetitionExtra = { year: number; title: Tr; place: Tr; result?: Tr; international: boolean; country: string };
const R = {
  primo: t('1° premio', '1. Preis', '1st prize'),
  secondo: t('2° premio', '2. Preis', '2nd prize'),
  terzo: t('3° premio', '3. Preis', '3rd prize'),
  finalista: t('Finalista', 'Finalist', 'Finalist'),
};
export const competitionExtras: CompetitionExtra[] = [
  { year: 2014, title: t('Impianto per gli sport su ghiaccio', 'Eissportanlage', 'Ice sports facility'), place: t('Brunico', 'Bruneck', 'Brunico'), result: R.finalista, international: true, country: 'IT' },
  { year: 2014, title: t('Zona ricreativa', 'Erholungszone', 'Recreation area'), place: t('Selva dei Molini', 'Mühlwald', 'Selva dei Molini'), result: R.finalista, international: false, country: 'IT' },
  { year: 2014, title: t('Ampliamento EURAC', 'Erweiterung EURAC', 'EURAC extension'), place: t('Bolzano', 'Bozen', 'Bolzano'), result: R.secondo, international: true, country: 'IT' },
  { year: 2014, title: t('Nuova sede IPES', 'Neuer Sitz des WOBI', 'New IPES headquarters'), place: t('Bolzano', 'Bozen', 'Bolzano'), result: R.secondo, international: true, country: 'IT' },
  { year: 2014, title: t('Piazza A. Moro e Piazza E. Berlinguer', 'Piazza A. Moro und Piazza E. Berlinguer', 'Piazza A. Moro and Piazza E. Berlinguer'), place: t('Putignano (BA)', 'Putignano (BA)', 'Putignano (BA)'), result: R.finalista, international: true, country: 'IT' },
  { year: 2013, title: t('Aula magna', 'Aula Magna', 'Assembly hall'), place: t('Salorno', 'Salurn', 'Salorno'), result: R.finalista, international: false, country: 'IT' },
  { year: 2006, title: t('Concorso «Meno è più 1»', 'Wettbewerb „Meno è più 1“', '“Meno è più 1” competition'), place: t('Roma', 'Rom', 'Rome'), result: R.terzo, international: true, country: 'IT' },
  { year: 2003, title: t('Abitazioni IPES «Vivere la città», ex centro Maya', 'WOBI-Wohnungen „Vivere la città“, ehemaliges Maya-Zentrum', 'IPES housing “Vivere la città”, former Maya centre'), place: t('Merano', 'Meran', 'Merano'), result: R.terzo, international: false, country: 'IT' },
  { year: 2000, title: t('Nuovo parcheggio interrato', 'Neue Tiefgarage', 'New underground car park'), place: t('Bolzano', 'Bozen', 'Bolzano'), result: R.primo, international: false, country: 'IT' },
  { year: 1994, title: t('Nuovo nucleo centrale', 'Neuer Ortskern', 'New town centre'), place: t('Laives', 'Leifers', 'Laives'), result: R.primo, international: false, country: 'IT' },
  { year: 1992, title: t('Convento della Cartuja, riuso espositivo', 'Kartause La Cartuja, Umnutzung für Ausstellungen', 'La Cartuja monastery, conversion for exhibitions'), place: t('Siviglia, Spagna', 'Sevilla, Spanien', 'Seville, Spain'), result: R.primo, international: true, country: 'ES' },
];

// Paese per ogni progetto (per il conteggio dei paesi nel registro).
export const projectCountry: Record<string, string> = {
  'centro-formazione-baza': 'ES', 'alcazaba-baza': 'ES', 'molo-levante-huelva': 'ES', 'parcheggio-piazza-arnedo': 'ES', 'ferrocarril-puerto-real': 'ES', 'ronda-marrubial-cordoba': 'ES', 'fuencarral-madrid': 'ES', 'plaza-el-salon-ecija': 'ES',
  'kulturplatz-san-gallo': 'CH', 'wintergartenstrasse-lipsia': 'DE', 'hindenburgplatz-hildesheim': 'DE', 'kirchplatz-starnberg': 'DE', 'ponte-erfurt': 'DE', 'lungolago-starnberg': 'DE', 'marienhof-monaco': 'DE',
  'bicentenario-citta-del-messico': 'MX', 'piazza-skanderbeg-tirana': 'AL',
};

export const bio = {
  born: t('Nato a Taurasi (Avellino) nel 1961.', 'Geboren 1961 in Taurasi (Avellino).', 'Born in Taurasi (Avellino) in 1961.'),
  lines: [
    { year: '1988', text: t('Laurea in architettura allo IUAV di Venezia.', 'Abschluss in Architektur an der IUAV Venedig.', 'Degree in architecture, IUAV Venice.') },
    { year: '1989', text: t('Abilitazione alla professione. Iscritto all’Ordine degli Architetti, n. 599.', 'Berufszulassung. Eingetragen in die Architektenkammer, Nr. 599.', 'Licensed to practise. Member of the Order of Architects, no. 599.') },
    { year: '1989–2005', text: t('Collabora ai corsi di progettazione di Arrigo Rudi e Francesco Venezia allo IUAV.', 'Mitarbeit in den Entwurfskursen von Arrigo Rudi und Francesco Venezia an der IUAV.', 'Teaching assistant in the design studios of Arrigo Rudi and Francesco Venezia at IUAV.') },
    { year: t('dal 2005', 'seit 2005', 'since 2005'), text: t('Professore incaricato di progettazione architettonica allo IUAV di Venezia. Relatore di tesi di laurea, seminari e mostre didattiche.', 'Lehrbeauftragter für Architekturentwurf an der IUAV Venedig. Betreuer von Diplomarbeiten, Seminaren und Lehrausstellungen.', 'Lecturer in architectural design at IUAV Venice. Supervisor of degree theses, seminars and teaching exhibitions.') },
  ],
  roles: [
    { year: '1998–2004', text: t('Consigliere dell’Ordine degli Architetti di Bolzano, responsabile Cultura.', 'Vorstandsmitglied der Architektenkammer Bozen, zuständig für Kultur.', 'Board member of the Bolzano Order of Architects, responsible for culture.') },
    { year: '', text: t('Redattore della rivista di architettura «Turris Babel».', 'Redakteur der Architekturzeitschrift „Turris Babel“.', 'Editor of the architecture journal “Turris Babel”.') },
    { year: '2016–2017', text: t('Esperto nella commissione edilizia e per il paesaggio del Comune di Trento.', 'Sachverständiger in der Bau- und Landschaftskommission der Stadt Trient.', 'Expert member of the building and landscape commission of the City of Trento.') },
  ],
};

export const books = [
  { year: 2011, title: 'Il Basamento', publisher: 'Giavedoni' },
  { year: 2011, title: 'Per una Architettura della Costruzione', publisher: 'Il Poligrafo' },
  { year: 2011, title: 'Arrigo Rudi. Architetture, restauro e allestimento', publisher: 'Marsilio' },
  { year: 2012, title: 'Un Museo per la Collezione Cleto Munari. Addizioni', publisher: t('Elaborati del Laboratorio 3, IUAV', 'Arbeiten aus dem Laboratorio 3, IUAV', 'Studio work, Laboratorio 3, IUAV') },
];

export const publishedIn = [
  { year: '2017', title: 'Casabella n. 873' },
  { year: '2006', title: 'Nuove Architetture in Alto Adige, Springer' },
  { year: '2006', title: 'The significant space, Arredo&Città' },
  { year: '2005', title: 'Piazze e spazi pubblici 1990–2005, F. Motta' },
  { year: '2004', title: 'Almanacco di Casabella' },
  { year: '2000', title: 'Almanacco di Casabella' },
  { year: '2007', title: 'Turris Babel 72' },
  { year: '2008', title: '«Dallo schizzo alla costruzione», Galileo n. 183' },
  { year: '2001', title: 'Lo spazio pubblico in Italia 1998–2000, Alinea' },
  { year: '', title: 'ArchDaily, Dezeen' },
].sort((a, b) => (b.year || '0').localeCompare(a.year || '0'));

export const lectures = [
  { year: '2017', text: t('Università di Catania, «Invarianti», SOS Architettura, Siracusa', 'Universität Catania, „Invarianti“, SOS Architettura, Syrakus', 'University of Catania, “Invarianti”, SOS Architettura, Syracuse') },
  { year: '2011', text: t('«Come si interviene negli spazi pubblici», EURAC, Bolzano', '„Wie man in öffentliche Räume eingreift“, EURAC, Bozen', '“How to intervene in public spaces”, EURAC, Bolzano') },
  { year: '2010', text: t('Facoltà di Architettura di Siviglia', 'Architekturfakultät Sevilla', 'School of Architecture, Seville') },
  { year: '2007', text: t('«Nuova Piazza Tribunale a Bolzano», IV Premio Architettura Alto Adige', '„Neuer Gerichtsplatz in Bozen“, IV. Architekturpreis Südtirol', '“New Piazza Tribunale in Bolzano”, 4th South Tyrol Architecture Award') },
  { year: '2005', text: t('«Metamorfosi e persistenze», Ordine degli Architetti di Cadice', '„Metamorphosen und Beständigkeit“, Architektenkammer Cádiz', '“Metamorphoses and persistence”, Cádiz Order of Architects') },
  { year: '2005', text: t('Invitato al Festival dell’Architettura di Parma', 'Eingeladen zum Festival dell’Architettura, Parma', 'Invited to the Festival dell’Architettura, Parma') },
  { year: '2004', text: t('Invitato alla Triennale di Milano, «Laboratorio Italia»', 'Eingeladen zur Triennale di Milano, „Laboratorio Italia“', 'Invited to the Milan Triennale, “Laboratorio Italia”') },
  { year: '2002–2003', text: t('III e IV Settimana Internazionale di Architettura di Ávila', 'III. und IV. Internationale Architekturwoche Ávila', '3rd and 4th International Architecture Week, Ávila') },
  { year: '2000', text: t('«Bolzano: città in concorso», ideatore e coordinatore', '„Bozen: Stadt im Wettbewerb“, Initiator und Koordinator', '“Bolzano: a city in competition”, initiator and coordinator') },
  { year: '1998', text: t('Curatore del laboratorio «Museion, il nuovo Museo d’Arte Moderna di Bolzano: dove? come?»', 'Kurator des Labors „Museion, das neue Museum für moderne Kunst in Bozen: wo? wie?“', 'Curator of the workshop “Museion, the new Museum of Modern Art in Bolzano: where? how?”') },
];

export const honours = [
  { year: '2019', text: t('Premio Architettura Alto Adige: Piazza Silvius Magnago (Spazi aperti e infrastrutture; premio del pubblico) e Baza (Architettura export)', 'Architekturpreis Südtirol: Silvius-Magnago-Platz (Freiräume und Infrastrukturen; Publikumspreis) und Baza (Architektur-Export)', 'South Tyrol Architecture Award: Piazza Silvius Magnago (Open Spaces and Infrastructure; Public Choice) and Baza (Architecture Export)') },
  { year: '2009', text: t('Premio Gubbio, segnalazione per Piazza Tribunale', 'Premio Gubbio, Auszeichnung für den Gerichtsplatz', 'Gubbio Prize, commendation for Piazza Tribunale') },
  { year: '2007', text: t('IV Premio Architettura Alto Adige, vincitore con Piazza Tribunale', 'IV. Architekturpreis Südtirol, Preisträger mit dem Gerichtsplatz', '4th South Tyrol Architecture Award, winner with Piazza Tribunale') },
  { year: '2004', text: t('Premio Architettura Città di Oderzo, VIII edizione', 'Architekturpreis Città di Oderzo, 8. Ausgabe', 'Città di Oderzo Architecture Prize, 8th edition') },
  { year: '2000', text: t('Premio Architettura Città di Oderzo, IV edizione, per Piazza Mazzini', 'Architekturpreis Città di Oderzo, 4. Ausgabe, für den Mazziniplatz', 'Città di Oderzo Architecture Prize, 4th edition, for Piazza Mazzini') },
  { year: '2000', text: t('Premio Europeo «Luigi Cosenza», menzione speciale per Piazza Mazzini', 'Europäischer Preis „Luigi Cosenza“, besondere Erwähnung für den Mazziniplatz', 'European “Luigi Cosenza” Prize, special mention for Piazza Mazzini') },
  { year: '1996', text: t('Premio Nazionale «Luigi Cosenza», menzione speciale per il centro di Laives', 'Nationaler Preis „Luigi Cosenza“, besondere Erwähnung für den Ortskern von Leifers', 'National “Luigi Cosenza” Prize, special mention for the centre of Laives') },
  { year: '1994', text: t('Premio Nazionale «Luigi Cosenza», menzione speciale per il centro scolastico di Piedicastello, Trento', 'Nationaler Preis „Luigi Cosenza“, besondere Erwähnung für das Schulzentrum Piedicastello, Trient', 'National “Luigi Cosenza” Prize, special mention for the Piedicastello school centre, Trento') },
  { year: '', text: t('Premio Internazionale Barbara Cappochin, menzione d’onore', 'Internationaler Preis Barbara Cappochin, lobende Erwähnung', 'Barbara Cappochin International Prize, honourable mention') },
];
