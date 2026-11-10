import Image from 'next/image';
import { imgSrc } from '@/lib/site';

/** A photo that arrives grey and blooms into colour around a point as it scrolls into view (CSS veil, one request). */
export function Bloom({ id, w, h, c, alt, sizes, className = '', priority = false, fill = true, origin, manual = false, veil = true, style }: {
  id: string; w: number; h: number; c: string; alt: string; sizes: string; className?: string; priority?: boolean; fill?: boolean; origin?: string; manual?: boolean; veil?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div className={`bloom ${className}`} style={{ '--c': c, ...style } as React.CSSProperties} data-bloom-origin={origin} data-bloom-manual={manual ? '' : undefined}>
      {fill ? (
        <Image className="zoom" src={imgSrc(id)} alt={alt} fill sizes={sizes} priority={priority} quality={72} />
      ) : (
        <Image className="zoom" src={imgSrc(id)} alt={alt} width={w} height={h} sizes={sizes} priority={priority} quality={72} style={{ width: '100%', height: 'auto' }} />
      )}
      {veil && <span className="bloom__veil" aria-hidden="true" />}
    </div>
  );
}
