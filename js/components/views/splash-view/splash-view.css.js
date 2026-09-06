import { css } from '../../../core/css.js';

/** Estilos de la portada Bauhaus (splash). */
export const styles = css`
  :host { display: block; }
  .cover {
    position: absolute; inset: 0; background: var(--paper); color: var(--ink);
    cursor: pointer; overflow: hidden;
  }

  /* rejilla milimetrada + marco técnico con nodos */
  .grid {
    position: absolute; inset: 0; animation: pc-fade .6s ease both;
    background-image:
      linear-gradient(var(--hair) 1px, transparent 1px),
      linear-gradient(90deg, var(--hair) 1px, transparent 1px);
    background-size: 33px 33px;
  }
  .frameline { position: absolute; inset: 16px; border: var(--border-w) solid var(--ink); animation: pc-fade .5s ease .1s both; }
  .tick { position: absolute; width: 12px; height: 12px; border: var(--border-w) solid var(--ink); background: var(--paper); animation: pc-fade .4s ease .25s both; }
  .tick.t1 { top: 10px; left: 10px; } .tick.t2 { top: 10px; right: 10px; }
  .tick.t3 { bottom: 10px; left: 10px; } .tick.t4 { bottom: 10px; right: 10px; }

  .scr { position: absolute; inset: 16px; padding: 24px 20px; display: flex; flex-direction: column; }

  .meta { display: flex; justify-content: space-between; align-items: center;
    font-size: 10.5px; letter-spacing: .16em; text-transform: uppercase; font-weight: 600;
    animation: pc-fade .6s ease .2s both; }
  .meta .idx { background: var(--ink); color: var(--paper); padding: 3px 8px; }

  /* emblema — motion graphics */
  .art { flex: 1; display: grid; place-items: center; position: relative; margin: 2px 0; }
  .emblem { width: 224px; height: 224px; overflow: visible; position: relative; z-index: 2; }
  .emblem .disc, .emblem .hub, .emblem .bar, .emblem .q { transform-box: fill-box; }

  /* disco: entra con escala+giro y luego gira lentísimo (vinilo premium) */
  .disc { transform-origin: center;
    animation: pc-disc-in 1s cubic-bezier(.16,1,.3,1) .2s both, pc-disc-spin 60s linear 1.25s infinite; }
  .q { transform-origin: center; opacity: 0; animation: pc-q-in .7s ease .35s both; }

  /* grooves: se dibujan escalonadas */
  .groove { stroke-dasharray: 100; stroke-dashoffset: 100; }
  .g1 { animation: pc-groove .7s cubic-bezier(.16,1,.3,1) .55s both; }
  .g2 { animation: pc-groove .7s cubic-bezier(.16,1,.3,1) .68s both; }
  .g3 { animation: pc-groove .7s cubic-bezier(.16,1,.3,1) .81s both; }

  /* barra: cae desde arriba con rebote */
  .bar { transform-origin: 50% 0; animation: pc-bar-drop .6s cubic-bezier(.34,1.56,.64,1) .55s both; }

  /* hub central: pop con sobreimpulso */
  .hub { transform-origin: center; animation: pc-hub-pop .55s cubic-bezier(.34,1.56,.64,1) .85s both; }

  /* destello que barre el emblema (glint recurrente) */
  .sheen { transform-box: fill-box; opacity: 0; mix-blend-mode: screen;
    animation: pc-sheen 5.5s ease-in-out 1.2s infinite; }

  @keyframes pc-disc-in { from { opacity: 0; transform: scale(.35) rotate(-120deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
  @keyframes pc-disc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pc-q-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pc-groove { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
  @keyframes pc-bar-drop { from { opacity: 0; transform: translateY(-34px) scaleY(.2); } to { opacity: 1; transform: translateY(0) scaleY(1); } }
  @keyframes pc-hub-pop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
  @keyframes pc-sheen {
    0% { opacity: 0; transform: translateX(-70px) skewX(-16deg); }
    6% { opacity: .9; }
    20% { opacity: 0; transform: translateX(240px) skewX(-16deg); }
    100% { opacity: 0; transform: translateX(240px) skewX(-16deg); }
  }

  .diag { position: absolute; left: 6px; top: 34px; width: 150px; height: 3px; background: var(--ink);
    transform: rotate(32deg); transform-origin: left center; z-index: 1;
    animation: pc-wipe .5s cubic-bezier(.16,1,.3,1) .5s both; }

  /* Accesibilidad: sin animación si el usuario lo prefiere */
  @media (prefers-reduced-motion: reduce) {
    .disc, .q, .groove, .g1, .g2, .g3, .bar, .hub, .sheen, .diag { animation: none !important; }
    .q, .hub { opacity: 1; }
    .groove { stroke-dashoffset: 0; }
    .sheen { display: none; }
  }
  .diag::before, .diag::after { content: ""; position: absolute; width: 9px; height: 9px; border-radius: 50%; top: -3px; }
  .diag::before { left: -4px; background: var(--ink); }
  .diag::after { right: -4px; background: var(--red); }

  /* wordmark — tamaño fluido (cqw) para que COUNTER nunca desborde */
  .title { margin-top: auto; container-type: inline-size; }
  .title .k { font-family: var(--font-body); font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
    color: var(--red); font-weight: 700; margin-bottom: 6px; animation: pc-up .6s cubic-bezier(.16,1,.3,1) .5s both; }
  .title h1 { font-family: var(--font-display); font-weight: 800; line-height: .86; letter-spacing: -.045em; text-transform: uppercase; margin: 0; white-space: nowrap; }
  .title h1 .l1 { font-size: min(44px, 12.4cqw); display: block; animation: pc-up .6s cubic-bezier(.16,1,.3,1) .58s both; }
  .title h1 .l2 { font-size: min(44px, 12.4cqw); display: block; -webkit-text-stroke: 2px var(--ink); color: transparent;
    animation: pc-up .6s cubic-bezier(.16,1,.3,1) .66s both; }

  .tag { margin-top: 18px; display: inline-block; align-self: flex-start; background: var(--blue); color: var(--paper);
    font-weight: 700; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; padding: 9px 14px;
    animation: pc-up .6s cubic-bezier(.16,1,.3,1) .74s both; }

  .enter { margin-top: 22px; display: flex; align-items: center; gap: 10px;
    font-family: var(--font-body); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600;
    animation: pc-fade 1s ease 1s both; }
  .enter .arrow { width: 34px; height: 34px; border-radius: 50%; background: var(--yellow); color: var(--ink);
    display: grid; place-items: center; font-size: 16px; animation: pc-ring-pulse 3s ease-in-out 1.4s infinite; }
`;
