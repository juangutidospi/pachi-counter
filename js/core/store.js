import { t } from './i18n.js';

/* ── constantes de dominio ────────────────────────────────────────────── */

const KEY = 'pachi.v1';
const DAY = 86400000;

/** Hitos por defecto (en días) de una racha nueva. */
export const DEF_MILESTONES = [1, 3, 7, 21, 30, 90, 180, 365];

/**
 * Acentos elegibles para un contador. `value` referencia un token del tema,
 * por lo que el color se adapta a claro/oscuro sin tocar el store.
 */
export const COUNTER_COLORS = {
  accent: { key: 'accent', value: 'var(--blue)', on: 'var(--paper)' },
  accent2: { key: 'accent2', value: 'var(--red)', on: 'var(--paper)' },
  light: { key: 'light', value: 'var(--yellow)', on: 'var(--ink)' },
  green: { key: 'green', value: 'var(--green)', on: 'var(--paper)' },
  teal: { key: 'teal', value: 'var(--teal)', on: 'var(--paper)' },
  violet: { key: 'violet', value: 'var(--violet)', on: 'var(--paper)' },
  magenta: { key: 'magenta', value: 'var(--magenta)', on: 'var(--paper)' },
  orange: { key: 'orange', value: 'var(--orange)', on: 'var(--ink)' },
  deep: { key: 'deep', value: 'var(--ink)', on: 'var(--paper)' },
};

/** Datos de ejemplo para la primera ejecución (y para el botón demo). */
const SEED = [
  { id: 'c1', name: "Sin fumar", tail: 'sin fumar', kind: 'quit', icon: 'ban', color: 'accent', ago: 3, best: 9, milestones: DEF_MILESTONES, note: 'Para poder subir las escaleras de casa sin pararme en el tercero.' },
  { id: 'c2', name: 'Saliendo a caminar', tail: 'saliendo a caminar', kind: 'build', icon: 'bolt', color: 'accent2', ago: 12, best: 12, milestones: DEF_MILESTONES, note: '' },
  { id: 'c3', name: 'Sin refrescos', tail: 'sin refrescos', kind: 'quit', icon: 'drop', color: 'deep', ago: 27, best: 27, milestones: DEF_MILESTONES, note: '' },
];

/* ── utilidades de fecha (día natural LOCAL, estable ante cambios de hora) ─
   La fecha se toma en hora local (el contador cambia a tu medianoche, no a la
   UTC) y el índice de día se calcula con Date.UTC sobre esos componentes de
   calendario: así cada fecha natural tiene un entero fijo, inmune a DST. */

/**
 * Fecha ISO `YYYY-MM-DD` del instante dado, en hora LOCAL.
 * @param {number} ms Milisegundos epoch.
 * @returns {string} Fecha ISO local.
 */
export function isoOf(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Índice de día absoluto (entero) de una fecha de calendario.
 * @param {string} iso Fecha ISO `YYYY-MM-DD`.
 * @returns {number} Días desde epoch para esa fecha natural.
 */
export function dayIndex(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY);
}

/**
 * Fecha ISO `YYYY-MM-DD` correspondiente a un índice de día (inverso de dayIndex).
 * @param {number} index Índice de día absoluto.
 * @returns {string} Fecha ISO.
 */
