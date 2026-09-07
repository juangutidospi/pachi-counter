import { store } from './store.js';

/**
 * Microsonidos sintetizados con WebAudio (sin archivos). Solo suenan si el
 * usuario los activa en Ajustes (`store.sound`). El contexto se desbloquea con
 * la primera interacción del usuario (requisito de iOS).
 */

let ctx = null;

/** @returns {AudioContext|null} Contexto de audio (perezoso). */
function context() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch (e) { return null; }
}

// Desbloqueo del audio en la primera interacción (iOS exige gesto).
if (typeof window !== 'undefined') {
  const unlock = () => { context(); window.removeEventListener('pointerdown', unlock); };
  window.addEventListener('pointerdown', unlock, { once: true });
}

/**
 * Toca un tono con envolvente sencilla.
 * @param {number} freq Frecuencia (Hz).
 * @param {number} start Desfase de inicio (s).
 * @param {number} dur Duración (s).
 * @param {number} gain Volumen pico (0–1).
 * @param {OscillatorType} type Forma de onda.
 */
function tone(freq, start, dur, gain, type = 'sine') {
  const ac = context();
  if (!ac) return;
  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t0); osc.stop(t0 + dur + 0.02);
}

/** Acorde ascendente breve para celebrar un hito. */
export function playChime() {
  if (!store.sound) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.075, 0.5, 0.16, 'triangle'));
}

/** «Scratch» de vinilo (barrido de ruido con caída de tono) al recaer. */
export function playScratch() {
  if (!store.sound) return;
  const ac = context();
  if (!ac) return;
  const t0 = ac.currentTime;
  const dur = 0.45;
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ac.createBufferSource(); src.buffer = buffer;
  const filter = ac.createBiquadFilter(); filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1200, t0);
  filter.frequency.exponentialRampToValueAtTime(180, t0 + dur);
  filter.Q.value = 6;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.22, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(t0); src.stop(t0 + dur);
}

/** Clic breve y seco (feedback puntual). */
export function playTick() {
  if (!store.sound) return;
  tone(880, 0, 0.06, 0.1, 'square');
}

/* — sonido continuo del vinilo al girar (ligado a la velocidad) — */
let spinSrc = null;
let spinGain = null;

/**
 * Ajusta el crujido del vinilo según la velocidad de giro.
 * @param {number} speed Velocidad normalizada 0–1.
 */
export function spin(speed) {
  if (!store.sound) { if (spinGain) spinGain.gain.value = 0; return; }
  const ac = context();
  if (!ac) return;
  if (!spinSrc) {
    const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    spinSrc = ac.createBufferSource(); spinSrc.buffer = buf; spinSrc.loop = true;
    const flt = ac.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 2600; flt.Q.value = 0.7;
    spinGain = ac.createGain(); spinGain.gain.value = 0;
    spinSrc.connect(flt).connect(spinGain).connect(ac.destination);
    spinSrc.start();
  }
  const target = Math.min(0.09, Math.max(0, speed - 0.06) * 0.16);
  spinGain.gain.setTargetAtTime(target, ac.currentTime, 0.05);
}

/** Detiene el crujido del vinilo (al salir del detalle). */
export function spinStop() {
  if (!spinSrc) return;
  const ac = context();
  try {
    if (spinGain && ac) spinGain.gain.setTargetAtTime(0, ac.currentTime, 0.06);
    const src = spinSrc;
    setTimeout(() => { try { src.stop(); } catch (e) { /* ya parado */ } }, 200);
  } catch (e) { /* ignora */ }
  spinSrc = null; spinGain = null;
}
