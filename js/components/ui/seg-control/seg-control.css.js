import { css } from '../../../core/css.js';

/**
 * Estilos del control segmentado (extiende las clases base .seg/.seg-opt).
 * Enfoque limpio y legible: un bloque de tinta que se desliza con suavidad
 * bajo la opción activa. El color del texto (papel sobre tinta / tinta sobre
 * papel) cambia con un leve retardo, sincronizado con el deslizamiento, para
 * que no parpadee al pasar el bloque por debajo.
 */
export const styles = css`
  :host { display: block; }
  .seg { position: relative; width: 100%; }

  /* Bloque de tinta que se desliza tras la opción activa. */
  .ind {
    position: absolute; top: 0; bottom: 0; left: 0; z-index: 0;
    width: calc(100% / var(--n, 1));
    transform: translateX(calc(var(--i, 0) * 100%));
    background: var(--ink); pointer-events: none;
    transition: transform .28s cubic-bezier(.22, 1, .36, 1);
  }

  /* Opciones más finas; la casilla activa no pinta fondo (lo aporta .ind). */
  .seg-opt {
    position: relative; z-index: 1; background: transparent;
    padding: 9px 10px; font-size: 11px; font-weight: 700; letter-spacing: .06em;
    transition: color .2s ease .08s;
  }
  .seg-opt:has(input:checked) { background: transparent; }

  @media (prefers-reduced-motion: reduce) {
    .ind { transition: none; }
    .seg-opt { transition: none; }
  }
`;
