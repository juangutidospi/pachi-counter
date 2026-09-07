/**
 * Generador determinista de «surcos» de vinilo por contador: a partir de una
 * semilla (su id/nombre) produce siempre el mismo patrón, de modo que cada
 * disco tiene una textura única e irrepetible.
 */

/**
 * Hash FNV-1a de una cadena.
 * @param {string} str Texto semilla.
 * @returns {number} Entero sin signo de 32 bits.
 */
export function seedFrom(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * PRNG mulberry32: función que devuelve números [0,1) deterministas.
 * @param {number} seed Semilla entera.
 * @returns {() => number} Generador.
 */
export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Textura de surcos decorativos para un contador.
 * @param {string} seedStr Semilla (id o nombre del contador).
 * @param {number} count Número de surcos.
 * @param {number} rMin Radio mínimo.
 * @param {number} rMax Radio máximo.
 * @returns {Array<{r:number, opacity:number, gap:boolean}>} Surcos ordenados por radio.
 */
export function grooveTexture(seedStr, count, rMin, rMax) {
  const next = rng(seedFrom(seedStr));
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      r: +(rMin + next() * (rMax - rMin)).toFixed(1),
      opacity: +(0.1 + next() * 0.28).toFixed(2),
      gap: next() < 0.32,
    });
  }
  return out.sort((a, b) => a.r - b.r);
}

/**
 * Ángulo inicial (grados) del surco radial, único por contador.
 * @param {string} seedStr Semilla.
 * @returns {number} Ángulo 0–359.
 */
export function seedAngle(seedStr) {
  return Math.floor(rng(seedFrom(seedStr + '·a'))() * 360);
}
