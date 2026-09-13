/**
 * Dibuja hitos como medallas: moneda con rosetón, relieve metálico, número
 * grabado y estrella al lograrse. Las pendientes van en gris; la próxima se
 * resalta con aro azul. Coherente con el material del resto de la app.
 */

const INK = '#111010';

/** @param {string} h Hex. @returns {number[]} [r,g,b]. */
function toRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
/** Mezcla dos colores. @returns {string} rgb(). */
function mix(hex, target, amt) {
  const a = toRgb(hex), b = toRgb(target);
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * amt)).join(',') + ')';
}

/** Dibuja una estrella de 5 puntas. */
function star(ctx, r, col) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r : r * 0.45; const a = Math.PI * i / 5 - Math.PI / 2;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill();
}

/**
 * @param {CanvasRenderingContext2D} ctx Contexto.
 * @param {number} W Ancho. @param {number} H Alto.
 * @param {{day:number, reached:boolean, next:boolean, fill:string, on:string}} o Opciones.
 */
export function drawMedal(ctx, W, H, o) {
  const S = W / 72, cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.42;
  ctx.clearRect(0, 0, W, H);
  const gold = o.reached && o.last;
  const base = !o.reached ? '#b3ab96' : (gold ? '#d9a520' : o.fill);
  const on = !o.reached ? 'rgba(17,16,16,.5)' : (gold ? '#3d2f0a' : o.on);
  const num = String(o.day);

  // sombra proyectada
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy + R * 0.94, R * 0.76, R * 0.15, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(17,16,16,' + (o.reached ? 0.22 : 0.10) + ')'; ctx.fill(); ctx.restore();

  ctx.save(); ctx.translate(cx, cy);

  // rosetón (borde festoneado fino) con relieve metálico
  const petals = 22; ctx.beginPath();
  for (let i = 0; i <= petals * 2; i++) {
    const rr = i % 2 ? R : R * 0.87; const a = Math.PI * i / petals - Math.PI / 2;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(-R * 0.32, -R * 0.38, R * 0.08, 0, 0, R * 1.12);
  g.addColorStop(0, mix(base, '#ffffff', 0.55)); g.addColorStop(0.5, base); g.addColorStop(1, mix(base, '#000000', 0.4));
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = (o.next && !o.reached ? 3 : 2) * S; ctx.strokeStyle = o.next && !o.reached ? '#2340d8' : INK; ctx.stroke();

  // bisel: arco de luz arriba-izquierda, sombra abajo-derecha
  ctx.lineWidth = 1.6 * S;
  ctx.beginPath(); ctx.arc(0, 0, R * 0.79, Math.PI * 0.9, Math.PI * 1.75); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, R * 0.79, Math.PI * -0.1, Math.PI * 0.7); ctx.strokeStyle = 'rgba(17,16,16,.28)'; ctx.stroke();

  // disco interior recesado (grabado)
  ctx.beginPath(); ctx.arc(0, 0, R * 0.72, 0, Math.PI * 2);
  const g2 = ctx.createRadialGradient(-R * 0.22, -R * 0.28, R * 0.04, 0, 0, R * 0.76);
  g2.addColorStop(0, mix(base, '#ffffff', 0.28)); g2.addColorStop(0.75, base); g2.addColorStop(1, mix(base, '#000000', 0.22));
  ctx.fillStyle = g2; ctx.fill(); ctx.lineWidth = 1.4 * S; ctx.strokeStyle = 'rgba(17,16,16,.4)'; ctx.stroke();

  // anillo de perlas
  const beads = 30, rb = R * 0.62;
  ctx.fillStyle = mix(base, o.reached ? '#000000' : '#000000', 0.22);
  for (let i = 0; i < beads; i++) { const a = (i / beads) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * rb, Math.sin(a) * rb, 0.9 * S, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, 0, R * 0.54, 0, Math.PI * 2); ctx.lineWidth = 1 * S; ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.stroke();

  // estrella superior (logrado)
  if (o.reached) { ctx.save(); ctx.translate(0, -R * 0.36); star(ctx, R * 0.13, mix(on, base, 0.15)); ctx.restore(); }

  // número grabado (ajustado al disco, con relieve)
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let fs = R * 0.9;
  ctx.font = '800 ' + fs + 'px Syne, sans-serif';
  while (ctx.measureText(num).width > R * 1.02 && fs > 8) { fs -= 1; ctx.font = '800 ' + fs + 'px Syne, sans-serif'; }
  const ny = R * (o.reached ? 0.1 : 0.02);
  ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillText(num, 0, ny + 1.2 * S); // luz inferior (emboss)
  ctx.fillStyle = on; ctx.fillText(num, 0, ny);

  // barrido especular
  ctx.beginPath(); ctx.arc(0, 0, R * 0.92, 0, Math.PI * 2); ctx.clip();
  const sp = ctx.createLinearGradient(-R, -R, R * 0.3, R * 0.3);
  sp.addColorStop(0, 'rgba(255,255,255,.34)'); sp.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = sp; ctx.fillRect(-R, -R, R * 2, R * 2);
  ctx.restore();
}