export function isoFromDayIndex(index) {
  const d = new Date(index * DAY);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Formatea una fecha ISO como «12 sep» con los meses del idioma activo.
 * @param {string} iso Fecha ISO.
 * @returns {string} Etiqueta corta día + mes.
 */
export function fmtDate(iso) {
  const [, m, d] = iso.split('-').map(Number);
  const months = t('months').split(',');
  return d + ' ' + months[m - 1];
}

/* ── store ────────────────────────────────────────────────────────────── */

const bus = new EventTarget();

/** @type {{counters: object[], tone: string, reminder: string, offset: number}} */
let state = load();

/**
 * Carga el estado desde localStorage; si no hay nada, siembra los ejemplos.
 * @returns {{counters: object[], tone: string, reminder: string, offset: number}}
 */
function load() {
  const today = dayIndex(isoOf(Date.now()));
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.counters)) {
        return {
          counters: data.counters.map((c) => normalize(c, today)),
          pressings: Array.isArray(data.pressings) ? data.pressings : [],
          tone: (data.settings && data.settings.tone) || 'direct',
          reminder: (data.settings && data.settings.reminder) || '21:00',
          sound: !!(data.settings && data.settings.sound),
          offset: 0,
        };
      }
    }
  } catch (e) { /* almacenamiento no disponible o corrupto */ }
  // Primer arranque: sin datos de ejemplo, el usuario empieza vacío y añade
  // los suyos. Los ejemplos quedan disponibles vía restoreSeed() (panel demo).
  return { counters: [], pressings: [], tone: 'direct', reminder: '21:00', sound: false, offset: 0 };
}

/** @returns {object[]} Copia de los contadores de ejemplo anclados a hoy. */
function seedCounters() {
  const now = Date.now();
  return SEED.map((s) => normalize({ ...s, start: isoOf(now - s.ago * DAY) }, dayIndex(isoOf(now))));
}

/**
 * Rellena campos derivados/ausentes de un contador (compatibilidad de datos).
 * @param {object} c Contador crudo.
 * @param {number} today Índice de día de hoy.
 * @returns {object} Contador normalizado.
 */
function normalize(c, today) {
  const start = c.start || isoOf(Date.now() - (c.ago || 0) * DAY);
  const milestones = c.milestones && c.milestones.length ? c.milestones : DEF_MILESTONES;
  // Modo: 'auto' (días derivados de la fecha) o 'manual' (cuenta incrementable).
  const mode = c.mode === 'manual' ? 'manual' : 'auto';
  const count = Math.max(0, c.count || 0);
  const days = mode === 'manual' ? count : Math.max(0, today - dayIndex(start));
  return {
    id: c.id, name: c.name, tail: c.tail || c.name.toLowerCase(), kind: c.kind || 'quit',
    icon: c.icon || 'bolt', color: COUNTER_COLORS[c.color] ? c.color : 'accent',
    mode, count, start, best: c.best || 0, milestones, note: c.note || '',
    seen: c.seen == null ? (milestones.filter((m) => m <= days).pop() || 0) : c.seen,
    seenDay: c.seenDay == null ? today : c.seenDay,
  };
}

/** Guarda el estado de dominio en localStorage. */
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      v: 1,
      settings: { tone: state.tone, reminder: state.reminder, sound: state.sound },
      counters: state.counters,
      pressings: state.pressings,
    }));
  } catch (e) { /* ignorar: modo privado, cuota… */ }
}

/**
 * Aplica un parche al estado, persiste y notifica a los suscriptores.
 * @param {Partial<typeof state>} patch Campos a mezclar.
 * @param {boolean} [save] Si debe persistir (por defecto sí).
 */
function commit(patch, save = true) {
  state = { ...state, ...patch };
  if (save) persist();
  bus.dispatchEvent(new CustomEvent('store:changed'));
}

/**
 * Aplica un parche y persiste SIN notificar a los suscriptores. Para ajustes
 * que no requieren refrescar la vista al instante (tono, recordatorio, sonido):
 * evita que el shell repinte y reinicie las tabs mientras se interactúa; el
 * valor nuevo se relee al navegar.
 * @param {Partial<typeof state>} patch Campos a mezclar.
 */
function commitSilent(patch) {
  state = { ...state, ...patch };
  persist();
}

