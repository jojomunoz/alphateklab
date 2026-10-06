// Guías cortas para el sitio de alphateklab (uso interno por ahora).
// Redactadas el 3-oct-2026. Cada afirmación concreta sale de la fuente oficial o primaria que se lista en su guía
// y que se abrió ese día (los PDF escaneados de la Gaceta Oficial se leyeron página por página).
// El comentario junto a cada fuente es el código HTTP de `curl -sI` del 3-oct-2026.

export const GUIAS = [
  {
    slug: 'factura-electronica',
    titulo: 'Factura electrónica en Panamá: quién está obligado y qué vía te conviene',
    bajada: 'Qué es, a quién obliga y desde cuándo, y cómo escoger entre el Facturador Gratuito de la DGI y un proveedor autorizado (PAC).',
    actualizada: '2026-10-03',
    secciones: [
      {
        titulo: 'Qué es',
        parrafos: [
          'La DGI la define como «un documento fiscal digital legalmente válido, que respalda las operaciones comerciales entre vendedor y comprador, firmado electrónicamente». Lleva un código QR para verificar que es válida.',
          'La Ley 256 de 2021 dejó escrito que toda venta de bienes o servicios se documenta de una de dos formas: con un equipo fiscal autorizado, como la impresora fiscal, o por el Sistema de Facturación Electrónica de Panamá. Ese sistema tiene dos modalidades: el Facturador Gratuito de la DGI y el proveedor de autorización calificado, o PAC.',
        ],
      },
      {
        titulo: 'Quién está obligado y desde cuándo',
        parrafos: [
          'Todo RUC nuevo desde el 1 de enero de 2022 tiene que facturar por el sistema electrónico (Ley 256 de 2021, parágrafo 6). A los proveedores del Estado, la DGI les dio hasta el 31 de octubre de 2022 para adoptarlo como su único método de facturación.',
          'Los permisos sin fecha de vencimiento para no usar equipo fiscal vencieron el 1 de marzo de 2024, y sus titulares debían pasarse al sistema electrónico (Resolución 201-0418). Desde entonces, la DGI dice que «los únicos dos sistemas de facturación son Factura Fiscal y Factura Electrónica»: si ya facturas con impresora fiscal, esa vía sigue siendo válida. Otro medio solo cabe por excepción de la DGI, por falta de internet o por la naturaleza o el volumen de la actividad (Ley 256, parágrafo 2).',
        ],
      },
      {
        titulo: 'Las dos vías',
        parrafos: [
          'El Facturador Gratuito de la DGI se usa en dgi-fep.mef.gob.pa desde el teléfono, la tableta o la computadora, con el RUC y el NIT de e-Tax 2.0. Emite facturas, notas de crédito y de débito y anulaciones, e importa artículos desde Excel, pero la DGI advierte que «no permite integración con otros sistemas». Desde el 1 de enero de 2026 es solo para quien tiene ingresos brutos de hasta B/.36,000 al año y emite hasta 100 documentos al mes; quien pase cualquiera de los dos límites debe usar un PAC (Resolución 201-6299 de 2025).',
          'Un PAC es una empresa que la DGI habilita para autorizar facturas electrónicas; tu sistema le envía cada factura. La lista oficial de la DGI muestra 18 al 3 de octubre de 2026. Esta modalidad pide el certificado de firma electrónica para factura electrónica: se solicita en e-Tax 2.0 y se retira en la Dirección Nacional de Firma Electrónica del Registro Público. Para pasarte del gratuito a un PAC presentas en e-Tax 2.0 una declaración jurada rectificativa, que no tiene costo.',
        ],
      },
      {
        titulo: 'Qué te conviene',
        parrafos: [
          'Cien documentos al mes son unos tres por día. Si estás dentro de los dos límites y facturas a mano, el Facturador Gratuito te alcanza. Si vendes con un punto de venta o una tienda en línea y quieres que cada venta salga facturada sin volver a escribirla, necesitas un PAC. Si te acercas a cualquiera de los dos límites, prepara el cambio antes de pasarte.',
          'Con cualquier método, el local debe tener a la vista la certificación del método de facturación con su código QR, que se descarga gratis en e-Tax 2.0 (Decreto Ejecutivo 25 de 2022), y un letrero con el método que usas y la multa al comprador que no pide factura (Ley 256 de 2021). Emitir facturas sin los requisitos o no conservarlas se multa con B/.500 a B/.1,000 la primera vez; en la primera reincidencia, con B/.5,000 a B/.10,000 y el cierre temporal del local.',
        ],
      },
    ],
    fuentes: [
      { nombre: 'DGI: ¿Qué es la factura electrónica?', url: 'https://dgi.mef.gob.pa/_7FacturaElectronica/felectronica' }, // curl -sI: 200
      { nombre: 'DGI: la obligación de emitir factura se mantiene con la Ley 473 (11 de febrero de 2026; requisito del código QR)', url: 'https://dgi.mef.gob.pa/New/news?n=296' }, // curl -sI: 200
      { nombre: 'Ley 256 de 26 de noviembre de 2021 (Gaceta Oficial 29424-B)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2021/11/29424_B/GacetaNo_29424b_20211126.pdf' }, // curl -sI: 200
      { nombre: 'DGI: los proveedores del Estado deben adoptar la factura electrónica (28 de septiembre de 2022)', url: 'https://dgi.mef.gob.pa/New/news?n=138' }, // curl -sI: 200
      { nombre: 'Resolución 201-0418 de 18 de enero de 2024 (Gaceta Oficial 29957)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2024/01/29957/GacetaNo_29957_20240125.pdf' }, // curl -sI: 200
      { nombre: 'DGI: preguntas frecuentes de facturación (pregunta 17)', url: 'https://dgi.mef.gob.pa/Preguntas/Facturacion' }, // curl -sI: 200
      { nombre: 'DGI: Facturador Gratuito', url: 'https://dgi.mef.gob.pa/_7FacturaElectronica/f-Gratuito' }, // curl -sI: 200
      { nombre: 'Resolución 201-6299 de 29 de julio de 2025 (DGI)', url: 'https://dgi.mef.gob.pa/_7FacturaElectronica/pdf/Resoluci%C3%B3n%20201-6299%20de%2029%20de%20julio%20de%202025.pdf' }, // curl -sI: 200
      { nombre: 'DGI: modalidad PAC y certificado de firma electrónica', url: 'https://dgi.mef.gob.pa/_7FacturaElectronica/Pcalificado' }, // curl -sI: 200
      { nombre: 'DGI: lista de proveedores de autorización calificados (PAC)', url: 'https://dgi.mef.gob.pa/_7FacturaElectronica/Proveedorespac' }, // curl -sI: 200
      { nombre: 'DGI: cómo ser emisor de factura electrónica (cambio de modalidad)', url: 'https://dgi.mef.gob.pa/_7FacturaElectronica/R-Emisorfe' }, // curl -sI: 200
      { nombre: 'Decreto Ejecutivo 25 de 27 de junio de 2022, artículo 6 (Gaceta Oficial 29567-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2022/06/29567_A/GacetaNo_29567a_20220629.pdf' }, // curl -sI: 200
    ],
    servicios: ['T07'],
  },

  {
    slug: 'itbms-y-propina-en-restaurantes',
    titulo: 'ITBMS y propina en un restaurante',
    bajada: 'La tasa de la comida y la del alcohol, cuándo una fonda no cobra ITBMS, el precio con impuestos incluidos de la Ley 473 y lo que dice la ley de la propina.',
    actualizada: '2026-10-03',
    secciones: [
      {
        titulo: 'Las tasas',
        parrafos: [
          'El ITBMS general es 7 % desde el 1 de julio de 2010 (Ley 8 de 2010, artículo 76), y la DGI aclara que incluye a los restaurantes con comida preparada. La venta al por mayor y al por menor de bebidas alcohólicas paga 10 %. En una misma cuenta pueden ir las dos tasas: 7 % el plato y 10 % la cerveza.',
          'Según las preguntas frecuentes de la DGI, declarar ITBMS es obligatorio cuando los ingresos del año pasan de B/.36,000 «o dependiendo de la actividad económica». La declaración se presenta en los primeros 15 días de cada mes.',
        ],
      },
      {
        titulo: 'El caso de las fondas',
        parrafos: [
          'La DGI lo resume así: «Fondas y restaurantes de comida rápida no deben cobrar ITBMS». La exención está en el artículo 1057-V del Código Fiscal, y la DGI la publica en su lista de servicios exentos con estas palabras: «expendio de alimentos en locales comerciales en los cuales no se vendan o consuman bebidas alcohólicas». Lo que cuenta es esa condición y no el nombre del local: si en tu fonda se vende o se toma cerveza, ya no la cumple. Confirma tu caso con tu contador.',
        ],
      },
      {
        titulo: 'El precio con ITBMS incluido',
        parrafos: [
          'Hoy el artículo 56 de la Ley 45 de 2007, en la versión de la Ley 34 de 2016, permite sumar los impuestos al precio anunciado. La Ley 473 de 19 de junio de 2025 cambia eso: en todo establecimiento o canal de venta, el precio a la vista tendrá que ser el total con impuestos y tasas. Iba a regir el 19 de junio de 2026, pero la Ley 531 de 18 de junio de 2026 movió su entrada en vigor al 1 de julio de 2027.',
          'Su reglamento, el Decreto Ejecutivo 2 de 23 de enero de 2026, rige desde el día siguiente a la entrada en vigor de la ley y entra en detalle. Define el menú digital como la versión electrónica del menú en teléfonos, tabletas o pantallas del local. Pide una leyenda visible que diga que los impuestos están incluidos en el precio total, y que en las plataformas electrónicas el precio total aparezca antes del pago. La factura no cambia: la DGI recordó en febrero de 2026 que debe seguir desglosando el ITBMS.',
        ],
      },
      {
        titulo: 'La propina',
        parrafos: [
          'La ley vigente dice que la propina «es voluntaria» y que no se incluye como cargo adicional al precio, salvo en servicios contratados de antemano donde se pacte. Se puede sugerir si la factura muestra el total con impuestos y, por separado, el total con la propina sugerida (Ley 34 de 2016). La Ley 473 repite esa regla, y su reglamento pide, desde julio de 2027, que la propina sugerida vaya en letra más pequeña que el precio total.',
          'En una cuenta que el cliente paga desde su teléfono, eso se traduce en mostrar primero el total con impuestos y después la propina como algo que el cliente escoge o quita. Si un cliente reclama por un cobro de propina, la queja va a ACODECO, la autoridad que aplica la Ley 45.',
        ],
      },
    ],
    fuentes: [
      { nombre: 'DGI: generalidades del ITBMS (tasas y fondas)', url: 'https://dgi.mef.gob.pa/itbms/Generalidades' }, // curl -sI: 200
      { nombre: 'DGI: servicios exentos de ITBMS (artículo 1057-V del Código Fiscal)', url: 'https://dgi.mef.gob.pa/itbms/SE-Itbms' }, // curl -sI: 200
      { nombre: 'DGI: preguntas frecuentes del ITBMS (preguntas 9 y 16)', url: 'https://dgi.mef.gob.pa/Preguntas/Itbms' }, // curl -sI: 200
      { nombre: 'Ley 34 de 2 de agosto de 2016, que modifica el artículo 56 de la Ley 45 de 2007 (Gaceta Oficial 28088-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2016/08/28088_A/GacetaNo_28088a_20160803.pdf' }, // curl -sI: 200
      { nombre: 'Ley 473 de 19 de junio de 2025, precio total (Gaceta Oficial 30304-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2025/06/30304_A/GacetaNo_30304a_20250619.pdf' }, // curl -sI: 200
      { nombre: 'Ley 531 de 18 de junio de 2026, que mueve la vigencia de la Ley 473 al 1 de julio de 2027 (Gaceta Oficial 30549-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2026/06/30549_A/GacetaNo_30549a_20260618.pdf' }, // curl -sI: 200
      { nombre: 'Decreto Ejecutivo 2 de 23 de enero de 2026, reglamento del precio total (Gaceta Oficial 30453-B)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2026/01/30453_B/GacetaNo_30453b_20260128.pdf' }, // curl -sI: 200
      { nombre: 'DGI: la factura sigue desglosando el ITBMS con la Ley 473 (11 de febrero de 2026)', url: 'https://dgi.mef.gob.pa/New/news?n=296' }, // curl -sI: 200
      { nombre: 'Ley 45 de 2007, texto que publica ACODECO (compilación de 2008: su artículo 56 todavía no trae la reforma de 2016)', url: 'https://www.acodeco.gob.pa/wp-content/uploads/2026/09/Ley45-31Oct2007.pdf' }, // curl -sI: 200
    ],
    servicios: ['R02', 'R11', 'T07'],
  },

  {
    slug: 'app-propia-o-plataformas',
    titulo: 'App propia o plataformas de delivery: cómo sacar la cuenta',
    bajada: 'Cómo comparar lo que te cobra una plataforma por pedido con lo que cuesta tener tu propio canal, con tu comisión real y tus números.',
    actualizada: '2026-10-03',
    secciones: [
      {
        titulo: 'Lo que te cobra la plataforma',
        parrafos: [
          'La plataforma te cobra una comisión por cada pedido. No encontramos una cifra pública y verificable de esa comisión para Panamá, así que toma la de tu contrato o la de tu estado de cuenta, no la de un anuncio.',
          'La cuenta del mes es: pedidos × ticket promedio × tu porcentaje. Con números de ejemplo, 400 pedidos de B/.15 suman B/.6,000, y cada punto porcentual de comisión te cuesta B/.60 al mes. Revisa en tu contrato si el porcentaje se calcula sobre el subtotal o sobre el total, si cambia cuando el reparto lo haces tú, y si pagas aparte por promociones.',
        ],
      },
      {
        titulo: 'Lo que cuesta tu propio canal',
        parrafos: [
          'En tu canal no pagas comisión a una plataforma, pero cobrar cuesta. Yappy Comercial cobra 1 % más ITBMS por cada pago recibido, con un mínimo de $0.02, y esa comisión no la paga el cliente. Una pasarela de tarjetas puede cobrar un porcentaje más un cargo fijo: la tarifa publicada de Tilopay para Panamá es 3.75 % más $0.50 por transacción con tarjeta, consultada el 3 de octubre de 2026.',
          'Si es una app, publicarla a nombre de tu negocio cuesta $99 al año en Apple y un pago único de $25 en Google Play. A eso súmale lo que te cuesta cada entrega con tus motorizados, el desarrollo y el mantenimiento de la app o la página, y lo que gastes para que tus clientes la conozcan.',
        ],
      },
      {
        titulo: 'Cómo compararlo',
        parrafos: [
          'Hazlo por pedido. En la plataforma, cada pedido te cuesta el ticket multiplicado por tu porcentaje de comisión. En tu canal, te cuesta lo que cobra el medio de pago (su porcentaje y su cargo fijo, si lo tiene) más la entrega, si en la plataforma no la pagabas tú. La diferencia entre las dos cifras es lo que ahorras en cada pedido que pasa a tu canal.',
          'Divide tus costos fijos del mes del canal propio entre ese ahorro por pedido y sabrás cuántos pedidos al mes necesitas para quedar igual. Con números de ejemplo, si ahorras B/.2 por pedido y tus costos fijos son B/.600 al mes, el punto de equilibrio son 300 pedidos. Por debajo de esa cifra, la plataforma te sale más barata; por encima, tu canal.',
        ],
      },
      {
        titulo: 'Lo que aplica en cualquier canal',
        parrafos: [
          'Desde el 1 de julio de 2027 la Ley 473 obliga a mostrar el precio total con impuestos en todo canal de venta, y su reglamento pide que en las plataformas electrónicas ese precio se vea antes del pago. Cada venta por tu canal lleva su factura (Ley 256 de 2021).',
          'En tu canal, el nombre, el teléfono y la dirección del cliente quedan en tu sistema y respondes por ellos según la Ley 81: aviso al pedirlos, por regla general consentimiento para mandarle promociones, y la opción de oponerse a ellas en todo momento (Decreto Ejecutivo 285, artículo 29). Si los pedidos entran por WhatsApp Business, Meta cobra por mensaje desde el 1 de julio de 2025. Según su página de precios, actualizada el 1 de octubre de 2026, lo que te escribe el cliente no se cobra y abre una ventana de 24 horas para responderle; esas respuestas son mensajes de servicio, gratis hasta 1,000 al mes por número y cobrados desde el 1,001. Los mensajes de plantilla, como los recordatorios o las promociones, se cobran por mensaje según su categoría, con una tarifa que Meta actualiza en su calendario de precios.',
        ],
      },
    ],
    fuentes: [
      { nombre: 'Yappy Comercial: preguntas frecuentes (comisión por cobro)', url: 'https://www.yappy.com.pa/comercial/preguntas-frecuentes/' }, // curl -sI: 200
      { nombre: 'Tilopay: tarifas por país (Panamá)', url: 'https://tilopay.com/tarifas' }, // curl -sI: 200
      { nombre: 'Apple Developer Program: inscripción y cuota anual', url: 'https://developer.apple.com/programs/enroll/' }, // curl -sI: 200
      { nombre: 'Google Play Console: cuota de registro', url: 'https://support.google.com/googleplay/android-developer/answer/6112435?hl=es' }, // curl -sI: 404 (Google responde 404 a HEAD; GET: 200)
      { nombre: 'Ley 473 de 19 de junio de 2025, precio total en todo canal de venta (Gaceta Oficial 30304-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2025/06/30304_A/GacetaNo_30304a_20250619.pdf' }, // curl -sI: 200
      { nombre: 'Ley 531 de 18 de junio de 2026, vigencia de la Ley 473 (Gaceta Oficial 30549-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2026/06/30549_A/GacetaNo_30549a_20260618.pdf' }, // curl -sI: 200
      { nombre: 'Decreto Ejecutivo 2 de 23 de enero de 2026, precio en plataformas electrónicas (Gaceta Oficial 30453-B)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2026/01/30453_B/GacetaNo_30453b_20260128.pdf' }, // curl -sI: 200
      { nombre: 'Ley 256 de 26 de noviembre de 2021, obligación de facturar (Gaceta Oficial 29424-B)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2021/11/29424_B/GacetaNo_29424b_20211126.pdf' }, // curl -sI: 200
      { nombre: 'Decreto Ejecutivo 285 de 28 de mayo de 2021, artículo 29 (Gaceta Oficial 29296-A)', url: 'https://www.gacetaoficial.gob.pa/storage/gacetas/2021/05/29296_A/GacetaNo_29296a_20210528.pdf' }, // curl -sI: 200
      { nombre: 'Meta: precios de la plataforma de WhatsApp Business (por mensaje desde el 1 de julio de 2025)', url: 'https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing' }, // curl -sI: 200
    ],
    servicios: ['R12', 'R07', 'R13'],
  },
];

