import { css } from '../../../core/css.js';

/** Estilos de la pantalla «hoy me cuesta». */
export const styles = css`
  :host { display: block; }
  .hard {
    position: absolute; inset: 0; z-index: 92; display: grid; place-items: center;
    padding: var(--space-8); text-align: center; cursor: pointer;
    background: radial-gradient(440px 440px at 50% 44%, var(--color-accent-900), var(--color-bg));
    animation: pc-fade .3s ease both;
  }
  .kicker { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--color-accent-400); animation: pc-fade .5s ease both; }
  .text {
    margin: var(--space-6) 0 0; font-family: var(--font-heading); font-size: 25px; line-height: 1.32;
    color: var(--color-neutral-100); text-wrap: pretty; animation: pc-up .6s cubic-bezier(.16,1,.3,1) .1s both;
  }
  .sep { height: 1px; width: 120px; margin: var(--space-8) auto; background: linear-gradient(to right, transparent, var(--color-accent-700), transparent); }
  .foot { margin: 0; font-size: 13px; line-height: 1.6; color: var(--color-neutral-400); animation: pc-up .6s cubic-bezier(.16,1,.3,1) .22s both; }
  .close { margin-top: var(--space-8); }
`;
