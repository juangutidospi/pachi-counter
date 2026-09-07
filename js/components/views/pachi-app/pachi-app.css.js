import { css } from '../../../core/css.js';

/** Estilos del shell de la app (marco tipo teléfono + tabbar + toast) — Bauhaus. */
export const styles = css`
  :host {
    display: flex; flex-direction: column; align-items: center; gap: var(--space-4);
    padding: var(--space-8) var(--space-4);
  }

  .frame {
    position: relative;
    width: 402px; max-width: 100%;
    height: min(844px, calc(100vh - 2 * var(--space-8)));
    height: min(844px, calc(100dvh - 2 * var(--space-8)));
    border-radius: 26px; overflow: hidden; box-shadow: 8px 8px 0 var(--ink);
    border: var(--border-w) solid var(--ink); background: var(--paper);
  }
  /* Grano de impresión: textura sutil sobre todo el marco (tacto analógico). */
  .frame::after {
    content: ""; position: absolute; inset: 0; z-index: 200; pointer-events: none;
    opacity: 0.06; mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 160px 160px;
  }
  @media (max-width: 460px) {
    :host { padding: 0; width: 100%; }
    /* 100dvh = altura visible real en móvil (evita el desbordamiento por la
       barra dinámica de iOS Safari); 100vh como respaldo. */
    .frame { width: 100%; height: 100vh; height: 100dvh; border-radius: 0; border: none; box-shadow: none; }
  }

  .screen {
    position: relative; width: 100%; height: 100%; overflow: hidden;
    display: flex; flex-direction: column;
    background: var(--paper); color: var(--ink);
  }
  /* Área de contenido con scroll propio; la tabbar queda fija fuera de ella. */
  .scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden;
    overscroll-behavior: contain; -webkit-overflow-scrolling: touch; }

  /* — tabbar fija al fondo (no se desplaza con el contenido) — */
  .tabbar {
    flex: none; z-index: 40;
    display: flex; align-items: stretch; justify-content: space-between;
    border-top: var(--border-w) solid var(--ink); background: var(--paper);
  }
  .tabbar .link {
    flex: 1; padding: 16px 10px; text-align: center; border-radius: 0; border: none;
    font-family: var(--font-heading); font-weight: 700; font-size: 12px; letter-spacing: .04em;
    text-transform: uppercase; color: var(--dim); background: transparent;
  }
  .tabbar .link.active { color: var(--ink); }
  .tabbar .new {
    flex: none; padding: 16px 22px; border-radius: 0;
    border-left: var(--border-w) solid var(--ink); border-right: var(--border-w) solid var(--ink);
    background: var(--blue); color: var(--paper); font-family: var(--font-heading); font-weight: 700;
    font-size: 12px; letter-spacing: .04em; text-transform: uppercase; cursor: pointer;
  }
  .tabbar .new:hover { background: var(--ink); }

  /* — transición constructivista (barrido de bloques primarios) — */
  .wipe { position: absolute; inset: 0; z-index: 60; pointer-events: none; overflow: hidden; }
  .wipe .p { position: absolute; inset: 0; transform: translateX(-101%); }
  .wipe .p1 { background: var(--blue); animation: pc-wipe-across .55s cubic-bezier(.7,0,.25,1) 0s both; }
  .wipe .p2 { background: var(--red); animation: pc-wipe-across .55s cubic-bezier(.7,0,.25,1) .06s both; }
  .wipe .p3 { background: var(--yellow); animation: pc-wipe-across .55s cubic-bezier(.7,0,.25,1) .12s both; }
  @keyframes pc-wipe-across {
    0% { transform: translateX(-101%); }
    50% { transform: translateX(0); }
    100% { transform: translateX(101%); }
  }
  @media (prefers-reduced-motion: reduce) { .wipe { display: none; } }

  /* — toast — */
  .toast-host {
    position: absolute; left: 0; right: 0; top: 0; height: 100%; z-index: 95;
    display: grid; align-items: end; justify-items: center; padding-bottom: 92px; pointer-events: none;
  }
  .toast {
    max-width: 84%; padding: 10px 16px; border-radius: 0;
    background: var(--ink); color: var(--paper); font-family: var(--font-body); font-weight: 500; font-size: 12.5px;
    box-shadow: 4px 4px 0 var(--blue); text-align: center; animation: pc-toast-in .25s ease both;
  }
`;
