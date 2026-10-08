// Las guías de Citas Médicas (alphateklab.com/<ruta>): lo que un médico de Panamá busca antes de elegir un sistema, con
// la norma y el artículo de cada afirmación. Para los buscadores y los asistentes (ChatGPT cita lo que tiene fuente), y
// para que el médico confíe en lo que le decimos del producto. (datos/guias.mjs es de las guías del sitio de la agencia.)
//
// Reglas: cada dato legal con su norma, su artículo y el enlace a la Gaceta Oficial (o a una copia oficial); lo que el
// texto no resuelve se dice así y va a «Lo que conviene preguntarle a un abogado»; lo que dice del producto está
// comprobado en su código. Las normas se leyeron en la Gaceta Oficial o en LEGISPAN (Asamblea Nacional) el 8-oct-2026.
//
// Formato: [texto](enlace) es un enlace. Cada bloque es un párrafo (texto), una lista ({ lista: [...] }) o una cita
// textual de la norma ({ cita, fuente }).

const G = {
  ley68: 'https://www.gacetaoficial.gob.pa/gacetas/24935_2003.pdf',
  ley33: 'https://www.gacetaoficial.gob.pa/pdfTemp/27275_A/GacetaNo_27275a_20130426.pdf',
  de1458: 'https://www.gacetaoficial.gob.pa/pdfTemp/27160_A/GacetaNo_27160a_20121109.pdf',
  ley51: 'https://www.gacetaoficial.gob.pa/pdfTemp/26090/GacetaNo_26090_20080724.pdf',
  ley82: 'https://registro-publico.gob.pa/images/stories/Ley82de2012atribucionesalRPPparaserAutoridadRegistradoraycertificadoraraiz.pdf',
  ley81: 'https://www.gacetaoficial.gob.pa/pdfTemp/28743_A/GacetaNo_28743a_20190329.pdf',
  de285: 'https://www.gacetaoficial.gob.pa/pdfTemp/29296_A/GacetaNo_29296a_20210528.pdf',
  ley203: 'https://www.gacetaoficial.gob.pa/pdfTemp/29244_A/GacetaNo_29244a_20210318.pdf',
};