export const store = {
  /* — lectura — */

  /** @returns {object[]} Contadores actuales (referencia de solo lectura). */
  get counters() { return state.counters; },
  /** @returns {string} Tono de las frases (`warm`|`direct`|`sober`). */
  get tone() { return state.tone; },
  /** @returns {string} Hora del recordatorio diario (`HH:MM`). */
  get reminder() { return state.reminder; },
  /** @returns {boolean} Si los sonidos están activados. */
  get sound() { return state.sound; },
  /** @returns {number} Desplazamiento de días del modo demo. */
  get offset() { return state.offset; },

  /**
   * Busca un contador por id.
   * @param {string} id Identificador.
   * @returns {object|undefined} Contador o undefined.
   */
  find(id) { return state.counters.find((c) => c.id === id); },

  /** @returns {number} Índice de día de «hoy» (aplicando el offset de demo). */
  today() { return dayIndex(isoOf(Date.now())) + state.offset; },

  /**
   * Días transcurridos de la racha de un contador.
   * @param {object} c Contador.
   * @returns {number} Días (>= 0).
   */
  daysOf(c) { return c.mode === 'manual' ? Math.max(0, c.count || 0) : Math.max(0, this.today() - dayIndex(c.start)); },

  /**
   * Escalera de hitos ordenada de un contador.
   * @param {object} c Contador.
   * @returns {number[]} Hitos ascendentes.
   */
  ladderOf(c) { return (c.milestones && c.milestones.length ? c.milestones : DEF_MILESTONES).slice().sort((a, b) => a - b); },

  /**
   * Próximo hito por alcanzar de un contador.
   * @param {object} c Contador.
   * @returns {number|null} Hito o null si ya superó todos.
   */
  nextOf(c) { const d = this.daysOf(c); return this.ladderOf(c).find((m) => m > d) || null; },

  /**
   * Frase motivadora + antetítulo según la situación y el tono actual.
   * @param {object} c Contador.
   * @returns {{kicker: string, text: string}} Antetítulo y frase.
   */
  quote(c) {
    const d = this.daysOf(c);
    const next = this.nextOf(c);
    const tone = state.tone;
    const tail = c.tail;
    const ladder = this.ladderOf(c);
    if (d > 0 && ladder.includes(d)) {
      return { kicker: t('phrase.k.milestone'), text: t(`phrase.milestone.${tone}`, { d, tail }) };
    }
    if (d === 0) {
      return { kicker: t('phrase.k.day0'), text: t(`phrase.day0.${tone}`) };
    }
    if (!next) {
      return { kicker: t('phrase.k.none'), text: t(`phrase.none.${tone}`, { d, tail }) };
    }
    const r = next - d;
    if (r === 1) return { kicker: t('phrase.k.tomorrow'), text: t(`phrase.tomorrow.${tone}`, { next, tail }) };
    if (r <= 5) return { kicker: t('phrase.k.soon'), text: t(`phrase.soon.${tone}`, { r, next, tail }) };
    return { kicker: t('phrase.k.next'), text: t(`phrase.next.${tone}`, { d, r, next, tail }) };
  },

  /**
   * Contadores ordenados por hito más cercano (para home).
   * @returns {object[]} Contadores ordenados.
   */
  sortedByNearest() {
    return state.counters.slice().sort((a, b) => this._gap(a) - this._gap(b));
  },

  /** @returns {object|null} Contador con el hito más cercano, o null. */
  focusCounter() {
    return state.counters.length ? this.sortedByNearest()[0] : null;
  },

  /**
   * «Columna» editorial del día: elige el titular más relevante según el estado
   * (hito inminente, récord personal en marcha o total acumulado) y una línea
   * de datos. Extiende la metáfora de publicación.
   * @returns {{kicker:string, headline:string, sub:string}|null}
   */
  insight() {
    const counters = state.counters;
    if (!counters.length) return null;
    const totalDays = counters.reduce((sum, c) => sum + this.daysOf(c), 0);
    const maxBest = Math.max(...counters.map((c) => Math.max(c.best || 0, this.daysOf(c))));

    let near = null;
    let nearGap = Infinity;
    counters.forEach((c) => {
      const n = this.nextOf(c);
      if (n) { const g = n - this.daysOf(c); if (g < nearGap) { nearGap = g; near = { c, n, g }; } }
    });
    const record = counters.find((c) => this.daysOf(c) > 0 && this.daysOf(c) >= (c.best || 0));
    const danger = this.dangerCounter();

    let headline;
    if (danger) headline = t('insight.danger', { name: danger.name });
    else if (near && near.g > 0 && near.g <= 2) headline = t('insight.nearMilestone', { name: near.c.name, n: near.n });
    else if (record) headline = t('insight.record', { name: record.name });
    else headline = t('insight.total', { n: totalDays });

    return {
      kicker: t('home.column.kicker'),
      headline,
      sub: t('insight.sub', { streaks: counters.length, best: maxBest }),
    };
  },

  /** @param {object} c Contador. @returns {number} Días hasta el próximo hito (o alto). */
  _gap(c) { const n = this.nextOf(c); return n ? n - this.daysOf(c) : 9999; },

  /* — escritura — */

  /**
   * Marca un contador como visto hoy (quita el badge «+1 hoy»).
   * @param {string} id Identificador.
   */
  markSeen(id) {
    commit({ counters: state.counters.map((c) => (c.id === id ? { ...c, seenDay: this.today() } : c)) });
  },

  /**
   * Guarda que se han visto los hitos hasta cierto día (tras celebrar).
   * @param {string} id Identificador.
   * @param {number} days Días vistos.
   */
  markCelebrated(id, days) {
    commit({ counters: state.counters.map((c) => (c.id === id ? { ...c, seen: days } : c)) });
  },

  /**
   * Actualiza la nota («por qué lo hago») de un contador.
   * @param {string} id Identificador.
   * @param {string} note Texto de la nota.
   */
  setNote(id, note) {
    commit({ counters: state.counters.map((c) => (c.id === id ? { ...c, note } : c)) });
  },

  /**
   * Cambia la fecha de inicio de un contador automático (recalcula los días).
   * No permite fechas futuras (se limita a hoy). Reajusta el hito visto.
   * @param {string} id Identificador.
   * @param {string} iso Fecha `YYYY-MM-DD`.
   */
  setStart(id, iso) {
    if (!iso) return;
    const today = this.today();
    const start = dayIndex(iso) > today ? isoFromDayIndex(today) : iso;
    commit({ counters: state.counters.map((c) => {
      if (c.id !== id || c.mode === 'manual') return c;
      const days = Math.max(0, today - dayIndex(start));
      const ms = c.milestones && c.milestones.length ? c.milestones : DEF_MILESTONES;
      return { ...c, start, best: Math.max(c.best || 0, days), seen: ms.filter((m) => m <= days).pop() || 0, seenDay: today };
    }) });
  },

  /**
   * Fija la cuenta de un contador manual (para correcciones grandes).
   * @param {string} id Identificador.
   * @param {number} n Nueva cuenta (>= 0).
   */
  setCount(id, n) {
    const count = Math.max(0, Math.floor(n) || 0);
    commit({ counters: state.counters.map((c) => {
      if (c.id !== id || c.mode !== 'manual') return c;
      const ms = c.milestones && c.milestones.length ? c.milestones : DEF_MILESTONES;
      return { ...c, count, best: Math.max(c.best || 0, count), seen: ms.filter((m) => m <= count).pop() || 0, seenDay: this.today() };
    }) });
  },

  /**
   * Reinicia la racha de un contador a 0, guardando la mejor racha.
   * @param {string} id Identificador.
   * @returns {number} Mejor racha resultante.
   */
  reset(id) {
    let best = 0;
    const pressing = this._press(this.find(id));
    const counters = state.counters.map((c) => {
      if (c.id !== id) return c;
      best = Math.max(c.best || 0, this.daysOf(c));
      return { ...c, best, count: 0, start: isoFromDayIndex(this.today()), seen: 0, seenDay: this.today() };
    });
    commit({ counters, pressings: pressing ? [...state.pressings, pressing] : state.pressings });
    return best;
  },

  /**
   * Elimina un contador (archivando su racha actual como disco prensado).
   * @param {string} id Identificador.
   */
  remove(id) {
    const pressing = this._press(this.find(id));
    commit({
      counters: state.counters.filter((c) => c.id !== id),
      pressings: pressing ? [...state.pressings, pressing] : state.pressings,
    });
  },

  /**
   * Construye un «disco prensado» (registro histórico) de la racha actual.
   * @param {object} c Contador.
   * @returns {object|null} Prensado, o null si la racha es 0.
   */
  _press(c) {
    if (!c) return null;
    const days = this.daysOf(c);
    if (days <= 0) return null;
    return {
      id: 'p' + Date.now() + Math.floor(this.today()),
      name: c.name, tail: c.tail, kind: c.kind, color: c.color,
      days, start: c.start, end: isoFromDayIndex(this.today()),
    };
  },

  /** @returns {object[]} Discos prensados, del más reciente al más antiguo. */
  get pressings() { return state.pressings.slice().reverse(); },

  /**
   * Historial de recaídas de un contador (a partir de discos prensados con el
   * mismo nombre): en qué días caíste antes y si HOY es uno de esos «días peligro».
   * @param {object} c Contador.
   * @returns {{days:number[], dangerToday:boolean, times:number, next:number|null, worst:number}}
   */
  relapseHistory(c) {
    const key = (s) => String(s || '').trim().toLowerCase();
    const past = state.pressings.filter((p) => key(p.name) === key(c.name)).map((p) => p.days).filter((d) => d > 0);
    const d = this.daysOf(c);
    const times = past.filter((x) => x === d).length;
    const ahead = past.filter((x) => x > d);
    return {
      days: past,
      dangerToday: d > 0 && times > 0,
      times,
      next: ahead.length ? Math.min(...ahead) : null,
      worst: past.length ? Math.max(...past) : 0,
    };
  },

  /**
   * Primer contador cuyo día actual coincide con un «día peligro» histórico.
   * @returns {object|null} Contador en día peligro, o null.
   */
  dangerCounter() {
    return state.counters.find((c) => this.relapseHistory(c).dangerToday) || null;
  },

  /**
   * Crea un contador y devuelve su id.
   * @param {object} draft Datos del formulario ya validados.
   * @param {string} draft.name Nombre.
   * @param {string} draft.tail Cola de lectura.
   * @param {'quit'|'build'} draft.kind Tipo.
   * @param {string} draft.icon Clave de icono.
   * @param {string} draft.color Clave de color.
   * @param {number} draft.ago Días ya cumplidos.
   * @param {number[]} draft.milestones Hitos.
   * @param {string} draft.note Nota.
   * @returns {string} Id del contador creado.
   */
  create(draft) {
    const id = 'c' + Date.now();
    const mode = draft.mode === 'manual' ? 'manual' : 'auto';
    const initial = Math.max(0, draft.ago || 0);
    // Manual: la cuenta arranca en `initial` y la fecha es hoy (solo referencia).
    // Auto: la fecha de inicio se retrasa `initial` días.
    const start = mode === 'manual' ? isoFromDayIndex(this.today()) : isoFromDayIndex(this.today() - initial);
    const counter = {
      id, name: draft.name, tail: draft.tail || draft.name.toLowerCase(), kind: draft.kind,
      icon: draft.icon, color: draft.color, mode, count: mode === 'manual' ? initial : 0,
      start, best: initial, milestones: draft.milestones, note: draft.note,
      seen: draft.milestones.filter((m) => m <= initial).pop() || 0, seenDay: this.today(),
    };
    commit({ counters: state.counters.concat([counter]) });
    return id;
  },

  /**
   * Incrementa en 1 la cuenta de un contador manual.
   * @param {string} id Identificador.
   */
  increment(id) {
    commit({ counters: state.counters.map((c) => {
      if (c.id !== id || c.mode !== 'manual') return c;
      const count = (c.count || 0) + 1;
      return { ...c, count, best: Math.max(c.best || 0, count) };
    }) });
  },

  /**
   * Corrige (resta 1) la cuenta de un contador manual, sin bajar de 0.
   * @param {string} id Identificador.
   */
  decrement(id) {
    commit({ counters: state.counters.map((c) => (
      c.id === id && c.mode === 'manual' ? { ...c, count: Math.max(0, (c.count || 0) - 1) } : c
    )) });
  },

  /** @param {string} tone Nuevo tono de frases. */
  setTone(tone) { commitSilent({ tone }); },
  /** @param {string} reminder Hora `HH:MM` del recordatorio. */
  setReminder(reminder) { commitSilent({ reminder }); },
  /** @param {boolean} on Activa o desactiva los sonidos. */
  setSound(on) { commitSilent({ sound: !!on }); },

  /** Borra todos los datos (contadores y colección). */
  wipe() { commit({ counters: [], pressings: [] }); },

  /** Restaura los contadores de ejemplo. */
  restoreSeed() { commit({ counters: seedCounters() }); },

  /** @returns {number} Tamaño aproximado en bytes del estado persistido. */
  storeSize() { return JSON.stringify({ v: 1, counters: state.counters }).length; },

  /** @returns {string} JSON exportable del estado (contadores, colección y ajustes). */
  exportJson() {
    return JSON.stringify({
      v: 1,
      settings: { tone: state.tone, reminder: state.reminder, sound: state.sound },
      counters: state.counters,
      pressings: state.pressings,
    }, null, 2);
  },

  /**
   * Carga datos desde un JSON exportado previamente (reemplaza el estado).
   * @param {string} text JSON con `counters` (y opcionalmente `pressings`/`settings`).
   * @returns {{ok:boolean, count?:number, error?:string}} Resultado.
   */
  importJson(text) {
    let data;
    try { data = JSON.parse(text); } catch (e) { return { ok: false, error: 'parse' }; }
    if (!data || !Array.isArray(data.counters)) return { ok: false, error: 'shape' };
    const today = this.today();
    const counters = data.counters
      .filter((c) => c && c.name)
      .map((c, i) => normalize({ ...c, id: c.id || ('c' + Date.now() + '_' + i) }, today));
    const pressings = Array.isArray(data.pressings) ? data.pressings : [];
    const s = data.settings || {};
    commit({
      counters, pressings,
      tone: s.tone || state.tone,
      reminder: s.reminder || state.reminder,
      sound: s.sound != null ? !!s.sound : state.sound,
    });
    return { ok: true, count: counters.length };
  },

  /* — demo (viaje en el tiempo, no se persiste) — */

  /** @param {number} delta Días a sumar al offset. */
  travel(delta) { commit({ offset: state.offset + delta }, false); },

  /**
   * Fuerza a los componentes a recalcular los días (sin cambiar ni persistir
   * nada). Se usa al cruzar la medianoche o al volver a la app, ya que los días
   * se derivan de la fecha actual en cada render.
   */
  tickDay() { bus.dispatchEvent(new CustomEvent('store:changed')); },

  /**
   * Detecta si algún contador acaba de alcanzar un hito no celebrado.
   * @returns {object|null} `{id, days, tail, color, next}` o null.
   */
  pendingCelebration() {
    const hit = state.counters.find((c) => {
      const d = this.daysOf(c);
      return d > 0 && this.ladderOf(c).includes(d) && (c.seen || 0) < d;
    });
    if (!hit) return null;
    const d = this.daysOf(hit);
    return {
      id: hit.id, days: d, tail: hit.tail,
      color: (COUNTER_COLORS[hit.color] || COUNTER_COLORS.accent).value,
      next: this.ladderOf(hit).find((m) => m > d) || null,
    };
  },

  /* — suscripción — */

  /**
   * Suscribe un callback a cualquier cambio de estado.
   * @param {() => void} handler Se ejecuta tras cada cambio.
   * @returns {() => void} Función para cancelar la suscripción.
   */
  subscribe(handler) {
    bus.addEventListener('store:changed', handler);
    return () => bus.removeEventListener('store:changed', handler);
  },
};
