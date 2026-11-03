import { useRef, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import TiltedCard from '../bits/TiltedCard';
import { GH, projects } from '../data';

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;

      const scroll = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: self => gsap.set('.projects__progress i', { scaleX: self.progress })
        }
      });

      // Parallax inside the horizontal track: kanji drift faster, numbers slower.
      gsap.utils.toArray<HTMLElement>('.panel').forEach(panel => {
        const st = { trigger: panel, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true };
        gsap.fromTo(panel.querySelector('.panel__kanji'), { xPercent: 40 }, { xPercent: -60, ease: 'none', scrollTrigger: st });
        gsap.fromTo(panel.querySelector('.panel__num'), { xPercent: -30 }, { xPercent: 30, ease: 'none', scrollTrigger: st });
        gsap.from(panel.querySelectorAll('.panel__info > *'), {
          y: 50,
          opacity: 0,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, containerAnimation: scroll, start: 'left 75%', toggleActions: 'play none none reverse' }
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="projects" id="work">
      <div className="projects__progress"><i /></div>
      <div ref={track} className="projects__track">
        <div className="panel panel--intro">
          <span className="tag">02 — Selected work</span>
          <h2 className="display projects__title">
            S-Rank
            <br />
            <em className="serif">missions</em>
          </h2>
          <p className="projects__lede">A live release site and nine cinematic builds — scroll sideways. Every card is live — tilt it, then open it.</p>
          <span className="projects__arrow" aria-hidden="true">⟶</span>
        </div>

        {projects.map((p, i) => (
          <article key={p.repo} className="panel" style={{ '--accent': p.accent } as CSSProperties}>
            <span className="panel__kanji" aria-hidden="true">{p.kanji}</span>
            <span className="panel__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <div className="panel__card">
              <TiltedCard
                imageSrc={p.shot}
                altText={`${p.title} website screenshot`}
                containerHeight="var(--card-h)"
                containerWidth="var(--card-w)"
                imageHeight="var(--card-h)"
                imageWidth="var(--card-w)"
                rotateAmplitude={8}
                scaleOnHover={1.03}
                showTooltip={false}
                flipOnClick={false}
                glare={0.35}
                radius={18}
                onClick={() => p.live && window.open(p.live, '_blank', 'noopener')}
              />
            </div>
            <div className="panel__info">
              <span className="tag" style={{ color: p.accent }}>
                {p.client ? `● Featured · ${p.client}` : `★ ${p.stars}`} · {p.stack.join(' · ')}
              </span>
              <h3 className="panel__title">{p.title}</h3>
              <p>{p.blurb}</p>
              <div className="panel__links">
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="link-u">
                    {p.client ? 'Visit madaramusic.com ↗' : 'Live site ↗'}
                  </a>
                )}
                {!p.client && (
                  <a href={`${GH}/${p.repo}`} target="_blank" rel="noreferrer" className="link-u">
                    Source ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}

        <div className="panel panel--outro">
          <a href={`${GH}?tab=repositories`} target="_blank" rel="noreferrer" className="outro-link">
            <span className="tag">+23 more on GitHub</span>
            <span className="display">See all<br />32 repos ↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
