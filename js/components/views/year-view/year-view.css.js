import { css } from '../../../core/css.js';

/** Estilos del vinilo del año — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .year { padding: 44px 22px 40px; animation: pc-fade .3s ease both; container-type: inline-size; }
  .back { gap: 4px; margin-left: -4px; }

  .head { margin: var(--space-4) 0 var(--space-6); }
  .head .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); margin-bottom: 8px; }
  .head h2 { margin: 0; font-size: min(40px, 9cqw); line-height: .9; overflow-wrap: anywhere; }
  .head .subtitle { margin: 10px 0 0; font-family: var(--font-body); font-size: 12.5px; color: var(--dim); max-width: 42ch; text-wrap: pretty; }

  .stage { display: grid; place-items: center; }
  canvas { display: block; width: 100%; touch-action: none; cursor: grab; user-select: none; -webkit-user-select: none; }
  canvas:active { cursor: grabbing; }

  .hint { margin-top: var(--space-4); text-align: center; font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--dim); }

  .empty { padding: var(--space-8) 0; text-align: center; color: var(--dim); }
  .empty p { font-size: 13px; max-width: 32ch; margin: 0 auto; text-wrap: pretty; }
`;
