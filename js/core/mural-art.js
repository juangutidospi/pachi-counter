import { store, COUNTER_COLORS } from './store.js';
import { seedFrom, rng } from './groove-seed.js';

/**
 * Mural generativo: convierte TODOS los contadores (y las recaídas prensadas)
 * en una composición constructivista Bauhaus. Es determinista respecto a los
 * datos —misma disciplina, mismo cuadro— pero crece contigo: cada contador es
 * una figura cuyo tamaño depende de sus días, con un anillo por hito logrado.
 *
 * Se usa en dos sitios con el mismo dibujo: la vista en vivo (`mural-view`) y
 * el póster exportable (`share-card`), pasando distinto tamaño y tiempo.
 */

/** Tokens de color resueltos a hex (el canvas no entiende var(--…)). */
const TOKHEX = {
  blue: '#2340d8', red: '#e5342a', yellow: '#f4c020', green: '#1f9d57', teal: '#0c9aa2',
  violet: '#6a3de8', magenta: '#d62f86', orange: '#ef6c14', ink: '#111010', paper: '#efe9dc',
};
const HEX = { paper: '#efe9dc', paper2: '#e7e0cf', ink: '#111010', dim: '#6b6459', hair: 'rgba(17,16,16,.07)', groove: '#c3baa4' };

/**
 * Resuelve un valor `var(--x)` de COUNTER_COLORS a hex.
 * @param {string} v Valor tipo `var(--blue)`.
 * @param {string} fallback Hex por defecto.
 * @returns {string} Color hex.
 */
function toHex(v, fallback) {
  const m = /var\(--(\w+)\)/.exec(v || '');
  return (m && TOKHEX[m[1]]) || fallback;
}

/**
 * Recopila los datos de dibujo del mural desde el store.
 * @returns {{items:Array, relapses:number, totalDays:number, count:number}}
 */
export function muralData() {
  const items = store.counters.map((c) => {
    const days = store.daysOf(c);
    const ladder = store.ladderOf(c);
    const cc = COUNTER_COLORS[c.color] || COUNTER_COLORS.accent;
    return {
      days,
      hex: toHex(cc.value, TOKHEX.blue),
      on: toHex(cc.on, TOKHEX.paper),
      reached: ladder.filter((m) => m <= days).length,
      seed: seedFrom(c.id || c.name),
    };
  });
  const totalDays = items.reduce((s, i) => s + i.days, 0);
  return { items, relapses: store.pressings.length, totalDays, count: items.length };
}

/**
 * Dibuja el mural en un contexto 2D, escalado al tamaño dado.
 * @param {CanvasRenderingContext2D} ctx Contexto.
 * @param {number} W Ancho en px.
 * @param {number} H Alto en px.
 * @param {number} t Tiempo (ms) para la animación sutil (0 = frame estático).
 * @param {object} data Resultado de `muralData()`.
 */
export function drawMural(ctx, W, H, t, data) {
  const S = W / 460; // factor de escala respecto al diseño base
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = HEX.paper; ctx.fillRect(0, 0, W, H);

  // rejilla tenue
  ctx.strokeStyle = HEX.hair; ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(i * W / 6, 0); ctx.lineTo(i * W / 6, H); ctx.stroke(); }
  for (let j = 1; j < 8; j++) { ctx.beginPath(); ctx.moveTo(0, j * H / 8); ctx.lineTo(W, j * H / 8); ctx.stroke(); }

  const items = data.items;
  const n = items.length;
  const footer = 46 * S;
  const areaH = H - footer;

  if (n > 0) {
    const maxDays = Math.max(1, ...items.map((i) => i.days));
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const cw = W / cols;
    const ch = areaH / rows;
    const base = Math.min(cw, ch) * 0.44;

    items.forEach((it, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const r = rng(it.seed);
      const jx = (r() - 0.5) * cw * 0.22;
      const jy = (r() - 0.5) * ch * 0.22;
      const cx = cw * (col + 0.5) + jx;
      const cy = ch * (row + 0.5) + jy;
      const size = base * (0.4 + 0.6 * (it.days / maxDays));
      const kind = it.seed % 4;
      const rot = (r() - 0.5) * 0.5 + (kind === 1 ? Math.sin(t / 3000 + idx) * 0.04 : 0);
      drawShape(ctx, kind, cx, cy, size, it.hex, S, rot);
      // anillos = hitos logrados (grabados en el color de contraste)
      ctx.strokeStyle = it.on; ctx.lineWidth = 1.6 * S;
      for (let k = 0; k < it.reached; k++) {
        const rr = size * (0.68 - k * 0.13);
        if (rr > size * 0.14) { ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke(); }
      }
    });
  }

  // recaídas prensadas: pequeñas marcas de tinta repartidas
  if (data.relapses > 0) {
    const r = rng(seedFrom('relapses' + data.relapses));
    ctx.fillStyle = HEX.ink;
    for (let i = 0; i < Math.min(data.relapses, 40); i++) {
      const mx = 20 * S + r() * (W - 40 * S);
      const my = 20 * S + r() * (areaH - 40 * S);
      const s = 4 * S;
      ctx.save(); ctx.translate(mx, my); ctx.rotate(r() * Math.PI); ctx.fillRect(-s / 2, -s * 1.6, s, s * 3.2); ctx.restore();
    }
  }

  // barra diagonal de acento
  ctx.save(); ctx.translate(W / 2, areaH / 2); ctx.rotate(-0.5); ctx.fillStyle = HEX.ink;
  ctx.fillRect(-W * 0.6, areaH * 0.3, W * 1.2, 9 * S); ctx.restore();

  // pie: firma editorial
  ctx.fillStyle = HEX.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.font = `800 ${Math.round(16 * S)}px Syne, sans-serif`;
  ctx.fillText(`COMPOSICIÓN Nº ${data.totalDays}`, 16 * S, H - 16 * S);
}

/**
 * Dibuja una figura constructivista.
 * @param {CanvasRenderingContext2D} ctx Contexto.
 * @param {number} kind 0 círculo · 1 semicírculo · 2 barra · 3 triángulo.
 * @param {number} cx Centro x. @param {number} cy Centro y.
 * @param {number} s Tamaño. @param {string} col Relleno hex.
 * @param {number} S Escala. @param {number} rot Rotación en rad.
 */
function drawShape(ctx, kind, cx, cy, s, col, S, rot) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.fillStyle = col; ctx.strokeStyle = HEX.ink; ctx.lineWidth = 2.5 * S;
  if (kind === 0) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
  else if (kind === 1) { ctx.beginPath(); ctx.arc(0, 0, s, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else if (kind === 2) { ctx.fillRect(-s, -s * 0.4, s * 2, s * 0.8); ctx.strokeRect(-s, -s * 0.4, s * 2, s * 0.8); }
  else { ctx.beginPath(); ctx.moveTo(-s, s); ctx.lineTo(0, -s); ctx.lineTo(s, s); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
