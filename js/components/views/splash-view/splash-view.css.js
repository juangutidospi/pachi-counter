import { css } from '../../../core/css.js';

/** Estilos de la pantalla de bienvenida (splash). */
export const styles = css`
  :host { display: block; }
  .splash {
    position: absolute; inset: 0; z-index: 80; display: grid; place-items: center; cursor: pointer;
    background: radial-gradient(560px 560px at 50% 40%, var(--color-accent-900) 0%, var(--color-bg) 74%);
  }
  .stack { display: grid; place-items: center; }

  .logo { position: relative; width: 238px; height: 238px; display: grid; place-items: center; }
  .logo .ring { position: absolute; border-radius: 50%; }
  .logo .r1 { inset: 0; border: 1px solid var(--color-accent-800); animation: pc-ring-in 1.05s cubic-bezier(.16,1,.3,1) both, pc-ring-pulse 3.4s ease-in-out 1.1s infinite; }
  .logo .r2 { inset: 30px; border: 1px solid var(--color-accent-700); animation: pc-ring-in .95s cubic-bezier(.16,1,.3,1) .13s both; }
  .logo .r3 { inset: 60px; border: 1px solid var(--color-accent-600); animation: pc-ring-in .85s cubic-bezier(.16,1,.3,1) .26s both; }
  .logo .r4 { inset: 90px; border: 1px solid var(--color-accent-500); animation: pc-ring-in .8s cubic-bezier(.16,1,.3,1) .38s both; }
  .logo svg { position: absolute; inset: 8px; width: 222px; height: 222px; transform: rotate(-90deg); animation: pc-fade .5s ease .3s both; }
  .logo svg circle { animation: pc-dial 1.6s cubic-bezier(.16,1,.3,1) .32s both; }
  .logo .letter {
    font-family: var(--font-heading); font-size: 26px; line-height: 1; letter-spacing: -.02em;
    color: var(--color-neutral-100); animation: pc-up .8s cubic-bezier(.16,1,.3,1) .5s both;
  }

  .gap { height: var(--space-8); }
  .name {
    font-family: var(--font-heading); font-size: 27px; letter-spacing: .2em; text-transform: uppercase;
    color: var(--color-neutral-100);
  }
  .name.line1 { animation: pc-up .9s cubic-bezier(.16,1,.3,1) .62s both; }
  .name.line2 { color: var(--color-neutral-600); animation: pc-up .9s cubic-bezier(.16,1,.3,1) .72s both; }
  .tagline {
    margin-top: var(--space-6); font-size: 12px; letter-spacing: .14em; color: var(--color-accent-300);
    animation: pc-up .9s cubic-bezier(.16,1,.3,1) .9s both;
  }
  .enter {
    position: absolute; bottom: 54px; left: 0; right: 0; text-align: center;
    font-size: 11px; color: var(--color-neutral-700); animation: pc-fade 1s ease 1.6s both;
  }
`;
