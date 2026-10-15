import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang, Tr } from '../i18n';
import { ui, path } from '../i18n';
import { competitionExtras, projectCountry } from '../data/site';

export type Project = CollectionEntry<'projects'>;

// Ordine dell'indice: anno decrescente, poi priorità editoriale, poi titolo.
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order || a.data.title.it.localeCompare(b.data.title.it, 'it'));
}

// Riconoscimento sintetico per l'indice: premio principale, altrimenti esito del concorso.
export function recognition(p: Project, lang: Lang): string {
  const d = p.data;
  if (d.awards?.length) return d.awards[0][lang].split(',')[0];
  if (d.competition?.result) return `${d.competition.result[lang]} ${d.competition.year}`;
  return '';
}

export function fullTitle(p: Project, lang: Lang): string {
  return p.data.title[lang];
}

export function yearLabel(p: Project): string {
  return String(p.data.year);
}

export const typologyLabel = (p: Project, lang: Lang) => ui.typologies[p.data.typology][lang];

// Immagine per l'anteprima nell'indice: copertina, altrimenti schizzo.
export function previewOf(p: Project) {
  return p.data.cover ?? p.data.sketch ?? null;
}

// Testo alternativo descrittivo, costruito dai dati certi della scheda.
export function altFor(p: Project, type: string, lang: Lang, caption?: string): string {
  const kind = ui.imageTypes[type as keyof typeof ui.imageTypes]?.[lang] ?? '';
  const where = `${p.data.title[lang]}, ${p.data.place[lang]}`;
  return caption ? `${where}: ${caption.toLowerCase()}` : `${where}, ${kind.toLowerCase()}`;
}

// Registro dei concorsi: schede con concorso più i concorsi della biografia senza scheda.
export type CompetitionRow = { year: number; title: string; place: string; result?: Tr; international: boolean; country: string; href?: string; note?: string; first: boolean };

export async function competitionRows(lang: Lang): Promise<CompetitionRow[]> {
  const projects = await getProjects();
  // L'edificio di Baza nasce dal concorso dell'Alcazaba: una sola riga, con rimando all'opera realizzata.
  const SKIP = new Set(['centro-formazione-baza']);
  const builtFrom: Record<string, string> = { 'alcazaba-baza': 'centro-formazione-baza' };
  const bySlug = Object.fromEntries(projects.map((p) => [p.id, p]));
  const rows: CompetitionRow[] = [
  ...projects
    .filter((p) => p.data.competition && !SKIP.has(p.id))
    .map((p) => {
      const c = p.data.competition!;
      const b = builtFrom[p.id] ? bySlug[builtFrom[p.id]] : null;
      const realized = p.data.status === 'realizzato' && p.data.built;
      return {
        year: c.year,
        title: p.data.title[lang],
        place: p.data.place[lang],
        result: c.result,
        international: p.data.international,
        country: projectCountry[p.id] ?? 'IT',
        href: path(lang, 'works', b ? b.id : p.id),
        note: b ? `${ui.statusOne.realizzato[lang]} ${b.data.built}: ${b.data.title[lang]}` : realized ? `${ui.statusOne.realizzato[lang]} ${p.data.built}` : undefined,
        first: /^1/.test(c.result?.it ?? ''),
      } satisfies CompetitionRow;
    }),
  ...competitionExtras.map((e) => ({
    year: e.year, title: e.title[lang], place: e.place[lang], result: e.result, international: e.international, country: e.country,
    first: /^1/.test(e.result?.it ?? ''),
  })),
].sort((a, b) => b.year - a.year || Number(b.first) - Number(a.first) || a.title.localeCompare(b.title, lang));
  return rows;
}
