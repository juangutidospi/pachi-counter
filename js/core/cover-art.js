import { store } from './store.js';
import { seedFrom, rng } from './groove-seed.js';
import { counterHex, ARTHEX } from './mural-art.js';

/**
 * Carátula de álbum generativa por contador: una composición Bauhaus única,
 * sembrada por el id del contador, cuya riqueza crece con los hitos logrados.
 * Se usa en el detalle (sección «Carátula») y en la imagen compartible.
 */

const PALETTE = ['#2340d8', '#e5342a', '#f4c020', '#1f9d57', '#6a3de8', '#0c9aa2', '#d62f86', '#ef6c14'];

/**
 * Dibuja la carátula del contador en un contexto 2D (cuadrado).
 * @param {CanvasRenderingContext2D} ctx Contexto.
 * @param {number} W Ancho. @param {number} H Alto.
 * @param {object} c Contador.
 * @param {number} t Tiempo (ms) para una animación mínima (0 = estático).
 */
export function drawCover(ctx, W, H, c, t) {
  const S = W / 460;
  const { fill, on } = counterHex(c.color);
  const days = store.daysOf(c);
  const ladder = store.ladderOf(c);
  const reached = ladder.filter((m) => m <= days).length;
  const r = rng(seedFrom(c.id || c.name));
  const barH = H * 0.16;
  const artH = H - barH;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ARTHEX.paper2; ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, W, artH); ctx.clip();

  // figura base grande, en el color del contador
  const bx = W * (0.28 + r() * 0.12);
  const by = artH * (0.34 + r() * 0.12);
  const bs = Math.min(W, artH) * 0.34;
  ctx.fillStyle = fill; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 3 * S;
  ctx.beginPath(); ctx.arc(bx, by, bs, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // figuras secundarias: más cuantos más hitos logrados
  const count = Math.min(2 + reached, 7);
  for (let i = 0; i < count; i++) {
    const kind = (r() * 4) | 0;
    const col = PALETTE[(r() * PALETTE.length) | 0];
    const cx = W * (0.1 + r() * 0.8);
    const cy = artH * (0.1 + r() * 0.8);
    const s = Math.min(W, artH) * (0.08 + r() * 0.16);
    const rot = (r() - 0.5) * 1.2 + (i === 0 ? Math.sin(t / 2600) * 0.05 : 0);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.fillStyle = col; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 2.5 * S;
    if (kind === 0) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else if (kind === 1) { ctx.beginPath(); ctx.arc(0, 0, s, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if (kind === 2) { ctx.fillRect(-s, -s * 0.4, s * 2, s * 0.8); ctx.strokeRect(-s, -s * 0.4, s * 2, s * 0.8); }
    else { ctx.beginPath(); ctx.moveTo(-s, s); ctx.lineTo(0, -s); ctx.lineTo(s, s); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();

  // marco
  ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 3 * S; ctx.strokeRect(0, 0, W, H);

  // barra de título
  ctx.fillStyle = ARTHEX.ink; ctx.fillRect(0, artH, W, barH);
  ctx.fillStyle = ARTHEX.paper; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const name = (c.name || '').toUpperCase();
  let fs = barH * 0.42;
  ctx.font = `800 ${fs}px Syne, sans-serif`;
  while (ctx.measureText(name).width > W - 24 * S && fs > 10) { fs -= 1 * S; ctx.font = `800 ${fs}px Syne, sans-serif`; }
  ctx.fillText(name, 14 * S, artH + barH * 0.5);
  // esquina: días
  ctx.textAlign = 'right'; ctx.fillStyle = fill;
  ctx.fillRect(W - 4 * S, artH, 4 * S, barH);
  ctx.fillStyle = ARTHEX.paper; ctx.font = `700 ${barH * 0.26}px "Space Grotesk", sans-serif`;
  ctx.fillText(`Nº ${days}`, W - 14 * S, artH + barH * 0.5);
  ctx.textBaseline = 'alphabetic';
}
