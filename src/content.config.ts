import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Testo in tre lingue. Per aggiungere un progetto basta un nuovo file in src/content/projects/.
const t = z.object({ it: z.string(), de: z.string(), en: z.string() });
const paragraphs = z.object({ it: z.array(z.string()), de: z.array(z.string()), en: z.array(z.string()) });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: t,
      subtitle: t.optional(),
      year: z.number().int(),
      place: t,
      typology: z.enum(['spazi-pubblici', 'edifici-pubblici', 'residenziale', 'scuole', 'allestimenti']),
      status: z.enum(['realizzato', 'concorso', 'progetto']),
      international: z.boolean().default(false),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      competition: z
        .object({ year: z.number().int(), result: t.optional(), name: t.optional() })
        .optional(),
      built: z.string().optional(),
      area: z.string().optional(),
      client: t.optional(),
      partners: z.array(z.string()).optional(),
      collaborators: z.array(z.string()).optional(),
      awards: z.array(t).optional(),
      press: z.array(z.string()).optional(),
      photographer: z.string().optional(),
      text: paragraphs.optional(),
      excerpt: z
        .object({ lang: z.enum(['it', 'de', 'es']), text: z.string(), source: z.url() })
        .optional(),
      cover: image().optional(),
      sketch: image().optional(),
      reveal: z
        .object({ sketch: image(), sketchAlt: t, photo: image(), photoAlt: t, credit: z.string().optional() })
        .optional(),
      sourcePages: z.array(z.url()),
      gallery: z.array(
        z.object({
          image: image(),
          type: z.enum(['foto', 'rendering', 'schizzo', 'disegno', 'tavola', 'plastico', 'immagine']),
          caption: t.optional(),
          alt: t.optional(),
          credit: z.string().optional(),
        }),
      ),
    }),
});

export const collections = { projects };
