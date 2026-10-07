// Citas Médicas: lo único que vende alphateklab desde el 7-oct-2026 (decisión de Edwin). La portada sale entera de
// aquí: los precios, lo que hace cada parte, las pantallas y las preguntas. Cambiar un precio es cambiar un número.
//
// Decisiones de Edwin (7-oct-2026):
// - La propuesta de valor es el expediente: que el médico sepa que puede dictar la nota de la consulta y no tiene que
//   escribirla a mano ni teclearla. Se explica para el médico joven que sabe de tecnología y para el señor que no:
//   con IA, y con palabras simples. El expediente va primero en toda la página; la agenda, después.
// - Dos productos que se contratan por separado: el Expediente (por profesional) y la Agenda (por clínica, con un
//   paquete de mensajes de WhatsApp). Sin la agenda, el expediente funciona solo: el médico abre la consulta del
//   paciente que llega y la recepción la imprime para el folder.
// - Los recordatorios por WhatsApp se explican por lo que ahorran: la secretaria ya no llama paciente por paciente.
// - En las tarjetas de los planes, poco: lo esencial de cada parte. El detalle va en las secciones.
// - Precios netos: van tal cual, sin sumar ITBMS. Prueba gratis de 7 días. Pago mes a mes, sin plan anual.
// - «Profesional» es cada médico que hace expedientes; la recepción, enfermería y administración no pagan.

export const PRODUCTO = 'Citas Médicas';
export const PRUEBA_DIAS = 7;

// Al mes, en dólares.
export const PRECIOS = {
  expediente: 30, // por profesional
  agenda: [
    // por clínica, según los mensajes de WhatsApp de confirmación al mes
    { mensajes: 200, precio: 25 },
    { mensajes: 500, precio: 35 },
    { mensajes: 1000, precio: 45 },
  ],
};
export const DESDE = Math.min(PRECIOS.expediente, ...PRECIOS.agenda.map((a) => a.precio));

export const HEROE = {
  antetitulo: `${PRODUCTO}, para clínicas y consultorios en Panamá`,
  // la parte entre [] va resaltada
  titulo: 'El expediente de tu paciente, [sin escribir a mano ni teclear]',
  bajada:
    'Durante la consulta hablas y el sistema escribe la nota con IA, sección por sección. Tú la revisas y queda guardada; si trabajas con folder, la recepción la imprime. Y si quieres, también la agenda, con recordatorios automáticos por WhatsApp.',
  puntos: [`${PRUEBA_DIAS} días gratis, sin tarjeta`, 'Sin instalar nada', `Desde $${DESDE} al mes`],
  // Las tarjetas que flotan sobre las pantallas del héroe (nombres inventados).
  avisos: [
    { icono: 'microphone', titulo: 'Dictando con IA', texto: 'Sin escribir ni teclear' },
    { icono: 'check-circle', titulo: 'Nota guardada', texto: '10:04 a. m., Dra. Ríos' },
    { icono: 'whatsapp-logo', titulo: 'Cita confirmada', texto: 'Por WhatsApp, sin llamar' },
  ],
};

// Las dos partes, como se contratan, en el orden de la página: primero el expediente.
export const PARTES = [
  {
    id: 'expediente',
    icono: 'stethoscope',
    nombre: 'Expediente clínico con IA',
    para: 'Para el médico',
    resumen: 'Dictas la nota de cada consulta y queda escrita. Con o sin la agenda.',
    destacado: { icono: 'microphone', titulo: 'Nota por secciones, con dictado por voz con IA', texto: 'Hablas y queda escrita: sin escribir a mano ni teclear.' },
    incluye: ['Antecedentes: alergias, enfermedades, medicamentos y seguro'],
    unidad: 'al mes por profesional',
  },
  {
    id: 'agenda',
    icono: 'calendar-check',
    nombre: 'Agenda de citas',
    para: 'Para la recepción',
    resumen: 'Citas sin choques y recordatorios automáticos por WhatsApp.',
    destacado: { icono: 'whatsapp-logo', titulo: 'Recordatorios automáticos por WhatsApp', texto: 'Tu secretaria ya no llama paciente por paciente para confirmar.' },
    incluye: ['Agenda por médico y por consultorio, por día o por semana', 'Quién no ha confirmado hoy y mañana', 'Registro del paciente por QR desde su teléfono', 'Lista de espera y sala de espera'],
    unidad: 'al mes por clínica',
  },
];

