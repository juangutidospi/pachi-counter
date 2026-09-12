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

  /* Cuerpo del disco: negro con material (luz arriba-izquierda) + sombra. */
  .vinyl .vinyl-base { position: absolute; inset: 0; border-radius: 50%; z-index: 0;
    background: radial-gradient(circle at 36% 34%, #26221e 0%, #141210 55%, #050505 100%);
    border: var(--border-w) solid var(--ink);
    box-shadow: 0 12px 26px rgba(17,16,16,.34), inset 0 0 34px rgba(0,0,0,.55); }

  /* Vinilo vivo: brillo especular que sigue al puntero/giroscopio. */
  .vinyl .glint { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; pointer-events: none;
    mix-blend-mode: screen;
    background: radial-gradient(circle at var(--lx, 38%) var(--ly, 30%),
      rgba(255,255,255,.55), rgba(255,255,255,.10) 30%, rgba(255,255,255,0) 55%); }
  /* Destello: un barrido de luz cruza el disco al bajar la púa (solo al abrir). */
  .vinyl .flash { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; pointer-events: none;
    z-index: 3; opacity: 0; mix-blend-mode: screen;
    background: linear-gradient(120deg, transparent 36%, rgba(255,255,255,.92) 50%, transparent 64%); }
  .vinyl.flash-on .flash { animation: pc-flash .9s cubic-bezier(.2,.8,.2,1) .9s both; }
  @keyframes pc-flash {
    0% { opacity: 0; transform: translateX(-75%); }
    18% { opacity: .95; }
    100% { opacity: 0; transform: translateX(75%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .vinyl { transform: none; transition: none; }
    .vinyl.flash-on .flash { animation: none; }
  }
  .vinyl .disc { transform-origin: center; will-change: transform; }
  .vinyl .progress { transform: rotate(-90deg); }
  .vinyl .prog-arc { transition: stroke-dashoffset .8s cubic-bezier(.16,1,.3,1);
    animation: pc-arc 1s cubic-bezier(.16,1,.3,1) .1s both; }
  .vinyl .label {
    position: absolute; inset: 0; margin: auto; width: 39%; aspect-ratio: 1; border-radius: 50%;
    display: grid; place-content: center; text-align: center; border: var(--border-w) solid var(--ink);
    box-shadow: 0 0 0 4px var(--paper);
    animation: pc-hub-pop .6s cubic-bezier(.34,1.56,.64,1) .15s both;
  }
  .vinyl .label { isolation: isolate; }
  .vinyl .label::before { content: ""; position: absolute; inset: 0; border-radius: 50%; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse at 42% 26%, rgba(255,255,255,.32), rgba(255,255,255,0) 58%); }
  .vinyl .label .num { position: relative; z-index: 1; font-family: var(--font-display); font-weight: 800; line-height: .9; letter-spacing: -.005em; font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1; }
  .vinyl .label .tail { position: relative; z-index: 1; font-family: var(--font-body); font-weight: 600; font-size: 8.5px; letter-spacing: .1em; text-transform: uppercase; margin-top: 5px; opacity: .85; padding: 0 6px; }

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
  .cover-stage { border: var(--border-w) solid var(--ink); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-lg); }
  .cover-stage canvas { display: block; width: 100%; }
  .cover-share { margin-top: var(--space-3); gap: 6px; }

  .danger { margin-top: var(--space-6); padding: var(--space-3) var(--space-4); border: var(--border-w) solid var(--red); border-radius: var(--radius-sm); background: color-mix(in srgb, var(--red) 8%, transparent); }
  .danger .danger-kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); }
  .danger p { margin: 6px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 16px; line-height: 1.2; color: var(--ink); text-wrap: pretty; text-transform: none; }

  /* Contador de tiempo en vivo — desglose hero (días · h : m : s) */
  .live { margin-top: var(--space-6); text-align: center; }
  .live-kicker { font-family: var(--font-mono); font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: var(--blue); font-weight: 700; }
  .live-grid { display: flex; align-items: stretch; justify-content: center; gap: 8px; margin-top: 10px; }
  .live-grid .clockgrp { display: flex; align-items: center; gap: 8px; }
  .live-grid .clockgrp i { font-family: var(--font-mono); font-weight: 700; font-size: 26px; line-height: 1; color: var(--color-neutral-600); font-style: normal; }
  .live-grid .lseg {
    display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 50px; padding: 0 4px;
  }
  .live-grid .lseg b { font-family: var(--font-mono); font-weight: 700; font-size: 30px; line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }
  .live-grid .lseg.big { padding-inline: 6px; }
  .live-grid .lseg.big b { font-family: var(--font-display); font-weight: 800; font-size: 40px; letter-spacing: -.02em; }
  .live-grid .lseg span { font-family: var(--font-mono); font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); margin-top: 6px; }
  .live-grid .lseg b.pulse { display: inline-block; animation: pc-livepulse .45s cubic-bezier(.34,1.56,.64,1); }
  @keyframes pc-livepulse { 0% { transform: scale(1); } 35% { transform: scale(1.16); color: var(--blue); } 100% { transform: scale(1); } }
  @media (prefers-reduced-motion: reduce) { .live-grid .lseg b.pulse { animation: none; } }

  .phrase { margin-top: var(--space-6); }
  .phrase .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); }
  .phrase p { margin: 8px 0 0; font-family: var(--font-display); font-weight: 700; font-size: 19px; line-height: 1.25; color: var(--ink); text-wrap: pretty; }

  .stats3 { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: var(--space-6); border: var(--border-w) solid var(--ink); border-radius: var(--radius-md); overflow: hidden; }
  .stat3 { background: transparent !important; border: 0 !important; border-right: var(--border-w) solid var(--ink) !important;
    border-radius: 0; padding: 12px; gap: 4px; }
  .stat3:last-child { border-right: 0 !important; }
  .stat3 { min-width: 0; }
  .stat3 .num { font-family: var(--font-display); font-weight: 800; font-size: min(22px, 7cqw); line-height: 1; color: var(--ink); font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1; white-space: nowrap; }
  .stat3 .lbl { overflow: hidden; text-overflow: ellipsis; }
  .stat3 .lbl { font-family: var(--font-body); font-size: 8.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--dim); font-weight: 600; }

  .edit-row { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3);
    margin-top: var(--space-4); padding: 10px var(--space-4); border: var(--border-w) solid var(--ink); border-radius: var(--radius-sm); }
  .edit-row label { font-family: var(--font-body); font-weight: 600; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); }
  .edit-row .input { width: auto; max-width: 170px; min-height: 38px; }

  .section-head { display: flex; align-items: baseline; justify-content: space-between; margin: var(--space-8) 0 var(--space-3); }
  .section-head h6 { margin: 0; color: var(--ink); }
  .section-head .note { font-family: var(--font-body); font-size: 11px; color: var(--dim); }

  .ladder-title { margin: var(--space-8) 0 var(--space-3); color: var(--color-neutral-500); }
  .ladder { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .mtile {
    position: relative; aspect-ratio: 1; border: var(--border-w) solid var(--ink); border-radius: var(--radius-sm); background: var(--paper);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  }
  .mtile .mnum { font-family: var(--font-display); font-weight: 800; font-size: 21px; line-height: 1;
    letter-spacing: -.02em; color: var(--dim); font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1, "zero" 1; }
  .mtile .munit { font-family: var(--font-body); font-weight: 600; font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); }
  .mtile .chk { position: absolute; top: 4px; right: 6px; font-size: 10px; font-weight: 800; }
  .mtile.done .mnum { color: inherit; }
  .mtile.done .munit { color: inherit; opacity: .8; }
  .mtile.next { box-shadow: inset 0 0 0 3px var(--blue); }
  .mtile.next .mnum, .mtile.next .munit { color: var(--blue); }

  .note-block { margin-top: var(--space-8); }

  .actions-main { margin-top: var(--space-8); }
  .actions-row { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
  .actions-row .reset { flex: 1; }
  .actions-row .remove { flex: none; color: var(--red); }
  .actions-row .remove:hover { color: var(--paper); background: var(--red); }
`;
