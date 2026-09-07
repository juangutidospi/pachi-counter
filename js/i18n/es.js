/**
 * Diccionario en español. Es el idioma de referencia; `en.js` debe mantener
 * exactamente las mismas claves (verificado por el test de paridad).
 * Los `{param}` se interpolan en tiempo de traducción.
 */
export const es = {
  months: 'ene,feb,mar,abr,may,jun,jul,ago,sep,oct,nov,dic',
  weekdays: 'lun,mar,mié,jue,vie,sáb,dom',

  word: { day: 'día', days: 'días' },

  app: {
    name1: 'Pachi’s',
    name2: 'counter',
    tagline: 'UN DÍA MÁS, SIEMPRE',
  },

  splash: {
    kicker: 'Contador de rachas',
    enter: 'Toca para entrar',
  },

  home: {
    greetingHas: 'Tus rachas',
    greetingEmpty: 'Empecemos',
    settings: 'Ajustes',
    edition: 'N.º {n}',
    stat: { days: 'Días sumados', streaks: 'Rachas vivas', nearest: 'Hito más cerca' },
    focusKicker: 'Hoy · {name}',
    column: { kicker: 'La columna' },
    empty: {
      title: 'Aún no cuentas nada',
      body: 'Crea tu primer contador. Arranca en 0 hoy y sube solo, un día cada día, hasta que tú lo resetees.',
      cta: 'Crear mi primer contador',
    },
  },

  insight: {
    nearMilestone: '{name} roza los {n} días',
    record: 'Récord personal en marcha: {name}',
    total: '{n} días sumados en total',
    sub: '{streaks} rachas vivas · mejor {best} d',
  },

  card: {
    today: '+1 hoy',
    since: 'desde el {date}',
    best: 'mejor: {best} d',
    goalHitToday: '¡hito hoy!',
    goalDaysTo: '{r} días para {next}',
    goalAll: 'todos los hitos',
  },

  detail: {
    back: 'Rachas',
    share: 'Compartir',
    kind: { quit: 'Dejar algo', build: 'Hacer algo' },
    stat: { current: 'Racha actual', best: 'Mejor racha', next: 'Próximo hito' },
    weeksTitle: 'Últimas 5 semanas',
    weeksFull: 'racha completa',
    weeksOf: '{d} de 35 días',
    gridBefore: 'antes de empezar',
    gridDay: 'día {n}',
    milestonesTitle: 'Hitos',
    milestoneLabel: '{m} {word} {tail}',
    milestoneLeft: '{r} d',
    noteTitle: 'Mi nota',
    noteAutosave: 'se guarda al escribir',
    notePh: 'Por qué lo hago. Para leérmelo los días difíciles.',
    hard: 'Hoy me cuesta',
    reset: 'Recaí, volver a 0',
    remove: 'Eliminar',
  },

  settings: {
    title: 'Ajustes',
    toneLabel: 'Tono de las frases',
    tone: { warm: 'Cálido', direct: 'Directo', sober: 'Sobrio' },
    toneSample: {
      warm: 'Ánimo, te faltan 3 días para llegar a 30 días sin refrescos.',
      direct: 'Vas por el día 27. 3 días más y son 30 días sin refrescos.',
      sober: 'Día 27. Siguiente hito: 30 días.',
    },
    reminderLabel: 'Recordatorio diario',
    reminderHint: 'un aviso, sin insistir',
    langLabel: 'Idioma',
    lang: { es: 'Español', en: 'English' },
    soundLabel: 'Sonidos',
    on: 'Sí',
    off: 'No',
    dataTitle: 'Datos',
    savedIn: 'Guardado en',
    size: 'Tamaño',
    bytes: '{n} bytes',
    export: 'Exportar JSON',
    wipe: 'Borrar todo',
    toolsTitle: 'Herramientas',
    toolsNote: 'Panel de demostración: viaja en el tiempo o restaura ejemplos.',
    footer: 'Pachi’s counter · v1 · sin cuenta, sin nube',
  },

  create: {
    title: 'Nuevo contador',
    subtitle: 'Empieza a contar desde el momento en que lo creas.',
    kindLabel: 'Tipo',
    kind: { quit: 'Dejar algo', build: 'Hacer algo' },
    nameLabel: 'Nombre',
    namePh: { quit: 'Sin azúcar', build: 'Leyendo cada día' },
    tailLabel: 'Se leerá así',
    tailPrefix: '0 días',
    tailPh: { quit: 'sin azúcar', build: 'leyendo cada día' },
    iconLabel: 'Icono',
    colorLabel: 'Acento',
    color: { accent: 'Azul', accent2: 'Rojo', light: 'Amarillo', deep: 'Negro' },
    startLabel: 'Fecha de inicio',
    startToday: 'Hoy',
    startPast: 'Ya llevo días',
    agoSuffix: 'días ya cumplidos',
    msLabel: 'Hitos',
    msDefault: 'Por defecto',
    msCustom: 'Los míos',
    msPh: '1, 3, 7, 21, 30, 90',
    msPreview: '{list} días',
    msPreviewEmpty: 'escribe al menos un hito',
    whyLabel: 'Por qué lo hago',
    whyOptional: '(opcional)',
    whyPh: 'Aparecerá en el detalle, para los días difíciles.',
    cancel: 'Cancelar',
    submit: 'Empezar a contar',
  },

  reset: {
    title: '¿Volver a 0?',
    body: 'Tu racha de {d} días {tail} vuelve a 0. Se queda guardada como mejor racha ({best} días) y el contador arranca hoy otra vez.',
    keep: 'Sigo en pie',
    confirm: 'Volver a 0',
  },

  hard: {
    kicker: 'Llevas {d} {word} {tail}',
    defaultText: 'Un día difícil no borra {d} días. Solo tienes que no romperlo hoy.',
    footDefault: 'Escribe tu motivo en el detalle y aparecerá aquí cuando lo necesites.',
    footNote: 'Esto lo escribiste tú. Mañana el contador pone {tomorrow}.',
    close: 'Sigo en pie',
  },

  celebrate: {
    tail: 'días {tail}',
    phrase: '¡{d} días {tail}!',
    footNext: 'Siguiente hito: {next} días. Faltan {r}.',
    footNone: 'Ya no hay más hitos. Ahora el récord eres tú.',
    close: 'Seguir contando',
  },

  nav: {
    streaks: 'Rachas',
    new: '+ Nuevo',
    settings: 'Ajustes',
  },

  demo: {
    title: 'Demo · viajar en el tiempo',
    today: 'hoy',
    offset: '{label}',
    back1: '− 1 día',
    fwd1: '+ 1 día',
    fwd7: '+ 7 días',
    empty: 'Ver estado vacío',
    restore: 'Restaurar ejemplos',
    splash: 'Splash',
    days: '{sign}{n} días',
  },

  toast: {
    reset: 'Contador a 0. Mejor racha guardada: {best} días.',
    removed: 'Contador eliminado.',
    created: '«{name}» empieza a contar hoy.',
    wiped: 'Todo borrado.',
    copied: 'Copiado: «{d} días {tail}»',
    exported: 'JSON copiado al portapapeles.',
    imgSaved: 'Imagen guardada.',
    imgFail: 'No se pudo generar la imagen.',
  },

  phrase: {
    k: {
      milestone: 'Hito conseguido',
      day0: 'Día 0',
      none: 'Fuera de escala',
      tomorrow: 'Mañana',
      soon: 'Ya casi',
      next: 'Siguiente hito',
    },
    milestone: {
      sober: '{d} días {tail}. Hito alcanzado.',
      warm: '¡{d} días {tail}! Hoy toca mirar atrás y estar orgulloso.',
      direct: '¡{d} días {tail}! Hito conseguido. Nadie te lo quita.',
    },
    day0: {
      sober: 'Contador iniciado. Mañana marcará 1 día.',
      warm: 'Hoy es el día 0, y el paso difícil (empezar) ya lo has dado.',
      direct: 'Día 0. Mañana pone 1. Solo tienes que llegar a mañana.',
    },
    none: {
      sober: '{d} días. Todos los hitos cumplidos.',
      warm: 'Has pasado todos los hitos: {d} días {tail}. Ahora el récord eres tú.',
      direct: 'Has pasado todos los hitos: {d} días {tail}. Ahora el récord eres tú.',
    },
    tomorrow: {
      sober: 'Mañana se cumplen {next} días {tail}.',
      warm: 'Mañana firmas {next} días {tail}. Queda uno.',
      direct: 'Mañana firmas {next} días {tail}. Queda uno.',
    },
    soon: {
      sober: 'Faltan {r} días para {next} días {tail}.',
      warm: 'Ánimo, te faltan {r} días para llegar a {next} días {tail}.',
      direct: 'Ánimo: {r} días para llegar a {next} días {tail}. Está hecho.',
    },
    next: {
      sober: 'Día {d}. Siguiente hito: {next} días.',
      warm: 'Vas por el día {d}. Poco a poco, {next} días {tail} está más cerca de lo que parece.',
      direct: 'Vas por el día {d}. {r} días más y son {next} días {tail}.',
    },
  },
};
