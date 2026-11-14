// A hand-drawn (canvas 2D) spiral chakra orb.
// State is driven from GSAP: charge (0..1) controls spin, density and jitter;
// x/y are viewport fractions; scale multiplies the base radius.

type Mote = { a: number; r: number; v: number; glyph: string | null; life: number };

const GLYPHS = ['{', '}', '<', '/>', ';', '()', '=>', '[]', '01', '&&'];

export type OrbState = { charge: number; x: number; y: number; scale: number; alpha: number };

export class Orb {
  state: OrbState = { charge: 0, x: 0.5, y: 0.6, scale: 0.2, alpha: 1 };
  private ctx: CanvasRenderingContext2D;
  private motes: Mote[] = [];
  private raf = 0;
  private t = 0;
  private last = 0;
  private running = false;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
    for (let i = 0; i < 160; i++) this.motes.push(this.spawn(true));
  }

  private spawn(scatter = false): Mote {
    return {
      a: Math.random() * Math.PI * 2,
      r: scatter ? 0.4 + Math.random() * 4.6 : 3.2 + Math.random() * 2,
      v: 0.4 + Math.random() * 0.8,
      glyph: Math.random() < 0.35 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : null,
      life: Math.random()
    };
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr)) {
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.draw(dt);
      if (this.running) this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  draw(dt = 0.016) {
    const { w, h } = this.resize();
    const ctx = this.ctx;
    const s = this.state;
    const c = s.charge;
    this.t += dt * (1.2 + c * 9);
    ctx.clearRect(0, 0, w, h);
    if (s.alpha <= 0.001 || s.scale <= 0.001) return;

    const base = Math.min(w, h) * 0.13;
    const R = base * s.scale;
    const jit = c * c * 5;
    const x = s.x * w + (Math.random() - 0.5) * jit;
    const y = s.y * h + (Math.random() - 0.5) * jit;

    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.globalCompositeOperation = 'lighter';

    // Atmosphere.
    const halo = ctx.createRadialGradient(x, y, R * 0.2, x, y, R * (2.4 + c));
    halo.addColorStop(0, `rgba(90, 180, 255, ${0.35 + c * 0.35})`);
    halo.addColorStop(0.5, `rgba(40, 110, 255, ${0.12 + c * 0.15})`);
    halo.addColorStop(1, 'rgba(0, 40, 160, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, R * (2.4 + c), 0, Math.PI * 2);
    ctx.fill();

    // Motes / code glyphs pulled inward on a spiral.
    const live = Math.round(40 + c * 120);
    ctx.font = `600 ${Math.max(10, R * 0.16)}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < live; i++) {
      const m = this.motes[i];
      m.r -= dt * m.v * (0.6 + c * 2.6);
      m.a += dt * (1.5 + c * 6) / Math.max(0.35, m.r);
      if (m.r < 0.32) Object.assign(m, this.spawn());
      const px = x + Math.cos(m.a) * m.r * R;
      const py = y + Math.sin(m.a) * m.r * R * 0.92;
      const fade = Math.min(1, (5.2 - m.r) / 1.2) * Math.min(1, (m.r - 0.32) * 2);
      if (m.glyph && m.r > 1.1) {
        ctx.fillStyle = `rgba(180, 225, 255, ${0.75 * fade})`;
        ctx.fillText(m.glyph, px, py);
      } else {
        const tail = 0.12 + c * 0.25;
        ctx.strokeStyle = `rgba(200, 235, 255, ${0.8 * fade})`;
        ctx.lineWidth = 1 + c * 1.4;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x + Math.cos(m.a - tail) * m.r * R * 1.04, y + Math.sin(m.a - tail) * m.r * R * 0.96);
        ctx.stroke();
      }
    }

    // Orbital rings around the sphere.
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = `rgba(140, 210, 255, ${0.18 + c * 0.3})`;
      ctx.lineWidth = 1 + c * 2;
      ctx.beginPath();
      ctx.ellipse(x, y, R * (1.12 + k * 0.08), R * (0.28 + k * 0.1), this.t * (0.6 + k * 0.25) + k * 1.1, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Spiral arms inside the sphere.
    const arms = 7;
    for (let k = 0; k < arms; k++) {
      ctx.beginPath();
      for (let i = 0; i <= 26; i++) {
        const u = i / 26;
        const rr = R * (0.08 + 0.94 * u);
        const ang = -this.t * 2.2 + (k / arms) * Math.PI * 2 + u * 3.4;
        const px = x + Math.cos(ang) * rr;
        const py = y + Math.sin(ang) * rr;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.strokeStyle = `rgba(185, 230, 255, ${0.28 + c * 0.35})`;
      ctx.lineWidth = 1.5 + c * 3.5;
      ctx.stroke();
    }

    // Core.
    const core = ctx.createRadialGradient(x, y, 0, x, y, R);
    core.addColorStop(0, 'rgba(255, 255, 255, 1)');
    core.addColorStop(0.28, 'rgba(215, 240, 255, 0.95)');
    core.addColorStop(0.62, `rgba(70, 165, 255, ${0.55 + c * 0.3})`);
    core.addColorStop(1, 'rgba(20, 80, 255, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
