import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollVelocity from '../bits/ScrollVelocity';
import { drawCover, framePaths, loadFrames, nearestLoaded } from '../lib/frames';
import { skills } from '../data';

const FRAMES = framePaths('seq/skills', 61);

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const frame = useRef({ i: 0 });

  useEffect(() => {
    images.current = loadFrames(FRAMES);
    images.current[0].addEventListener('load', () => canvas.current && drawCover(canvas.current, images.current[0]));
  }, []);

  useGSAP(
    () => {
      const draw = () => canvas.current && drawCover(canvas.current, nearestLoaded(images.current, Math.round(frame.current.i)));
      const items = gsap.utils.toArray<HTMLElement>('.skills__list li');

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.skills__pin',
          start: 'top top',
          end: '+=220%',
          scrub: 0.5,
          pin: true,
          onUpdate: self => {
            const lit = Math.floor(self.progress * (items.length + 0.5));
            items.forEach((li, k) => li.classList.toggle('is-lit', k < lit));
          }
        }
      });
      tl.to(frame.current, { i: FRAMES.length - 1, duration: 1, onUpdate: draw }, 0)
        .fromTo('.skills__frame', { scale: 0.82, rotate: -2 }, { scale: 1, rotate: 0, duration: 0.5 }, 0)
        .fromTo('.skills__frame-glow', { opacity: 0 }, { opacity: 1, duration: 1 }, 0);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="skills" id="skills">
      <div className="skills__pin">
        <div className="section__head">
          <span className="tag">03 — Jutsu arsenal</span>
          <span className="tag tag--dim">術</span>
        </div>
        <div className="skills__grid">
          <div className="skills__frame">
            <div className="skills__frame-glow" />
            <canvas ref={canvas} aria-label="Megha summoning her tech stack" />
          </div>
          <div className="skills__side">
            <h2 className="display skills__title">
              Summoning <em className="serif">the stack</em>
            </h2>
            <ol className="skills__list">
              {skills.map((s, i) => (
                <li key={s}>
                  <span className="skills__idx">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
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
