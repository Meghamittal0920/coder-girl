import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Orb } from '../lib/orb';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINES = ['Gather the chakra', 'Spin it. Faster.', 'Compress it into a sphere', 'Strike!'];

// Pinned scene: Megha charges a spiral orb out of her code, lunges, and the
// impact (flash frames, manga panel slam, shockwave, white-out) is the page
// transition into the missions gallery.
export default function ChakraStrike() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const orb = useRef<Orb | null>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useEffect(() => () => orb.current?.stop(), []);

  useGSAP(
    () => {
      const el = root.current!;
      // useGSAP runs as a layout effect, so the orb is created here rather than in useEffect.
      const o = (orb.current ??= new Orb(canvas.current!));
      o.draw();
      const s = o.state;

      // Where the orb is born: just above the laptop in the portrait.
      const hand = () => {
        const a = el.querySelector('.strike__hand')!.getBoundingClientRect();
        const b = el.getBoundingClientRect();
        return { x: (a.left + a.width / 2 - b.left) / b.width, y: (a.top + a.height / 2 - b.top) / b.height };
      };
      const placeAtHand = () => Object.assign(s, hand());
      placeAtHand();

      const lines = gsap.utils.toArray<HTMLElement>('.strike__line');
      const shake = gsap.quickSetter('.strike__shake', 'css');

      // Timeline beats (fractions of the pinned scroll).
      const CHARGE = 0.4; // orb charges until here
      const HIT = 0.5; // orb reaches the target: contact
      const PANEL = 0.56; // manga panel slams in and holds until BLAST
      const BLAST = 0.74; // orb erupts, shockwaves, white-out

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=650%',
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: placeAtHand,
          onToggle: self => (self.isActive ? o.start() : o.stop()),
          onUpdate: self => {
            const p = self.progress;
            if (pct.current) pct.current.textContent = String(Math.min(100, Math.round((p / CHARGE) * 100))).padStart(3, '0');
            // Rumble builds with the charge, spikes on contact, settles while the panel holds, spikes on the blast.
            const amp =
              p < CHARGE ? (p / CHARGE) ** 3 * 5
              : p < HIT ? 5 + ((p - CHARGE) / (HIT - CHARGE)) * 4
              : p < HIT + 0.05 ? 18
              : p < BLAST ? 3
              : p < BLAST + 0.1 ? 16
              : Math.max(0, 16 * (1 - (p - BLAST - 0.1) / 0.06));
            shake({ x: Math.sin(p * 2400) * amp, y: Math.cos(p * 3100) * amp * 0.6 });
          }
        }
      });

      // 1 — Charge: the orb forms out of code above the laptop; a target locks on.
      tl.fromTo(s, { charge: 0, scale: 0.12 }, { charge: 0.85, scale: 1, duration: CHARGE, ease: 'power1.in' }, 0)
        .fromTo('.strike__megha', { scale: 1, filter: 'brightness(0.65)' }, { scale: 1.04, filter: 'brightness(1)', duration: CHARGE }, 0)
        .fromTo('.strike__glow', { opacity: 0 }, { opacity: 1, duration: CHARGE }, 0)
        .fromTo('.strike__kanji', { opacity: 0, scale: 0.8 }, { opacity: 0.16, scale: 1, duration: CHARGE }, 0)
        .fromTo('.strike__speed', { opacity: 0 }, { opacity: 0.4, duration: 0.2 }, 0.22)
        .fromTo('.strike__target', { opacity: 0, scale: 1.8 }, { opacity: 1, scale: 1, duration: 0.08, ease: 'power2.out' }, CHARGE - 0.08);
      lines.forEach((l, i) => {
        const at = 0.02 + i * 0.1;
        tl.fromTo(l, { opacity: 0, yPercent: 60, filter: 'blur(8px)' }, { opacity: 1, yPercent: 0, filter: 'blur(0px)', duration: 0.04 }, at);
        if (i < lines.length - 1) tl.to(l, { opacity: 0, yPercent: -60, filter: 'blur(8px)', duration: 0.04 }, at + 0.08);
      });

      // 2 — Lunge: she drives the orb across the screen into the target.
      tl.to('.strike__hud, .strike__line', { opacity: 0, duration: 0.03 }, CHARGE + 0.01)
        .to('.strike__megha', { xPercent: 26, scale: 1.24, rotate: 4, duration: HIT - CHARGE, ease: 'power3.in' }, CHARGE)
        .to(s, { x: 0.6, y: 0.5, scale: 1.7, charge: 1, duration: HIT - CHARGE, ease: 'power3.in' }, CHARGE)
        .to('.strike__speed', { opacity: 1, scale: 1.3, duration: HIT - CHARGE }, CHARGE)

        // 3 — Contact: starburst, camera punch, hit-stop, negative impact frames.
        .to('.strike__target', { scale: 0.4, opacity: 0, duration: 0.015 }, HIT)
        .fromTo('.strike__impact', { scale: 0.2, opacity: 0, rotate: 0 }, { scale: 1.5, opacity: 1, rotate: 25, duration: 0.03, ease: 'power4.out' }, HIT)
        .to('.strike__impact', { scale: 2.4, opacity: 0, duration: 0.04, ease: 'power2.in' }, HIT + 0.035)
        .fromTo('.strike__stage', { scale: 1 }, { scale: 1.14, duration: 0.012, ease: 'power4.out', immediateRender: false }, HIT)
        .to('.strike__stage', { scale: 1.06, duration: 0.05 }, HIT + 0.012)
        .to(s, { scale: 2.3, duration: 0.012, ease: 'power4.out' }, HIT)
        .to(s, { scale: 2.1, duration: 0.045 }, HIT + 0.012) // hit-stop: the orb grinds in place
        .set('.strike__stage', { filter: 'invert(1) hue-rotate(180deg) contrast(1.5)' }, HIT + 0.004)
        .set('.strike__stage', { filter: 'none' }, HIT + 0.014)
        .set('.strike__stage', { filter: 'invert(1) grayscale(1) contrast(2)' }, HIT + 0.024)
        .set('.strike__stage', { filter: 'none' }, HIT + 0.034)

        // 4 — Manga panel slams in on a diagonal and HOLDS, slowly pushing in, then shatters.
        .fromTo(
          '.strike__panel',
          { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', scale: 1.3, rotate: -6, opacity: 1, filter: 'blur(0px)' },
          { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', scale: 1, rotate: -3, duration: 0.025, ease: 'power4.out' },
          PANEL
        )
        .fromTo('.strike__panel-cap', { xPercent: -120 }, { xPercent: 0, duration: 0.025, ease: 'power4.out' }, PANEL + 0.02)
        .to('.strike__panel', { scale: 1.08, rotate: -2, duration: BLAST - PANEL - 0.03 }, PANEL + 0.025)
        .to('.strike__panel', { scale: 1.7, opacity: 0, rotate: 5, filter: 'blur(16px)', duration: 0.05, ease: 'power2.in' }, BLAST)

        // 5 — The orb erupts to fill the screen; shockwaves; white-out.
        .to(s, { scale: 16, duration: 0.1, ease: 'power3.in' }, BLAST)
        .fromTo('.strike__ring', { scale: 0, opacity: 1 }, { scale: 5, opacity: 0, stagger: 0.02, duration: 0.08, ease: 'power2.out' }, BLAST + 0.02)
        .fromTo('.strike__flash', { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'power2.in' }, BLAST + 0.06)
        .set(s, { alpha: 0 }, BLAST + 0.12)
        .to('.strike__megha, .strike__speed, .strike__glow', { opacity: 0, duration: 0.01 }, BLAST + 0.11)

        // 6 — White fades into the night of the next page.
        .fromTo('.strike__dusk', { opacity: 0 }, { opacity: 1, duration: 0.1 }, BLAST + 0.13)
        .fromTo('.strike__next', { opacity: 0, y: 40, letterSpacing: '0.6em' }, { opacity: 1, y: 0, letterSpacing: '0.14em', duration: 0.08, ease: 'power3.out' }, BLAST + 0.17)
        .to({}, { duration: 0.04 }); // short rest before the pin releases
    },
    { scope: root }
  );

  return (
    <section ref={root} className="strike" id="strike" aria-label="Megha charges a spiral chakra strike">
      <div className="strike__shake">
        <div className="strike__stage">
          <div className="strike__glow" />
          <span className="strike__kanji" aria-hidden="true">螺旋</span>
          <div className="strike__speed" aria-hidden="true" />
          <figure className="strike__megha">
            <img src="nj/jacket.webp" alt="Megha in an orange ninja jacket, ready to strike" />
            <i className="strike__hand" />
          </figure>
          <i className="strike__target" aria-hidden="true" />
          <canvas ref={canvas} className="strike__canvas" aria-hidden="true" />
          <i className="strike__impact" aria-hidden="true" />
        </div>

        <div className="strike__copy">
          <div className="strike__hud tag">
            <span className="dot" /> Chakra <span ref={pct}>000</span>%
          </div>
          <div className="strike__lines">
            {LINES.map(l => (
              <p key={l} className="strike__line display">{l}</p>
            ))}
          </div>
        </div>

        <figure className="strike__panel" aria-hidden="true">
          <img src="nj/p-orb.webp" alt="" />
          <figcaption className="strike__panel-cap">ドーン!!</figcaption>
        </figure>
        <i className="strike__ring" />
        <i className="strike__ring" />
        <i className="strike__ring" />
      </div>
      <div className="strike__flash" />
      <div className="strike__dusk">
        <span className="tag strike__next">Act II · The missions</span>
      </div>
    </section>
  );
}
