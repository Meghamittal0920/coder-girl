import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Magnet from '../bits/Magnet';
import { Banner, Drapes, Leaves } from '../bits/Stage';
import { setDrapes } from '../lib/drape';
import { profile } from '../data';

// Finale: as the scroll runs out, the drapes sweep shut and the banner rolls back down.
export default function CurtainClose() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const drape = { p: 1 };
      setDrapes(el, 1);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=340%', scrub: 1.2, pin: true }
      });
      tl.fromTo('.finale__bg img', { scale: 1.25 }, { scale: 1, duration: 0.5 }, 0)
        .from('.finale__bye > *', { opacity: 0, y: 40, stagger: 0.04, duration: 0.12, ease: 'power3.out' }, 0.02)
        .to('.finale__bye', { opacity: 0, y: -30, duration: 0.08 }, 0.3)
        .fromTo('.finale .valance', { yPercent: -100 }, { yPercent: 0, duration: 0.12, ease: 'power2.out' }, 0.26)
        .to(drape, { p: 0, duration: 0.34, ease: 'power2.inOut', onUpdate: () => setDrapes(el, drape.p) }, 0.3)
        .fromTo('.finale .banner', { yPercent: -140, '--roll': 0.9 }, { yPercent: 0, duration: 0.08, ease: 'power2.out' }, 0.62)
        .to('.finale .banner', { '--roll': 0, duration: 0.2, ease: 'power1.out' }, 0.7)
        .from('.finale__end > *', { opacity: 0, y: 30, stagger: 0.03, duration: 0.08, ease: 'power3.out' }, 0.86);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="finale" aria-label="Curtain call">
      <div className="finale__bg">
        <img src="nj/p-sunset.webp" alt="Two friends watching the sunset from a cliff" loading="lazy" />
      </div>
      <div className="finale__bye">
        <span className="finale__jp" aria-hidden="true">またね</span>
        <span className="tag">See you on the next mission</span>
      </div>

      <Drapes />
      <Leaves count={12} />
      <Banner src="nj/banner.webp" alt="Banner reading Megha Mittal, codergirl.megha" />

      <div className="finale__end">
        <span className="tag">Fin · Thanks for watching</span>
        <Magnet padding={80} magnetStrength={3}>
          <a className="btn btn--orange" href={`mailto:${profile.email}`}>
            Send a scroll <span aria-hidden="true">→</span>
          </a>
        </Magnet>
        <div className="finale__foot">
          <img src="nj/runner.gif" alt="" className="footer__runner" />
          <span>© 2026 Megha Mittal</span>
          <a href="#top" className="link-u">Raise the curtain again ↑</a>
        </div>
      </div>
    </section>
  );
}
