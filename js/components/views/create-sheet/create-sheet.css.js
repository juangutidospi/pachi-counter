import { css } from '../../../core/css.js';

/** Estilos de la hoja modal de creación de contador — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .scrim {
    position: absolute; inset: 0; z-index: 70; display: flex; flex-direction: column; justify-content: flex-end;
    background: color-mix(in srgb, var(--ink) 40%, transparent);
    animation: pc-fade .35s ease both;
  }
  .sheet {
    position: relative; display: flex; flex-direction: column;
    max-height: 94%; overflow: hidden;
    background: var(--paper); border: var(--border-w) solid var(--ink); border-bottom: 0;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -8px 24px rgba(17,16,16,.16);
  }
  .sheet-scroll { flex: 1; min-height: 0; overflow: auto; padding: var(--space-4) var(--space-6) 46px; }

  /* Aspa de cierre, fija arriba a la derecha (no se va con el scroll). */
  .close {
    position: absolute; top: 14px; right: var(--space-6); z-index: 6;
    width: 38px; height: 38px; display: grid; place-items: center; cursor: pointer;
    background: var(--paper); color: var(--ink);
    border: var(--border-w) solid var(--ink); border-radius: 50%;
    box-shadow: 0 2px 7px rgba(17,16,16,.22);
    transition: background .12s ease, color .12s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .close:hover { background: var(--ink); color: var(--paper); }
  .close:active { transform: scale(.88); }
  .close svg { display: block; }
  /* Revelado circular que crece desde el botón «+» (abajo-centro) hacia arriba. */
  .sheet.enter { animation: pc-sheet-pop 1.2s cubic-bezier(.16,1,.3,1) both; transform-origin: bottom center; }
  @keyframes pc-sheet-pop {
    from { clip-path: circle(0% at 50% 106%); opacity: .95; transform: translateY(30px) scale(.95); }
    to   { clip-path: circle(175% at 50% 106%); opacity: 1; transform: translateY(0) scale(1); }
  }
  /* Cierre: animación inversa (encoge hacia el botón + y se desvanece). */
  .scrim.leaving { animation: pc-fade-out .5s ease both; }
  .scrim.leaving .sheet { animation: pc-sheet-shrink .5s cubic-bezier(.5,0,.85,.35) both; transform-origin: bottom center; }
  @keyframes pc-sheet-shrink {
    from { clip-path: circle(175% at 50% 106%); opacity: 1; transform: translateY(0) scale(1); }
    70%  { opacity: 1; }
    to   { clip-path: circle(0% at 50% 106%); opacity: .6; transform: translateY(30px) scale(.95); }
  }
  @keyframes pc-fade-out { from { opacity: 1; } to { opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .scrim { animation: none; }
    .sheet.enter { animation: pc-fade .2s ease both; }
  }
  .grabber { position: absolute; top: 9px; left: 50%; transform: translateX(-50%); width: 44px; height: 4px;
    border-radius: 2px; background: color-mix(in srgb, var(--ink) 45%, transparent); }

  /* — Hero: franja con tinte del color elegido + disco esmaltado — */
  .head {
    position: relative; display: flex; align-items: center; gap: 15px;
    margin: calc(-1 * var(--space-4)) calc(-1 * var(--space-6)) var(--space-6);
    padding: 28px 48px 18px var(--space-6);
    background: linear-gradient(180deg, color-mix(in srgb, var(--acc, var(--blue)) 16%, var(--paper)) 0%, var(--paper) 100%);
    border-bottom: var(--border-w) solid var(--ink);
  }
  .pv-disc {
    flex: none; width: 66px; height: 66px; display: grid; place-items: center;
    background: var(--acc, var(--blue)); color: var(--on, var(--paper));
    border: var(--border-w) solid var(--ink); border-radius: var(--radius-sm);
    box-shadow: inset 0 3px 0 rgba(255,255,255,.28), inset 0 -8px 14px rgba(0,0,0,.24), 5px 5px 0 var(--ink);
    transition: background .18s ease, color .18s ease;
  }
  .pv-disc svg { width: 31px; height: 31px; }
  .head-txt { min-width: 0; flex: 1; }
  .kicker { display: inline-block; background: var(--red); color: var(--paper); padding: 2px 7px;
    font-family: var(--font-body); font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase; }
  .pv-title { margin: 7px 0 0; font-family: var(--font-display); font-weight: 800; font-size: 24px;
    line-height: .95; text-transform: uppercase; letter-spacing: -.02em; color: var(--ink);
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    overflow-wrap: anywhere; }
  .pv-title.ph { color: var(--dim); }
  .pv-read { margin: 6px 0 0; font-family: var(--font-body); font-size: 11.5px; color: var(--dim);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .field { margin-top: var(--space-4); }
  .field.gap6 { margin-top: var(--space-6); }

  /* «0 días · …» como un único control con segmento prefijo. */
  .tail-row {
    display: flex; align-items: stretch; overflow: hidden; border-radius: var(--radius-sm);
    border: var(--border-w) solid var(--ink);
    background: linear-gradient(180deg, color-mix(in srgb, var(--ink) 7%, var(--paper)) 0%, var(--paper) 62%);
    box-shadow: inset 0 2px 4px rgba(17,16,16,.12);
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .tail-row .prefix {
    display: flex; align-items: center; flex: none; padding: 0 13px;
    background: color-mix(in srgb, var(--ink) 9%, transparent); border-right: var(--border-w) solid var(--ink);
    font-family: var(--font-body); font-weight: 700; font-size: 12px; letter-spacing: .04em; color: var(--dim); white-space: nowrap;
  }
  .tail-row .input { flex: 1; min-width: 0; min-height: 48px; border: 0; background: transparent; box-shadow: none; border-radius: 0; }
  .tail-row .input:focus, .tail-row .input:focus-visible { border: 0; box-shadow: none; }
  .tail-row:focus-within { border-color: var(--blue);
    box-shadow: inset 0 2px 4px rgba(17,16,16,.06), 0 0 0 3px color-mix(in srgb, var(--blue) 22%, transparent); }

  /* — Aspecto: color + icono como fichas redondas (menos bloque, más compacto) — */
  .look .swatches { display: flex; flex-wrap: wrap; gap: 9px; }
  .swatch {
    flex: none; width: 30px; height: 30px; cursor: pointer; padding: 0;
    border: var(--border-w) solid var(--ink); border-radius: 50%;
    box-shadow: inset 0 2px 0 rgba(255,255,255,.35), inset 0 -3px 6px rgba(0,0,0,.20);
    transition: transform .16s cubic-bezier(.34,1.56,.64,1), box-shadow .14s ease;
  }
  .swatch:hover { transform: translateY(-2px); }
  .swatch:active { transform: scale(.9); }
  .swatch.active { transform: translateY(-2px);
    box-shadow: inset 0 2px 0 rgba(255,255,255,.35), 0 0 0 2px var(--paper), 0 0 0 4px var(--ink), 2px 3px 0 rgba(17,16,16,.28); }

  .look .icons { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-top: 12px; }
  .icon-btn {
    width: 100%; aspect-ratio: 1 / 1; display: grid; place-items: center; cursor: pointer;
    color: var(--ink); border: var(--border-w) solid var(--ink); border-radius: 50%;
    background: linear-gradient(180deg, var(--paper) 0%, var(--paper-2) 100%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.55), inset 0 -2px 5px rgba(17,16,16,.06);
    transition: transform .16s cubic-bezier(.34,1.56,.64,1), box-shadow .14s ease, background .12s ease, color .12s ease;
  }
  .icon-btn:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 rgba(255,255,255,.55), 2px 3px 0 rgba(17,16,16,.18); }
  .icon-btn:active { transform: scale(.9); }
  .icon-btn.active {
    color: var(--on, var(--paper)); border-color: var(--ink); transform: translateY(-2px);
    background: var(--acc, var(--ink));
    box-shadow: inset 0 2px 0 rgba(255,255,255,.24), inset 0 -4px 9px rgba(0,0,0,.22), 2px 3px 0 rgba(17,16,16,.28);
  }

  .hide { display: none !important; }

  .ago-row { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-3); }
  .ago-row .input { width: 92px; }
  .ago-row .suffix { font-family: var(--font-body); font-size: 13px; color: var(--dim); }

  .mode-hint { font-family: var(--font-body); font-size: 11px; color: var(--dim); margin: 6px 0 0; text-wrap: pretty; }
  .ms-preview { font-family: var(--font-body); font-size: 11px; color: var(--dim); margin-top: 6px; }
  .ms-custom { margin-top: var(--space-3); }
  .why-optional { color: var(--dim); font-weight: 400; }

  .buttons { display: flex; gap: var(--space-2); margin-top: var(--space-6); }
  .buttons .cancel { flex: none; }
  .buttons .submit { flex: 1; }
`;
