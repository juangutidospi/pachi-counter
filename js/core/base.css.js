import { css } from './css.js';

/**
 * Estilos base compartidos por todos los componentes — lenguaje Bauhaus.
 * Filos de tinta, geometría dura, Syne en mayúsculas para acciones, colores
 * primarios planos. Se adoptan como primera hoja en `AppElement.styles`.
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
  @keyframes pc-wipe { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes pc-drop { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: none; } }

  /* — tipografía — */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading); font-weight: var(--font-heading-weight);
    line-height: .96; letter-spacing: -.03em; margin: 0 0 var(--space-2); text-transform: uppercase;
  }
  h1 { font-size: 46px; } h2 { font-size: 34px; } h3 { font-size: 26px; }
  h4 { font-size: 21px; } h5 { font-size: 17px; } h6 { font-size: 12px; letter-spacing: .1em; }
  p { margin: 0 0 var(--space-3); }
  .text-muted { color: var(--dim); }
  :focus { outline: none; }
  :focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; }

  /* — botones — */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    cursor: pointer; text-decoration: none;
    font-family: var(--font-heading); font-weight: 700;
    font-size: 13px; line-height: 1; color: var(--ink); text-transform: uppercase; letter-spacing: .02em;
    background: transparent; border: var(--border-w) solid transparent;
    padding: 10px 16px; border-radius: 0;
    transition: background .12s ease, color .12s ease, transform .22s cubic-bezier(.34,1.56,.64,1);
  }
  .btn svg { display: block; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn:active:not(:disabled) { transform: scale(.94); }
  .btn-primary { background: var(--blue); color: var(--paper); border-color: var(--blue); }
  .btn-primary:hover { background: var(--ink); border-color: var(--ink); }
  .btn-secondary { border-color: var(--ink); color: var(--ink); }
  .btn-secondary:hover { background: var(--ink); color: var(--paper); }
  .btn-ghost { color: var(--ink); border-color: transparent; padding-inline: 4px; }
  .btn-ghost:hover { color: var(--blue); }
  .btn-icon { width: 38px; height: 38px; padding: 0; }
  .btn-block { width: 100%; }

  /* — campos — */
  .field > label {
    display: block; font-family: var(--font-body); font-weight: 600; font-size: 11px;
    letter-spacing: .1em; text-transform: uppercase; margin-bottom: 6px; color: var(--ink);
  }
  .input {
    width: 100%; min-height: 46px; padding: 12px 14px; font: inherit;
    font-size: 15px; color: var(--ink); caret-color: var(--blue); border-radius: 3px;
    background: linear-gradient(180deg, color-mix(in srgb, var(--ink) 7%, var(--paper)) 0%, var(--paper) 62%);
    border: var(--border-w) solid var(--ink);
    box-shadow: inset 0 2px 4px rgba(17, 16, 16, 0.12);
    transition: box-shadow .15s ease, border-color .15s ease;
  }
  .input::placeholder { color: color-mix(in srgb, var(--ink) 42%, transparent); }
  .input:focus-visible, .input:focus {
    border-color: var(--blue); outline: none;
    box-shadow: inset 0 2px 4px rgba(17, 16, 16, 0.06), 0 0 0 3px color-mix(in srgb, var(--blue) 22%, transparent);
  }
  textarea.input { min-height: 88px; resize: vertical; }

  /* — segmentos — */
  .seg {
    display: inline-flex; overflow: hidden;
    border: var(--border-w) solid var(--ink); border-radius: 0;
  }
  .seg-opt {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 10px 12px; font-family: var(--font-heading); font-weight: 700; font-size: 12px;
    text-transform: uppercase; letter-spacing: .02em; cursor: pointer; flex: 1; color: var(--ink);
    transition: background .12s ease, color .12s ease;
  }
  .seg-opt + .seg-opt { border-left: var(--border-w) solid var(--ink); }
  .seg-opt input { position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none; }
  .seg-opt:has(input:checked) { background: var(--ink); color: var(--paper); }
  .seg-opt:not(:has(input:checked)):hover { background: color-mix(in srgb, var(--ink) 8%, transparent); }

  /* — tarjetas — */
  .card {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-4); border-radius: 0; background: var(--paper);
    border: var(--border-w) solid var(--ink);
  }
  .card-title { font-family: var(--font-heading); font-weight: 800; font-size: 18px; line-height: 1; text-transform: uppercase; letter-spacing: -.01em; }
  .elev-sm, .elev-md { box-shadow: none; }
  .elev-lg { box-shadow: var(--shadow-lg); }

  /* — tags — */
  .tag {
    display: inline-flex; align-items: center; font-family: var(--font-body); font-weight: 600;
    font-size: 10px; letter-spacing: .1em; text-transform: uppercase; padding: 3px 8px; border-radius: 0;
  }
  .tag-neutral { background: var(--ink); color: var(--paper); }

  /* — diálogo — */
  .dialog-backdrop {
    position: absolute; inset: 0; display: grid; place-items: center;
    padding: var(--space-6);
    background: color-mix(in srgb, var(--ink) 34%, transparent);
  }
  .dialog {
    width: min(330px, 100%); display: flex; flex-direction: column; gap: var(--space-3);
    padding: var(--space-6); border-radius: 0;
    background: var(--paper); border: var(--border-w) solid var(--ink); box-shadow: var(--shadow-lg);
  }
  .dialog-title { font-family: var(--font-heading); font-weight: 800; font-size: 24px; text-transform: uppercase; letter-spacing: -.02em; }
  .dialog-body { font-size: 14px; color: var(--dim); }
  .dialog-actions { display: flex; justify-content: flex-end; gap: var(--space-2); margin-top: var(--space-2); }
`;
