// Registro dei progetti: unica fonte per generare src/content/projects/*.yaml e images-map.json.
// pages = schede del sito attuale (index.php?p=N) da cui provengono le immagini (attribuzione certa).
// typology: spazi-pubblici | edifici-pubblici | residenziale | scuole | allestimenti
// status:   realizzato | concorso | progetto

const P = (it, de, en) => ({ it, de, en });

// Luoghi ricorrenti, con i nomi ufficiali tedeschi dell'Alto Adige.
export const L = {
  bolzano: P('Bolzano', 'Bozen', 'Bolzano'),
  soprabolzano: P('Soprabolzano', 'Oberbozen', 'Soprabolzano'),
  luson: P('Luson', 'Lüsen', 'Luson'),
  nalles: P('Nalles', 'Nals', 'Nalles'),
  sluderno: P('Sluderno', 'Schluderns', 'Sluderno'),
  lagundo: P('Lagundo', 'Algund', 'Lagundo'),
  sanCandido: P('San Candido', 'Innichen', 'San Candido'),
  cornedo: P('San Valentino, Cornedo', 'St. Valentin, Karneid', 'San Valentino, Cornedo'),
  bressanone: P('Bressanone', 'Brixen', 'Bressanone'),
  merano: P('Merano', 'Meran', 'Merano'),
  tires: P('Tires', 'Tiers', 'Tires'),
  novaLevante: P('Nova Levante', 'Welschnofen', 'Nova Levante'),
  funes: P('Funes', 'Villnöß', 'Funes'),
  laimburg: P('Laimburg, Vadena', 'Laimburg, Pfatten', 'Laimburg, Vadena'),
  roma: P('Roma', 'Rom', 'Rome'),
  trieste: P('Trieste', 'Triest', 'Trieste'),
  torreDiMosto: P('Torre di Mosto (VE)', 'Torre di Mosto (VE)', 'Torre di Mosto (VE)'),
  baza: P('Baza, Spagna', 'Baza, Spanien', 'Baza, Spain'),
  sanGallo: P('San Gallo, Svizzera', 'St. Gallen, Schweiz', 'St. Gallen, Switzerland'),
  chiari: P('Chiari (BS)', 'Chiari (BS)', 'Chiari (BS)'),
  huelva: P('Huelva, Spagna', 'Huelva, Spanien', 'Huelva, Spain'),
  riccione: P('Riccione (RN)', 'Riccione (RN)', 'Riccione (RN)'),
  lipsia: P('Lipsia, Germania', 'Leipzig, Deutschland', 'Leipzig, Germany'),
  sanGimignano: P('San Gimignano (SI)', 'San Gimignano (SI)', 'San Gimignano (SI)'),
  guastalla: P('Guastalla (RE)', 'Guastalla (RE)', 'Guastalla (RE)'),
  noventa: P('Noventa di Piave (VE)', 'Noventa di Piave (VE)', 'Noventa di Piave (VE)'),
  arnedo: P('Arnedo, Spagna', 'Arnedo, Spanien', 'Arnedo, Spain'),
  hildesheim: P('Hildesheim, Germania', 'Hildesheim, Deutschland', 'Hildesheim, Germany'),
  messico: P('Città del Messico', 'Mexiko-Stadt', 'Mexico City'),
  prato: P('Gancetello, Prato', 'Gancetello, Prato', 'Gancetello, Prato'),
  tirana: P('Tirana, Albania', 'Tirana, Albanien', 'Tirana, Albania'),
  puertoReal: P('Puerto Real (Cadice), Spagna', 'Puerto Real (Cádiz), Spanien', 'Puerto Real (Cádiz), Spain'),
  starnberg: P('Starnberg, Germania', 'Starnberg, Deutschland', 'Starnberg, Germany'),
  erfurt: P('Erfurt, Germania', 'Erfurt, Deutschland', 'Erfurt, Germany'),
  castelfranco: P('Castelfranco Emilia (MO)', 'Castelfranco Emilia (MO)', 'Castelfranco Emilia (MO)'),
  cordoba: P('Cordova, Spagna', 'Córdoba, Spanien', 'Córdoba, Spain'),
  madrid: P('Madrid, Spagna', 'Madrid, Spanien', 'Madrid, Spain'),
  monaco: P('Monaco di Baviera, Germania', 'München, Deutschland', 'Munich, Germany'),
  ecija: P('Écija, Spagna', 'Écija, Spanien', 'Écija, Spain'),
};

