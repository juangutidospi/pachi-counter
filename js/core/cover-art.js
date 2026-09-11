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
 * Grano de tinta: puntos deterministas que rompen el plano digital (risograph).
 * @param {CanvasRenderingContext2D} ctx Contexto.
 * @param {number} W Ancho. @param {number} H Alto.
 * @param {number} n Número de puntos. @param {number} a Opacidad.
 */
function grain(ctx, W, H, n, a) {
  ctx.save();
  ctx.globalAlpha = a; ctx.fillStyle = ARTHEX.ink;
  for (let i = 0; i < n; i++) {
    const gx = (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1 * W;
    const gy = (((Math.sin(i * 78.233) * 12543.7891) % 1) + 1) % 1 * H;
    ctx.fillRect(gx, gy, 1, 1);
  }
  ctx.restore();
}

/**
 * Miniatura de carátula (para la home tipo «crate»): solo el arte generativo,
 * sin barra de título ni número (esos van en la tarjeta).
 * @param {CanvasRenderingContext2D} ctx Contexto.
 * @param {number} W Ancho. @param {number} H Alto.
 * @param {object} c Contador.
 */
export function drawMiniCover(ctx, W, H, c) {
  const S = W / 56;
  const { fill } = counterHex(c.color);
  const days = store.daysOf(c);
  const reached = store.ladderOf(c).filter((m) => m <= days).length;
  const r = rng(seedFrom(c.id || c.name));
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = ARTHEX.paper2; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
  // Overprint: los rellenos se multiplican (los cruces mezclan colores como en
  // serigrafía); los contornos, finos, quedan en tinta.
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = fill; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 1.4 * S;
  ctx.beginPath(); ctx.arc(W * (0.3 + r() * 0.12), H * (0.32 + r() * 0.12), Math.min(W, H) * 0.34, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  const count = Math.min(1 + reached, 4);
  for (let i = 0; i < count; i++) {
    const kind = (r() * 4) | 0;
    const col = PALETTE[(r() * PALETTE.length) | 0];
    const cx = W * (0.15 + r() * 0.7), cy = H * (0.15 + r() * 0.7), s = Math.min(W, H) * (0.1 + r() * 0.16);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((r() - 0.5) * 1.2);
    ctx.fillStyle = col; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 1.2 * S;
    if (kind === 0) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else if (kind === 1) { ctx.beginPath(); ctx.arc(0, 0, s, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if (kind === 2) { ctx.fillRect(-s, -s * 0.4, s * 2, s * 0.8); ctx.strokeRect(-s, -s * 0.4, s * 2, s * 0.8); }
    else { ctx.beginPath(); ctx.moveTo(-s, s); ctx.lineTo(0, -s); ctx.lineTo(s, s); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  ctx.globalCompositeOperation = 'source-over';
  grain(ctx, W, H, Math.round(W * H / 30), 0.07);
  ctx.restore();
  ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 2 * S; ctx.strokeRect(0, 0, W, H);
}

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

  // leve degradado de fondo (aire, no plano)
  const bg = ctx.createLinearGradient(0, 0, W, artH);
  bg.addColorStop(0, 'rgba(255,255,255,.22)'); bg.addColorStop(1, 'rgba(17,16,16,.05)');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, artH);

  // Overprint: rellenos en multiply (los cruces mezclan color, como serigrafía);
  // contornos finos en tinta.
  ctx.globalCompositeOperation = 'multiply';

  // figura base grande, en el color del contador
  const bx = W * (0.28 + r() * 0.12);
  const by = artH * (0.34 + r() * 0.12);
  const bs = Math.min(W, artH) * 0.34;
  ctx.fillStyle = fill; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 2 * S;
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
    ctx.fillStyle = col; ctx.strokeStyle = ARTHEX.ink; ctx.lineWidth = 1.8 * S;
    if (kind === 0) { ctx.beginPath(); ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    else if (kind === 1) { ctx.beginPath(); ctx.arc(0, 0, s, Math.PI, 2 * Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if (kind === 2) { ctx.fillRect(-s, -s * 0.4, s * 2, s * 0.8); ctx.strokeRect(-s, -s * 0.4, s * 2, s * 0.8); }
    else { ctx.beginPath(); ctx.moveTo(-s, s); ctx.lineTo(0, -s); ctx.lineTo(s, s); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    ctx.restore();
  }
  ctx.globalCompositeOperation = 'source-over';
  // grano + semitono fino
  grain(ctx, W, artH, Math.round(W * artH / 26), 0.06);
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
