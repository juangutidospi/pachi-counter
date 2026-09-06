import { css } from '../../../core/css.js';

/** Estilos de la pantalla de celebración de hito. */
export const styles = css`
  :host { display: block; }
  .celebrate {
    position: absolute; inset: 0; z-index: 96; display: grid; place-items: center; cursor: pointer; overflow: hidden;
    background: radial-gradient(560px 560px at 50% 42%, var(--color-accent-900), var(--color-bg));
    animation: pc-fade .3s ease both;
  }
  .confetti { position: absolute; inset: 0; pointer-events: none; }
  .confetti i { position: absolute; top: -20px; border-radius: 1px; animation-name: pc-conf; animation-timing-function: linear; animation-fill-mode: both; }

  .content { display: grid; place-items: center; text-align: center; padding: 0 var(--space-8); position: relative; z-index: 1; }
  .logo { position: relative; width: 238px; height: 238px; display: grid; place-items: center; }
  .logo .ring { position: absolute; border-radius: 50%; }
  .logo .r1 { inset: 0; border: 1px solid var(--color-accent-800); animation: pc-ring-in .9s cubic-bezier(.16,1,.3,1) both, pc-ring-pulse 3.4s ease-in-out .9s infinite; }
  .logo .r2 { inset: 26px; border: 1px solid var(--color-accent-700); animation: pc-ring-in .85s cubic-bezier(.16,1,.3,1) .1s both; }
  .logo svg { position: absolute; inset: 8px; width: 222px; height: 222px; transform: rotate(-90deg); }
  .logo svg circle { animation: pc-dial 1.1s cubic-bezier(.16,1,.3,1) .15s both; }
  .days { font-family: var(--font-heading); font-size: 76px; line-height: .95; letter-spacing: -.045em; color: var(--color-neutral-100); animation: pc-up .8s cubic-bezier(.16,1,.3,1) .25s both; }
  .tail { font-size: 11px; letter-spacing: .16em; text-transform: uppercase; color: var(--color-accent-300); margin-top: 6px; animation: pc-up .8s cubic-bezier(.16,1,.3,1) .35s both; }
  .phrase { margin: var(--space-8) 0 0; font-family: var(--font-heading); font-size: 22px; line-height: 1.3; color: var(--color-neutral-100); text-wrap: pretty; animation: pc-up .7s cubic-bezier(.16,1,.3,1) .5s both; }
  .foot { margin: var(--space-3) 0 0; font-size: 13px; color: var(--color-neutral-400); animation: pc-up .7s cubic-bezier(.16,1,.3,1) .62s both; }
  .close { margin-top: var(--space-8); animation: pc-up .7s cubic-bezier(.16,1,.3,1) .74s both; }
`;
