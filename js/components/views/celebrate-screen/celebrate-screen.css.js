import { css } from '../../../core/css.js';

/** Estilos de la pantalla de celebración de hito — Bauhaus. */
export const styles = css`
  :host { display: block; }
  .celebrate {
    position: absolute; inset: 0; z-index: 96; display: grid; place-items: center; cursor: pointer; overflow: hidden;
    background: var(--paper); color: var(--ink); animation: pc-fade .3s ease both;
  }
  .celebrate::before {
    content: ""; position: absolute; inset: 12px; border: var(--border-w) solid var(--ink); pointer-events: none;
  }
  .confetti { position: absolute; inset: 0; pointer-events: none; }
  .confetti i { position: absolute; top: -20px; animation-name: pc-conf; animation-timing-function: linear; animation-fill-mode: both; }

  .content { display: grid; place-items: center; text-align: center; padding: 0 var(--space-8); position: relative; z-index: 1; }
  .logo { position: relative; width: 220px; height: 220px; display: grid; place-items: center; }
  .logo .ring { position: absolute; border-radius: 50%; }
  .logo .r1 { inset: 0; border: var(--border-w) solid var(--ink); animation: pc-ring-in .9s cubic-bezier(.16,1,.3,1) both; }
  .logo .r2 { inset: 26px; border: var(--border-w) solid var(--red); animation: pc-ring-in .85s cubic-bezier(.16,1,.3,1) .1s both; }
  .logo svg { position: absolute; inset: 8px; width: 204px; height: 204px; transform: rotate(-90deg); }
  .logo svg circle { animation: pc-dial 1.1s cubic-bezier(.16,1,.3,1) .15s both; }
  .days { font-family: var(--font-display); font-weight: 800; font-size: 80px; line-height: .8; letter-spacing: -.05em; color: var(--ink); animation: pc-up .8s cubic-bezier(.16,1,.3,1) .25s both; }
  .tail { font-family: var(--font-body); font-weight: 700; font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--blue); margin-top: 8px; animation: pc-up .8s cubic-bezier(.16,1,.3,1) .35s both; }
  .phrase { margin: var(--space-8) 0 0; font-family: var(--font-display); font-weight: 800; font-size: 24px; line-height: 1.1; text-transform: uppercase; letter-spacing: -.02em; color: var(--ink); text-wrap: pretty; animation: pc-up .7s cubic-bezier(.16,1,.3,1) .5s both; }
  .foot { margin: var(--space-3) 0 0; font-family: var(--font-body); font-size: 13px; color: var(--dim); animation: pc-up .7s cubic-bezier(.16,1,.3,1) .62s both; }
  .close { margin-top: var(--space-8); animation: pc-up .7s cubic-bezier(.16,1,.3,1) .74s both; }
`;
