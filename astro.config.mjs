// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.stanislaofierro.com',
  trailingSlash: 'always',
  // un solo foglio di stile piccolo: in linea, nessuna richiesta bloccante
  build: { inlineStylesheets: 'always' },
  i18n: {
    locales: ['it', 'de', 'en'],
    defaultLocale: 'it',
    routing: { prefixDefaultLocale: false },
  },
  image: {
    // le foto originali sono piccole: nessuna larghezza oltre l'originale
    breakpoints: [320, 480, 640, 750, 828, 1040, 1240],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
