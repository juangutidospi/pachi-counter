import { css } from '../../../core/css.js';

/** Estilos de la pantalla «hoy me cuesta» — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .hard {
    position: absolute; inset: 0; z-index: 92; display: grid; place-items: center;
    padding: var(--space-8); text-align: center; cursor: pointer;
    background: var(--paper); color: var(--ink); animation: pc-fade .3s ease both;
  }
  .hard::before { content: ""; position: absolute; inset: 12px; border: var(--border-w) solid var(--ink); pointer-events: none; }
  .inner { position: relative; z-index: 1; }
  .kicker { font-family: var(--font-body); font-weight: 700; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--red); animation: pc-fade .5s ease both; }
  .text {
    margin: var(--space-6) 0 0; font-family: var(--font-display); font-weight: 800; font-size: 26px; line-height: 1.12;
    text-transform: uppercase; letter-spacing: -.02em; color: var(--ink); text-wrap: pretty;
    animation: pc-up .6s cubic-bezier(.16,1,.3,1) .1s both;
  }
  .sep { height: 6px; width: 64px; margin: var(--space-8) auto; background: var(--yellow); }
  .foot { margin: 0; font-family: var(--font-body); font-size: 13px; line-height: 1.6; color: var(--dim); animation: pc-up .6s cubic-bezier(.16,1,.3,1) .22s both; }
  .close { margin-top: var(--space-8); }
`;
