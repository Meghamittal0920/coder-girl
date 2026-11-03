import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurText from '../bits/BlurText';
import CountUp from '../bits/CountUp';
import CircularText from '../bits/CircularText';
import SplitText from '../bits/SplitText';
import { drawCover, framePaths, loadFrames } from '../lib/frames';
import { profile } from '../data';

const CODE = framePaths('seq/code', 20);

// Ping-pong loop of the "coding on the sofa" clip, paused while off-screen.
function CodeLoop() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const imgs = loadFrames(CODE);
    let i = 0;
    let dir = 1;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = window.setInterval(() => {
      if (!visible || !ref.current) return;
      drawCover(ref.current, imgs[i]);
      if (i + dir < 0 || i + dir >= imgs.length) dir *= -1;
      i += dir;
    }, 90);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, []);
  return <canvas ref={ref} className="about__canvas" aria-label="Megha coding on a laptop" />;
}

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '.about__media',
        { clipPath: 'inset(18% 18% 18% 18% round 28px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 28px)',
          ease: 'none',
          scrollTrigger: { trigger: '.about__media', start: 'top 90%', end: 'top 30%', scrub: true }
        }
      );
      gsap.to('.about__canvas', {
        yPercent: -10,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      gsap.to('.about__badge', {
        y: -120,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="about section" id="about">
      <div className="section__head">
        <span className="tag">01 — About</span>
        <span className="tag tag--dim">自己紹介</span>
      </div>
      <div className="about__grid">
        <div className="about__media-wrap">
          <div className="about__media">
            <CodeLoop />
          </div>
          <div className="about__badge">
            <CircularText text="OPEN TO FREELANCE ✦ COLLABS ✦ " size={150} fontSize={13} fontWeight={600} letterSpacing={2} spinDuration={18} color="#f3efe6">
              <span className="about__badge-core">🍥</span>
            </CircularText>
          </div>
        </div>

        <div className="about__copy">
          <SplitText
            tag="h2"
            text="I don't just watch anime. I make it move."
            className="display about__title"
            splitType="words"
            effect="rise"
            mask
            delay={60}
            duration={1}
            textAlign="left"
          />
          <BlurText text={profile.bio} className="about__bio" animateBy="words" delay={35} stepDuration={0.3} />
          <p className="about__note">
            By day I ship production frontends at <b>Wiley</b>. By night I build scroll-driven love letters to the shows that raised me —
            and somehow the internet keeps starring them.
          </p>
          <dl className="stats">
            <div>
              <dt>GitHub stars</dt>
              <dd><CountUp to={profile.stats.stars} duration={2.2} />+</dd>
            </div>
            <div>
              <dt>Followers</dt>
              <dd><CountUp to={profile.stats.followers} duration={2.2} /></dd>
            </div>
            <div>
              <dt>Repositories</dt>
              <dd><CountUp to={profile.stats.repos} duration={1.6} /></dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
