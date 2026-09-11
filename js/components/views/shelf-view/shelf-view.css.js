import { css } from '../../../core/css.js';

/** Estilos de la colección de discos prensados — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .shelf { padding: 44px 22px 32px; animation: pc-fade .3s ease both; container-type: inline-size; }
  .back { gap: 4px; margin-left: -4px; }

  .head { margin: var(--space-4) 0 var(--space-6); }
  .head h2 { margin: 0; font-size: min(40px, 9cqw); line-height: .9; overflow-wrap: anywhere; }
  .head .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); margin-bottom: 8px; }
  .head .count { font-family: var(--font-mono); font-size: 11px; letter-spacing: .04em; color: var(--dim); margin-top: 8px; }

  .mural { margin-bottom: var(--space-3); gap: 6px; }
  .annual { margin-bottom: var(--space-6); }

  .empty { padding: var(--space-8) 0; text-align: center; color: var(--dim); }
  .empty .rings { position: relative; width: 120px; height: 120px; margin: var(--space-6) auto; display: grid; place-items: center; }
  .empty .rings .r { position: absolute; border-radius: 50%; border: var(--border-w) solid var(--ink); }
  .empty .rings .r1 { inset: 0; } .empty .rings .r2 { inset: 22px; opacity: .5; } .empty .rings .r3 { inset: 44px; opacity: .25; }
  .empty p { font-size: 13px; max-width: 30ch; margin: 0 auto; text-wrap: pretty; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: var(--space-4); }
  .rec {
    border: var(--border-w) solid var(--ink); padding: var(--space-4); display: flex; flex-direction: column; align-items: center; text-align: center;
    animation: pc-up .4s cubic-bezier(.16,1,.3,1) both;
  }
  .rec .mini { width: 96px; height: 96px; }
  .rec .name { font-family: var(--font-display); font-weight: 800; font-size: 15px; line-height: 1; text-transform: uppercase; letter-spacing: -.01em; margin-top: var(--space-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .rec .range { font-family: var(--font-mono); font-size: 9.5px; color: var(--dim); margin-top: 6px; }
`;
