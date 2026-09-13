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
  const base = o.reached ? o.fill : '#b3ab96';
  const on = o.reached ? o.on : 'rgba(17,16,16,.5)';

  // sombra proyectada
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy + R * 0.92, R * 0.78, R * 0.16, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(17,16,16,' + (o.reached ? 0.20 : 0.10) + ')'; ctx.fill(); ctx.restore();

  ctx.save(); ctx.translate(cx, cy);

  // rosetón (borde festoneado) con relieve
  const petals = 18; ctx.beginPath();
  for (let i = 0; i <= petals * 2; i++) {
    const rr = i % 2 ? R : R * 0.9; const a = Math.PI * i / petals - Math.PI / 2;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(-R * 0.3, -R * 0.35, R * 0.1, 0, 0, R * 1.1);
  g.addColorStop(0, mix(base, '#ffffff', 0.45)); g.addColorStop(0.55, base); g.addColorStop(1, mix(base, '#000000', 0.32));
  ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = (o.next && !o.reached ? 3 : 2) * S; ctx.strokeStyle = o.next && !o.reached ? '#2340d8' : INK; ctx.stroke();

  // disco interior
  ctx.beginPath(); ctx.arc(0, 0, R * 0.74, 0, Math.PI * 2);
  const g2 = ctx.createRadialGradient(-R * 0.25, -R * 0.3, R * 0.05, 0, 0, R * 0.74);
  g2.addColorStop(0, mix(base, '#ffffff', 0.32)); g2.addColorStop(1, mix(base, '#000000', 0.16));
  ctx.fillStyle = g2; ctx.fill(); ctx.lineWidth = 1.4 * S; ctx.strokeStyle = 'rgba(17,16,16,.35)'; ctx.stroke();
  // aro claro interior
  ctx.beginPath(); ctx.arc(0, 0, R * 0.6, 0, Math.PI * 2); ctx.lineWidth = 1 * S; ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.stroke();

  // estrella superior (solo logrado)
  if (o.reached) { ctx.save(); ctx.translate(0, -R * 0.4); ctx.globalAlpha = 0.9; star(ctx, R * 0.14, on); ctx.restore(); }

  // número grabado
  ctx.fillStyle = on; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const digits = String(o.day).length;
  ctx.font = '800 ' + Math.round(R * (digits >= 3 ? 0.6 : 0.82)) + 'px Syne, sans-serif';
  ctx.fillText(String(o.day), 0, R * (o.reached ? 0.1 : 0.04));

  // brillo especular
  ctx.beginPath(); ctx.arc(0, 0, R * 0.9, 0, Math.PI * 2); ctx.clip();
  const sp = ctx.createLinearGradient(-R, -R, R * 0.2, R * 0.2);
  sp.addColorStop(0, 'rgba(255,255,255,.32)'); sp.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = sp; ctx.fillRect(-R, -R, R * 2, R * 2);
  ctx.restore();
}