const T = (it, de, en) => ({ it, de, en });
const R = {
  primo: T('1° premio', '1. Preis', '1st prize'),
  primoExAequo: T('1° premio ex aequo', '1. Preis ex aequo', '1st prize (joint)'),
  secondo: T('2° premio', '2. Preis', '2nd prize'),
  terzo: T('3° premio', '3. Preis', '3rd prize'),
  quarto: T('4° classificato', '4. Rang', '4th place'),
  finalista: T('Finalista', 'Finalist', 'Finalist'),
};
export const RESULTS = R;

// Coppie «dallo schizzo alla costruzione»: schizzo e foto della stessa opera, scelti per soggetto e taglio.
export const reveals = {
  'centro-formazione-baza': { sketch: 'pagine/foto/497_immagine.jpg', photo: 'pagine/foto/509_immagine.jpg' },
  'piazza-tribunale': { sketch: 'pagine/foto/440_immagine.jpg', photo: 'pagine/foto/449_immagine.jpg' },
  'piazza-universita': { sketch: 'pagine/foto/527_immagine.jpg', photo: 'pagine/foto/489_immagine.jpg' },
  'centro-luson': { sketch: 'pagine/foto/89_immagine.jpg', photo: 'pagine/foto/102_immagine.jpg' },
};

export const projects = [
  {
    slug: 'piazza-silvius-magnago', pages: [76, 78], year: 2017, order: 1, featured: true,
    title: T('Piazza Silvius Magnago', 'Silvius-Magnago-Platz', 'Piazza Silvius Magnago'),
    place: L.bolzano, typology: 'spazi-pubblici', status: 'realizzato', international: false,
    competition: { year: 2012, result: R.primo },
    built: '2017', client: T('Comune di Bolzano', 'Gemeinde Bozen', 'Municipality of Bolzano'),
    partners: ['Nadine Saul'],
    awards: [
      T('Premio Architettura Alto Adige 2019, categoria Spazi aperti e infrastrutture', 'Architekturpreis Südtirol 2019, Kategorie Freiräume und Infrastrukturen', 'South Tyrol Architecture Award 2019, Open Spaces and Infrastructure category'),
      T('Premio Architettura Alto Adige 2019, premio del pubblico', 'Architekturpreis Südtirol 2019, Publikumspreis', 'South Tyrol Architecture Award 2019, Public Choice award'),
    ],
  },
  {
    slug: 'centro-formazione-baza', pages: [85], year: 2015, order: 2, featured: true,
    title: T('Edificio de Formación y Empleo', 'Edificio de Formación y Empleo', 'Edificio de Formación y Empleo'),
    subtitle: T('Centro di formazione e lavoro', 'Ausbildungs- und Arbeitszentrum', 'Training and employment centre'),
    place: L.baza, typology: 'edifici-pubblici', status: 'realizzato', international: true,
    competition: { year: 2007, result: R.primo, name: T('Concorso Alcazaba de Baza', 'Wettbewerb Alcazaba de Baza', 'Alcazaba de Baza competition') },
    built: '2015', area: '1.564 m²', client: T('Ayuntamiento de Baza', 'Ayuntamiento de Baza', 'Ayuntamiento de Baza'),
    partners: ['Daroca Arquitectos (José Luís Daroca Bruño)'],
    photographer: 'Fernando Alda',
    awards: [T('Premio Architettura Alto Adige 2019, premio Architettura export', 'Architekturpreis Südtirol 2019, Preis Architektur-Export', 'South Tyrol Architecture Award 2019, Architecture Export award')],
    press: ['Casabella n. 873, 2017', 'ArchDaily', 'Dezeen'],
  },
  {
    slug: 'piazza-tribunale', pages: [75], year: 2004, order: 3, featured: true,
    title: T('Piazza Tribunale e parcheggio interrato', 'Gerichtsplatz und Tiefgarage', 'Piazza Tribunale and underground car park'),
    place: L.bolzano, typology: 'spazi-pubblici', status: 'realizzato', international: false,
    competition: { year: 2001, result: R.primo }, built: '2000–2004', area: '30.000 m²',
    client: T('Comune di Bolzano', 'Gemeinde Bozen', 'Municipality of Bolzano'), collaborators: ['Orazio Basso'],
    awards: [
      T('IV Premio Architettura Alto Adige 2007, vincitore', 'IV. Architekturpreis Südtirol 2007, Preisträger', '4th South Tyrol Architecture Award 2007, winner'),
      T('Premio Gubbio 2009, segnalazione', 'Premio Gubbio 2009, Auszeichnung', 'Gubbio Prize 2009, commendation'),
    ],
  },
  {
    slug: 'piazza-mazzini', pages: [], year: 2000, order: 4,
    title: T('Piazza Mazzini', 'Mazziniplatz', 'Piazza Mazzini'),
    place: L.bolzano, typology: 'spazi-pubblici', status: 'realizzato', international: false,
    awards: [
      T('Premio Architettura Città di Oderzo 2000', 'Architekturpreis Città di Oderzo 2000', 'Città di Oderzo Architecture Prize 2000'),
      T('Premio Europeo di Architettura «Luigi Cosenza» 2000, menzione speciale', 'Europäischer Architekturpreis „Luigi Cosenza“ 2000, besondere Erwähnung', 'European Architecture Prize “Luigi Cosenza” 2000, special mention'),
    ],
  },
  {
    slug: 'piazza-universita', pages: [83], year: 2014, order: 5,
    title: T('Piazza Università', 'Universitätsplatz', 'Piazza Università'),
    place: L.bolzano, typology: 'spazi-pubblici', status: 'realizzato', international: false,
    competition: { year: 2013, result: R.primo }, built: '2014', partners: ['Nadine Saul'],
    client: T('Provincia autonoma di Bolzano', 'Autonome Provinz Bozen', 'Autonomous Province of Bolzano'),
  },
  {
    slug: 'ipes-soprabolzano', pages: [73], year: 2012, order: 6,
    title: T('9 alloggi IPES', '9 WOBI-Wohnungen', '9 IPES housing units'),
    place: L.soprabolzano, typology: 'residenziale', status: 'progetto', international: false,
    competition: { year: 2012, result: R.primo }, client: T('IPES Bolzano', 'WOBI Bozen', 'IPES Bolzano'),
  },
  {
    slug: 'casanova-ea2', pages: [66], year: 2005, order: 7,
    title: T('Edifici residenziali CasaNova, isolato EA2', 'Wohnbau CasaNova, Baulos EA2', 'CasaNova housing, block EA2'),
    place: L.bolzano, typology: 'residenziale', status: 'progetto', international: false,
    competition: { year: 2005 }, partners: ['Nadine Saul'], client: T('IPES Bolzano', 'WOBI Bozen', 'IPES Bolzano'),
  },
  {
    slug: 'mausoleo-augusto', pages: [64], year: 2006, order: 8,
    title: T('Mausoleo di Augusto e Piazza Augusto Imperatore', 'Augustusmausoleum und Piazza Augusto Imperatore', 'Mausoleum of Augustus and Piazza Augusto Imperatore'),
    place: L.roma, typology: 'spazi-pubblici', status: 'concorso', international: true,
    competition: { year: 2006, result: R.finalista, name: T('Concorso internazionale', 'Internationaler Wettbewerb', 'International competition') },
    partners: ['José Ignacio Linazasoro'], collaborators: ['Nadine Saul', 'Ricardo Sánchez González'],
    client: T('Comune di Roma', 'Stadt Rom', 'City of Rome'),
  },
  {
    slug: 'centro-luson', pages: [42, 20, 32], year: 2010, order: 9,
    title: T('Riqualificazione del centro storico', 'Neugestaltung des Ortskerns', 'Redesign of the historic centre'),
    place: L.luson, typology: 'spazi-pubblici', status: 'realizzato', international: false,
    competition: { year: 2008, result: R.primo }, built: '2009–2010',
    partners: ['Wolfgang Simmerle'], collaborators: ['Nadine Saul', 'Irmgard Brunner'],
    client: T('Comune di Luson', 'Gemeinde Lüsen', 'Municipality of Luson'),
  },
  {
    slug: 'piazza-liberta-trieste', pages: [], year: 2007, order: 10,
    title: T('Piazza Libertà', 'Piazza Libertà', 'Piazza Libertà'),
    place: L.trieste, typology: 'spazi-pubblici', status: 'concorso', international: true,
    competition: { year: 2007, result: R.primo, name: T('Concorso europeo', 'Europäischer Wettbewerb', 'European competition') },
    client: T('Comune di Trieste', 'Gemeinde Triest', 'Municipality of Trieste'),
  },
  {
    slug: 'piazza-indipendenza-torre-di-mosto', pages: [59, 54], year: 2009, order: 11,
    title: T('Piazza Indipendenza', 'Piazza Indipendenza', 'Piazza Indipendenza'),
    place: L.torreDiMosto, typology: 'spazi-pubblici', status: 'realizzato', international: false,
    competition: { year: 2007, result: R.primo }, built: '2009',
    partners: ['Nadine Saul', 'C&P Architetti'], client: T('Comune di Torre di Mosto', 'Gemeinde Torre di Mosto', 'Municipality of Torre di Mosto'),
  },
  {
    slug: 'alcazaba-baza', pages: [55], year: 2007, order: 12,
    title: T('Riqualificazione dell’Alcazaba', 'Neugestaltung der Alcazaba', 'Redevelopment of the Alcazaba'),
    place: L.baza, typology: 'spazi-pubblici', status: 'concorso', international: true,
    competition: { year: 2007, result: R.primo, name: T('Concorso internazionale', 'Internationaler Wettbewerb', 'International competition') },
    partners: ['José Luís Daroca Bruño'], collaborators: ['Nadine Saul', 'Adrián López Fernández'], client: T('EPSA, Siviglia', 'EPSA, Sevilla', 'EPSA, Seville'),
  },
  { slug: 'kulturplatz-san-gallo', pages: [8, 12], year: 2011, title: T('Nuova Kulturplatz', 'Neuer Kulturplatz', 'New Kulturplatz'), place: L.sanGallo, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2011, result: R.quarto }, area: '11.000 m²', partners: ['Nadine Saul'], client: T('Città di San Gallo', 'Stadt St. Gallen', 'City of St. Gallen') },
  { slug: 'palestra-nalles', pages: [9, 10], year: 2011, title: T('Palestra della scuola elementare', 'Turnhalle der Grundschule', 'Primary school gymnasium'), place: L.nalles, typology: 'scuole', status: 'concorso', international: false, competition: { year: 2011, result: R.finalista }, area: '4.000 m²', partners: ['Nadine Saul'], client: T('Comune di Nalles', 'Gemeinde Nals', 'Municipality of Nalles') },
  { slug: 'scuola-materna-sluderno', pages: [13], year: 2012, title: T('Scuola materna', 'Kindergarten', 'Nursery school'), place: L.sluderno, typology: 'scuole', status: 'concorso', international: false, competition: { year: 2012 }, area: '5.500 m²', partners: ['Nadine Saul'], client: T('Comune di Sluderno', 'Gemeinde Schluderns', 'Municipality of Sluderno') },
  { slug: 'palazzo-provinciale-bolzano', pages: [15, 28], year: 2011, title: T('Palazzo Provinciale', 'Landhaus', 'Provincial government building'), place: L.bolzano, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2011 }, area: '4.100 m²', partners: ['Nadine Saul'], client: T('Provincia autonoma di Bolzano', 'Autonome Provinz Bozen', 'Autonomous Province of Bolzano') },
  { slug: 'viale-mazzini-chiari', pages: [16, 29], year: 2011, title: T('Riqualificazione di Viale Mazzini', 'Neugestaltung des Viale Mazzini', 'Redesign of Viale Mazzini'), place: L.chiari, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2011 }, area: '19.000 m²', partners: ['Nadine Saul'], client: T('Comune di Chiari', 'Gemeinde Chiari', 'Municipality of Chiari') },
  { slug: 'scuola-planetario-cornedo', pages: [17, 30], year: 2010, title: T('Scuola elementare e planetario', 'Grundschule und Planetarium', 'Primary school and planetarium'), place: L.cornedo, typology: 'scuole', status: 'concorso', international: false, competition: { year: 2010, result: R.terzo }, area: '1.500 m²', partners: ['Wolfgang Simmerle'], client: T('Provincia autonoma di Bolzano', 'Autonome Provinz Bozen', 'Autonomous Province of Bolzano') },
  { slug: 'casa-kock-san-candido', pages: [18, 25], year: 2010, title: T('Casa Köck, biblioteca comunale', 'Haus Köck, Gemeindebibliothek', 'Casa Köck, public library'), place: L.sanCandido, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2010, result: R.terzo }, area: '1.500 m²', partners: ['Roberto Rosset'], client: T('Provincia autonoma di Bolzano', 'Autonome Provinz Bozen', 'Autonomous Province of Bolzano') },
  { slug: 'area-sportiva-lagundo', pages: [19, 31], year: 2010, title: T('Area sportiva e ricreativa', 'Sport- und Freizeitzone', 'Sports and recreation area'), place: L.lagundo, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2010, result: R.secondo }, area: '39.000 m²', partners: ['Wolfgang Simmerle'], client: T('Comune di Lagundo', 'Gemeinde Algund', 'Municipality of Lagundo') },
  { slug: 'molo-levante-huelva', pages: [21, 33], year: 2010, title: T('Area nord del Molo di Levante', 'Nordbereich der Mole Levante', 'North area of the Levante pier'), place: L.huelva, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2010 }, area: '55.000 m²', partners: ['José Luís Daroca Bruño'], client: T('Ayuntamiento de Huelva', 'Ayuntamiento de Huelva', 'Ayuntamiento de Huelva') },
  { slug: 'ex-fornace-riccione', pages: [22, 34], year: 2010, title: T('Ex fornace: scuola, uffici, teatro', 'Ehemalige Ziegelei: Schule, Büros, Theater', 'Former brickworks: school, offices, theatre'), place: L.riccione, typology: 'edifici-pubblici', status: 'progetto', international: false, client: T('Carpentedil S.r.l.', 'Carpentedil S.r.l.', 'Carpentedil S.r.l.') },
  { slug: 'wintergartenstrasse-lipsia', pages: [23, 35], year: 2010, title: T('Wintergartenstraße / Querstraße', 'Wintergartenstraße / Querstraße', 'Wintergartenstraße / Querstraße'), place: L.lipsia, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2010, result: R.finalista } },
  { slug: 'biblioteca-bressanone', pages: [24, 36], year: 2010, title: T('Nuova biblioteca civica', 'Neue Stadtbibliothek', 'New public library'), place: L.bressanone, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2010 }, partners: ['José Luís Daroca Bruño'] },
  { slug: 'casa-anziani-san-gimignano', pages: [37], year: 2010, title: T('Casa per anziani', 'Seniorenheim', 'Care home for the elderly'), place: L.sanGimignano, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2010 } },
  { slug: 'centro-tires', pages: [38], year: 2010, title: T('Sistemazione del centro', 'Gestaltung des Ortszentrums', 'Village centre'), place: L.tires, typology: 'spazi-pubblici', status: 'progetto', international: false, partners: ['Wolfgang Simmerle'], client: T('Comune di Tires', 'Gemeinde Tiers', 'Municipality of Tires') },
  { slug: 'centro-nova-levante', pages: [39], year: 2009, title: T('Riqualificazione del centro', 'Neugestaltung des Ortskerns', 'Village centre redesign'), place: L.novaLevante, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2009, result: R.secondo }, partners: ['Wolfgang Simmerle'], client: T('Comune di Nova Levante', 'Gemeinde Welschnofen', 'Municipality of Nova Levante') },
  { slug: 'piazza-guastalla', pages: [40], year: 2009, title: T('Piazza della Repubblica', 'Piazza della Repubblica', 'Piazza della Repubblica'), place: L.guastalla, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2009, result: R.terzo }, partners: ['Nadine Saul'], client: T('Comune di Guastalla', 'Gemeinde Guastalla', 'Municipality of Guastalla') },
  { slug: 'pronto-soccorso-merano', pages: [41], year: 2009, title: T('Pronto soccorso', 'Notaufnahme', 'Emergency department'), place: L.merano, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2009, result: R.terzo }, partners: ['Wolfgang Simmerle'], client: T('Provincia autonoma di Bolzano', 'Autonome Provinz Bozen', 'Autonomous Province of Bolzano') },
  { slug: 'centro-noventa-di-piave', pages: [43], year: 2009, title: T('Riqualificazione del centro', 'Neugestaltung des Zentrums', 'Town centre redesign'), place: L.noventa, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2009, result: R.terzo }, partners: ['Nadine Saul', 'Stefania Maggio'] },
  { slug: 'parcheggio-piazza-arnedo', pages: [44], year: 2008, title: T('Parcheggio interrato e piazza', 'Tiefgarage und Platz', 'Underground car park and square'), place: L.arnedo, typology: 'edifici-pubblici', status: 'concorso', international: true, competition: { year: 2008 }, partners: ['Nadine Saul'] },
  { slug: 'hindenburgplatz-hildesheim', pages: [45], year: 2008, title: T('Hindenburgplatz', 'Hindenburgplatz', 'Hindenburgplatz'), place: L.hildesheim, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2008, result: R.finalista }, partners: ['Wolfgang Simmerle'] },
  { slug: 'bicentenario-citta-del-messico', pages: [46], year: 2008, title: T('Piazza e simbolo del Bicentenario', 'Platz und Symbol der Zweihundertjahrfeier', 'Bicentennial square and monument'), place: L.messico, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2008 }, partners: ['Nadine Saul'] },
  { slug: 'scuola-materna-prato', pages: [47], year: 2008, title: T('Nuova scuola materna', 'Neuer Kindergarten', 'New nursery school'), place: L.prato, typology: 'scuole', status: 'concorso', international: false, competition: { year: 2008 }, partners: ['Nadine Saul'] },
  { slug: 'piazza-skanderbeg-tirana', pages: [48], year: 2008, title: T('Piazza Scanderbeg', 'Skanderbeg-Platz', 'Skanderbeg Square'), place: L.tirana, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2008 }, partners: ['Nadine Saul'] },
  { slug: 'ferrocarril-puerto-real', pages: [49], year: 2008, title: T('Intorno del Ferrocarril', 'Umfeld der Bahntrasse', 'Railway corridor'), place: L.puertoReal, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2008, result: R.secondo }, partners: ['José Luís Daroca Bruño'] },
  { slug: 'kirchplatz-starnberg', pages: [50], year: 2008, title: T('Kirchplatz', 'Kirchplatz', 'Kirchplatz'), place: L.starnberg, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2008, result: R.finalista }, partners: ['Nadine Saul'] },
  { slug: 'centro-multiservizi-merano', pages: [51], year: 2008, title: T('Centro multiservizi', 'Dienstleistungszentrum', 'Multi-service centre'), place: L.merano, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2008, result: R.finalista }, partners: ['Nadine Saul'] },
  { slug: 'ponte-erfurt', pages: [52], year: 2008, title: T('Riqualificazione urbana e nuovo ponte', 'Stadtraum und neue Brücke', 'Urban redesign and new bridge'), place: L.erfurt, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2008, result: R.finalista }, partners: ['Nadine Saul'] },
  { slug: 'centro-castelfranco-emilia', pages: [56], year: 2007, title: T('Riqualificazione del centro', 'Neugestaltung des Zentrums', 'Town centre redesign'), place: L.castelfranco, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2007, result: R.finalista }, partners: ['Nadine Saul'] },
  { slug: 'ronda-marrubial-cordoba', pages: [57], year: 2007, title: T('Ronda del Marrubial', 'Ronda del Marrubial', 'Ronda del Marrubial'), place: L.cordoba, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2007, result: R.finalista }, partners: ['Nadine Saul'], client: T('EPSA, Siviglia', 'EPSA, Sevilla', 'EPSA, Seville') },
  { slug: 'fuencarral-madrid', pages: [58], year: 2007, title: T('Edificio sportivo nel parco di Fuencarral', 'Sportgebäude im Park von Fuencarral', 'Sports building in Fuencarral park'), place: L.madrid, typology: 'edifici-pubblici', status: 'concorso', international: true, competition: { year: 2007 }, partners: ['Nadine Saul'], client: T('Comune di Madrid', 'Stadt Madrid', 'City of Madrid') },
  { slug: 'lungolago-starnberg', pages: [60], year: 2006, title: T('Lungolago', 'Seeufer', 'Lakefront'), place: L.starnberg, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2006, result: R.finalista }, partners: ['José Ignacio Linazasoro'] },
  { slug: 'banca-popolare-bressanone', pages: [61], year: 2006, title: T('Nuova sede Banca Popolare', 'Neuer Sitz der Volksbank', 'New Banca Popolare headquarters'), place: L.bressanone, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2006 }, partners: ['Nadine Saul'] },
  { slug: 'divino-amore-roma', pages: [62], year: 2006, title: T('Piazza e parcheggi al Divino Amore', 'Platz und Parkplätze am Divino Amore', 'Square and parking at Divino Amore'), place: L.roma, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2006, result: R.terzo }, partners: ['Nadine Saul'], client: T('Comune di Roma', 'Stadt Rom', 'City of Rome') },
  { slug: 'marienhof-monaco', pages: [63], year: 2006, title: T('Piazza Marienhof', 'Marienhof', 'Marienhof square'), place: L.monaco, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2006, result: R.finalista }, partners: ['Nadine Saul'], client: T('Città di Monaco di Baviera', 'Landeshauptstadt München', 'City of Munich') },
  { slug: 'abitazioni-funes', pages: [65], year: 2005, title: T('Abitazioni', 'Wohnhäuser', 'Housing'), place: L.funes, typology: 'residenziale', status: 'progetto', international: false },
  { slug: 'centro-storico-chiari', pages: [67], year: 2005, title: T('Riqualificazione del centro storico', 'Neugestaltung der Altstadt', 'Historic centre redesign'), place: L.chiari, typology: 'spazi-pubblici', status: 'concorso', international: false, competition: { year: 2005, result: R.terzo }, partners: ['Nadine Saul'], client: T('Comune di Chiari', 'Gemeinde Chiari', 'Municipality of Chiari') },
  { slug: 'plaza-el-salon-ecija', pages: [68], year: 2005, title: T('Plaza del Salón', 'Plaza del Salón', 'Plaza del Salón'), place: L.ecija, typology: 'spazi-pubblici', status: 'concorso', international: true, competition: { year: 2005, result: R.secondo }, partners: ['Nadine Saul'], client: T('EPSA, Siviglia', 'EPSA, Sevilla', 'EPSA, Seville') },
  { slug: 'museo-civico-bolzano', pages: [69], year: 2005, title: T('Ampliamento del Museo Civico', 'Erweiterung des Stadtmuseums', 'Extension of the City Museum'), place: L.bolzano, typology: 'edifici-pubblici', status: 'concorso', international: false, competition: { year: 2005, result: R.terzo }, partners: ['Ulrich Weger'], client: T('Comune di Bolzano', 'Gemeinde Bozen', 'Municipality of Bolzano') },
  { slug: 'mostra-danza-architettura', pages: [70], year: 2005, title: T('Mostra «Danza Architettura»', 'Ausstellung „Tanz Architektur“', '“Dance Architecture” exhibition'), place: L.bolzano, typology: 'allestimenti', status: 'realizzato', international: false, client: T('Ordine degli Architetti di Bolzano', 'Architektenkammer Bozen', 'Bolzano Order of Architects') },
  { slug: 'centro-culturale-funes', pages: [71], year: 2005, title: T('Centro culturale e scuola materna', 'Kulturzentrum und Kindergarten', 'Cultural centre and nursery school'), place: L.funes, typology: 'scuole', status: 'concorso', international: false, competition: { year: 2005 }, client: T('Provincia autonoma di Bolzano', 'Autonome Provinz Bozen', 'Autonomous Province of Bolzano') },
  { slug: 'centro-agrario-laimburg', pages: [72], year: 2004, title: T('Nuovo centro agrario', 'Neues Landwirtschaftszentrum', 'New agricultural centre'), place: L.laimburg, typology: 'scuole', status: 'progetto', international: false },
  { slug: 'biblioteca-bolzano', pages: [74], year: 2004, title: T('Biblioteca', 'Bibliothek', 'Library'), place: L.bolzano, typology: 'edifici-pubblici', status: 'progetto', international: false },
];

