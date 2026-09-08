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
    max-height: 94%; overflow: auto; padding: var(--space-4) var(--space-6) 46px;
    background: var(--paper); border-top: var(--border-w) solid var(--ink);
    box-shadow: 0 -6px 0 rgba(17,16,16,.12);
  }
  /* Revelado circular que crece desde el botón «+» (abajo-centro) hacia arriba. */
  .sheet.enter { animation: pc-sheet-pop 1.15s cubic-bezier(.16,1,.3,1) both; transform-origin: bottom center; }
  @keyframes pc-sheet-pop {
    from { clip-path: circle(0% at 50% 106%); opacity: .95; transform: translateY(34px) scale(.94); }
    to   { clip-path: circle(175% at 50% 106%); opacity: 1; transform: translateY(0) scale(1); }
  }
  /* Cierre: animación inversa (encoge hacia el botón + y se desvanece). */
  .scrim.leaving { animation: pc-fade-out .42s ease both; }
  .scrim.leaving .sheet { animation: pc-sheet-shrink .46s cubic-bezier(.5,0,.75,.3) both; transform-origin: bottom center; }
  @keyframes pc-sheet-shrink {
    from { clip-path: circle(175% at 50% 106%); opacity: 1; transform: translateY(0) scale(1); }
    to   { clip-path: circle(0% at 50% 106%); opacity: .95; transform: translateY(34px) scale(.94); }
  }
  @keyframes pc-fade-out { from { opacity: 1; } to { opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .scrim { animation: none; }
    .sheet.enter { animation: pc-fade .2s ease both; }
  }
  .grabber { width: 44px; height: 4px; background: var(--ink); margin: 0 auto var(--space-6); }
  h3 { margin: 0; font-size: 28px; }
  .subtitle { font-family: var(--font-body); font-size: 12px; margin-top: var(--space-1); color: var(--dim); }

  .field { margin-top: var(--space-4); }
  .field.gap6 { margin-top: var(--space-6); }
  .tail-row { display: flex; align-items: center; gap: var(--space-2); }
  .tail-row .prefix { font-family: var(--font-body); font-size: 13px; color: var(--dim); flex: none; }

  .icons { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .icon-btn {
    width: 44px; height: 44px; display: grid; place-items: center; cursor: pointer;
    background: var(--paper); color: var(--ink); border: var(--border-w) solid var(--ink); border-radius: 0;
  }
  .icon-btn.active { background: var(--ink); color: var(--paper); }

  .colors { display: flex; gap: var(--space-3); }
  .color-btn { width: 36px; height: 36px; cursor: pointer; border: var(--border-w) solid var(--ink); border-radius: 50%; }

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
