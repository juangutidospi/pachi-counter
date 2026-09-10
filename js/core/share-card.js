import { store } from './store.js';
import { t } from './i18n.js';
import { grooveTexture } from './groove-seed.js';
import { drawMural, muralData } from './mural-art.js';

/**
 * Genera un cartel (imagen) de una racha y lo comparte por la hoja del sistema
 * (Web Share con archivos) o lo descarga si no está disponible. Se dibuja en
 * un canvas para poder usar las fuentes de la app (Syne / Space Grotesk).
 */

/** Paleta concreta (hex) para el canvas, equivalente a los tokens. */
const HEX = { paper: '#efe9dc', ink: '#111010', dim: '#6b6459', groove: '#c3baa4', blue: '#2340d8', red: '#e5342a', yellow: '#f4c020', green: '#1f9d57', teal: '#0c9aa2', violet: '#6a3de8', magenta: '#d62f86', orange: '#ef6c14' };
/** color de contador → relleno y color de texto sobre él. */
const COLOR = {
  accent: { fill: HEX.blue, on: HEX.paper },
  accent2: { fill: HEX.red, on: HEX.paper },
  light: { fill: HEX.yellow, on: HEX.ink },
  green: { fill: HEX.green, on: HEX.paper },
  teal: { fill: HEX.teal, on: HEX.paper },
  violet: { fill: HEX.violet, on: HEX.paper },
  magenta: { fill: HEX.magenta, on: HEX.paper },
  orange: { fill: HEX.orange, on: HEX.ink },
  deep: { fill: HEX.ink, on: HEX.paper },
};

const W = 1080;
const H = 1350;

/**
 * Construye el archivo PNG del cartel de un contador (para pre-generarlo al
 * abrir el detalle y así preservar el gesto de usuario al compartir en iOS).
 * @param {object} counter Contador del store.
 * @returns {Promise<File|null>} Archivo PNG o null si falla.
 */
export async function buildPosterFile(counter) {
  try {
    await ensureFonts();
    const canvas = drawPoster(counter);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], 'pachi-racha.png', { type: 'image/png' });
  } catch (e) { return null; }
}

/**
 * Construye el archivo PNG de la «prensa anual» (resumen de la colección).
 * @returns {Promise<File|null>} Archivo PNG o null si falla.
 */
export async function buildAnnualFile() {
  try {
    await ensureFonts();
    const canvas = drawAnnual();
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], 'pachi-prensa-anual.png', { type: 'image/png' });
  } catch (e) { return null; }
}

/**
 * Construye el archivo PNG del mural generativo (composición de todos los
 * contadores) para compartirlo o guardarlo como póster/fondo.
 * @returns {Promise<File|null>} Archivo PNG o null si falla.
 */
export async function buildMuralFile() {
  try {
    await ensureFonts();
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    drawMural(canvas.getContext('2d'), W, H, 0, muralData());
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], 'pachi-mural.png', { type: 'image/png' });
  } catch (e) { return null; }
}

/**
 * Comparte el archivo por la hoja del sistema; si no se puede, lo descarga.
 * Debe llamarse SIN await previo dentro del manejador del clic (gesto iOS).
 * @param {File} file Imagen a compartir.
 * @param {string} text Texto acompañante.
 * @returns {Promise<'shared'|'saved'|'error'>} Resultado.
 */
export function shareOrSave(file, text) {
  if (!file) return Promise.resolve('error');
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    return navigator.share({ files: [file], title: 'Pachi’s counter', text })
      .then(() => 'shared')
      .catch((e) => (e && e.name === 'AbortError' ? 'shared' : download(file)));
  }
  return Promise.resolve(download(file));
}

/** Descarga el archivo como recaída. @param {File} file Imagen. @returns {'saved'} */
function download(file) {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'saved';
}

/** Asegura que las fuentes están cargadas antes de dibujar en el canvas. */
async function ensureFonts() {
  if (!document.fonts) return;
  try {
    await Promise.all([
      document.fonts.load('800 120px Syne'),
      document.fonts.load('700 40px "Space Grotesk"'),
      document.fonts.load('600 30px "Space Grotesk"'),
    ]);
    await document.fonts.ready;
  } catch (e) { /* seguimos con lo que haya */ }
}

/**
 * Dibuja el cartel del contador en un canvas y lo devuelve.
 * @param {object} c Contador.
 * @returns {HTMLCanvasElement} Canvas con el cartel.
 */
