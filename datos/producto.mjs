// Citas Médicas: lo único que vende alphateklab desde el 7-oct-2026 (decisión de Edwin). La portada sale entera de
// aquí: los precios, lo que hace cada parte, las pantallas y las preguntas. Cambiar un precio es cambiar un número.
//
// Decisiones de Edwin (7-oct-2026):
// - Dos productos que se contratan por separado: la Agenda (por clínica, con un paquete de mensajes de WhatsApp) y el
//   Expediente (por profesional). Sin la agenda, el expediente funciona solo: el médico abre la consulta del paciente
//   que llega y la recepción la imprime para el folder.
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
  antetitulo: 'Para clínicas y consultorios en Panamá',
  // la parte entre [] va resaltada
  titulo: 'Citas [confirmadas por WhatsApp] y expedientes en orden',
  bajada:
    'La recepción agenda sin choques y el paciente confirma su cita por WhatsApp. El médico llena el expediente de cada consulta, dictando si quiere, y la recepción lo imprime para el folder. Contrata la agenda, el expediente o los dos.',
  puntos: [`${PRUEBA_DIAS} días gratis, sin tarjeta`, 'Te lo dejamos listo con tus pacientes', `Desde $${DESDE} al mes`],
  // Las tarjetas que flotan sobre las pantallas del héroe (nombres inventados).
  avisos: [
    { icono: 'whatsapp-logo', titulo: 'Recordatorio enviado', texto: 'Mañana 9:00 a. m., Dra. Ríos' },
    { icono: 'check-circle', titulo: 'Confirmó su cita', texto: 'Carlos Méndez' },
    { icono: 'heartbeat', titulo: 'Signos tomados', texto: 'PA 118/76, pulso 72' },
  ],
};

export const CONFIANZA = [
  { icono: 'map-pin', texto: 'Hecho en Panamá, en español' },
  { icono: 'device-mobile', texto: 'En la computadora, la tableta o el celular' },
  { icono: 'users-three', texto: 'Un usuario y sus permisos por persona' },
  { icono: 'shield-check', texto: 'Consentimiento según la Ley 81 de 2019' },
];

// Las dos partes, como se contratan.
export const PARTES = [
  {
    id: 'agenda',
    icono: 'calendar-check',
    nombre: 'Agenda de citas',
    para: 'Para la recepción',
    resumen: 'Citas sin choques, recordatorios por WhatsApp y la lista de a quién hay que llamar.',
    incluye: [
      'Agenda por médico y por consultorio, por día o por semana',
      'Recordatorio por WhatsApp para que el paciente confirme',
      'Quién no ha confirmado hoy y mañana',
      'Registro del paciente por QR desde su teléfono',
      'Lista de espera y sala de espera',
      'Usuarios para todo el equipo',
    ],
    unidad: 'al mes por clínica',
  },
  {
    id: 'expediente',
    icono: 'stethoscope',
    nombre: 'Expediente clínico',
    para: 'Para el médico',
    resumen: 'El expediente de cada consulta, con o sin la agenda, y la hoja lista para el folder.',
    incluye: [
      'Antecedentes: alergias, enfermedades, medicamentos y seguro',
      'Signos vitales, con el IMC calculado',
      'Nota por secciones, con dictado por voz',
      'Resultados en PDF o foto, desde la computadora o el celular',
      'La consulta impresa en tamaño carta para el folder',
      'Historial del paciente con todas sus consultas',
    ],
    unidad: 'al mes por profesional',
  },
];

