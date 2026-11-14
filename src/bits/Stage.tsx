import { useMemo } from 'react';

// Red velvet drapes + pelmet. Animate them with setDrapes() from lib/drape.
export function Drapes() {
  return (
    <>
      <div className="velvet velvet--l" aria-hidden="true">
        <i className="velvet__hem" />
      </div>
      <div className="velvet velvet--r" aria-hidden="true">
        <i className="velvet__hem" />
      </div>
      <div className="valance" aria-hidden="true" />
    </>
  );
}

// Hanging banner that rolls up/down via the --roll CSS variable (0 = unrolled, 1 = rolled to the rod).
export function Banner({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="banner">
      <i className="banner__rope banner__rope--l" aria-hidden="true" />
      <i className="banner__rope banner__rope--r" aria-hidden="true" />
      <img className="banner__img" src={src} alt={alt} />
      <i className="banner__roll" aria-hidden="true" />
    </div>
  );
}

// Lightweight CSS leaf fall (pure DOM, original leaf shapes).
export function Leaves({ count = 18 }: { count?: number }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: -Math.random() * 14,
        dur: 9 + Math.random() * 9,
        size: 10 + Math.random() * 16,
        sway: 30 + Math.random() * 80,
        hue: i % 3
      })),
    [count]
  );
  return (
    <div className="leaves" aria-hidden="true">
      {leaves.map((l, i) => (
        <span
          key={i}
          className={`leaf leaf--${l.hue}`}
          style={
            {
              left: `${l.left}%`,
              width: l.size,
              height: l.size * 0.62,
              animationDelay: `${l.delay}s`,
              animationDuration: `${l.dur}s`,
              '--sway': `${l.sway}px`
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
