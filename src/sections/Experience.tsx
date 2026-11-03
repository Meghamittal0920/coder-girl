import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SpotlightCard from '../bits/SpotlightCard';
import { experience, GH, moreRepos } from '../data';

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.timeline__line i',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } }
      );
      gsap.utils.toArray<HTMLElement>('.timeline__item').forEach(item => {
        gsap.from(item, {
          x: 80,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none reverse' }
        });
      });
      gsap.fromTo(
        '.exp__portrait img',
        { yPercent: 12 },
        { yPercent: -12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
      );
      gsap.from('.repo-row', {
        y: 40,
        opacity: 0,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.repo-list', start: 'top 85%' }
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="exp section" id="experience">
      <div className="section__head">
        <span className="tag">04 — Experience</span>
        <span className="tag tag--dim">経歴</span>
      </div>

      <div className="exp__grid">
        <figure className="exp__portrait">
          <img src="img/laptop-white.webp" alt="Illustrated portrait of Megha with her laptop" loading="lazy" />
        </figure>

        <div>
          <h2 className="display exp__title">
            The path <em className="serif">so far</em>
          </h2>
          <ol className="timeline">
            <span className="timeline__line"><i /></span>
            {experience.map(e => (
              <li key={e.title} className="timeline__item">
                <SpotlightCard className="timeline__card" spotlightColor="rgba(255, 122, 26, 0.22)">
                  <span className="tag">{e.when}</span>
                  <h3>{e.title}</h3>
                  <span className="timeline__org">{e.org}</span>
                  <p>{e.text}</p>
                </SpotlightCard>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="more">
        <div className="section__head">
          <span className="tag">Side quests</span>
          <span className="tag tag--dim">from the archive</span>
        </div>
        <ul className="repo-list">
          {moreRepos.map(r => (
            <li key={r.repo}>
              <a className="repo-row" href={`${GH}/${r.repo}`} target="_blank" rel="noreferrer">
                <span className="repo-row__name">{r.repo.replace(/[-_]+/g, ' ').trim()}</span>
                <span className="repo-row__lang">{r.lang}</span>
                <span className="repo-row__stars">★ {r.stars}</span>
                <span className="repo-row__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
