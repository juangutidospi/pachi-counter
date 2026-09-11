import { css } from '../../../core/css.js';

/** Estilos del mural generativo — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .mural { padding: 44px 22px 40px; animation: pc-fade .3s ease both; container-type: inline-size; }
  .back { gap: 4px; margin-left: -4px; }

  .head { margin: var(--space-4) 0 var(--space-6); }
  .head .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); margin-bottom: 8px; }
  .head h2 { margin: 0; font-size: min(40px, 9cqw); line-height: .9; overflow-wrap: anywhere; }
  .head .subtitle { margin: 10px 0 0; font-family: var(--font-body); font-size: 12.5px; color: var(--dim); max-width: 42ch; text-wrap: pretty; }

  .stage { border: var(--border-w) solid var(--ink); box-shadow: var(--shadow-lg); background: var(--paper); }
  canvas { display: block; width: 100%; }

  .cta { margin-top: var(--space-6); }

  .empty { padding: var(--space-8) 0; text-align: center; color: var(--dim); }
  .empty .rings { position: relative; width: 120px; height: 120px; margin: var(--space-6) auto; display: grid; place-items: center; }
  .empty .rings .r { position: absolute; border-radius: 50%; border: var(--border-w) solid var(--ink); }
  .empty .rings .r1 { inset: 0; } .empty .rings .r2 { inset: 22px; border-color: var(--red); } .empty .rings .r3 { inset: 44px; border-color: var(--blue); }
  .empty p { font-size: 13px; max-width: 32ch; margin: 0 auto; text-wrap: pretty; }
`;
