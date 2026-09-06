import { css } from '../../../core/css.js';

/** Estilos del diálogo de reinicio de racha. */
export const styles = css`
  :host { display: block; }
  .dialog-backdrop { z-index: 90; animation: pc-fade .2s ease both; }
  .dialog { animation: pc-up .3s cubic-bezier(.16,1,.3,1) both; }
`;
