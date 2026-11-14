import { useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ClickSpark from './bits/ClickSpark';
import ScrollVelocity from './bits/ScrollVelocity';
import CurtainOpen from './sections/CurtainOpen';
import ChakraStrike from './sections/ChakraStrike';
import Bonds from './sections/Bonds';
import CurtainClose from './sections/CurtainClose';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

const NAV = [
  ['About', '#about'],
  ['Missions', '#work'],
  ['Jutsu', '#skills'],
  ['Bonds', '#bonds'],
  ['Contact', '#contact']
];

export default function App() {
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('is-loading');
    if (reduce) return;
    const l = new Lenis({ lerp: 0.06, wheelMultiplier: 0.55, touchMultiplier: 0.8 });
    l.stop();
    lenis.current = l;
    l.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
    };
  }, []);

  const onReady = useCallback(() => {
    document.documentElement.classList.remove('is-loading');
    lenis.current?.start();
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // Smooth in-page anchor jumps through Lenis so pinned sections stay in sync.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a || !lenis.current) return;
      e.preventDefault();
      lenis.current.scrollTo(a.getAttribute('href')!, { duration: 1.6 });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <ClickSpark sparkColor={['#ff7a1a', '#7cc8ff', '#ffd7a8']} sparkCount={10} sparkRadius={26} sparkSize={12} shape="star">
      <div className="grain" aria-hidden="true" />
      <header className="nav">
        <a href="#top" className="nav__logo">
          <span className="nav__mark">忍</span> codergirl.megha
        </a>
        <nav>
          {NAV.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="nav__cta" href="#contact">
          Summon me
        </a>
      </header>

      <main>
        <CurtainOpen onReady={onReady} />
        <div className="ribbon">
          <ScrollVelocity
            texts={['Megha Mittal ✦ Frontend Shinobi ✦ ', 'Ninja way ✦ Scroll stories ✦ ']}
            velocity={70}
            className="marquee-text"
            outlineAlternate
            numCopies={6}
          />
        </div>
        <About />
        <ChakraStrike />
        <Projects />
        <Skills />
        <Bonds />
        <Experience />
        <Contact />
        <CurtainClose />
      </main>
    </ClickSpark>
  );
}
