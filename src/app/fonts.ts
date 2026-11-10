import { Golos_Text, Prata, Tiro_Devanagari_Hindi } from 'next/font/google';

// Prata: high-contrast Cyrillic display. Golos Text: drawn for Cyrillic UI. Tiro Devanagari: day numerals only.
export const display = Prata({ subsets: ['cyrillic', 'latin'], weight: '400', variable: '--font-display', display: 'swap' });
export const text = Golos_Text({ subsets: ['cyrillic', 'latin'], weight: ['400', '500', '600'], variable: '--font-text', display: 'swap' });
export const deva = Tiro_Devanagari_Hindi({ subsets: ['devanagari'], weight: '400', variable: '--font-deva', display: 'swap', preload: false });
