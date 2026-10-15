// Spazi video della home. Per ora ogni spazio mostra la sua immagine (che poi farà da poster).
// Per inserire un video: copia il file in public/video/ e scrivi il percorso in `video`,
// per esempio video: '/video/hero.mp4'. Meglio MP4 (H.264) o WebM, muto, 1920px, sotto i 10 MB.
import type { ImageMetadata } from 'astro';

import magnagoDay from '../assets/originali/pagine/foto/454_immagine.jpg';
import magnagoNight from '../assets/originali/home/1494000674_immagine.jpg';
import bazaDusk from '../assets/originali/home/1493912194_immagine.jpg';
import universita from '../assets/originali/home/1493912858_immagine.jpg';
import tribunale from '../assets/originali/pagine/foto/449_immagine.jpg';
import luson from '../assets/originali/pagine/foto/102_immagine.jpg';

export type VideoSlot = { poster: ImageMetadata; video?: string };

// grande video d'apertura, a tutto schermo
export const heroVideo: VideoSlot = { poster: magnagoDay, video: undefined };

// opere in evidenza: un video per opera
export const featuredVideos: Record<string, VideoSlot> = {
  'piazza-silvius-magnago': { poster: magnagoNight, video: undefined },
  'centro-formazione-baza': { poster: bazaDusk, video: undefined },
  'piazza-tribunale': { poster: tribunale, video: undefined },
  'piazza-universita': { poster: universita, video: undefined },
  'centro-luson': { poster: luson, video: undefined },
};
