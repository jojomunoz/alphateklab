// Detalle de cada servicio (cómo funciona, qué necesitas, qué no incluye, preguntas, ejemplo).
// Redactado por agentes con los datos del catálogo y revisado por otro agente; se junta con herramientas/juntar-fichas.mjs.
export const FICHAS = {
  R01: {
    "como": [
      {
        "titulo": "Nos pasas tu carta",
        "texto": "Nos mandas la carta que usas hoy con sus precios, las fotos que tengas y qué platos llevan maní, mariscos u otros alérgenos."
      },
      {
        "titulo": "Armamos la carta digital",
        "texto": "La montamos por categorías, en español y en inglés, con los precios ya con ITBMS. Tú la revisas antes de publicarla."
      },
      {
        "titulo": "Te entregamos el QR",
        "texto": "Te damos el QR impreso, que apunta a una dirección a nombre tuyo. Lo pones junto a la carta de papel, en la mesa o en la entrada."
      },
      {
        "titulo": "Cambios desde el celular",
        "texto": "Cuando se acaba un plato o sube un precio, lo cambias en el panel desde tu celular y el cliente ya lo ve así en la carta."
      }
    ],
    "necesitas": [
      "Tu carta actual con los precios",
      "Fotos de tus platos",
      "Saber qué alérgenos lleva cada plato",
      "Un celular para entrar al panel"
    ],
    "no_incluye": [
      "Que el cliente pida y pague desde la mesa: eso es el servicio de pedir y pagar desde la mesa",
      "La sesión de fotos de los platos: la carta usa las fotos que nos des",
      "Imprimir o rediseñar la carta de papel",
      "Placas con un QR distinto por mesa: esas van con el servicio de pedir desde la mesa"
    ],
    "preguntas": [
      {
        "p": "¿Cuánto cuesta?",
        "r": "$10 al mes por la carta sola. Si quieres que el cliente también pida y pague desde la mesa, ese servicio se cotiza aparte."
      },
      {
        "p": "¿Tengo que dejar la carta de papel?",
        "r": "No. Está pensada para ir junto a la de papel, para quien prefiere leerla en su teléfono o en inglés."
      },
      {
        "p": "¿Qué pasa con el QR si un día cambio de proveedor?",
        "r": "El QR apunta a una dirección tuya, no a la nuestra. Si cambias de proveedor, la carta nueva se pone en esa misma dirección y no hay que reimprimir el QR."
      }
    ],
    "ejemplo": "Ejemplo: en un café de Boquete donde llegan muchos turistas, la carta en inglés evita explicar cada plato en la mesa. Cuando se acaba el pie de limón a media tarde, la dueña lo marca agotado desde su celular y deja de salir en la carta."
  },
  R02: {
    "como": [
      {
        "titulo": "Visita al local",
        "texto": "Vamos a ver cuántas mesas tienes, dónde se prepara cada pedido y dónde conviene poner la tableta, en la caja o en la cocina."
      },
      {
        "titulo": "Carta y cobro listos",
        "texto": "Montamos tu carta, le damos a cada mesa su propio QR y conectamos el cobro con tu cuenta de Yappy Comercial o de una pasarela de tarjeta."
      },
      {
        "titulo": "Placas en cada mesa",
        "texto": "Instalamos las placas con el QR de cada mesa y la tableta, y hacemos pedidos de prueba desde varias mesas antes de dejarlo andando."
      },
      {
        "titulo": "El servicio de cada día",
        "texto": "El cliente pide desde su teléfono y el pedido entra a la cocina o a la caja con el número de mesa. Al final pide la cuenta, la divide si quiere, elige su propina y paga."
      }
    ],
    "necesitas": [
      "Internet estable en el local para la tableta",
      "Una cuenta para cobrar en línea: Yappy Comercial o una pasarela de tarjeta",
      "Tu carta con precios y fotos"
    ],
    "no_incluye": [
      "Las comisiones de cada pago: las cobra Yappy, el banco o la pasarela",
      "La factura electrónica: lo que el cliente ve al pedir la cuenta es una precuenta, y la factura sale de tu punto de venta",
      "La conexión a internet del local"
    ],
    "preguntas": [
      {
        "p": "¿Y si el cliente prefiere pagar en efectivo o con el mesero?",
        "r": "Puede hacerlo como siempre. Pagar desde el teléfono es una opción más."
      },
      {
        "p": "¿La propina viene marcada?",
        "r": "No. El cliente escoge 10, 15, 20 % u otra cifra en su teléfono, y nadie se la pregunta en la mesa."
      },
      {
        "p": "¿Sigo necesitando meseros?",
        "r": "Sí. Llevan los platos y atienden. Lo que cambia es que no tienen que ir a cada mesa a tomar el pedido o a llevar la cuenta, salvo a quien prefiera hacerlo como siempre."
      }
    ],
    "ejemplo": "Ejemplo: en una cevichería de Vacamonte con 14 mesas, un grupo de seis pide desde la mesa 9, llama al mesero para otra ronda y al final divide la cuenta por plato. En la tableta de la caja se ve qué pidió cada mesa y cuál pidió la cuenta."
  },
  R03: {
    "como": [
      {
        "titulo": "Contamos las mesas",
        "texto": "Vemos cuántas mesas hay y eliges la placa, de acrílico o de madera, que lleva el QR y la etiqueta NFC juntos."
      },
      {
        "titulo": "Grabamos cada etiqueta",
        "texto": "En cada etiqueta grabamos la dirección de su mesa y la bloqueamos para que nadie la pueda cambiar con su teléfono."
      },
      {
        "titulo": "Prueba mesa por mesa",
        "texto": "Colocamos las placas y probamos cada una con un iPhone y un Android para confirmar que abre la mesa correcta."
      },
      {
        "titulo": "El cliente acerca el teléfono",
        "texto": "Acerca el teléfono a la placa y se le abre la carta de su mesa. Quien no tenga NFC escanea el QR de la misma placa."
      }
    ],
    "necesitas": [
      "Tener con nosotros la carta QR o el servicio de pedir desde la mesa: la etiqueta abre esa carta"
    ],
    "no_incluye": [
      "La carta y el sistema de pedidos: van en sus propios servicios",
      "Pagar acercando el teléfono, como en la terminal de tarjeta: la etiqueta solo abre la carta, y el pago se hace dentro de ella"
    ],
    "preguntas": [
      {
        "p": "¿Funciona en todos los teléfonos?",
        "r": "Funciona sin instalar nada en iPhone XS o más nuevos y en los Android que tienen NFC. En algunos aparece un aviso que hay que tocar para abrir la carta. Para los demás está el QR en la misma placa."
      },
      {
        "p": "¿Qué pasa si cambio la carta o los precios?",
        "r": "La etiqueta no se toca. Guarda la dirección de la mesa, y los cambios se hacen en la carta."
      },
      {
        "p": "¿Alguien puede cambiar lo que tiene grabado?",
        "r": "No. La etiqueta queda bloqueada contra escritura al grabarla, y ese bloqueo no se puede deshacer. Por eso graba una dirección de mesa que no cambia."
      }
    ],
    "ejemplo": "Ejemplo: en un bar de Casco Antiguo con poca luz, leer un QR con la cámara cuesta. El cliente acerca el teléfono a la placa de su mesa y la carta se abre con el número de mesa ya puesto."
  },
  R04: {
    "como": [
      {
        "titulo": "Hablamos de tu salón",
        "texto": "Nos cuentas cuántas mesas tienes, cómo las numeras y cómo cobras hoy. Una foto o un dibujo del salón ayuda."
      },
      {
        "titulo": "Dibujamos el plano",
        "texto": "Armamos el plano en el editor, con cada mesa en su sitio, girada y con su número. Si cambias el salón para un evento, la mueves tú."
      },
      {
        "titulo": "El mapa en la caja",
        "texto": "Dejamos el mapa abierto en la tableta o computadora de la caja y te mostramos cómo revisar y cerrar la cuenta de una mesa."
      },
      {
        "titulo": "El salón desde la caja",
        "texto": "Ves qué mesa está libre, cuál pidió y cuál llama al mesero. Al cerrar una mesa ves su cuenta con el ITBMS desglosado y sacas el comprobante."
      }
    ],
    "necesitas": [
      "Una tableta o computadora en la caja",
      "Internet en el local",
      "Que los pedidos entren por el sistema, desde el QR de la mesa o por el punto de venta, para que el mapa sepa qué pidió cada mesa"
    ],
    "no_incluye": [
      "El pedido desde la mesa: los avisos de que una mesa pidió o llama al mesero vienen de ese servicio",
      "La mensualidad del proveedor autorizado de factura electrónica (PAC): la cobra él"
    ],
    "preguntas": [
      {
        "p": "¿Tengo que instalar algo en el local?",
        "r": "Nada físico. Funciona en una tableta o computadora de la caja con internet. Si no tienes una, va en la propuesta."
      },
      {
        "p": "¿Sirve si cambio las mesas los fines de semana?",
        "r": "Sí. En el editor mueves, giras y vuelves a numerar las mesas cuando quieras."
      },
      {
        "p": "¿Las mesas cambian de estado solas?",
        "r": "Sí, si los pedidos entran por el QR de la mesa o por el punto de venta. Si se toman en libreta, el mapa no tiene de dónde saberlo."
      }
    ],
    "ejemplo": "Ejemplo: en un restaurante de comida típica en Chitré con salón y terraza, el cajero ve en la pantalla que la mesa 12 de la terraza pidió la cuenta y cuánto lleva, sin salir a preguntar. El domingo, cuando juntan mesas para un grupo grande, las mueve en el plano."
  },
  R05: {
    "como": [
      {
        "titulo": "Visita a la cocina",
        "texto": "Vemos cómo se reparte el trabajo entre parrilla, fríos y bar, y dónde va la pantalla para que el cocinero la vea sin moverse de su puesto."
      },
      {
        "titulo": "Platos por estación",
        "texto": "Definimos qué platos van a cada estación, para que la parrilla vea solo lo suyo y el bar solo las bebidas."
      },
      {
        "titulo": "Pantalla en la pared",
        "texto": "Instalamos la pantalla o tableta con su soporte de pared y mandamos comandas de prueba hasta que cada una salga donde debe."
      },
      {
        "titulo": "Marcar listo",
        "texto": "Cada comanda muestra cuánto lleva esperando. El cocinero la marca lista con un toque y la caja o el mesero reciben el aviso."
      }
    ],
    "necesitas": [
      "Wi-Fi que llegue bien a la cocina",
      "Un enchufe donde va la pantalla",
      "Que los pedidos entren por el sistema: QR en la mesa, pantalla de autopedido, pedidos para llevar o punto de venta"
    ],
    "no_incluye": [
      "Un enchufe nuevo o cableado eléctrico en la cocina",
      "La toma de pedidos: la pantalla muestra lo que entra por otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Necesito una pantalla por estación?",
        "r": "Depende de la cocina. Una pantalla puede mostrar varias estaciones o cada estación puede tener la suya; va en la propuesta."
      },
      {
        "p": "¿Y si los meseros siguen anotando en libreta?",
        "r": "Entonces a la pantalla no le llega nada. El pedido tiene que entrar por el sistema: desde la mesa, en la caja o en línea."
      }
    ],
    "ejemplo": "Ejemplo: en una parrillada de David, el viernes en la noche la parrilla y el bar tienen cada uno su pantalla. El parrillero ve que la comanda de la mesa 7 lleva 18 minutos y la saca primero; al marcarla lista, el mesero recibe el aviso."
  },
  R06: {
    "como": [
      {
        "titulo": "Visita al local",
        "texto": "Vemos por dónde entra la gente, dónde se forma la fila y si hay enchufe e internet donde iría el kiosco."
      },
      {
        "titulo": "Carta con fotos grandes",
        "texto": "Armamos la carta táctil con tus fotos y decidimos qué sugerir para completar el pedido, como la bebida o el acompañante."
      },
      {
        "titulo": "Pantalla y cobro",
        "texto": "Instalamos la pantalla con su pedestal y dejamos el cobro en una terminal de pago junto al kiosco o en la caja, como prefieras."
      },
      {
        "titulo": "Pedido con número",
        "texto": "El cliente arma su pedido, recibe un número de orden y espera el aviso de que está listo."
      }
    ],
    "necesitas": [
      "Espacio en la entrada con un enchufe cerca",
      "Internet en el local",
      "Fotos de tus productos",
      "Si quieres cobrar en el kiosco, una cuenta con tu banco o con una pasarela"
    ],
    "no_incluye": [
      "Las comisiones del pago con tarjeta: las cobra el banco o la pasarela",
      "Cableado eléctrico o de red hasta el kiosco",
      "La pantalla de cocina para ver los pedidos: es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Me conviene más que el QR en la mesa?",
        "r": "Si atiendes en mesas, casi siempre basta el QR en cada mesa. El kiosco tiene sentido en mostrador o comida rápida, donde la gente hace fila para pedir."
      },
      {
        "p": "¿De qué tamaño es la pantalla?",
        "r": "Entre 22 y 32 pulgadas, con pedestal. El tamaño se escoge en la visita según el espacio."
      },
      {
        "p": "¿El cliente puede pagar en efectivo?",
        "r": "Sí, si el cobro queda en la caja: pide en el kiosco y paga allá."
      }
    ],
    "ejemplo": "Ejemplo: en un local de hamburguesas en una plaza de La Chorrera, a la hora del almuerzo la fila llega a la puerta. Con un kiosco en la entrada, parte de los clientes arma su pedido ahí y espera su número, y la caja atiende al resto."
  },
  R07: {
    "como": [
      {
        "titulo": "Zonas, horario y cobro",
        "texto": "Definimos tu horario, las zonas a las que entregas, cuánto cobras por cada una y cómo quieres cobrar."
      },
      {
        "titulo": "Tu página de pedidos",
        "texto": "Montamos la carta con carrito, horario y zonas, y dejamos listo el pago con tarjeta o Yappy, o contra entrega."
      },
      {
        "titulo": "Pedidos de prueba",
        "texto": "Hacemos pedidos de prueba hasta que el aviso llegue completo al WhatsApp del local."
      },
      {
        "titulo": "Pedidos del día",
        "texto": "El cliente pide desde tu página y el pedido te llega al WhatsApp del local. Lo preparas para que lo recojan o lo mandas con tu repartidor."
      }
    ],
    "necesitas": [
      "Tu carta con precios y fotos",
      "La lista de zonas de entrega con su costo",
      "Una cuenta de Yappy Comercial o de una pasarela si quieres cobrar en línea",
      "Un número de WhatsApp del local para recibir los pedidos"
    ],
    "no_incluye": [
      "Los repartidores: la entrega la haces tú",
      "La comisión de Yappy o de la pasarela por cada pago en línea",
      "Publicidad para atraer clientes a la página"
    ],
    "preguntas": [
      {
        "p": "¿Cobran algo por cada pedido?",
        "r": "No. alphateklab no cobra comisión por pedido; el precio del servicio va en la propuesta. Por los pagos en línea, el banco o la pasarela cobra su propia comisión."
      },
      {
        "p": "¿Puedo seguir en las apps de delivery?",
        "r": "Sí. Tu página es un canal más, y el enlace lo puedes poner en tu Instagram y en tu WhatsApp."
      }
    ],
    "ejemplo": "Ejemplo: en una pizzería de Penonomé que reparte con su propio motorizado, el cliente arma su pedido en la página, escoge su barrio y ve el costo de entrega antes de pagar con Yappy. El pedido llega al WhatsApp del local con la dirección y lo que lleva."
  },
  R08: {
    "como": [
      {
        "titulo": "Turnos y capacidad",
        "texto": "Nos dices tus horarios, cuántas personas caben en cada turno y con cuánta anticipación aceptas reservas."
      },
      {
        "titulo": "Reservas en tu página",
        "texto": "Ponemos las reservas en tu página y te damos un enlace para tu Instagram. El cliente escoge día, hora y cuántos son."
      },
      {
        "titulo": "Recordatorio por WhatsApp",
        "texto": "Antes de la fecha, el cliente recibe un recordatorio y confirma. Si un turno se llena, puede anotarse en la lista de espera."
      },
      {
        "titulo": "Las reservas del día",
        "texto": "Al abrir ves las reservas del día sobre el plano del salón y sabes qué mesas quedan libres."
      }
    ],
    "necesitas": [
      "Tus horarios y la capacidad de cada turno",
      "Un número de WhatsApp del negocio para los recordatorios",
      "Tu página web o tu Instagram para poner el enlace"
    ],
    "no_incluye": [
      "El costo de los mensajes de WhatsApp: Meta lo cobra por mensaje",
      "Cobrar un depósito al reservar: si lo necesitas, se suma con cobros en línea",
      "Aparecer en aplicaciones de reservas de terceros"
    ],
    "preguntas": [
      {
        "p": "¿Tengo que tener página web?",
        "r": "No hace falta. El enlace de reservas funciona solo y lo puedes poner en tu Instagram o en tu WhatsApp."
      },
      {
        "p": "¿Y si el cliente no llega?",
        "r": "El recordatorio le pide confirmar antes. Qué hacer con una reserva sin confirmar lo decides tú, por ejemplo dársela a la lista de espera."
      }
    ],
    "ejemplo": "Ejemplo: en un restaurante de El Valle que se llena los sábados al mediodía, la gente reserva desde el enlace de su Instagram y le llega el recordatorio por WhatsApp antes de subir. Cuando el turno de la 1:00 se llena, los siguientes quedan en lista de espera."
  },
  R09: {
    "como": [
      {
        "titulo": "Visita al mostrador",
        "texto": "Vemos dónde van las pantallas, cuántas hacen falta y si hay enchufe e internet cerca de cada una."
      },
      {
        "titulo": "Diseño de las pantallas",
        "texto": "Diseñamos la carta, el plato del día y los precios para que se lean bien desde la fila."
      },
      {
        "titulo": "Horarios e instalación",
        "texto": "Dejamos programado qué se ve en el desayuno y qué en el almuerzo, y conectamos cada televisor a su reproductor o a su navegador."
      },
      {
        "titulo": "Cambios desde el celular",
        "texto": "Cambias el plato del día o un precio desde tu celular. Cuando marcas un plato agotado, sale solo de la pantalla."
      }
    ],
    "necesitas": [
      "Un enchufe junto a cada pantalla",
      "Internet en el local",
      "Tu carta con precios y, si tienes, fotos de los platos"
    ],
    "no_incluye": [
      "Instalación eléctrica nueva: si no hay enchufe donde va la pantalla, la hace tu electricista",
      "La carta QR para el teléfono del cliente: es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Puedo usar los televisores que ya tengo?",
        "r": "Puede ser. Si el televisor tiene navegador, o una entrada HDMI para un reproductor pequeño, lo revisamos en la visita."
      },
      {
        "p": "¿Cómo sabe la pantalla que un plato se acabó?",
        "r": "Lo marcas agotado desde el celular y deja de salir en la pantalla."
      }
    ],
    "ejemplo": "Ejemplo: en una cafetería de Santiago con dos pantallas sobre el mostrador, a las 11:00 el desayuno se cambia solo por el menú del almuerzo. Cuando se acaba el sancocho, la cocinera lo marca agotado y sale de la pantalla."
  },
  R10: {
    "como": [
      {
        "titulo": "Visita a la cocina",
        "texto": "Contamos neveras, congeladores y cuartos fríos, y revisamos que el Wi-Fi llegue hasta ellos."
      },
      {
        "titulo": "Sensores en cada equipo",
        "texto": "Ponemos un sensor de temperatura dentro de cada nevera o congelador y uno en su puerta, y un receptor pequeño, la puerta de enlace, en un enchufe donde llegue el Wi-Fi."
      },
      {
        "titulo": "Límites y avisos",
        "texto": "Defines el límite de cada equipo, por ejemplo 5 °C en la nevera, y a qué WhatsApp o correo llega el aviso."
      },
      {
        "titulo": "Aviso y registro",
        "texto": "Si la temperatura pasa del límite o una puerta queda abierta, te llega el aviso. El historial queda guardado y lo descargas cuando lo pida un inspector."
      }
    ],
    "necesitas": [
      "Wi-Fi que llegue a la cocina y al cuarto frío",
      "Un enchufe para el receptor (la puerta de enlace)",
      "Los números de WhatsApp o correos que van a recibir los avisos"
    ],
    "no_incluye": [
      "El costo de los avisos por WhatsApp: Meta lo cobra por mensaje",
      "La reparación de la nevera: el sistema avisa, el técnico de refrigeración la arregla",
      "La conexión a internet del local"
    ],
    "preguntas": [
      {
        "p": "¿Tengo que cambiar mis neveras?",
        "r": "No. Los sensores van dentro de las neveras y congeladores que ya tienes."
      },
      {
        "p": "¿Me sirve para las inspecciones del MINSA?",
        "r": "El historial se descarga para mostrarlo. El Decreto Ejecutivo 352 de 2001 pide registrar la temperatura de las cámaras de enfriamiento y congelación y guardar ese registro dos años; no hemos confirmado si sigue vigente ni si aplica a tu negocio."
      },
      {
        "p": "¿Qué pasa si se va la luz?",
        "r": "Sin luz ni internet el aviso no puede salir. Si eso te preocupa, cómo cubrirlo depende de tu local y va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: en una marisquería de Colón con dos congeladores y un cuarto frío, la puerta del cuarto queda mal cerrada al final del turno de la noche. El encargado recibe el aviso en su WhatsApp y regresa a cerrarla."
  },
  R11: {
    "como": [
      {
        "titulo": "Visita al negocio",
        "texto": "Vemos cómo vendes hoy, en mesa, en mostrador o para llevar, cuántas cajas y cajeros hay y qué productos manejas."
      },
      {
        "titulo": "Productos e inventario",
        "texto": "Cargamos tus productos con su precio e ITBMS, y los insumos que cada plato o producto descuenta del inventario."
      },
      {
        "titulo": "Caja y factura",
        "texto": "Instalamos la computadora o tableta, la impresora de tickets, el cajón y el lector de código de barras, y conectamos la factura electrónica con tu proveedor autorizado (PAC)."
      },
      {
        "titulo": "Cierre de cada turno",
        "texto": "Cada cajero vende en su turno y al final hace su cierre de caja. Tú ves lo vendido por turno y lo que queda en inventario."
      }
    ],
    "necesitas": [
      "Tu lista de productos con precios",
      "Tu RUC y los datos para la factura electrónica",
      "Internet en el local",
      "Un conteo inicial del inventario"
    ],
    "no_incluye": [
      "La mensualidad del proveedor de factura electrónica (PAC): la cobra él",
      "Las comisiones de tarjeta o de Yappy",
      "La terminal de tarjeta del banco",
      "Cableado eléctrico o de red"
    ],
    "preguntas": [
      {
        "p": "¿Sirve para la factura electrónica de la DGI?",
        "r": "Sí. La factura sale por un proveedor autorizado (PAC). Si ya tienes uno, revisamos si se puede conectar; si no, lo vemos en la propuesta."
      },
      {
        "p": "¿Puedo usar la computadora que ya tengo?",
        "r": "Depende del equipo. Lo revisamos en la visita, y lo que haya que comprar va en la propuesta."
      },
      {
        "p": "¿Funciona también para una tienda?",
        "r": "Sí. Sirve para restaurante y para comercio, con venta en mostrador y lector de código de barras."
      }
    ],
    "ejemplo": "Ejemplo: en una panadería con cafetería en Las Tablas, con dos cajeros al día, cada uno cierra su turno con lo vendido y el efectivo del cajón. Al vender un pan con jamón se descuentan el pan y el jamón del inventario, y la factura sale electrónica."
  },
};
