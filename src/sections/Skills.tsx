import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollVelocity from '../bits/ScrollVelocity';
import { skills } from '../data';

// Megha's flashlight sweeps across the dashboard; each jutsu (skill) lights up as the beam reaches it.
export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const frame = root.current!.querySelector<HTMLElement>('.dash')!;
      const wrap = root.current!.querySelector<HTMLElement>('.dash-wrap')!;
      const items = gsap.utils.toArray<HTMLElement>('.jutsu li');
      const pan = () => Math.max(0, frame.offsetWidth - wrap.clientWidth);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.skills__pin',
          start: 'top top',
          end: '+=320%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: self => {
            const lit = Math.floor(gsap.utils.clamp(0, 1, (self.progress - 0.12) / 0.8) * (items.length + 0.5));
            items.forEach((li, k) => li.classList.toggle('is-lit', k < lit));
          }
        }
      });
      tl.fromTo(frame, { '--sx': '30%', '--sr': '6%' }, { '--sx': '104%', '--sr': '26%', duration: 1 }, 0)
        .fromTo(frame, { x: 0 }, { x: () => -pan(), duration: 1 }, 0)
        .fromTo('.dash__beam', { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.05)
        .fromTo('.skills__title', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.3 }, 0);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="skills" id="skills">
      <div className="skills__pin">
        <div className="section__head">
          <span className="tag">04 — Jutsu arsenal</span>
          <span className="tag tag--dim">術</span>
        </div>
        <h2 className="display skills__title">
          Lighting up <em className="serif">the stack</em>
        </h2>
        <div className="dash-wrap">
          <div className="dash">
            <img className="dash__base" src="nj/dashboard.webp" alt="Megha shining a flashlight over her tech stack icons" />
            <img className="dash__lit" src="nj/dashboard.webp" alt="" aria-hidden="true" />
            <i className="dash__beam" aria-hidden="true" />
          </div>
        </div>
        <ol className="jutsu">
          {skills.map((s, i) => (
            <li key={s}>
              <span className="jutsu__idx">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className="skills__marquee">
        <ScrollVelocity
          texts={['React ✦ GSAP ✦ Three.js ✦ TypeScript ✦ ', 'HTML ✦ CSS ✦ SQL ✦ SAP ✦ Framer Motion ✦ ']}
          velocity={60}
          className="marquee-text"
          outlineAlternate
          numCopies={6}
        />
      </div>
    </section>
  );
}