// Las filas de cada parte: texto de un lado y su pantalla del otro. `visual`: la captura (assets/producto/<nombre>.webp,
// con su versión -oscuro) o una de las animaciones de la página («chat», «dictado», «hoja»).
export const FILAS = {
  agenda: {
    titulo: 'Que tus pacientes lleguen a su cita',
    bajada: 'Para la recepción: citas sin choques, recordatorios por WhatsApp y la lista de a quién llamar.',
    filas: [
      {
        titulo: 'La agenda del día, de un vistazo',
        texto: 'Cada médico en su columna, con los huecos libres, el almuerzo y quién ya está en la sala de espera.',
        puntos: ['Por día o por semana, por médico o por consultorio', 'No deja encimar citas del mismo médico, consultorio o paciente', 'Días sin atención, feriados y el almuerzo de cada médico'],
        visual: { tipo: 'portatil', imagen: 'citas-agenda', alt: 'La agenda de un consultorio de ejemplo: las citas del día de la Dra. Ríos y del Dr. Herrera, con las confirmadas, las atendidas y quién está en la sala.' },
      },
      {
        titulo: 'Recordatorios por WhatsApp que el paciente confirma',
        texto: 'Uno o dos días antes, al paciente le llega su recordatorio con la fecha, la hora y el médico. Responde, y la recepción ve quién confirmó y a quién hay que llamar.',
        puntos: ['200, 500 o 1000 mensajes al mes, según tu paquete', 'La lista de quién no ha confirmado hoy y mañana', 'Si no responde, se le vuelve a escribir'],
        visual: { tipo: 'chat' },
      },
      {
        titulo: 'El paciente se registra desde su teléfono',
        texto: 'Escanea un código QR en la recepción y llena sus datos: nombre, cédula o pasaporte, celular, alergias y seguro. Acepta ahí mismo el uso de sus datos.',
        puntos: ['Sin hojas que pasar en limpio', 'La recepción lo ve llegar al momento', 'Tus pacientes de Excel también se pueden importar'],
        visual: { tipo: 'telefono', imagen: 'citas-registro', alt: 'El formulario «Tus datos» en el teléfono de una paciente de ejemplo, con su nombre, cédula y celular.' },
      },
    ],
  },
  expediente: {
    titulo: 'El expediente de cada consulta, con o sin agenda',
    bajada: 'Para el médico: lo que antes escribía a mano, ahora ordenado, legible y a la mano en la próxima consulta.',
    filas: [
      {
        titulo: 'Signos, antecedentes y la nota del médico',
        texto: 'Enfermería anota los signos y el médico escribe su nota por secciones: motivo, lo que refiere el paciente, examen, diagnóstico e indicaciones.',
        puntos: ['Alergias y enfermedades a la vista en cada consulta', 'Resultados en PDF o foto, también con la cámara del celular', 'El historial con todas las consultas del paciente'],
        visual: { tipo: 'portatil', imagen: 'citas-expediente', alt: 'El expediente de un paciente de ejemplo: los signos que tomó enfermería, los resultados y la nota del médico.' },
      },
      {
        titulo: 'Dicta la nota mientras atiendes',
        texto: 'Toca «Dictar» en la sección y habla. El texto aparece en la casilla para que lo revises antes de guardarlo.',
        puntos: ['Por secciones, como ya escribes', 'Revisas y corriges antes de agregar', 'Funciona en Chrome, Edge y Safari'],
        visual: { tipo: 'dictado' },
      },
      {
        id: 'imprimir',
        titulo: '¿Trabajas con folder? Imprime la consulta',
        texto: 'Si tu clínica prefiere seguir con su secretaria y sus folders, no hay que cambiar eso: el médico llena el expediente y, al terminar la consulta, la recepción lo imprime para el folder del paciente.',
        pasos: ['El médico toca «Terminar consulta»', 'A la recepción le aparece en «Por imprimir»', 'Imprime la hoja tamaño carta y la guarda en el folder'],
        visual: { tipo: 'hoja' },
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

// La animación del dictado: el caso del expediente de las capturas.
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
  { titulo: 'Pides tu prueba', texto: 'Por WhatsApp o por correo. Nos dices cuántos médicos son y si quieres la agenda, el expediente o los dos.' },
  { titulo: 'Te lo dejamos listo', texto: 'Ponemos a tus médicos, horarios y servicios, pasamos tus pacientes desde tu Excel y creamos el usuario de cada persona.' },
  { titulo: `Lo usas ${PRUEBA_DIAS} días gratis`, texto: 'Con todo incluido. Si te sirve, sigues mes a mes; si no, no pagas nada.' },
];

export const PREGUNTAS = [
  ['¿Tengo que instalar algo?', 'No. Se usa en el navegador de la computadora, la tableta o el celular que ya tienes. Solo necesitas internet.'],
  ['¿Puedo contratar solo el expediente?', 'Sí. El expediente funciona sin la agenda: el médico abre la consulta del paciente que llega, la llena y, si trabajan con folder, la recepción la imprime al terminar.'],
  ['¿Puedo contratar solo la agenda?', 'Sí. Tienes las citas, los recordatorios por WhatsApp, el registro de pacientes y la lista de espera, sin el expediente.'],
  ['¿Qué cuenta como profesional?', 'Cada médico que hace expedientes. La recepción, enfermería y administración tienen su propio usuario sin costo.'],
  ['¿Qué pasa si se me acaban los mensajes del mes?', 'Te avisamos para pasar al paquete siguiente. Mientras tanto, los recordatorios que falten se mandan con un toque desde el WhatsApp del consultorio.'],
  ['¿Puedo pasar mis pacientes desde Excel?', 'Sí. Los importamos desde un Excel o un CSV: nombre, cédula o pasaporte, celular, correo, fecha de nacimiento, alergias, enfermedades, medicamentos y seguro.'],
  ['¿Quién puede ver los expedientes?', 'Solo las personas a las que les das ese acceso. La recepción puede agendar sin ver el expediente; si le das «Imprimir expedientes», lo puede ver e imprimir, pero no cambiar.'],
  ['¿Cómo dicta el médico?', 'Toca «Dictar» en la sección de la nota y habla; el texto aparece en la casilla para revisarlo antes de guardarlo. Funciona en Chrome, Edge y Safari.'],
  [`¿Cómo es la prueba de ${PRUEBA_DIAS} días?`, 'Te dejamos el sistema listo con tus datos y lo usas una semana con todo incluido. No pedimos tarjeta.'],
  ['¿Hay contrato o plan anual?', 'No. Después de la prueba pagas mes a mes.'],
];
