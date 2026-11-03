import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollFloat from '../bits/ScrollFloat';
import Magnet from '../bits/Magnet';
import GradientText from '../bits/GradientText';
import { profile } from '../data';

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.contact__art',
        { yPercent: 20, scale: 0.9 },
        { yPercent: -5, scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } }
      );
      gsap.fromTo(
        '.contact__ring',
        { scale: 0.4, opacity: 0 },
        { scale: 1.1, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'center center', scrub: true } }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} className="contact" id="contact">
      <div className="contact__ring" aria-hidden="true" />
      <div className="section__head">
        <span className="tag">05 — Contact</span>
        <span className="tag tag--dim">連絡</span>
      </div>

      <ScrollFloat containerClassName="contact__float" textClassName="contact__float-text" stagger={0.02} distance={90}>
        Let's build something
      </ScrollFloat>
      <h2 className="display contact__big">
        <GradientText colors={['#ff7a1a', '#e2383f', '#c77dff', '#ff7a1a']} animationSpeed={6}>
          legendary.
        </GradientText>
      </h2>

      <div className="contact__grid">
        <div className="contact__cta">
          <p className="contact__lede">
            Got a project, a collab idea, or just want to argue about the strongest Straw Hat? My inbox is open.
          </p>
          <Magnet padding={100} magnetStrength={2.5}>
            <a className="btn btn--orange" href={`mailto:${profile.email}`}>
              {profile.email} <span aria-hidden="true">→</span>
            </a>
          </Magnet>
          <ul className="socials">
            {profile.socials.map(s => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-u">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <img className="contact__art" src="img/companion.webp" alt="Megha and Naruto standing side by side" loading="lazy" />
      </div>

      <footer className="footer">
        <img src="img/naruto-sticker.gif" alt="" className="footer__runner" />
        <span>© 2026 Megha Mittal</span>
        <span className="serif">Dattebayo — keep coding, keep growing.</span>
        <a href="#top" className="link-u">Back to top ↑</a>
      </footer>
    </section>
  );
}
