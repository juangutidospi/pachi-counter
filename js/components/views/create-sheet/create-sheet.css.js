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
    background: var(--paper); border-top: var(--border-w) solid var(--ink);
    box-shadow: 0 -6px 0 rgba(17,16,16,.12);
  }
  .sheet-scroll { flex: 1; min-height: 0; overflow: auto; padding: var(--space-4) var(--space-6) 46px; }

  /* Aspa de cierre, fija arriba a la derecha (no se va con el scroll). */
  .close {
    position: absolute; top: var(--space-4); right: var(--space-6); z-index: 2;
    width: 34px; height: 34px; display: grid; place-items: center; cursor: pointer;
    background: var(--paper); color: var(--ink);
    border: var(--border-w) solid var(--ink); border-radius: 0;
    transition: background .12s ease, color .12s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .close:hover { background: var(--ink); color: var(--paper); }
  .close:active { transform: scale(.9); }
  .close svg { display: block; }
  /* Revelado circular que crece desde el botón «+» (abajo-centro) hacia arriba. */
  .sheet.enter { animation: pc-sheet-pop .85s cubic-bezier(.16,1,.3,1) both; transform-origin: bottom center; }
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
  .grabber { width: 44px; height: 4px; background: var(--ink); margin: 0 auto var(--space-6); }

  /* — Cabecera con vista previa viva del disco — */
  .head { display: flex; align-items: center; gap: 14px; margin-bottom: var(--space-2); padding-right: 42px; }
  .pv-disc {
    flex: none; width: 62px; height: 62px; display: grid; place-items: center;
    background: var(--acc, var(--blue)); color: var(--on, var(--paper));
    border: var(--border-w) solid var(--ink); box-shadow: 5px 5px 0 var(--ink);
    transition: background .18s ease, color .18s ease;
  }
  .pv-disc svg { width: 30px; height: 30px; }
  .head-txt { min-width: 0; flex: 1; }
  .kicker { display: block; font-family: var(--font-body); font-weight: 700; font-size: 10px;
    letter-spacing: .2em; text-transform: uppercase; color: var(--red); }
  .pv-title { margin: 4px 0 0; font-family: var(--font-display); font-weight: 800; font-size: 24px;
    line-height: .95; text-transform: uppercase; letter-spacing: -.02em; color: var(--ink);
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    overflow-wrap: anywhere; }
  .pv-title.ph { color: var(--dim); }
  .pv-read { margin: 6px 0 0; font-family: var(--font-body); font-size: 11.5px; color: var(--dim);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .field { margin-top: var(--space-4); }
  .field.gap6 { margin-top: var(--space-6); }
  .tail-row { display: flex; align-items: center; gap: var(--space-2); }
  .tail-row .prefix { font-family: var(--font-body); font-size: 13px; color: var(--dim); flex: none; }

  /* — Aspecto: color (swatches) + icono (rejilla) — */
  .look .swatches { display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px; }
  .swatch {
    width: 100%; aspect-ratio: 1 / 1; cursor: pointer; padding: 0;
    border: var(--border-w) solid var(--ink); border-radius: 0;
    transition: box-shadow .12s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .swatch:active { transform: scale(.9); }
  .swatch.active { box-shadow: inset 0 0 0 2px var(--paper), inset 0 0 0 4px var(--ink); }

  .look .icons { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-top: 10px; }
  .icon-btn {
    width: 100%; aspect-ratio: 1 / 1; display: grid; place-items: center; cursor: pointer;
    background: var(--paper); color: var(--ink);
    border: var(--border-w) solid var(--ink); border-radius: 0;
    transition: background .12s ease, color .12s ease, transform .18s cubic-bezier(.34,1.56,.64,1);
  }
  .icon-btn:active { transform: scale(.9); }
  .icon-btn.active { background: var(--acc, var(--ink)); color: var(--on, var(--paper)); }

  .hide { display: none !important; }

  .ago-row { display: flex; align-items: center; gap: var(--space-3); margin-top: var(--space-3); }
  .ago-row .input { width: 92px; }
  .ago-row .suffix { font-family: var(--font-body); font-size: 13px; color: var(--dim); }

  .ms-preview { font-family: var(--font-body); font-size: 11px; color: var(--dim); margin-top: 6px; }
  .ms-custom { margin-top: var(--space-3); }
  .why-optional { color: var(--dim); font-weight: 400; }

  .buttons { display: flex; gap: var(--space-2); margin-top: var(--space-6); }
  .buttons .cancel { flex: none; }
  .buttons .submit { flex: 1; }
`;
