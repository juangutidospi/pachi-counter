# Pachi's counter

Contador de rachas (días sin fumar, saliendo a caminar, sin refrescos…).
Cada contador arranca en 0, sube un día por día y solo vuelve a 0 cuando tú
lo reinicias. Frases motivadoras por tono, hitos, heatmap, celebraciones y
todo guardado en `localStorage` (sin cuenta, sin nube).

Construido como **Web Components vanilla, sin build step**, siguiendo el patrón
de `Patron-Web-Components`: Shadow DOM por componente, estilos por tokens
(`var(--…)`), markup en getters puros y comportamiento en `afterRender()`.

## Ejecutar

No hay build. Se sirve la carpeta tal cual con un servidor estático en Node
(sin dependencias); imprime la URL y busca otro puerto si 8080 está ocupado:

```bash
npm run serve            # node serve.js  → http://localhost:8080
npm run serve -- 3000    # puerto a elección
```

Debe abrirse por HTTP (no con `file://`): los módulos ES no cargan desde disco.

## Tests

```bash
npm test             # node --test
```

- **Paridad i18n**: `es.js` y `en.js` tienen exactamente las mismas claves.
- **Temas ↔ tokens**: todo `var(--color-…/--space-…/…)` usado está definido en
  `css/tokens.css`, y el tema claro redefine los tokens de superficie.

## Estructura

```
index.html                         enlaza tokens.css + <pachi-app> + <demo-panel>
css/tokens.css                     paleta Nocturne + tema claro/oscuro
js/
├── main.js                        entrada: registra el shell y el panel demo
├── core/                          infraestructura compartida (no son componentes)
│   ├── AppElement.js              clase base (shadow, styles, on(), $()/$$(), i18n)
│   ├── css.js                     helper css`…` → CSSStyleSheet
│   ├── base.css.js                primitivas .btn/.card/.field/.seg + @keyframes
│   ├── escape-html.js             escapeHtml()
│   ├── store.js                   estado de dominio + persistencia + lógica de rachas
│   ├── router.js                  ruta principal + overlays + toast
│   ├── i18n.js                    t(), setLang(), onI18nChanged()
│   ├── theme.js                   tema claro/oscuro
│   └── icons.js                   iconos SVG (contador + interfaz)
├── i18n/{es,en}.js                diccionarios (paridad verificada)
└── components/
    ├── ui/                        primitivos reutilizables
    │   ├── ring-dial/             anillo de progreso (detalle + celebración)
    │   ├── seg-control/           segmentos (ajustes + creación)
    │   ├── counter-card/          tarjeta de contador (home)
    │   └── demo-panel/            controles demo (chrome global)
    └── views/                     vistas
        ├── pachi-app/             shell: marco + vista activa + overlays + tabbar
        ├── splash-view/           bienvenida animada
        ├── home-view/             lista de rachas / estado vacío
        ├── detail-view/           anillo, frase, métricas, heatmap, hitos, nota
        ├── settings-view/         tono, recordatorio, idioma, tema, datos
        ├── create-sheet/          hoja modal de creación (borrador local)
        ├── reset-dialog/          confirmación de reinicio
        ├── hard-screen/           pantalla «hoy me cuesta»
        └── celebrate-screen/      celebración de hito con confeti
```

## Arquitectura

- **Estado central** en `core/store.js` (contadores + ajustes en `localStorage`)
  y **navegación** en `core/router.js` (ruta, overlays, toast). Ambos son
  `EventTarget` con `subscribe()`.
- El shell `<pachi-app>` se suscribe al store, al router y al tema, y recompone
  el marco (vista activa + overlays + tabbar + toast) en cada cambio.
- Cada componente hereda de `AppElement`: crea su Shadow DOM, adopta
  `[base, styles]`, re-renderiza al cambiar el idioma y limpia sus listeners.
- El orden de cada archivo es siempre: `static styles` → `render()` (compone
  getters `_xTpl`) → getters de bloque (HTML puro) → `afterRender()` (wiring) →
  métodos privados. Nunca se mezclan markup y comportamiento.

## Modo demo

El panel bajo el teléfono permite viajar en el tiempo (para ver crecer las
rachas y disparar celebraciones), alternar el estado vacío y repetir la splash.
No se persiste.