// Tipo di ogni immagine delle schede principali, classificato a vista sui provini.
// Le altre immagini usano la didascalia del sito e, in mancanza, un'euristica dichiarata.
const range = (a, b, t) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, t]));
export const manualTypes = {
  // Magnago
  454: 'rendering', 455: 'disegno', 456: 'disegno', 457: 'disegno', 458: 'disegno', 459: 'disegno', 460: 'rendering', 461: 'disegno', 462: 'tavola', 463: 'disegno', 464: 'disegno', 465: 'rendering', 466: 'foto', 467: 'tavola', 468: 'tavola', 469: 'tavola', 453: 'schizzo', 472: 'schizzo',
  // Baza
  497: 'schizzo', 498: 'foto', 499: 'disegno', 500: 'disegno', 501: 'disegno', 502: 'disegno', 503: 'schizzo', 504: 'schizzo', ...range(505, 525, 'foto'),
  // Università
  482: 'foto', 527: 'schizzo', 481: 'disegno', 483: 'disegno', 484: 'disegno', 485: 'disegno', ...range(486, 496, 'foto'), 526: 'foto',
  // Tribunale
  430: 'schizzo', 431: 'disegno', 432: 'disegno', 433: 'disegno', 434: 'disegno', 435: 'disegno', 438: 'schizzo', 439: 'foto', 440: 'schizzo', 441: 'schizzo', 442: 'disegno', 443: 'foto', 444: 'foto', 445: 'foto', 446: 'foto', 449: 'foto', 450: 'foto',
  // Torre di Mosto
  249: 'schizzo', 250: 'disegno', 251: 'disegno', 252: 'disegno', 253: 'disegno', 254: 'foto', 255: 'foto', 256: 'foto', 257: 'foto', 258: 'tavola', 259: 'foto', 260: 'foto', 261: 'foto', 262: 'foto', 263: 'disegno', 264: 'foto', 265: 'foto', 266: 'disegno', 267: 'foto', 290: 'schizzo', 291: 'tavola', 292: 'tavola',
  // Luson
  82: 'schizzo', 103: 'disegno', 84: 'disegno', 85: 'disegno', 86: 'foto', 87: 'disegno', 89: 'schizzo', 90: 'foto', 91: 'disegno', 92: 'foto', 94: 'foto', 100: 'disegno', 102: 'foto', 101: 'disegno', 96: 'foto',
  176: 'schizzo', 177: 'disegno', 181: 'rendering', 186: 'disegno', 187: 'disegno', 188: 'tavola', 189: 'rendering', 142: 'schizzo', 143: 'schizzo', 144: 'schizzo',
  // Augusto
  319: 'schizzo', 320: 'disegno', 321: 'disegno', 322: 'disegno', 323: 'schizzo', 324: 'rendering', 325: 'disegno', 326: 'disegno', 327: 'disegno', 328: 'disegno', 329: 'schizzo', 330: 'rendering', 331: 'disegno', 332: 'schizzo', 333: 'disegno', 334: 'rendering', 335: 'rendering', 336: 'rendering', 337: 'rendering', 338: 'rendering',
  // IPES Soprabolzano
  411: 'rendering', ...range(412, 418, 'disegno'), 419: 'rendering',
  // CasaNova
  349: 'schizzo', 350: 'disegno', 351: 'disegno', 352: 'rendering',
  // Mostra
  382: 'schizzo', 383: 'schizzo', 384: 'schizzo', 385: 'foto', 386: 'foto', 388: 'foto', 389: 'foto', 390: 'foto',
  // Funes abitazioni
  339: 'schizzo', 340: 'tavola', 341: 'disegno', 342: 'disegno', 343: 'schizzo', 344: 'disegno', 345: 'schizzo', 347: 'disegno', 348: 'plastico',
  // originali nelle schede degli schizzi pubblicati anche nel Regesto (stesso file)
  43: 'schizzo', 47: 'schizzo', 65: 'disegno', 53: 'schizzo', 128: 'schizzo', 119: 'schizzo', 111: 'schizzo', 105: 'schizzo', 110: 'schizzo', 107: 'schizzo', 74: 'schizzo', 63: 'schizzo',
  104: 'tavola',
  // Regesto schizzi
  51: 'schizzo', 52: 'schizzo', 64: 'tavola', 133: 'disegno', 134: 'schizzo', 135: 'schizzo', 136: 'schizzo', 137: 'schizzo', 138: 'schizzo', 139: 'schizzo', 140: 'schizzo', 141: 'schizzo', 145: 'schizzo', 146: 'schizzo', 147: 'schizzo',
};

// Didascalie del sito che descrivono il contenuto (le altre sono numeri).
export const captionTypes = [
  [/schizzo/i, 'schizzo'],
  [/^foto$/i, 'foto'],
  [/foto al plastico/i, 'plastico'],
  [/sezione|pianta|planimetria|prospetto|piante/i, 'disegno'],
];
