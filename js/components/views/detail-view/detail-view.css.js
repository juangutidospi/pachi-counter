import { css } from '../../../core/css.js';

/** Estilos de la vista de detalle — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .detail { padding: 44px 22px 108px; animation: pc-fade .3s ease both; container-type: inline-size; }

  .top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); flex-wrap: wrap; }
  .top .back { gap: 4px; margin-left: -4px; }
  .top .right { display: flex; align-items: center; gap: var(--space-2); }

  /* — disco de vinilo personal — */
  .vinyl-wrap { display: grid; place-items: center; margin-top: var(--space-6); perspective: 900px; }
  .vinyl { position: relative; width: min(264px, 74vw); aspect-ratio: 1;
    touch-action: none; cursor: grab; user-select: none; -webkit-user-select: none;
    transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .18s ease; }
  .vinyl.dragging { cursor: grabbing; transition: none; }
  .vinyl svg { position: absolute; inset: 0; width: 100%; height: 100%; }

  /* Vinilo vivo: brillo especular que sigue al puntero/giroscopio. */
  .vinyl .glint { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; pointer-events: none;
    mix-blend-mode: screen;
    background: radial-gradient(circle at var(--lx, 38%) var(--ly, 30%),
      rgba(255,255,255,.55), rgba(255,255,255,.10) 30%, rgba(255,255,255,0) 55%); }
  @media (prefers-reduced-motion: reduce) {
    .vinyl { transform: none; transition: none; }
  }
  .vinyl .disc { transform-origin: center; will-change: transform; }
  .vinyl .progress { transform: rotate(-90deg); }
  .vinyl .prog-arc { transition: stroke-dashoffset .8s cubic-bezier(.16,1,.3,1);
    animation: pc-arc 1s cubic-bezier(.16,1,.3,1) .1s both; }
  .vinyl .label {
    position: absolute; inset: 0; margin: auto; width: 39%; aspect-ratio: 1; border-radius: 50%;
    display: grid; place-content: center; text-align: center; border: var(--border-w) solid var(--ink);
    box-shadow: 0 0 0 4px var(--paper); view-transition-name: pc-hero;
    animation: pc-hub-pop .6s cubic-bezier(.34,1.56,.64,1) .15s both;
  }
  .vinyl .label .num { font-family: var(--font-display); font-weight: 800; line-height: .8; letter-spacing: -.04em; font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1; }
  .vinyl .label .tail { font-family: var(--font-body); font-weight: 600; font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; margin-top: 5px; opacity: .85; padding: 0 6px; }

  /* brazo de tocadiscos: cae sobre el disco al abrir */
  .vinyl .tonearm { pointer-events: none; }
  .vinyl .tonearm .arm { transform-box: view-box; transform-origin: 236px 30px;
    animation: pc-needle .8s cubic-bezier(.34,1.4,.5,1) .35s both; }
  @keyframes pc-needle { from { transform: rotate(-26deg); } to { transform: rotate(0deg); } }
  @keyframes pc-arc { from { stroke-dashoffset: 100; } }
  @keyframes pc-hub-pop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }

  @media (prefers-reduced-motion: reduce) {
    .vinyl .disc, .vinyl .prog-arc, .vinyl .label, .vinyl .tonearm .arm { animation: none; }
  }

  /* leyenda del modo reproducir + accesos vivos bajo el vinilo */
  .player-cap { min-height: 16px; margin-top: var(--space-3); text-align: center; font-family: var(--font-display); font-weight: 700; font-size: 14px; letter-spacing: -.01em; color: var(--ink); text-transform: uppercase; }
  .live-actions { display: flex; gap: var(--space-2); margin-top: var(--space-3); }
  .live-actions .btn { flex: 1; font-size: 11px; padding: 9px 10px; }

  /* contador manual: +1 / corregir −1 */
  .manual-actions { display: flex; gap: var(--space-2); margin-top: var(--space-4); width: 100%; max-width: 320px; }
  .manual-actions .plus { flex: 1; font-size: 15px; }
  .manual-actions .minus { flex: none; color: var(--dim); }
  .manual-actions .minus:hover { color: var(--paper); background: var(--ink); }

  /* carátula generativa */
  .cover-block { margin-top: var(--space-8); }
  .cover-stage { border: var(--border-w) solid var(--ink); box-shadow: var(--shadow-lg); }
  .cover-stage canvas { display: block; width: 100%; }
  .cover-share { margin-top: var(--space-3); gap: 6px; }

  .danger { margin-top: var(--space-6); padding: var(--space-3) var(--space-4); border: var(--border-w) solid var(--red); background: color-mix(in srgb, var(--red) 8%, transparent); }
  .danger .danger-kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); }
  .danger p { margin: 6px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 16px; line-height: 1.2; color: var(--ink); text-wrap: pretty; text-transform: none; }

  .phrase { margin-top: var(--space-6); padding-left: 14px; border-left: 6px solid var(--red); }
  .phrase .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); }
  .phrase p { margin: 8px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 19px; line-height: 1.25; color: var(--ink); text-wrap: pretty; }

  .stats3 { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: var(--space-6); border: var(--border-w) solid var(--ink); }
  .stat3 { background: transparent !important; border: 0 !important; border-right: var(--border-w) solid var(--ink) !important;
    border-radius: 0; padding: 12px; gap: 4px; }
  .stat3:last-child { border-right: 0 !important; }
  .stat3 { min-width: 0; }
  .stat3 .num { font-family: var(--font-display); font-weight: 800; font-size: min(22px, 7cqw); line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1; white-space: nowrap; }
  .stat3 .lbl { overflow: hidden; text-overflow: ellipsis; }
  .stat3 .lbl { font-family: var(--font-body); font-size: 8.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--dim); font-weight: 600; }

  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin: var(--space-8) 0 var(--space-3); }
  .section-head h6 { margin: 0; color: var(--ink); }
  .section-head .note { font-family: var(--font-body); font-size: 11px; color: var(--dim); }

  .ladder { display: flex; flex-direction: column; }
  .ladder .item { display: flex; align-items: center; gap: var(--space-3); padding: 11px 0; border-bottom: var(--border-w) solid var(--hair); }
  .ladder .item:first-child { border-top: var(--border-w) solid var(--ink); }
  .ladder .dot { flex: none; width: 22px; height: 22px; display: grid; place-items: center; font-size: 11px; font-weight: 700; }
  .ladder .lbl { flex: 1; font-family: var(--font-body); font-weight: 500; font-size: 14px; }
  .ladder .meta { font-family: var(--font-body); font-size: 11px; color: var(--dim); }

  .note-block { margin-top: var(--space-8); }

  .actions-main { margin-top: var(--space-8); }
  .actions-row { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
  .actions-row .reset { flex: 1; }
  .actions-row .remove { flex: none; color: var(--red); }
  .actions-row .remove:hover { color: var(--paper); background: var(--red); }
`;
