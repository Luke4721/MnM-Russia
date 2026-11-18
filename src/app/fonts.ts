import { Playfair_Display, Golos_Text, Tiro_Devanagari_Hindi } from 'next/font/google';

// Playfair has sturdy strokes and a real Cyrillic italic; Cormorant's hairlines vanished over the 3D rooms.
export const display = Playfair_Display({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
export const text = Golos_Text({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], variable: '--font-text', display: 'swap' });
export const deva = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', variable: '--font-deva', display: 'swap', preload: false });