export const EXPEDIENTE_LEY = {
  ruta: 'expediente-clinico-electronico-panama/',
  titulo: 'Expediente clínico en Panamá: lo que piden la Ley 68 y la 81',
  descripcion: 'Lo que dicen la Ley 68 de 2003, el Decreto 1458 de 2012 y la Ley 81 de 2019: qué lleva el expediente, la firma, cuánto se guarda y los datos.',
  miga: 'Expediente clínico electrónico en Panamá',
  pie: 'Lo que pide la ley',
  h1: 'El expediente clínico electrónico en Panamá: lo que pide la ley',
  bajada:
    'Las normas que aplican a los consultorios y clínicas privadas, con el artículo y el enlace a la Gaceta Oficial de cada una. No es asesoría legal: al final van las preguntas que el texto de la ley no resuelve y conviene llevarle a un abogado.',
  publicada: '2026-10-08',
  revisada: { iso: '2026-10-08', texto: '8 de octubre de 2026' },
  secciones: [
    {
      id: 'en-corto',
      titulo: 'En corto',
      bloques: [
        {
          lista: [
            'Se puede llevar solo en electrónico, si se garantiza que el contenido es auténtico y que se podrá reproducir en el futuro (Ley 68 de 2003, art. 38).',
            'Cada anotación va con fecha y firma, y todo cambio queda registrado con el profesional que lo hizo (art. 38).',
            'Cada paciente tiene un expediente único en el centro (art. 37), con un contenido mínimo (art. 40).',
            'Se conserva como mínimo veinte años, contados desde la muerte del paciente (art. 49).',
            'El paciente tiene derecho a una copia (Decreto Ejecutivo 1458 de 2012, art. 6).',
            'Los datos de salud son datos sensibles. Si se tratan con el consentimiento del paciente, ese consentimiento es previo, irrefutable y expreso (Ley 81 de 2019, art. 8).',
          ],
        },
      ],
    },
    {
      id: 'normas',
      titulo: 'Las normas',
      bloques: [
        {
          lista: [
            `[Ley 68 de 20 de noviembre de 2003](${G.ley68}) (Gaceta Oficial 24935): los derechos y obligaciones de los pacientes. Regula el expediente clínico en los centros públicos y privados. La [Ley 33 de 2013](${G.ley33}) le agregó al artículo 38 un párrafo sobre los sistemas del MINSA y la CSS.`,
            `[Decreto Ejecutivo 1458 de 6 de noviembre de 2012](${G.de1458}) (Gaceta Oficial 27160-A): reglamenta la Ley 68. Su capítulo VIII trata del expediente clínico.`,
            `[Ley 51 de 2008](${G.ley51}), reformada por la [Ley 82 de 2012](${G.ley82}): los documentos y las firmas electrónicas.`,
            `[Ley 81 de 26 de marzo de 2019](${G.ley81}) y su reglamento, el [Decreto Ejecutivo 285 de 28 de mayo de 2021](${G.de285}): la protección de datos personales.`,
            `[Ley 203 de 18 de marzo de 2021](${G.ley203}): la telesalud.`,
          ],
        },
      ],
    },
    {
      id: 'electronico',
      titulo: '¿Puede ser solo electrónico?',
      bloques: [
        'Sí. Lo dice el artículo 38 de la Ley 68:',
        { cita: 'Los expedientes clínicos se pueden elaborar mediante soporte papel, audiovisual e informático, siempre que se garantice la autenticidad de su contenido y su plena reproducibilidad futura.', fuente: 'Ley 68 de 2003, art. 38' },
        'El mismo artículo pide que quede registrado todo cambio y el profesional que lo hizo, que el expediente sea legible y que «cualquier información incorporada al expediente clínico debe ser datada y firmada».',
        'El Decreto Ejecutivo 1458 permite a los centros públicos y privados organizar los expedientes «por medios convencionales o electrónicos» (art. 53). A los que los llevan en electrónico les pide regular el acceso por categoría profesional y que cada usuario tenga una clave que se actualice periódicamente (art. 54).',
        'La Ley 51 de 2008 da a los documentos electrónicos validez y efectos jurídicos si quedan accesibles para consultarlos después (art. 4), y los admite como prueba (art. 7). Una firma que exige la ley se cumple con un método que identifique al autor y sea confiable (art. 8). Una firma escaneada no es una firma electrónica calificada.',
        'Lo que ninguna norma dice es qué firma basta en un expediente privado: el usuario y la contraseña del médico, o una firma electrónica calificada.',
      ],
    },
    {
      id: 'contenido',
      titulo: 'Qué debe llevar',
      bloques: [
        'En cada centro, un expediente único por paciente (Ley 68, art. 37). El artículo 40 fija el contenido mínimo:',
        {
          lista: [
            'Identificación: nombre, fecha de nacimiento, sexo, cédula, número de Seguro Social, domicilio y teléfono, el médico responsable y el número de seguro privado.',
            'Datos clínicos: antecedentes, historia clínica y examen físico, procedimientos y sus resultados, interconsultas, tratamiento, la hoja de consentimiento cuando proceda y la epicrisis, entre otros.',
            'Datos sociales.',
          ],
        },
        'El Decreto 1458 agrega que toda atención en consulta ambulatoria, hospitalización o urgencias se registra en el expediente (art. 46), que el número del expediente coincide con el de la cédula (art. 47), y que no se usan símbolos ni abreviaturas y los diagnósticos se codifican con la Clasificación Internacional de Enfermedades de la OMS (art. 52).',
      ],
    },
    {
      id: 'acceso',
      titulo: 'Quién puede verlo',
      bloques: [
        'Toda persona tiene derecho a que se respete la confidencialidad de los datos de su salud (Ley 68, art. 13). Los centros públicos y privados deben tomar medidas técnicas y organizativas para protegerlos (art. 39). El personal administrativo solo accede a lo que necesita para su trabajo (art. 46), y la dirección del centro debe tener medidas de seguridad, control y registro de cualquier acceso (art. 48).',
      ],
    },
    {
      id: 'consentimiento',
      titulo: 'El consentimiento informado',
      bloques: [
        'Va por escrito en las intervenciones quirúrgicas, en los procedimientos diagnósticos invasores y, en general, cuando el procedimiento supone riesgos o inconvenientes notorios y previsibles (Ley 68, art. 16). Es específico para cada procedimiento (art. 17), y el paciente lo puede revocar en cualquier momento. El Decreto 1458 lista lo que debe llevar el documento (art. 22) y pide que la revocatoria sea por escrito y ante un testigo (art. 25).',
        'Es otro consentimiento que el que pide la Ley 81 para tratar los datos personales del paciente, que va más abajo.',
      ],
    },
    {
      id: 'conservar',
      titulo: 'Cuánto tiempo se guarda',
      bloques: [
        { cita: 'El expediente clínico se ha de conservar, como mínimo, hasta veinte años, contados desde la muerte del paciente. No obstante, se podrán seleccionar y destruir los documentos que no sean relevantes para la asistencia, transcurridos dos años desde la última atención del paciente.', fuente: 'Ley 68 de 2003, art. 49' },
        'Algunos documentos se guardan siempre esos veinte años, junto con los datos de identificación: los consentimientos, los informes de alta y los quirúrgicos, el registro del parto, los datos de la anestesia, los informes de exploraciones complementarias y las necropsias (art. 50). Si un establecimiento cierra, los expedientes se entregan a los pacientes, a sus familiares o a quien indique el MINSA (Decreto 1458, art. 58).',
        'En la práctica, la obligación de conservar es del centro, no del programa que use. Si cambias de sistema, saca antes una copia completa de tus expedientes.',
      ],
    },
    {
      id: 'copia',
      titulo: 'La copia para el paciente',
      bloques: [
        'El establecimiento entrega una copia del expediente cuando el paciente o su representante la pide (Decreto 1458, art. 6). La solicitud va por escrito al director de la entidad que lo custodia (art. 8). Se responde en un máximo de 30 días calendario, prorrogables hasta 60 (art. 9), y la reproducción la paga quien la pide (art. 10).',
        'La Ley 81, en cambio, da a la persona el derecho de acceso a sus datos en un máximo de 10 días hábiles y de forma gratuita (arts. 15 y 16). El texto no resuelve cuál de los dos plazos manda para el expediente.',
      ],
    },
    {
      id: 'datos',
      titulo: 'Los datos del paciente: la Ley 81 de 2019',
      bloques: [
        {
          lista: [
            'Aplica a personas y empresas, públicas o privadas (art. 1). Los datos relativos a la salud son datos sensibles (art. 4).',
            'Los médicos y los establecimientos pueden recolectar y procesar los datos de salud de sus pacientes, respetando el secreto profesional (art. 20).',
            'Si la base es el consentimiento y son datos de salud, debe ser «previo, irrefutable y expreso» (art. 8). No hace falta en una urgencia médica o sanitaria. El paciente lo puede retirar cuando quiera, y retirarlo debe ser tan fácil como darlo (Decreto 285, art. 19).',
            'La persona tiene derecho de acceso, rectificación, cancelación, oposición y portabilidad (art. 15).',
            'Una brecha de seguridad se notifica a la ANTAI y a los afectados en un plazo de 72 horas desde que se conoce (Decreto 285, art. 37).',
            'Si un proveedor trata los datos por encargo del consultorio (el «custodio»), hace falta un contrato que diga, entre otras cosas, que los trata solo según tus instrucciones, que te avisa de una brecha y que los devuelve o los elimina al terminar (Decreto 285, arts. 47 y 48).',
            'Las multas van de B/.1,000 a B/.10,000 (art. 36). Las infracciones muy graves pueden llevar además a la clausura de la base de datos (art. 43). Los reclamos los resuelve la ANTAI (Decreto 285, art. 54).',
          ],
        },
        'Mandar datos de salud a un proveedor en otro país, por ejemplo un servicio de transcripción en Estados Unidos, tiene reglas propias en los artículos 5, 13 y 33 de la ley. El texto no deja claro qué se exige cuando ese proveedor actúa por encargo del médico.',
      ],
    },
    {
      id: 'telesalud',
      titulo: 'Si atiendes por telemedicina',
      bloques: [
        'La Ley 203 de 2021 pide un consentimiento informado específico para la telemedicina, con constancia en la historia clínica (art. 6), y que toda actividad de telemedicina quede registrada en la historia clínica del paciente (art. 13). Si la plataforma es de un tercero, el prestador verifica su seguridad, su privacidad y su confidencialidad (art. 11). Las recetas, incapacidades y constancias por telemedicina valen con firma electrónica (art. 14).',
      ],
    },
    {
      id: 'citas-medicas',
      titulo: 'Qué hace Citas Médicas con esto, y qué no',
      bloques: [
        {
          lista: [
            'Cada nota queda con el nombre de quien la escribió y la hora. Una nota se corrige el mismo día y queda marcada como corregida.',
            'Cada persona entra con su usuario y su contraseña, y tiene solo los accesos que le marcas: expedientes, notas, signos, imprimir y configuración.',
            'Antes de guardar los datos de un paciente, el sistema le pide su consentimiento y guarda la fecha y la forma en que lo dio.',
            'Cada clínica tiene su propia base de datos, separada de las demás, con un respaldo diario. alphateklab trata los datos por encargo del consultorio, que es el responsable ([términos del servicio](../terminos/)).',
            'Puedes pedir una copia de tus datos en cualquier momento. Si cancelas, se guardan 90 días y te avisamos antes de borrarlos.',
            'El audio del dictado no se guarda. El servicio que lo transcribe está nombrado en la [política de privacidad](../privacidad/#dictado).',
          ],
        },
        'Lo que no hace: no codifica los diagnósticos con la CIE (se escriben en texto), no pide cambiar la contraseña cada cierto tiempo y no tiene firma electrónica calificada. Si tu centro los necesita, tenlo en cuenta.',
      ],
    },
    {
      id: 'abogado',
      titulo: 'Lo que conviene preguntarle a un abogado',
      bloques: [
        {
          lista: [
            'Qué firma basta en un expediente privado: el usuario y la contraseña del médico, o una firma electrónica calificada (Ley 68, art. 38; Ley 51, art. 8).',
            'Qué plazo manda para entregar la copia del expediente: 30 días calendario con costo (Decreto 1458) o 10 días hábiles gratis (Ley 81).',
            'Si usar un proveedor en el extranjero que trata los datos por encargo del médico exige la autorización explícita del paciente (Ley 81, art. 13) o basta la condición de asistencia sanitaria (art. 33) con un contrato de custodio.',
            'Si la Ley 68, como ley especial, deja fuera de la Ley 81 alguna parte del tratamiento del expediente (Ley 81, art. 3).',
            'Quién es el dueño del expediente: las normas regulan su custodia por el centro (Ley 68, art. 51; Decreto 1458, arts. 8 y 58), pero no dicen de quién es.',
          ],
        },
      ],
    },
  ],
  fuentes: [
    ['Ley 68 de 2003, Gaceta Oficial 24935', G.ley68],
    ['Ley 33 de 2013, Gaceta Oficial 27275-A (reforma del art. 38 de la Ley 68)', G.ley33],
    ['Decreto Ejecutivo 1458 de 2012, Gaceta Oficial 27160-A', G.de1458],
    ['Ley 51 de 2008, Gaceta Oficial 26090', G.ley51],
    ['Ley 82 de 2012 (copia del Registro Público)', G.ley82],
    ['Ley 81 de 2019, Gaceta Oficial 28743-A', G.ley81],
    ['Decreto Ejecutivo 285 de 2021, Gaceta Oficial 29296-A', G.de285],
    ['Ley 203 de 2021, Gaceta Oficial 29244-A', G.ley203],
  ],
};

export const GUIAS = [EXPEDIENTE_LEY];