function drawPoster(c) {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const days = store.daysOf(c);
  const ladder = store.ladderOf(c);
  const col = COLOR[c.color] || COLOR.accent;

  // fondo
  ctx.fillStyle = HEX.paper; ctx.fillRect(0, 0, W, H);

  // marco técnico + nodos
  ctx.strokeStyle = HEX.ink; ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, W - 88, H - 88);
  drawTick(ctx, 44, 44); drawTick(ctx, W - 44, 44); drawTick(ctx, 44, H - 44); drawTick(ctx, W - 44, H - 44);

  // masthead
  ctx.fillStyle = HEX.ink;
  ctx.textBaseline = 'middle';
  setFont(ctx, 600, 26, 'Space Grotesk'); ctx.letterSpacing = '6px';
  ctx.textAlign = 'left';
  ctx.fillText('PACHI’S COUNTER', 96, 112);
  const ed = t('home.edition', { n: store.today() - dayIndexJan(c) });
  ctx.textAlign = 'right';
  const edW = ctx.measureText(ed.toUpperCase()).width;
  ctx.fillStyle = HEX.ink; ctx.fillRect(W - 96 - edW - 32, 92, edW + 32, 40);
  ctx.fillStyle = HEX.paper; ctx.fillText(ed.toUpperCase(), W - 112, 112);
  ctx.letterSpacing = '0px';

  // vinilo
  const cx = W / 2, cy = 560, R = 300;
  // surcos generativos (únicos por contador)
  ctx.setLineDash([]);
  grooveTexture(c.id || c.name, 22, 165, R).forEach((g) => {
    ctx.beginPath(); ctx.arc(cx, cy, g.r, 0, Math.PI * 2);
    ctx.strokeStyle = HEX.groove; ctx.lineWidth = 2; ctx.globalAlpha = g.opacity;
    ctx.setLineDash(g.gap ? [6, 12] : []); ctx.stroke();
  });
  ctx.globalAlpha = 1; ctx.setLineDash([]);
  const rings = ladder.length;
  for (let i = 0; i < rings; i++) {
    const r = 170 + (rings <= 1 ? R - 170 : (i / (rings - 1)) * (R - 170));
    const reached = ladder[i] <= days;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = reached ? col.fill : HEX.groove;
    ctx.lineWidth = reached ? 10 : 3;
    ctx.globalAlpha = reached ? 1 : 0.5; ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = HEX.ink; ctx.lineWidth = 5; ctx.stroke();
  // etiqueta central
  ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.fillStyle = col.fill; ctx.fill();
  ctx.lineWidth = 5; ctx.strokeStyle = HEX.ink; ctx.stroke();
  // número
  ctx.fillStyle = col.on; ctx.textAlign = 'center';
  const numSize = days >= 1000 ? 150 : days >= 100 ? 190 : 240;
  setFont(ctx, 800, numSize, 'Syne');
  ctx.fillText(String(days), cx, cy - 6);
  setFont(ctx, 700, 26, 'Space Grotesk'); ctx.letterSpacing = '3px';
  ctx.fillText((t(days === 1 ? 'word.day' : 'word.days')).toUpperCase(), cx, cy + numSize / 2 + 12);
  ctx.letterSpacing = '0px';

  // nombre
  ctx.fillStyle = HEX.ink; ctx.textAlign = 'center';
  setFont(ctx, 800, 84, 'Syne');
  fitText(ctx, c.name.toUpperCase(), W - 200, 84, 'Syne', 800);
  ctx.fillText(c.name.toUpperCase(), cx, 960);

  // frase
  ctx.fillStyle = HEX.dim;
  setFont(ctx, 500, 34, 'Space Grotesk');
  wrapText(ctx, store.quote(c).text, cx, 1040, W - 240, 46, 2);

  // pie
  ctx.fillStyle = HEX.blue;
  const tag = t('app.tagline').toUpperCase();
  setFont(ctx, 700, 26, 'Space Grotesk'); ctx.letterSpacing = '6px';
  const tagW = ctx.measureText(tag).width;
  ctx.fillRect(cx - tagW / 2 - 22, 1230, tagW + 44, 52);
  ctx.fillStyle = HEX.paper; ctx.textBaseline = 'middle';
  ctx.fillText(tag, cx, 1257);
  ctx.letterSpacing = '0px';

  return canvas;
}

/**
 * Dibuja la prensa anual (resumen de la colección) en un canvas.
 * @returns {HTMLCanvasElement} Canvas con el resumen.
 */
