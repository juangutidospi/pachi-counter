import { css } from '../../../core/css.js';

/** Estilos del anillo de progreso circular. */
export const styles = css`
  :host { display: grid; place-items: center; }
  .dial {
    position: relative; display: grid; place-items: center;
    width: var(--size, 236px); height: var(--size, 236px);
  }
  svg {
    position: absolute; inset: 0; width: 100%; height: 100%;
    transform: rotate(-90deg);
  }
  .track { stroke: var(--color-neutral-900); }
  .value {
    stroke-linecap: round;
    transition: stroke-dashoffset .7s cubic-bezier(.16,1,.3,1);
    animation: pc-dial 1s cubic-bezier(.16,1,.3,1) .06s both;
  }
  .center { position: relative; z-index: 1; text-align: center; }
`;