// Las filas de cada parte: texto de un lado y su pantalla del otro. `visual`: la captura (assets/producto/<nombre>.webp,
// con su versión -oscuro) o una de las animaciones de la página («chat», «dictado», «hoja»).
export const FILAS = {
  expediente: {
    titulo: 'Dicta el expediente en vez de escribirlo',
    bajada: 'Para el médico, con o sin la agenda: lo que antes escribías a mano o tecleabas, ahora lo dices y queda escrito, ordenado y legible.',
    filas: [
      {
        titulo: 'Hablas y la nota queda escrita',
        texto: 'Toca «Dictar» en la sección de la nota y habla como si se lo dictaras a tu asistente. La IA convierte tu voz en texto; tú lo revisas y lo guardas. Sin escribir a mano y sin teclear.',
        pasos: ['Toca «Dictar» en la sección', 'Habla con calma, como le hablas a tu asistente', 'Revisa el texto y toca «Agregar»'],
        nota: 'Funciona en Chrome, Edge y Safari, en la computadora, la tableta o el celular.',
        visual: { tipo: 'dictado' },
      },
      {
        titulo: 'Todo el expediente de la consulta, en orden',
        texto: 'Los antecedentes, los signos que anota enfermería, la nota del médico por secciones y los resultados, en un solo lugar y legibles en la próxima consulta.',
        puntos: ['Alergias y enfermedades a la vista en cada consulta', 'Resultados en PDF o foto, también con la cámara del celular', 'El historial con todas las consultas del paciente'],
        visual: { tipo: 'portatil', imagen: 'citas-expediente', alt: 'El expediente de un paciente de ejemplo: los signos que tomó enfermería, los resultados y la nota del médico.' },
      },
      {
        id: 'imprimir',
        titulo: '¿Trabajas con folder? Imprime la consulta',
        texto: 'Si tu clínica prefiere seguir con su secretaria y sus folders, no hay que cambiar eso: el médico dicta el expediente y, al terminar la consulta, la recepción lo imprime para el folder del paciente.',
        pasos: ['El médico toca «Terminar consulta»', 'A la recepción le aparece en «Por imprimir»', 'Imprime la hoja tamaño carta y la guarda en el folder'],
        visual: { tipo: 'hoja' },
      },
    ],
  },
  agenda: {
    titulo: 'Que tus pacientes lleguen a su cita',
    bajada: 'Para la recepción: citas sin choques y confirmaciones automáticas por WhatsApp, sin llamar paciente por paciente.',
    filas: [
      {
        titulo: 'La agenda del día, de un vistazo',
        texto: 'Cada médico en su columna, con los huecos libres, el almuerzo y quién ya está en la sala de espera.',
        puntos: ['Por día o por semana, por médico o por consultorio', 'No deja encimar citas del mismo médico, consultorio o paciente', 'Días sin atención, feriados y el almuerzo de cada médico'],
        visual: { tipo: 'portatil', imagen: 'citas-agenda', alt: 'La agenda de un consultorio de ejemplo: las citas del día de la Dra. Ríos y del Dr. Herrera, con las confirmadas, las atendidas y quién está en la sala.' },
      },
      {
        titulo: 'Recordatorios automáticos por WhatsApp',
        texto: 'Tu secretaria ya no tiene que pasar la mañana llamando paciente por paciente para confirmar. Uno o dos días antes, el sistema le escribe a cada paciente por WhatsApp con la fecha, la hora y el médico, y el paciente confirma respondiendo.',
        puntos: ['200, 500 o 1000 mensajes al mes, según tu paquete', 'Quién ya confirmó y quién no, de un vistazo', 'Si no responde, el sistema le vuelve a escribir'],
        visual: { tipo: 'chat' },
      },
      {
        titulo: 'El paciente se registra desde su teléfono',
        texto: 'Escanea un código QR en la recepción y llena sus datos: nombre, cédula o pasaporte, celular, alergias y seguro. Acepta ahí mismo el uso de sus datos.',
        puntos: ['Sin hojas que pasar en limpio', 'La recepción lo ve llegar al momento', 'Desde cualquier celular, sin instalar nada'],
        visual: { tipo: 'telefono', imagen: 'citas-registro', alt: 'El formulario «Tus datos» en el teléfono de una paciente de ejemplo, con su nombre, cédula y celular.' },
      },
    ],
  },
};

// Todo con el mismo consultorio inventado de las capturas («Dermatología Ríos»), para que la historia sea una sola.
// La conversación de la animación de recordatorios: el mensaje es el que arma el sistema; el nombre, inventado.
export const CHAT = {
  consultorio: 'Dermatología Ríos',
  mensaje: 'Hola, Daniela. Te recordamos tu cita en Dermatología Ríos el jueves 8 de octubre a las 9:00 a. m. con Dra. Ana Ríos. Responde SÍ para confirmar, o escríbenos si necesitas cambiarla o no podrás venir.',
  respuesta: 'Sí, ahí estaré',
  estado: 'Cita confirmada',
};

// La animación del dictado: el caso del expediente de las capturas. El héroe muestra las dos primeras secciones.
export const DICTADO = [
  { seccion: 'Motivo de consulta', texto: 'Lesiones rojas con descamación en codos y rodillas desde hace dos meses.' },
  { seccion: 'Examen físico', texto: 'Placas bien delimitadas con escama plateada en ambos codos.' },
  { seccion: 'Diagnóstico', texto: 'Psoriasis en placas, leve.' },
];