function drawAnnual() {
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const pressings = store.pressings;
  const counters = store.counters;
  const entities = pressings.map((p) => ({ days: p.days, color: p.color, name: p.name, seed: p.id || p.name }))
    .concat(counters.map((c) => ({ days: store.daysOf(c), color: c.color, name: c.name, seed: c.id || c.name })));
  const best = entities.slice().sort((a, b) => b.days - a.days)[0] || { days: 0, color: 'accent', name: '—', seed: 'x' };
  const totalPressed = pressings.reduce((s, p) => s + p.days, 0);
  const year = new Date().getFullYear();
  const col = COLOR[best.color] || COLOR.accent;

  ctx.fillStyle = HEX.paper; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = HEX.ink; ctx.lineWidth = 4; ctx.strokeRect(44, 44, W - 88, H - 88);
  drawTick(ctx, 44, 44); drawTick(ctx, W - 44, 44); drawTick(ctx, 44, H - 44); drawTick(ctx, W - 44, H - 44);

  // masthead
  ctx.fillStyle = HEX.ink; ctx.textBaseline = 'middle';
  setFont(ctx, 600, 26, 'Space Grotesk'); ctx.letterSpacing = '6px'; ctx.textAlign = 'left';
  ctx.fillText('PACHI’S COUNTER', 96, 112);
  const badge = `${t('annual.title').toUpperCase()} · ${year}`;
  ctx.textAlign = 'right';
  const bw = ctx.measureText(badge).width;
  ctx.fillStyle = HEX.ink; ctx.fillRect(W - 96 - bw - 32, 92, bw + 32, 40);
  ctx.fillStyle = HEX.paper; ctx.fillText(badge, W - 112, 112);
  ctx.letterSpacing = '0px';

  // vinilo del mejor disco
  const cx = W / 2, cy = 520, R = 250;
  ctx.setLineDash([]);
  grooveTexture(best.seed, 20, 150, R).forEach((g) => {
    ctx.beginPath(); ctx.arc(cx, cy, g.r, 0, Math.PI * 2);
    ctx.strokeStyle = HEX.groove; ctx.lineWidth = 2; ctx.globalAlpha = g.opacity;
    ctx.setLineDash(g.gap ? [6, 12] : []); ctx.stroke();
  });
  ctx.globalAlpha = 1; ctx.setLineDash([]);
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = HEX.ink; ctx.lineWidth = 5; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 128, 0, Math.PI * 2); ctx.fillStyle = col.fill; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = HEX.ink; ctx.stroke();
  ctx.fillStyle = col.on; ctx.textAlign = 'center';
  const ns = best.days >= 1000 ? 120 : best.days >= 100 ? 150 : 190;
  setFont(ctx, 800, ns, 'Syne'); ctx.fillText(String(best.days), cx, cy - 4);

  // etiqueta "mejor disco" + nombre
  ctx.fillStyle = HEX.dim; setFont(ctx, 700, 22, 'Space Grotesk'); ctx.letterSpacing = '4px';
  ctx.fillText(t('annual.bestLabel').toUpperCase(), cx, 830); ctx.letterSpacing = '0px';
  ctx.fillStyle = HEX.ink; setFont(ctx, 800, 60, 'Syne');
  fitText(ctx, best.name.toUpperCase(), W - 220, 60, 'Syne', 800);
  ctx.fillText(best.name.toUpperCase(), cx, 888);

  // fila de estadísticas
  const cells = [
    [String(totalPressed), t('annual.daysLabel')],
    [String(pressings.length), t('annual.recordsLabel')],
    [String(counters.length), t('annual.streaksLabel')],
  ];
  const gy = 980, gh = 150, gx = 96, gw = (W - 192) / 3;
  ctx.strokeStyle = HEX.ink; ctx.lineWidth = 4; ctx.strokeRect(gx, gy, W - 192, gh);
  cells.forEach((cell, i) => {
    const x = gx + i * gw;
    if (i > 0) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + gh); ctx.stroke(); }
    ctx.fillStyle = HEX.ink; ctx.textAlign = 'left';
    setFont(ctx, 800, 58, 'Syne'); ctx.fillText(cell[0], x + 26, gy + 58);
    ctx.fillStyle = HEX.dim; setFont(ctx, 600, 20, 'Space Grotesk'); ctx.letterSpacing = '2px';
    ctx.fillText(cell[1].toUpperCase(), x + 26, gy + 108); ctx.letterSpacing = '0px';
  });

  // pie
  ctx.fillStyle = HEX.blue; const tag = t('app.tagline').toUpperCase();
  setFont(ctx, 700, 26, 'Space Grotesk'); ctx.letterSpacing = '6px'; ctx.textAlign = 'center';
  const tw = ctx.measureText(tag).width;
  ctx.fillRect(cx - tw / 2 - 22, 1230, tw + 44, 52);
  ctx.fillStyle = HEX.paper; ctx.fillText(tag, cx, 1257); ctx.letterSpacing = '0px';

  return canvas;
}

/* — helpers de dibujo — */

/** Establece la fuente del contexto. */
function setFont(ctx, weight, size, family) { ctx.font = `${weight} ${size}px "${family}", sans-serif`; }

/** Dibuja un nodo cuadrado (esquina del marco). */
function drawTick(ctx, x, y) {
  ctx.fillStyle = HEX.paper; ctx.strokeStyle = HEX.ink; ctx.lineWidth = 4;
  ctx.fillRect(x - 12, y - 12, 24, 24); ctx.strokeRect(x - 12, y - 12, 24, 24);
}

/** Reduce el tamaño de fuente hasta que el texto quepa en `maxW`. */
function fitText(ctx, text, maxW, size, family, weight) {
  let s = size;
  setFont(ctx, weight, s, family);
  while (ctx.measureText(text).width > maxW && s > 24) { s -= 4; setFont(ctx, weight, s, family); }
}

/** Dibuja texto con salto de línea, centrado, hasta `maxLines`. */
function wrapText(ctx, text, cx, y, maxW, lh, maxLines) {
  const words = String(text).split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
    if (lines.length === maxLines - 1 && ctx.measureText(line + '…').width > maxW) break;
  }
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((ln, i) => ctx.fillText(ln, cx, y + i * lh));
}

/** @param {object} c Contador (no usado; edición basada en hoy). @returns {number} Índice de 2026-01-01. */
function dayIndexJan() {
  return Math.floor(Date.UTC(2026, 0, 1) / 86400000) - 1;
}
