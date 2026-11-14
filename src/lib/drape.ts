// Velvet stage curtains. `p` = 0 closed, 1 fully drawn back.
// The inner edge is clipped along a curve so the cloth swoops like a tie-back
// (held high, swept further at the hem) while scaleX bunches the folds together.

const STEPS = 16;

export function setDrape(el: HTMLElement | null, p: number, side: 'l' | 'r') {
  if (!el) return;
  const pts: string[] = [side === 'l' ? '0% 0%' : '100% 0%'];
  for (let i = 0; i <= STEPS; i++) {
    const y = i / STEPS;
    // How far the inner edge has retreated at this height (0..100).
    const pull = p * 100 * (0.58 + 0.36 * Math.pow(y, 1.6));
    const inner = Math.max(0, 100 - pull);
    pts.push(side === 'l' ? `${inner}% ${y * 100}%` : `${100 - inner}% ${y * 100}%`);
  }
  pts.push(side === 'l' ? '0% 100%' : '100% 100%');
  el.style.clipPath = `polygon(${pts.join(',')})`;
  el.style.transform = `scaleX(${1 - 0.48 * p}) skewY(${(side === 'l' ? -1 : 1) * p * 1.2}deg)`;
}

export function setDrapes(root: ParentNode, p: number) {
  setDrape(root.querySelector<HTMLElement>('.velvet--l'), p, 'l');
  setDrape(root.querySelector<HTMLElement>('.velvet--r'), p, 'r');
}