// La hoja impresa de la animación (datos inventados; la de verdad sale del sistema).
export const HOJA = {
  consultorio: 'Dermatología Ríos',
  paciente: 'Carlos Méndez Castillo',
  documento: '8-903-1111',
  edad: '47 años',
  fecha: 'Miércoles 7 de octubre, 10:00 a. m.',
  medico: 'Dra. Ana Ríos',
  antecedentes: 'Alergias: ninguna conocida · Enfermedades: diabetes',
  signos: 'PA 118/76 mmHg · Pulso 72 lpm · T 36.6 °C · SpO₂ 98 %',
  notas: [
    ['Motivo de consulta', 'Lesiones rojas con descamación en codos y rodillas desde hace dos meses.'],
    ['Examen físico', 'Placas bien delimitadas con escama plateada en ambos codos.'],
    ['Diagnóstico', 'Psoriasis en placas, leve.'],
    ['Indicaciones', 'Crema con corticoide dos veces al día por dos semanas. Control en un mes.'],
  ],
};

export const ACCESOS = {
  titulo: 'Cada quien ve lo que le toca',
  bajada: 'Tú decides qué puede hacer cada persona de tu equipo.',
  imagen: 'citas-accesos',
  alt: 'Personal y accesos en un consultorio de ejemplo: las casillas de acceso a expedientes, notas, signos y resultados de cada persona.',
  puntos: [
    { icono: 'users-three', titulo: 'Un usuario por persona', texto: 'Nadie comparte la clave de la recepción: cada quien entra con la suya.' },
    { icono: 'lock-key', titulo: 'Permisos con casillas', texto: 'Acceso a expedientes, notas, signos, imprimir y configuración, persona por persona.' },
    { icono: 'shield-check', titulo: 'El consentimiento del paciente', texto: 'Antes de guardar sus datos, el paciente acepta su uso según la Ley 81 de 2019, en la recepción o en su teléfono, y queda la fecha.' },
    { icono: 'clipboard-text', titulo: 'Las correcciones a la vista', texto: 'Una nota se corrige el mismo día y queda marcada como corregida.' },
  ],
};

export const PASOS = [
  { titulo: 'Pides tu prueba', texto: 'Nos escribes y nos dices cuántos médicos son y si quieres el expediente, la agenda o los dos.' },
  { titulo: 'Te lo dejamos listo', texto: 'Configuramos a tus médicos, sus horarios y las secciones de su nota, y creamos el usuario de cada persona.' },
  { titulo: `Lo usas ${PRUEBA_DIAS} días gratis`, texto: 'Con todo incluido. Si te sirve, sigues mes a mes; si no, no pagas nada.' },
];

export const PRUEBA = {
  titulo: 'Pruébalo en tu consultorio',
  bajada: 'Dicta tus primeros expedientes esta semana. Sin tarjeta y sin plan anual.',
  puntos: ['El dictado con IA, incluido en la prueba', 'Creamos el usuario de cada persona', 'Te mostramos cómo se usa'],
  // Mientras no haya WhatsApp ni correo en datos/sitio.mjs: los doctores llegan desde el correo que les mandamos.
  sinContacto: 'Para pedirla, responde el correo con el que te llegó esta página y te escribimos.',
};

export const PREGUNTAS = [
  ['¿Cómo funciona el dictado con IA?', 'Tocas «Dictar» en la sección de la nota y hablas. La IA convierte tu voz en texto en la casilla; lo revisas, corriges si hace falta y tocas «Agregar». No hace falta escribir a mano ni teclear. Funciona en Chrome, Edge y Safari.'],
  ['¿Y si no me llevo bien con la tecnología?', 'Es un botón: tocas «Dictar», hablas y revisas lo que quedó escrito. En la prueba te mostramos cómo se usa, paso a paso.'],
  ['¿Tengo que instalar algo?', 'No. Se usa en el navegador de la computadora, la tableta o el celular que ya tienes. Solo necesitas internet.'],
  ['¿Puedo contratar solo el expediente?', 'Sí. El expediente funciona sin la agenda: el médico abre la consulta del paciente que llega, la dicta y, si trabajan con folder, la recepción la imprime al terminar.'],
  ['¿Puedo contratar solo la agenda?', 'Sí. Tienes las citas, los recordatorios automáticos por WhatsApp, el registro de pacientes y la lista de espera, sin el expediente.'],
  ['¿Qué cuenta como profesional?', 'Cada médico que hace expedientes. La recepción, enfermería y administración tienen su propio usuario sin costo.'],
  ['¿Qué pasa si se me acaban los mensajes del mes?', 'Te avisamos para pasar al paquete siguiente. Mientras tanto, los recordatorios que falten se mandan con un toque desde el WhatsApp del consultorio.'],
  ['¿Puedo pasar mis pacientes desde Excel?', 'Sí. El sistema importa tus pacientes desde un Excel o un CSV: nombre, cédula o pasaporte, celular, correo, fecha de nacimiento, alergias, enfermedades, medicamentos y seguro.'],
  ['¿Quién puede ver los expedientes?', 'Solo las personas a las que les das ese acceso. La recepción puede agendar sin ver el expediente; si le das «Imprimir expedientes», lo puede ver e imprimir, pero no cambiar.'],
  [`¿Cómo es la prueba de ${PRUEBA_DIAS} días?`, 'Te dejamos el sistema listo y lo usas una semana con todo incluido. No pedimos tarjeta.'],
  ['¿Hay contrato o plan anual?', 'No. Después de la prueba pagas mes a mes.'],
];
