import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import DecryptedText from '../bits/DecryptedText';
import { bonds } from '../data';

// Horizontal manga strip. Panels lean with scroll velocity and their art pans inside the frame.
export default function Bonds() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const skew = gsap.quickTo(el, 'skewX', { duration: 0.5, ease: 'power3' });
      const clamp = gsap.utils.clamp(-8, 8);

      const scroll = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance() * 1.6}`,
          scrub: 1.2,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: self => {
            skew(clamp(self.getVelocity() / -400));
            gsap.set('.bonds__progress i', { scaleX: self.progress });
          },
          onLeave: () => skew(0),
          onLeaveBack: () => skew(0)
        }
      });

      gsap.utils.toArray<HTMLElement>('.bond').forEach(panel => {
        const st = { trigger: panel, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true };
        gsap.fromTo(panel.querySelector('img'), { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: st });
        gsap.fromTo(panel.querySelector('.bond__jp'), { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: st });
        gsap.fromTo(
          panel.querySelector('.bond__frame'),
          { clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            ease: 'power2.out',
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left 90%', end: 'left 40%', scrub: true }
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bonds" id="bonds">
      <div className="bonds__progress"><i /></div>
      <div ref={track} className="bonds__track">
        <div className="bonds__intro">
          <span className="tag">05 — Bonds</span>
          <span className="bonds__kanji" aria-hidden="true">絆</span>
          <h2 className="display bonds__title">
            Story <em className="serif">arcs</em>
          </h2>
          <p className="bonds__lede">
            <DecryptedText
              text="Late nights, ramen, rooftop dreams — the panels behind the code."
              animateOn="view"
              sequential
              revealDirection="start"
              speed={28}
              characters="忍術火影螺旋絆夢里<>/{}"
            />
          </p>
        </div>

        {bonds.map((b, i) => (
          <figure key={b.src} className={`bond bond--${b.shape}`} style={{ '--tilt': `${i % 2 ? 1.4 : -1.4}deg`, '--lift': `${i % 2 ? 5 : -4}vh` } as CSSProperties}>
            <div className="bond__frame">
              <img src={b.src} alt={b.alt} loading="lazy" />
              <span className="bond__num">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <figcaption>
              <span className="bond__jp" aria-hidden="true">{b.jp}</span>
              <span className="bond__en">{b.en}</span>
            </figcaption>
          </figure>
        ))}

        <div className="bonds__outro">
          <span className="display">To be<br /><em className="serif">continued…</em></span>
        </div>
      </div>
    </section>
  );
}
