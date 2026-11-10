export type Img = { id: string; w: number; h: number; c: string };
export type Day = { n: number; label: string; title: string; text: string[]; img: Img | null };
export type Price =
  | { kind: 'request'; stale?: boolean; pastDeparture?: boolean; tables: string[][][]; rub: null | { note: string; tables: string[][][] } }
  | { kind: 'usd' | 'rub'; cur: 'USD' | 'RUB'; from: number; fromNote: string; note: string; tables: string[][][]; stale: boolean; rub: null | { note: string; tables: string[][][] } };
export type Pkg = {
  slug: string; code: string; collection: Collection; title: string; tagline: string; days: number; nights: number;
  route: string[]; pts: [string, number, number][]; tags: string[]; months: number[]; yearRound: boolean; weekly: boolean; weekday: string;
  departure: string | null; intro: string[]; summary: { n: number; place: string; sights: string }[]; program: Day[];
  hotels: string[][] | null; price: Price; included: string[]; excluded: string[]; facts: Record<string, string>; why: string[];
  cover: Img | null; more: Img[]; coverBorrowed?: boolean;
};
export type Collection = '12x' | 'festival' | 'group' | 'b2c' | 'private' | 'unique' | 'luxury' | 'short' | 'neighbors';
export type CatItem = {
  s: string; k: string; c: Collection; t: string; g: string; d: number; n: number; r: string[]; tg: number[]; m: number[]; yr: 0 | 1; wd: string;
  p: null | { c: 'USD' | 'RUB'; v: number; n: string }; dep: string; cv: string; cw: number; ch: number; cc: string; sh: 0 | 1;
};
export type Catalog = { tags: string[]; collections: Record<Collection, string>; items: CatItem[] };
export type GalleryItem = { id: string; w: number; h: number; c: string; s: string; t: string; tg: string; col: Collection };