// Lo que se buscó y NO se pudo confirmar en una fuente oficial o primaria; por eso no está en las guías.
// NO CONFIRMADO: comisión por pedido de las plataformas de delivery en Panamá (PedidosYa u otras). No hay cifra pública verificable; la investigación tenía un «10 %» de un fragmento de búsqueda sin abrir y la prensa habla de un 25 % «en un inicio», sin fecha ni documento.
// NO CONFIRMADO: lo que dijo ACODECO en mayo de 2026 sobre la propina (que lo común es sugerir 10 %, que no hay norma sobre el porcentaje, quejas por la línea 311). Solo está en prensa (TVN, 4-may-2026); las páginas de ACODECO sobre propina (inicio/noticias-panama-12 y -179) dan 404 desde el cambio de sitio y no están en el Wayback Machine.
// NO CONFIRMADO: monto de la multa por incumplir el artículo 56 de la Ley 45 (precio y propina). La prensa dice hasta B/.25,000; el texto de la Ley 45 que publica ACODECO es una compilación de 2008 (artículo 104: de amonestación a B/.25,000) y no se comprobó que siga vigente así.
// NO CONFIRMADO: fecha en que la factura electrónica será obligatoria para un negocio con RUC anterior a 2022 que usa impresora fiscal. El Decreto Ejecutivo 25 de 2022 dice que para las actividades no listadas «será establecida posteriormente» y no se encontró norma posterior; hay blogs que afirman una obligación general sin citar norma.
// NO CONFIRMADO: precios de los PAC y del certificado de firma electrónica, y los plazos de implementación con PAC (la tabla de la página de la DGI está vacía).
// NO CONFIRMADO: numeral exacto de la exención de las fondas. La DGI la ubica en el artículo 1057-V, parágrafo 8, literal b; contando su lista sería el numeral 17, pero no se leyó el texto del Código Fiscal.
// NO CONFIRMADO: si la propina causa ITBMS.
// NO CONFIRMADO: si mandar promociones a quien ya es cliente cabe en la excepción del artículo 8, numeral 5 de la Ley 81 («relación comercial establecida... comercialización»). No se encontró criterio de la ANTAI; las guías dicen «por regla general, consentimiento», como la ANTAI.
// CONFIRMADO en la sesión principal (3-oct-2026, versión en inglés de la página de Meta, actualizada el 30-sep-2026 con vigencia 1-oct-2026): «Meta provides 1,000 free service messages per month… Meta only charges as of the 1,001st service message». La versión en español no lo traía.
