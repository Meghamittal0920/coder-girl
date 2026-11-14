import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Particles from '../bits/Particles';
import RotatingText from '../bits/RotatingText';
import ShinyText from '../bits/ShinyText';
import { Banner, Drapes, Leaves } from '../bits/Stage';
import { setDrapes } from '../lib/drape';
import { drawCover, framePaths, loadFrames, nearestLoaded } from '../lib/frames';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const FRAMES = framePaths('seq/ramen', 45); // clip's last 3 frames cut to a different shot — dropped
const FIRST = 8; // the clip opens on a poster; start just before its own curtain parts

export default function CurtainOpen({ onReady }: { onReady: () => void }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const frame = useRef({ i: FIRST });
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let bannerDone = false;
    let framesP = 0;
    const report = () => {
      const p = framesP * 0.9 + (bannerDone ? 0.1 : 0);
      setProgress(p);
      if (p >= 0.999) setLoaded(true);
    };
    const banner = new Image();
    banner.onload = banner.onerror = () => ((bannerDone = true), report());
    banner.src = 'nj/banner.webp';
    images.current = loadFrames(FRAMES, p => ((framesP = p), report()));

    const draw = () => canvas.current && drawCover(canvas.current, nearestLoaded(images.current, Math.round(frame.current.i)));
    images.current[FIRST].addEventListener('load', draw);
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  // Preloader: shoji doors slide apart, banner drops in and swings.
  useGSAP(
    () => {
      if (!loaded) return;
      const tl = gsap.timeline({ onComplete: onReady });
      tl.to('.preloader__count, .preloader__inner .tag', { yPercent: -120, opacity: 0, duration: 0.5, ease: 'power3.in' })
        .to('.preloader__kanji', { scale: 6, opacity: 0, duration: 0.7, ease: 'power3.in' }, 0)
        .to('.shoji--l', { xPercent: -101, duration: 1.1, ease: 'expo.inOut' }, 0.35)
        .to('.shoji--r', { xPercent: 101, duration: 1.1, ease: 'expo.inOut' }, 0.35)
        .set('.preloader', { display: 'none' })
        .from('.hero .banner', { yPercent: -120, rotate: -4, duration: 1.4, ease: 'back.out(1.4)' }, 0.9)
        .to('.hero .banner', { rotate: 1.2, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 2.1)
        .from('.hero__hint, .hero__chrome > *', { opacity: 0, y: 16, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 1.6);
    },
    { dependencies: [loaded], scope: root }
  );

  // Scroll: roll the banner up → draw the drapes → scrub the clip → title.
  useGSAP(
    () => {
      const el = root.current!;
      const drape = { p: 0 };
      setDrapes(el, 0);
      const draw = () => canvas.current && drawCover(canvas.current, nearestLoaded(images.current, Math.round(frame.current.i)));
      const split = new SplitText('.hero .intro__name span', { type: 'chars', charsClass: 'intro__char' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: '+=460%', scrub: 1.2, pin: true }
      });
      tl.to('.hero__hint', { opacity: 0, y: 20, duration: 0.06 }, 0)
        .fromTo('.hero .banner', { '--roll': 0 }, { '--roll': 0.9, duration: 0.28, ease: 'power1.in' }, 0)
        .to('.hero .banner', { yPercent: -140, duration: 0.1, ease: 'power2.in' }, 0.27)
        .to(drape, { p: 1, duration: 0.36, ease: 'power2.inOut', onUpdate: () => setDrapes(el, drape.p) }, 0.3)
        .to('.hero .valance', { yPercent: -100, duration: 0.14, ease: 'power2.in' }, 0.62)
        .to('.hero__chrome', { opacity: 0, duration: 0.1 }, 0.62)
        .to(frame.current, { i: FRAMES.length - 1, duration: 0.72, onUpdate: draw }, 0.22)
        .fromTo('.hero__stage', { scale: 1.18, filter: 'brightness(0.55)' }, { scale: 1, filter: 'brightness(1)', duration: 0.6 }, 0.3)
        .from(split.chars, { yPercent: 120, rotate: 8, opacity: 0, stagger: 0.02, duration: 0.18, ease: 'power3.out' }, 0.7)
        .from('.hero .intro__sub', { opacity: 0, y: 30, duration: 0.12 }, 0.84)
        .to('.hero__veil', { opacity: 1, duration: 0.25 }, 0.68);

      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero__stage">
        <canvas ref={canvas} className="intro__canvas" aria-label="Megha coding at her desk with a bowl of ramen" />
      </div>
      <div className="hero__veil" />
      <div className="intro__particles">
        <Particles
          particleCount={90}
          particleColors={['#ffd7a8', '#ff7a1a', '#ffffff']}
          particleSpread={12}
          speed={0.06}
          particleBaseSize={55}
          shape="sparkle"
          glow={0.1}
          twinkle={0.7}
          drift="up"
          driftSpeed={0.35}
          clickBurst={false}
          disableRotation
        />
      </div>

      <h1 className="intro__name" aria-label="Megha Mittal">
        <span>Megha</span>
        <span>Mittal</span>
      </h1>
      <div className="intro__sub">
        <span className="serif">Frontend shinobi at Wiley —</span>
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

      <Drapes />
      <Leaves count={16} />
      <Banner src="nj/banner.webp" alt="Banner reading Megha Mittal, codergirl.megha" />

      <div className="hero__chrome">
        <span className="tag hero__tl">Act I · The curtain</span>
        <span className="tag hero__tr">Noida, IN · 28.53°N</span>
      </div>
      <div className="hero__hint">
        <ShinyText text="Scroll to raise the curtain" color="#e9d9c0" shineColor="#ffffff" speed={2.4} className="tag" />
        <span className="intro__hint-line" />
      </div>

      <div className="preloader" aria-hidden={loaded}>
        <div className="shoji shoji--l" />
        <div className="shoji shoji--r" />
        <div className="preloader__inner">
          <span className="preloader__kanji">忍</span>
          <div className="preloader__count">
            {String(Math.round(progress * 100)).padStart(3, '0')}
            <small>%</small>
          </div>
          <span className="tag">Preparing the stage…</span>
        </div>
        <div className="preloader__bar" style={{ transform: `scaleX(${progress})` }} />
      </div>
    </section>
  );
}
