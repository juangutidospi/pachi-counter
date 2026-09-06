import { css } from './css.js';

/**
 * Estilos base compartidos por todos los componentes.
 * Reproducen las primitivas del design system (botones, tarjetas, campos,
 * segmentos, tags, diálogo) para poder reutilizarlas dentro de cada Shadow DOM.
 * Se adoptan como primera hoja en `AppElement.styles`.
 */
export const base = css`
  :host { box-sizing: border-box; }
  *, *::before, *::after { box-sizing: border-box; }

  /* — animaciones compartidas (los @keyframes viven en cada Shadow DOM) — */
  @keyframes pc-ring-in { from { opacity: 0; transform: scale(.3); } to { opacity: 1; transform: scale(1); } }
  @keyframes pc-ring-pulse { 0%, 100% { opacity: .22; } 50% { opacity: .6; } }
  @keyframes pc-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes pc-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pc-sheet { from { transform: translateY(101%); } to { transform: none; } }
  @keyframes pc-dial { from { stroke-dashoffset: 327; } }
  @keyframes pc-conf { from { transform: translateY(-20px) rotate(0deg); opacity: .95; } to { transform: translateY(900px) rotate(340deg); opacity: 0; } }
  @keyframes pc-toast-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

  /* — tipografía — */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading); font-weight: var(--font-heading-weight);
    line-height: 1.12; letter-spacing: -0.015em; margin: 0 0 var(--space-2);
  }
  h1 { font-size: 42px; } h2 { font-size: 32px; } h3 { font-size: 25px; }
  h4 { font-size: 20px; } h5 { font-size: 16px; } h6 { font-size: 13px; }
  h6 { letter-spacing: 0.08em; text-transform: uppercase; }
  p { margin: 0 0 var(--space-3); }
  .text-muted { color: color-mix(in srgb, var(--color-text) 55%, transparent); }
  :focus { outline: none; }
  :focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

  /* — botones — */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; text-decoration: none;
    font-family: var(--font-heading); font-weight: var(--font-heading-weight);
    font-size: 14px; line-height: 1.2; color: var(--color-text);
    background: transparent; border: 1px solid transparent;
    padding: var(--space-2) calc(var(--space-3) * 1.2);
    border-radius: var(--radius-md);
    transition: background .15s ease, box-shadow .2s ease, transform .12s ease;
  }
  .btn svg { display: block; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-primary { color: var(--color-accent); border-color: var(--color-accent); }
  .btn-primary:hover { background: color-mix(in srgb, var(--color-accent) 12%, transparent); }
  .btn-primary:active { background: color-mix(in srgb, var(--color-accent) 22%, transparent); }
  .btn-secondary { border-color: var(--color-divider); }
  .btn-secondary:hover { background: color-mix(in srgb, var(--color-text) 7%, transparent); }
  .btn-secondary:active { background: color-mix(in srgb, var(--color-text) 14%, transparent); }
  .btn-ghost { color: var(--color-accent); padding-inline: var(--space-1); }
  .btn-ghost:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
  .btn-icon { width: 36px; height: 36px; padding: 0; }
  .btn-block { width: 100%; }

  /* — campos — */
  .field > label {
    display: block; font-size: 12px; margin-bottom: 5px;
    color: color-mix(in srgb, var(--color-text) 70%, transparent);
  }
  .input {
    width: 100%; min-height: 36px; padding: 6px 10px; font: inherit;
    font-size: 14px; color: var(--color-text); caret-color: var(--color-accent);
    background: var(--color-surface);
    border: 1px solid var(--color-divider); border-radius: var(--radius-md);
  }
  .input:hover { border-color: color-mix(in srgb, var(--color-text) 45%, transparent); }
  .input:focus-visible { border-color: var(--color-accent); outline-offset: 0; }
  textarea.input { min-height: 90px; resize: vertical; }

  /* — segmentos — */
  .seg {
    display: inline-flex; overflow: hidden;
    border: 1px solid var(--color-divider); border-radius: var(--radius-md);
  }
  .seg-opt {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 7px 12px; font-size: 13px; cursor: pointer; flex: 1;
  }
  .seg-opt + .seg-opt { border-left: 1px solid var(--color-divider); }
  .seg-opt input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
  .seg-opt:has(input:checked) { color: var(--color-accent); box-shadow: inset 0 0 0 1px var(--color-accent); }
  .seg-opt:not(:has(input:checked)):hover { background: color-mix(in srgb, var(--color-text) 7%, transparent); }

  /* — tarjetas — */
  .card {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-3); border-radius: var(--radius-md); background: var(--color-surface);
  }
  .card-title { font-family: var(--font-heading); font-weight: var(--font-heading-weight); font-size: 17px; line-height: 1.2; }
  .elev-sm { box-shadow: var(--shadow-sm); }
  .elev-md { box-shadow: var(--shadow-md); }
  .elev-lg { box-shadow: var(--shadow-lg); }

  /* — tags — */
  .tag {
    display: inline-flex; align-items: center; font-size: 11px;
    letter-spacing: 0.02em; padding: 3px 10px; border-radius: calc(var(--radius-md) * 0.75);
  }
  .tag-neutral { background: var(--color-neutral-800); color: var(--color-neutral-100); }

  /* — diálogo — */
  .dialog-backdrop {
    position: absolute; inset: 0; display: grid; place-items: center;
    padding: var(--space-6);
    background: color-mix(in srgb, var(--color-neutral-900) 62%, transparent);
  }
  .dialog {
    width: min(340px, 100%); display: flex; flex-direction: column; gap: var(--space-3);
    padding: var(--space-4); border-radius: var(--radius-lg);
    background: var(--color-surface); box-shadow: var(--shadow-lg);
  }
  .dialog-title { font-family: var(--font-heading); font-weight: var(--font-heading-weight); font-size: 20px; }
  .dialog-body { font-size: 14px; opacity: 0.85; }
  .dialog-actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-2); }
`;
