import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Particles from '../bits/Particles';
import RotatingText from '../bits/RotatingText';
import { drawCover, framePaths, loadFrames, nearestLoaded } from '../lib/frames';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FRAMES = framePaths('seq/hat', 70);

export default function Intro({ onReady }: { onReady: () => void }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const frame = useRef({ i: 0 });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    images.current = loadFrames(FRAMES, p => {
      setProgress(p);
      if (p >= 1) setLoaded(true);
    });
    const first = images.current[0];
    first.addEventListener('load', () => canvas.current && drawCover(canvas.current, first));
    const onResize = () => canvas.current && drawCover(canvas.current, nearestLoaded(images.current, Math.round(frame.current.i)));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preloader exit, then hand scroll control back to the page.
  useGSAP(
    () => {
      if (!loaded) return;
      const tl = gsap.timeline({ onComplete: onReady });
      tl.to('.preloader__count', { yPercent: -110, duration: 0.6, ease: 'power3.in' })
        .to('.preloader', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=0.1')
        .from('.intro__stage', { scale: 1.25, filter: 'blur(12px)', duration: 1.6, ease: 'expo.out' }, '-=0.6')
        .from('.intro__chrome > *', { opacity: 0, y: 16, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, '-=1.1');
    },
    { dependencies: [loaded], scope: root }
  );

  useGSAP(
    () => {
      const draw = () => canvas.current && drawCover(canvas.current, nearestLoaded(images.current, Math.round(frame.current.i)));
      const split = new SplitText('.intro__name span', { type: 'chars', charsClass: 'intro__char' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', scrub: 0.6, pin: true }
      });
      tl.to(frame.current, { i: FRAMES.length - 1, duration: 1, onUpdate: draw }, 0)
        .to('.intro__stage', { scale: 1, duration: 1 }, 0)
        .to('.intro__hint', { opacity: 0, y: 20, duration: 0.12 }, 0)
        .to('.intro__kanji', { yPercent: -40, duration: 1 }, 0)
        .from(split.chars, { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.025, duration: 0.25, ease: 'power3.out' }, 0.5)
        .from('.intro__sub', { opacity: 0, y: 30, duration: 0.2 }, 0.75)
        .to('.intro__veil', { opacity: 0.55, duration: 0.3 }, 0.55);

      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="intro" id="top">
      <div className="intro__stage">
        <canvas ref={canvas} className="intro__canvas" aria-label="Animated portrait of Megha lifting her straw hat" />
      </div>
      <div className="intro__veil" />
      <div className="intro__particles">
        <Particles
          particleCount={110}
          particleColors={['#ffffff', '#ff7a1a', '#ffd7a8']}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={60}
          shape="sparkle"
          glow={0.1}
          twinkle={0.7}
          drift="up"
          driftSpeed={0.4}
          clickBurst={false}
          disableRotation
        />
      </div>

      <div className="intro__chrome">
        <span className="tag intro__tl">Portfolio · 2026</span>
        <span className="tag intro__tr">Noida, IN · 28.53°N</span>
        <span className="intro__kanji" aria-hidden="true">麦わらの開発者</span>
        <div className="intro__hint">
          <span className="tag">Scroll to lift the hat</span>
          <span className="intro__hint-line" />
        </div>
      </div>

      <h1 className="intro__name" aria-label="Megha Mittal">
        <span>Megha</span>
        <span>Mittal</span>
      </h1>
      <div className="intro__sub">
        <span className="serif">Frontend developer at Wiley —</span>
        <span className="intro__rot">
          crafting{' '}
          <RotatingText
            texts={['cinematic scroll stories', 'anime-grade web', 'clean, responsive UI', 'motion that feels alive']}
            mainClassName="rot-pill"
            staggerDuration={0.02}
            staggerFrom="last"
            rotationInterval={2400}
            effect="slide"
            animatePresenceMode="sync"
            animatePresenceInitial
          />
        </span>
      </div>

      <div className="preloader" aria-hidden={loaded}>
        <div className="preloader__inner">
          <span className="preloader__kanji">忍</span>
          <div className="preloader__count">
            {String(Math.round(progress * 100)).padStart(3, '0')}
            <small>%</small>
          </div>
          <span className="tag">Summoning the straw hat…</span>
        </div>
        <div className="preloader__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </section>
  );
}
