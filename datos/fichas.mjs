// Detalle de cada servicio (cómo funciona, qué necesitas, qué no incluye, preguntas, ejemplo).
// Redactado por agentes con los datos del catálogo y revisado por otro agente; se junta con herramientas/juntar-fichas.mjs.
export const FICHAS = {
  C01: {
    "como": [
      {
        "titulo": "Visita a la puerta",
        "texto": "Vamos al local a ver la entrada: el ancho, la altura del techo y si hay toma eléctrica cerca. De eso depende si va una cámara sobre la puerta o un sensor en el techo."
      },
      {
        "titulo": "Instalación y línea de conteo",
        "texto": "Montamos el equipo y marcamos la línea que la gente cruza al entrar y al salir. Se prueba contando a mano un rato y comparando con lo que marca el equipo."
      },
      {
        "titulo": "Aforo y cruce con la caja",
        "texto": "Fijas el máximo de personas adentro para el aviso de aforo. Con el número de ventas por hora de tu caja sale cuántos de los que entraron compraron."
      },
      {
        "titulo": "El reporte del día",
        "texto": "Ves en el teléfono o la computadora cuánta gente entró hoy, por hora, y la comparas con la semana pasada. Si se llena, te llega el aviso."
      }
    ],
    "necesitas": [
      "Una toma eléctrica cerca de la puerta e internet en el local",
      "El reporte de ventas por hora de tu caja, para sacar cuántos compraron",
      "El máximo de personas que aceptas adentro, si quieres el aviso de aforo"
    ],
    "no_incluye": [
      "El sistema de caja: se usan las ventas del que ya tienes",
      "Obras eléctricas si no hay toma cerca de la puerta",
      "Reconocer quién es cada persona: el equipo cuenta cruces, sin nombres"
    ],
    "preguntas": [
      {
        "p": "¿Cuenta dos veces a la misma persona?",
        "r": "Cuenta cada vez que alguien cruza la puerta. Quien sale y vuelve a entrar suma dos, y tus empleados también cruzan; cómo separarlos depende de tu local y se ve en la visita."
      },
      {
        "p": "¿Puedo verlo funcionar antes?",
        "r": "Sí. En el laboratorio del sitio hay una demo que cuenta personas con la cámara de tu computadora, sin que el video salga de tu equipo."
      },
      {
        "p": "¿Cuánto cuesta?",
        "r": "Depende de cuántas puertas tengas y de si va cámara o sensor de techo. La cifra va cerrada en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: una zapatería de David con una sola entrada pone el contador sobre la puerta. Un sábado ve que entre las 3 y las 5 de la tarde entraron muchas más personas que las ventas que marcó la caja, y decide poner una vendedora más en ese horario."
  },
  C02: {
    "como": [
      {
        "titulo": "Recorrido por el local",
        "texto": "Caminamos el local contigo y marcamos los pasillos, exhibidores y zonas que te interesa medir. Revisamos si tus cámaras actuales ven esas zonas desde arriba."
      },
      {
        "titulo": "Cámaras de techo",
        "texto": "Usamos las cámaras que sirvan y ponemos las que falten para cubrir el piso de venta. Cada zona queda con su nombre en el sistema."
      },
      {
        "titulo": "Primer mapa",
        "texto": "Con los datos que se van juntando ves por hora dónde se detiene la gente, cuánto tiempo y qué pasillos casi nadie recorre."
      },
      {
        "titulo": "Mover y comparar",
        "texto": "Cuando cambias un exhibidor de lugar, anotas la fecha y comparas el mapa de antes con el de después."
      }
    ],
    "necesitas": [
      "Internet en el local",
      "Acceso a tus cámaras actuales, si quieres que revisemos si sirven",
      "Anotar la fecha de cada cambio de exhibidor, para comparar"
    ],
    "no_incluye": [
      "Decidir dónde va cada producto: el mapa muestra el recorrido y la decisión es tuya",
      "Saber quién es cada persona: el mapa mide presencia por zona",
      "Cuántos de los que entran compran: eso lo da el contador de personas en la entrada"
    ],
    "preguntas": [
      {
        "p": "¿Sirven las cámaras que ya tengo?",
        "r": "Depende de dónde están y de si se pueden conectar por la red. Las revisamos en la visita; las que sirven se usan y solo se compran las que falten."
      },
      {
        "p": "¿Mis clientes van a saber que los miden?",
        "r": "Deben saberlo. La Ley 81 de 2019 protege los datos personales y la ANTAI ha tratado el video de vigilancia como dato sensible, así que el local lleva un aviso visible de que hay cámaras y para qué se usan."
      },
      {
        "p": "¿Y si mi local es pequeño?",
        "r": "Con un solo pasillo el mapa dice poco. Te lo decimos en la conversación antes de proponerte nada."
      }
    ],
    "ejemplo": "Ejemplo: un almacén de ropa en Santiago, con cuatro pasillos, ve en el mapa que casi nadie llega al fondo donde están los jeans. Pasa los jeans al frente y compara en el reporte el antes y el después."
  },
  C03: {
    "como": [
      {
        "titulo": "Visita a las cajas",
        "texto": "Vemos dónde se forma la fila y desde dónde una cámara la ve completa. Si ya hay una cámara que la cubre, se usa."
      },
      {
        "titulo": "Marcar la zona de fila",
        "texto": "En la imagen de la cámara se marca el área de la fila, sin tomar pasillos ni vitrinas. Tú decides con cuántas personas esperando salta el aviso."
      },
      {
        "titulo": "Quién recibe el aviso",
        "texto": "Eliges si el aviso llega al WhatsApp del encargado, a una pantalla en el local o a los dos. Se prueba con gente del local haciendo fila."
      },
      {
        "titulo": "En el día a día",
        "texto": "Cuando la fila pasa del número, el encargado recibe el aviso y abre otra caja. Al final de la semana ves los tiempos de espera por hora."
      }
    ],
    "necesitas": [
      "Internet en el local",
      "El número de personas en fila que para ti ya es demasiado",
      "Alguien que reciba el aviso y pueda abrir otra caja"
    ],
    "no_incluye": [
      "El costo de los avisos por WhatsApp: Meta lo cobra por mensaje, unos US$0,011 cada uno en Panamá según su tarifa de octubre de 2026; el aviso en pantalla no tiene ese costo",
      "Personal para abrir la otra caja: el aviso solo dice cuándo hace falta",
      "La pantalla del local, si eliges ese aviso y no tienes una"
    ],
    "preguntas": [
      {
        "p": "¿La cámara va a contar a los que miran la vitrina junto a la caja?",
        "r": "Cuenta a quien esté dentro de la zona marcada. Por eso la zona se ajusta en la visita para que no tome pasillos ni vitrinas."
      },
      {
        "p": "¿Me van a llegar avisos todo el día?",
        "r": "Solo cuando la fila pasa del número que fijaste. Si llegan demasiados, se sube el número."
      },
      {
        "p": "¿Necesito una cámara nueva?",
        "r": "Solo si ninguna de las tuyas ve la fila completa. Eso se ve en la visita."
      }
    ],
    "ejemplo": "Ejemplo: en una farmacia de La Chorrera con tres cajas y una sola abierta al mediodía, la cámara avisa al WhatsApp del encargado cuando hay más de cinco personas esperando. El encargado abre la segunda caja y el reporte de la semana muestra a qué hora se repite la fila."
  },
  C04: {
    "como": [
      {
        "titulo": "Ver tu mercancía",
        "texto": "Vemos tu mercancía y cómo la cuentas hoy. Si es ropa, la vía es una etiqueta RFID por pieza; si son abarrotes, el teléfono lee las etiquetas del estante."
      },
      {
        "titulo": "Etiquetas y lector",
        "texto": "Se etiqueta la mercancía, o se registran las etiquetas del estante, y se deja el lector RFID de mano o el teléfono listo para escanear."
      },
      {
        "titulo": "Conexión con tu sistema",
        "texto": "El escaneo se conecta al sistema de inventario. Lo que cuentas se compara contra lo que dice tu sistema y sale la lista de diferencias."
      },
      {
        "titulo": "Contar en un recorrido",
        "texto": "Para contar, alguien recorre la tienda con el lector o el teléfono. Al terminar ves qué falta, qué sobra y dónde."
      }
    ],
    "necesitas": [
      "Tu lista de productos con su código y las existencias de tu sistema actual",
      "Que la mercancía nueva entre con su etiqueta, si usas RFID",
      "Internet o red en la tienda para subir cada conteo"
    ],
    "no_incluye": [
      "Las etiquetas RFID de la mercancía que llegue después: se compran con cada pedido",
      "El punto de venta y la factura electrónica: son otros servicios",
      "Hacer el conteo por ti: el recorrido con el lector lo hace tu personal"
    ],
    "preguntas": [
      {
        "p": "¿Sirve para una tienda de abarrotes?",
        "r": "Sí, por otra vía. En vez de poner una etiqueta RFID a cada producto, la cámara del teléfono lee las etiquetas del estante."
      },
      {
        "p": "¿Tengo que cambiar el sistema que uso?",
        "r": "No necesariamente. El conteo se compara contra lo que dice tu sistema. Cómo se conectan depende de tu sistema y va en la propuesta."
      },
      {
        "p": "¿Quién pone las etiquetas la primera vez?",
        "r": "Depende de cuánta mercancía tengas. En la propuesta queda quién lo hace y cuánto cuesta."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de ropa en Los Andes con dos pisos etiqueta cada prenda con RFID. El conteo de fin de mes se hace pasando el lector de mano por los colgadores, y el sistema muestra qué tallas faltan contra lo que dice el inventario."
  },
  C05: {
    "como": [
      {
        "titulo": "Qué pérdidas te preocupan",
        "texto": "Nos cuentas dónde crees que se va la mercancía o el efectivo: la caja, la bodega o la puerta de atrás. Revisamos las cámaras que ya tienes."
      },
      {
        "titulo": "Cámaras y grabador",
        "texto": "Instalamos las cámaras que falten y un grabador que analiza el video en el local. Se definen los momentos a marcar, como el cajón abierto sin venta o mercancía saliendo por atrás."
      },
      {
        "titulo": "Revisión de eventos",
        "texto": "Cada momento marcado queda con su clip de video. Lo revisas desde el teléfono o la computadora, sin ver horas de grabación."
      },
      {
        "titulo": "Buscar cuando pasa algo",
        "texto": "Si falta algo en el cierre, buscas por hora y por cámara y vas directo al momento."
      }
    ],
    "necesitas": [
      "Internet en el local y un lugar seguro para el grabador",
      "Que tu caja registre ventas y aperturas del cajón, si quieres cruzarlas con el video",
      "Un letrero visible de que hay cámaras y el aviso por escrito a tu personal"
    ],
    "no_incluye": [
      "Alguien vigilando el video en vivo: el sistema marca los momentos y los revisas tú",
      "Reconocer caras o identificar personas por nombre",
      "Concluir quién se llevó algo: eso lo decides tú con el clip"
    ],
    "preguntas": [
      {
        "p": "¿Puedo grabar a mis empleados?",
        "r": "La Ley 81 de 2019 protege los datos personales, y la ANTAI ha tratado el video de vigilancia como dato sensible. Pon letreros visibles y avisa a tu personal por escrito; para tu reglamento interno, consulta a tu abogado."
      },
      {
        "p": "¿El video sale de mi local?",
        "r": "El análisis se hace en el grabador del local, sin mandar el video a otro servicio. Verlo desde el teléfono es opcional y tú decides quién tiene acceso."
      },
      {
        "p": "¿Sirven mis cámaras actuales?",
        "r": "Depende de su ubicación y de si se pueden conectar por la red. Las revisamos en la visita y solo se compran las que falten."
      }
    ],
    "ejemplo": "Ejemplo: un minisúper de Chitré con dos cajas y una bodega atrás no cuadra el efectivo algunos cierres. Las cámaras marcan cada vez que el cajón se abre sin venta y cada salida por la puerta de la bodega fuera de la hora de carga, y el dueño revisa esos clips desde su teléfono."
  },
  C06: {
    "como": [
      {
        "titulo": "Catálogo y envíos",
        "texto": "Revisamos qué vendes, con qué tallas o colores, y cómo entregas: envío a domicilio, retiro en tienda o los dos."
      },
      {
        "titulo": "Carga de productos",
        "texto": "Se suben tus productos con fotos, precios, variantes y existencias. Tú revisas la tienda antes de abrirla."
      },
      {
        "titulo": "Cobro de prueba",
        "texto": "Conectamos la pasarela panameña para cobrar con tarjeta y Yappy, y hacemos una compra de prueba de punta a punta."
      },
      {
        "titulo": "Pedidos del día",
        "texto": "Cada pedido te llega por correo y por WhatsApp, y la existencia del producto baja sola. Tú preparas y entregas."
      }
    ],
    "necesitas": [
      "Tu lista de productos con precios, tallas o colores y existencias",
      "Fotos de los productos",
      "Una cuenta para recibir cobros a nombre de tu negocio; si no la tienes, te decimos cuál abrir",
      "Tus reglas de entrega: zonas, cargo de envío y horario de retiro"
    ],
    "no_incluye": [
      "La comisión de cada cobro, que la cobra la pasarela o el banco: Yappy Comercial, por ejemplo, cobra 1 % más ITBMS por transacción",
      "El reparto: la tienda te pasa la dirección y quién lleva el pedido lo decides tú",
      "La factura electrónica de cada venta: se conecta con el servicio de factura electrónica",
      "El dominio con el nombre de tu negocio, si no tienes uno: va en el servicio de correo y dominio"
    ],
    "preguntas": [
      {
        "p": "¿Puedo cambiar precios y productos yo mismo?",
        "r": "Sí, desde el panel de la tienda. Te enseñamos a usarlo al entregarla."
      },
      {
        "p": "Ya vendo por Instagram y WhatsApp, ¿me sirve?",
        "r": "Sí. Pones el enlace de la tienda en tu perfil y en tus respuestas, y el cliente compra y paga sin que tengas que anotar el pedido."
      },
      {
        "p": "¿Cuánto cuesta?",
        "r": "Depende de cuántos productos tengas y de cómo entregas. La cifra va cerrada en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de artículos de cocina en Vía España con unos 300 productos abre su tienda en línea con retiro en el local y envío dentro de la ciudad. El cliente paga con Yappy, al dueño le llega el aviso al WhatsApp y la existencia baja sola."
  },
  C07: {
    "como": [
      {
        "titulo": "Recorrido por los estantes",
        "texto": "Vemos tus estantes, cuántos precios hay que cambiar y de dónde sale hoy tu lista de precios."
      },
      {
        "titulo": "Etiquetas y antena",
        "texto": "Ponemos las etiquetas de tinta electrónica en el borde de cada estante y la antena en el techo, que les manda los precios."
      },
      {
        "titulo": "Conexión con tu lista",
        "texto": "Cada etiqueta queda unida a su producto en tu lista de precios. Se prueba cambiando un precio en la computadora y viéndolo en el estante."
      },
      {
        "titulo": "Cambiar y programar ofertas",
        "texto": "Cambias el precio en la computadora y el estante muestra el mismo que la caja. Las ofertas del fin de semana se programan con su fecha de inicio y de fin."
      }
    ],
    "necesitas": [
      "Tu lista de precios en un sistema o archivo que se pueda conectar",
      "Corriente cerca de donde va la antena en el techo, e internet en el local",
      "Qué producto va en cada espacio del estante"
    ],
    "no_incluye": [
      "El sistema de caja: las etiquetas toman los precios del que ya usas",
      "Pantallas con ofertas en el local: son otro servicio",
      "Cambiar o comprar estantes"
    ],
    "preguntas": [
      {
        "p": "¿El precio del estante puede quedar distinto al de la caja?",
        "r": "Los dos salen de la misma lista de precios. Cómo se conecta tu caja a esa lista depende de tu sistema y va en la propuesta."
      },
      {
        "p": "¿Y si se va la luz?",
        "r": "La tinta electrónica mantiene lo que muestra sin corriente, así que el precio sigue a la vista. Los cambios llegan cuando vuelve la conexión."
      },
      {
        "p": "¿Tengo que poner etiqueta electrónica en toda la tienda?",
        "r": "No. Puedes empezar por los pasillos donde más cambian los precios y dejar papel en el resto."
      }
    ],
    "ejemplo": "Ejemplo: un supermercado pequeño de Penonomé que cambia precios de granos y aceite casi cada semana pone etiquetas electrónicas en esos dos pasillos. El encargado cambia el precio en la computadora de la oficina y no tiene que imprimir ni pegar etiquetas."
  },
  C08: {
    "como": [
      {
        "titulo": "La regla del premio",
        "texto": "Decides cómo se gana: por visitas (la décima taza gratis) o por monto comprado, y cuántos días sin volver activan el mensaje."
      },
      {
        "titulo": "Tarjeta con tu marca",
        "texto": "Preparamos la tarjeta digital con tu logo y el QR que va en la caja para que el cliente se inscriba, con su consentimiento."
      },
      {
        "titulo": "Sellos en la caja",
        "texto": "En cada compra se lee el QR de la tarjeta del cliente y se suma el sello o los puntos. El cliente ve en su teléfono cuánto le falta."
      },
      {
        "titulo": "Volver a llamar",
        "texto": "Cuando alguien lleva el tiempo que fijaste sin volver, le llega un mensaje. Tu lista de clientes con permiso queda lista para tus promociones."
      }
    ],
    "necesitas": [
      "La regla del premio: qué se regala y cada cuánto",
      "Tu logo y los colores de tu negocio",
      "Que en la caja haya un teléfono o tableta para leer el QR del cliente"
    ],
    "no_incluye": [
      "El costo de los mensajes por WhatsApp a clientes que no vuelven: Meta cobra por cada mensaje de promoción, unos US$0,074 en Panamá según su tarifa de octubre de 2026",
      "Lo que regalas: el premio lo pone tu negocio",
      "Tarjetas plásticas o de cartón impresas"
    ],
    "preguntas": [
      {
        "p": "¿El cliente tiene que bajar una app?",
        "r": "No. La tarjeta se abre desde un enlace en su teléfono."
      },
      {
        "p": "¿Puedo mandarle promociones a toda la lista?",
        "r": "Solo a quienes dieron su permiso al inscribirse. La Ley 81 de 2019 y su reglamento les permiten oponerse a recibir promociones en cualquier momento, y la tarjeta trae esa opción."
      },
      {
        "p": "¿Sirve si mis clientes vienen una vez al mes?",
        "r": "Sí, con premios por monto en vez de por visitas. Lo vemos en la conversación según cómo compran tus clientes."
      }
    ],
    "ejemplo": "Ejemplo: una cafetería de Boquete da la décima bebida gratis. Cuando un cliente que venía cada semana pasa un mes sin aparecer, le llega un mensaje con un pan de regalo en su próxima visita."
  },
  C09: {
    "como": [
      {
        "titulo": "Visita al local",
        "texto": "Vemos dónde está tu módem, el tamaño del local y dónde se sientan o esperan los clientes, para ubicar el punto de acceso."
      },
      {
        "titulo": "Red de clientes aparte",
        "texto": "Instalamos el punto de acceso y dejamos la red de clientes separada de la de la caja y tus equipos. Tú eliges el límite de tiempo o de velocidad por cliente."
      },
      {
        "titulo": "Página de entrada",
        "texto": "Armamos la página con tu marca donde el cliente pone su correo o su WhatsApp y acepta el aviso de privacidad."
      },
      {
        "titulo": "Ver quién vuelve",
        "texto": "El cliente se conecta como en cualquier Wi-Fi. Tú ves cuántos se registran y cuántos vuelven."
      }
    ],
    "necesitas": [
      "Internet contratado en el local",
      "Una toma eléctrica donde va el punto de acceso",
      "El nombre y los datos de contacto de tu negocio, que aparecen en el aviso de privacidad como responsable de los datos"
    ],
    "no_incluye": [
      "El plan de internet: lo sigue pagando tu negocio a su proveedor",
      "Puntos de acceso adicionales si uno no cubre todo el local: se cotizan aparte",
      "Mandar promociones a la lista: eso lo hace el programa de clientes frecuentes u otra herramienta"
    ],
    "preguntas": [
      {
        "p": "¿Mis clientes pueden entrar a la red de la caja?",
        "r": "No. La red de clientes va separada de la de la caja y de tus equipos."
      },
      {
        "p": "¿Qué pide la ley para guardar sus datos?",
        "r": "La Ley 81 de 2019 pide un consentimiento previo, informado y que se pueda comprobar. La página de entrada muestra para qué usas los datos y guarda la aceptación de cada cliente."
      },
      {
        "p": "¿Uso el módem que ya tengo?",
        "r": "El punto de acceso se conecta a tu internet actual. Si tu plan se queda corto para los clientes, te lo decimos en la visita."
      }
    ],
    "ejemplo": "Ejemplo: una heladería de Las Tablas cambia la clave del Wi-Fi escrita en la pared por una página de entrada con su logo. Cada cliente entra con su WhatsApp, tiene una hora de conexión, y la dueña ve cuántos de los que se conectaron en un mes volvieron al siguiente."
  },
  C10: {
    "como": [
      {
        "titulo": "Elegir los productos",
        "texto": "Vemos qué productos vale la pena mostrar en 3D y si el fabricante tiene el modelo 3D. Si no lo tiene, se arma con fotos del producto desde todos los lados."
      },
      {
        "titulo": "Armar el modelo",
        "texto": "Se hace el modelo 3D con las medidas reales del producto. Lo revisas en tu teléfono antes de publicarlo."
      },
      {
        "titulo": "Ponerlo en tu página",
        "texto": "El visor se coloca en la ficha del producto de tu página o tienda en línea, junto a las fotos que ya tienes."
      },
      {
        "titulo": "El cliente en su casa",
        "texto": "El cliente gira el producto en la pantalla y, con la cámara del teléfono, lo pone en su sala para ver cómo queda."
      }
    ],
    "necesitas": [
      "Una página o tienda en línea donde mostrarlo",
      "El producto a mano para fotografiarlo, o el modelo 3D del fabricante",
      "Las medidas reales de cada producto"
    ],
    "no_incluye": [
      "La página o la tienda en línea: si no la tienes, es otro servicio",
      "Lentes o equipos de realidad virtual: todo se ve con el teléfono",
      "Videos o animaciones del producto"
    ],
    "preguntas": [
      {
        "p": "¿El cliente tiene que bajar una app?",
        "r": "No. Se abre desde tu página en el teléfono, con Android o iPhone. En un teléfono que no permite la vista en su sala, igual puede girar el modelo."
      },
      {
        "p": "¿Se ve del tamaño real?",
        "r": "Sí, si el modelo se hace con las medidas reales del producto. Por eso te las pedimos."
      },
      {
        "p": "¿Sirve para cualquier producto?",
        "r": "Depende. Los productos brillantes, transparentes o muy finos son más difíciles de sacar de fotos; lo vemos con los tuyos antes de proponerte nada."
      }
    ],
    "ejemplo": "Ejemplo: una mueblería de Arraiján pone en 3D sus cinco sofás más vendidos. Un cliente abre la ficha desde el celular, pone el sofá en su sala con la cámara y escribe para preguntar si hay en gris."
  },
  C11: {
    "como": [
      {
        "titulo": "Tu catálogo en un enlace",
        "texto": "Nos pasas tus productos con fotos, precios y existencias, y armamos el catálogo en un enlace que puedes compartir."
      },
      {
        "titulo": "El enlace en tus redes",
        "texto": "Pones el enlace en tu estado de WhatsApp, en tu perfil de Instagram y en tus respuestas."
      },
      {
        "titulo": "El pedido llega armado",
        "texto": "El cliente escoge productos y cantidades, y el pedido te llega al WhatsApp con todo listado y el total."
      },
      {
        "titulo": "Cobrar con un enlace",
        "texto": "Respondes con el enlace de pago y despachas cuando se confirma el cobro."
      }
    ],
    "necesitas": [
      "Un número de WhatsApp del negocio",
      "Tus productos con fotos, precios y existencias",
      "Una cuenta para recibir cobros a nombre de tu negocio"
    ],
    "no_incluye": [
      "La comisión de cada cobro con el enlace de pago, que la cobra la pasarela o el banco",
      "El reparto de los pedidos",
      "Un asistente que converse solo con tus clientes: eso es el asistente de WhatsApp con IA"
    ],
    "preguntas": [
      {
        "p": "¿Qué pasa si piden algo que ya no tengo?",
        "r": "Lo agotado se marca en el catálogo y no se puede pedir. Si se te pasa marcarlo, lo aclaras con el cliente al confirmar el pedido."
      },
      {
        "p": "¿Me cobran por cada pedido que llega?",
        "r": "Meta no cobra por los mensajes que el cliente te escribe. Lo que se paga por cada venta es la comisión del enlace de pago; lo nuestro va cerrado en la propuesta."
      },
      {
        "p": "¿Puedo actualizar precios y existencias yo?",
        "r": "Sí, desde el teléfono o la computadora. Te enseñamos a hacerlo al entregarlo."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de repuestos de moto en Colón que vende sobre todo por WhatsApp comparte el enlace del catálogo en su estado. El pedido le llega con la pieza, la cantidad y el total, y el cliente paga con el enlace antes de que salga el mensajero."
  },
  E01: {
    "como": [
      {
        "titulo": "Tus cobros y tu formulario",
        "texto": "Nos pasas tus tarifas de matrícula y mensualidad, las fechas de pago y los documentos que pides al matricular."
      },
      {
        "titulo": "Carga de estudiantes",
        "texto": "Cargamos a los estudiantes actuales con su grado y sus acudientes, para que cada uno arranque con su estado de cuenta."
      },
      {
        "titulo": "Matrícula y pago en línea",
        "texto": "Los padres llenan la matrícula, suben los documentos y pagan con Yappy o tarjeta desde el celular. Antes de cada vencimiento les llega el recordatorio."
      },
      {
        "titulo": "Quién está al día",
        "texto": "Ves el estado de cuenta de cada estudiante y el reporte de morosidad sin revisar comprobantes uno por uno."
      }
    ],
    "necesitas": [
      "Tus tarifas, fechas de pago y descuentos, si los das",
      "La lista de estudiantes con su grado y el contacto de sus acudientes",
      "Una cuenta para cobrar: Yappy Comercial o una pasarela de tarjetas"
    ],
    "no_incluye": [
      "La comisión de Yappy o de la pasarela de tarjetas por cada pago",
      "La factura electrónica de cada pago; conectarla es otro servicio",
      "Llamar o cobrar a los morosos por ti"
    ],
    "preguntas": [
      {
        "p": "¿Puedo seguir recibiendo efectivo o transferencia?",
        "r": "Sí. Lo anotas a mano y el estado de cuenta se actualiza igual."
      },
      {
        "p": "¿Los padres tienen que bajar una app?",
        "r": "No. Entran desde un enlace en el navegador del celular."
      }
    ],
    "ejemplo": "Ejemplo: en un colegio pequeño de Chitré, de prekínder a sexto grado, los acudientes reciben el recordatorio antes del 5 de cada mes y pagan con Yappy desde el enlace. La secretaria abre el reporte de morosidad y ve quién falta sin cruzar comprobantes con el estado del banco."
  },
  E02: {
    "como": [
      {
        "titulo": "Visita a la entrada",
        "texto": "Vemos por dónde entran los estudiantes o empleados, dónde va el lector y si hay tomacorriente e internet."
      },
      {
        "titulo": "Listas y carnés",
        "texto": "Cargamos la lista por grupo o por turno, y cada persona queda con su QR o su tarjeta."
      },
      {
        "titulo": "Instalación del lector",
        "texto": "Ponemos el lector y la tableta o pantalla en la entrada. Cada quien marca al pasar y ve su nombre en la pantalla."
      },
      {
        "titulo": "Aviso de ausencias",
        "texto": "A la hora que tú defines, el sistema revisa quién no marcó y avisa al acudiente o al supervisor que corresponda."
      }
    ],
    "necesitas": [
      "La lista de estudiantes o empleados con su grupo y el contacto a quien avisar",
      "Un tomacorriente e internet en la entrada",
      "Un lugar fijo en la entrada para el lector y la tableta"
    ],
    "no_incluye": [
      "Los carnés o tarjetas, si no los tienen; se cotizan aparte según cuántos sean",
      "Los mensajes de WhatsApp de los avisos, que Meta cobra aparte",
      "Abrir una puerta o un torniquete: aquí solo se marca la asistencia"
    ],
    "preguntas": [
      {
        "p": "¿Y si alguien olvida el carné?",
        "r": "La persona en la entrada lo marca a mano en la tableta, y queda anotado que fue a mano."
      },
      {
        "p": "¿Sirve también para empleados?",
        "r": "Sí. La lista va por turno en vez de por grado, y el aviso le llega al supervisor."
      }
    ],
    "ejemplo": "Ejemplo: en una escuela de Aguadulce, los estudiantes pasan el carné por el lector de la entrada entre las 6:45 y las 7:15. A las 7:30 los acudientes de quienes no marcaron reciben un WhatsApp, y cada maestra ya tiene la lista de su grado."
  },
  E03: {
    "como": [
      {
        "titulo": "Listas y preguntas de siempre",
        "texto": "Nos pasas los grados y las familias con su WhatsApp, y las preguntas que más contesta la secretaría."
      },
      {
        "titulo": "El WhatsApp del colegio",
        "texto": "Conectamos un número del colegio a la API oficial de WhatsApp. Meta aprueba las plantillas de los avisos antes de usarlas."
      },
      {
        "titulo": "Mandar un aviso",
        "texto": "Escribes la circular, eliges si va a todo el colegio, a un grado o a un estudiante, y sale al WhatsApp de cada familia."
      },
      {
        "titulo": "Lecturas y respuestas",
        "texto": "Ves quién lo recibió y quién lo leyó. Las preguntas de siempre, como el horario o la fecha de pago, se contestan solas."
      }
    ],
    "necesitas": [
      "La lista de familias por grado con su número de WhatsApp",
      "El permiso de cada familia para recibir avisos por WhatsApp",
      "Un número de teléfono para el WhatsApp del colegio y una cuenta de Meta Business a su nombre"
    ],
    "no_incluye": [
      "Los mensajes de WhatsApp, que Meta cobra aparte por cada uno",
      "Redactar las circulares: el texto lo pone el colegio",
      "Sacar las notas de un sistema académico que ya usas; conectarlo depende de cuál sea y va en la propuesta"
    ],
    "preguntas": [
      {
        "p": "¿Veo quién leyó el aviso?",
        "r": "Ves quién lo recibió y quién lo abrió. Si una familia apagó la confirmación de lectura en WhatsApp, solo aparece como recibido."
      },
      {
        "p": "¿Qué pasa si un padre pregunta algo que el sistema no sabe?",
        "r": "La pregunta le llega a la secretaría para que la conteste una persona."
      },
      {
        "p": "¿Se usa el grupo de WhatsApp que ya tenemos?",
        "r": "No. Cada familia recibe el aviso en su propio chat, y nadie ve el número de los demás."
      }
    ],
    "ejemplo": "Ejemplo: en un colegio bilingüe de Arraiján se suspende la clase de natación por lluvia a las 6 de la mañana. La secretaria manda el aviso solo a cuarto grado, y a las 7 ve que dos familias no lo han leído y las llama."
  },
  H01: {
    "como": [
      {
        "titulo": "Tus unidades y tarifas",
        "texto": "Nos pasas cada cabaña o habitación con su capacidad, fotos y tarifas por temporada, y tus reglas de depósito y cancelación."
      },
      {
        "titulo": "El calendario en tu página",
        "texto": "Ponemos el calendario de reservas en tu página web. Si todavía no tienes página, se arma junto y va en la propuesta."
      },
      {
        "titulo": "Reserva con depósito",
        "texto": "El huésped escoge fechas, ve qué unidades están libres, puede tomar varias a la vez y paga el depósito con tarjeta o Yappy."
      },
      {
        "titulo": "Instrucciones de llegada",
        "texto": "Con la reserva le llegan solas las instrucciones para llegar, y tú ves todas las reservas en el calendario de cada unidad."
      }
    ],
    "necesitas": [
      "Fotos de cada unidad y sus tarifas por temporada",
      "Tus reglas de depósito, cancelación y horarios de entrada y salida",
      "Una cuenta para cobrar: Yappy Comercial o una pasarela de tarjetas",
      "Las instrucciones de llegada: ubicación, acceso y a quién llamar"
    ],
    "no_incluye": [
      "La comisión de Yappy o de la pasarela de tarjetas por cada depósito",
      "Cerrar las fechas en Booking o Airbnb; eso lo hace el calendario sincronizado con vigilante",
      "La compra del dominio, si todavía no tienes uno",
      "Fotos profesionales de las unidades"
    ],
    "preguntas": [
      {
        "p": "¿De verdad no pago comisión?",
        "r": "Por las reservas que entran por tu página no pagas comisión a ningún portal. Sí pagas la comisión del medio de pago por el depósito."
      },
      {
        "p": "¿Puedo seguir vendiendo en Booking y Airbnb?",
        "r": "Sí. Para que las fechas no se crucen entre tu página y esos canales está el calendario sincronizado con vigilante."
      }
    ],
    "ejemplo": "Ejemplo: en unas cabañas de Boquete con cuatro unidades, una familia reserva dos cabañas juntas para un fin de semana largo y deja el depósito con Yappy. Al momento le llegan las indicaciones para subir por el camino de tierra y la hora de entrada."
  },
  H02: {
    "como": [
      {
        "titulo": "Tus canales y unidades",
        "texto": "Vemos en qué canales vendes cada unidad y sacamos de cada panel el enlace de su calendario (iCal)."
      },
      {
        "titulo": "Conectar los calendarios",
        "texto": "Cada unidad recibe las fechas ocupadas de Booking, Airbnb y Expedia y les manda las suyas, así lo vendido en uno se cierra en los demás."
      },
      {
        "titulo": "El vigilante",
        "texto": "Si un canal lleva horas sin actualizar, te avisa y cierra la venta en tu página hasta que vuelva a sincronizar."
      },
      {
        "titulo": "Choques de fechas",
        "texto": "Si aun así entran dos reservas para la misma noche, aparecen en la lista de choques con una propuesta de a qué unidad reubicar."
      }
    ],
    "necesitas": [
      "Acceso a tus paneles de Booking, Airbnb y Expedia, o los enlaces de calendario de cada unidad",
      "La lista de unidades y en qué canal está cada una"
    ],
    "no_incluye": [
      "Una conexión directa por API con los canales (channel manager); si tu volumen la pide, va en la propuesta",
      "Las comisiones que cobra cada canal por sus reservas",
      "La llamada al huésped para reubicarlo: el sistema propone la unidad y la llamada la haces tú"
    ],
    "preguntas": [
      {
        "p": "¿Esto acaba con la doble reserva?",
        "r": "La reduce, pero no del todo. Los canales releen los calendarios cada pocas horas (Airbnb cada unas 3 y Booking cada unas 2, según lo que revisamos), y en ese rato se puede vender la misma noche dos veces. El vigilante te avisa del choque para resolverlo antes de que llegue el huésped."
      },
      {
        "p": "¿Funciona con cualquier cuenta de Booking o Expedia?",
        "r": "No siempre. Booking solo permite calendarios iCal con 20 tipos de habitación o menos, una unidad por tipo y sin un channel manager conectado, y Expedia trabaja sobre todo con channel managers. Lo revisamos con tu cuenta antes de empezar."
      }
    ],
    "ejemplo": "Ejemplo: un hostal en Bocas del Toro vende sus seis habitaciones en Booking, en Airbnb y en su propia página. Un domingo el calendario de Airbnb deja de actualizarse; al dueño le llega el aviso y su página deja de vender esas fechas mientras lo arregla."
  },
  H03: {
    "como": [
      {
        "titulo": "Visita a las puertas",
        "texto": "Vamos al lugar a medir cada puerta, revisar el marco y comprobar que llega la señal de internet."
      },
      {
        "titulo": "Instalación",
        "texto": "Cambiamos la cerradura de cada unidad por una electrónica con teclado y la conectamos."
      },
      {
        "titulo": "Un código por reserva",
        "texto": "Con cada reserva se crea un código que abre solo esa puerta, desde la hora de entrada hasta la de salida. Limpieza tiene su propio código."
      },
      {
        "titulo": "El día a día",
        "texto": "El huésped recibe su código antes de llegar y entra sin esperar a nadie. Tú ves en el registro a qué hora se abrió cada puerta."
      }
    ],
    "necesitas": [
      "Puertas y marcos en buen estado",
      "Internet que llegue a cada puerta",
      "Saber de dónde salen tus reservas: tu página, Booking o Airbnb"
    ],
    "no_incluye": [
      "Arreglos de carpintería en puertas o marcos",
      "Llevar la red de internet hasta cada cabaña; si hace falta, es el servicio de red e internet del negocio",
      "Prender luces o aire al llegar el huésped; eso es la domótica para alquileres"
    ],
    "preguntas": [
      {
        "p": "¿Qué pasa si se va el internet o la luz?",
        "r": "Depende del modelo de cerradura. En la propuesta te decimos cómo abre la que se escoja sin internet y sin luz, y cuál es la entrada de respaldo."
      },
      {
        "p": "¿Y si el huésped se queda una noche más?",
        "r": "Cambias la fecha de salida en la reserva y su código sigue abriendo hasta la nueva fecha."
      }
    ],
    "ejemplo": "Ejemplo: en un edificio de cinco apartamentos de alquiler corto en Casco Viejo, el huésped que aterriza en Tocumen a medianoche llega directo al apartamento 3 y entra con su código. A las 11 de la mañana entra la persona de limpieza con el suyo, y el registro muestra las dos entradas."
  },
  H04: {
    "como": [
      {
        "titulo": "Tus datos y normas",
        "texto": "Nos dices qué datos pides hoy a cada huésped y nos pasas tus normas de la casa por escrito."
      },
      {
        "titulo": "El formulario",
        "texto": "Armamos el formulario con tus campos, la foto del documento, la firma de las normas y la casilla de consentimiento que nombra la Ley 81 de 2019."
      },
      {
        "titulo": "Antes de llegar",
        "texto": "Con la reserva el huésped recibe el enlace, llena sus datos desde el celular y firma."
      },
      {
        "titulo": "Recepción sin papel",
        "texto": "Ves quién ya se registró y quién falta, con su documento y su firma. En la llegada solo entregas la llave o el código."
      }
    ],
    "necesitas": [
      "Tus normas de la casa por escrito",
      "La lista de datos que pides hoy en recepción",
      "El correo o WhatsApp por donde le escribes al huésped tras la reserva"
    ],
    "no_incluye": [
      "Verificar la identidad contra registros oficiales: se guarda la foto que manda el huésped",
      "La revisión legal de tus normas de la casa",
      "El cobro de la estadía; eso va con el motor de reservas"
    ],
    "preguntas": [
      {
        "p": "¿Y si el huésped llega sin haberlo llenado?",
        "r": "Lo llena en recepción desde su celular, escaneando un QR que lleva al mismo formulario."
      },
      {
        "p": "¿Dónde quedan los documentos de los huéspedes?",
        "r": "Guardados con acceso solo para ti y para quien autorices. Dónde está el servidor va escrito en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: en un hotel de doce habitaciones en Pedasí, la pareja que llega el viernes completa el registro el miércoles desde el celular, con foto del pasaporte y la firma de las normas. El viernes en recepción todo está listo y solo se les entrega la llave."
  },
  H05: {
    "como": [
      {
        "titulo": "Visita al tablero y al tanque",
        "texto": "Revisamos el tablero eléctrico, qué circuito alimenta cada cabaña, dónde está el tanque de agua y cómo llega la señal hasta ahí."
      },
      {
        "titulo": "Instalación de medidores",
        "texto": "Ponemos un medidor de energía en los circuitos de cada cabaña y un sensor ultrasónico que mide el nivel del tanque."
      },
      {
        "titulo": "Lo normal de cada unidad",
        "texto": "Con los primeros datos y tus fechas de ocupación se ve cuánto gasta cada cabaña con huéspedes y sin ellos, y de ahí sale qué cuenta como fuera de lo normal."
      },
      {
        "titulo": "Avisos al celular",
        "texto": "Si una cabaña vacía gasta como si tuviera el aire prendido, o el tanque baja de noche sin que nadie use agua, te llega un aviso."
      }
    ],
    "necesitas": [
      "Que cada cabaña tenga su propio circuito en el tablero; si no lo tiene, lo vemos en la visita",
      "Internet en la propiedad; cómo llegan los datos del tablero y del tanque lo vemos en la visita",
      "Acceso al tanque de agua para poner el sensor",
      "Las fechas en que cada cabaña está ocupada, desde tus reservas o anotadas a mano"
    ],
    "no_incluye": [
      "Separar circuitos o cambiar el tablero, que es trabajo de electricista",
      "Un medidor de agua en cada cabaña: el agua se mide por el nivel del tanque",
      "Apagar el aire desde el teléfono; eso es la domótica para alquileres"
    ],
    "preguntas": [
      {
        "p": "¿Cuánto voy a ahorrar?",
        "r": "No te damos una cifra. Ves en qué cabaña se va la luz y cuándo baja el tanque; el ahorro depende de lo que hagas con esos avisos."
      },
      {
        "p": "¿Hay que tocar el medidor de la compañía eléctrica?",
        "r": "No. Los medidores van en tu tablero, después del de la compañía, y ese no se toca."
      }
    ],
    "ejemplo": "Ejemplo: en unas cabañas en El Valle de Antón con seis unidades, el medidor muestra que la cabaña 4 pasó la tarde con el aire prendido y sin huéspedes. Otra madrugada el tanque baja sin que nadie use agua, y el aviso lleva a un inodoro que se quedó corriendo."
  },
  H06: {
    "como": [
      {
        "titulo": "Visita a cada unidad",
        "texto": "Vemos qué luces, enchufes y aires hay en cada cabaña, cómo se maneja cada aire y si llega el Wi-Fi."
      },
      {
        "titulo": "Instalación",
        "texto": "Cambiamos los interruptores por inteligentes, ponemos un control infrarrojo frente a cada aire y una puerta de enlace Wi-Fi que los conecta."
      },
      {
        "titulo": "Escenas por reserva",
        "texto": "Dejamos armadas las escenas de llegada y salida: antes de que entre el huésped se prenden luces y aire, y cuando sale se apaga todo."
      },
      {
        "titulo": "Desde tu celular",
        "texto": "Ves cada cabaña en el teléfono y apagas el aire de la que quedó vacía desde donde estés."
      }
    ],
    "necesitas": [
      "Wi-Fi que llegue a cada unidad",
      "Aires que se manejen con control remoto infrarrojo",
      "Cajas de interruptores que admitan el cambio; lo revisamos en la visita"
    ],
    "no_incluye": [
      "La cerradura de la puerta: eso es el servicio de cerraduras con código",
      "Arreglos eléctricos o de cableado que aparezcan en la visita",
      "Llevar la red Wi-Fi hasta cada cabaña, si hoy no llega"
    ],
    "preguntas": [
      {
        "p": "¿Sirve con cualquier aire acondicionado?",
        "r": "Con los que se manejan con un control remoto infrarrojo. En la visita revisamos los tuyos."
      },
      {
        "p": "¿El huésped puede usar los interruptores como siempre?",
        "r": "Sí. Los interruptores siguen funcionando con la mano; el teléfono es para ti."
      },
      {
        "p": "¿También abro la puerta desde el teléfono?",
        "r": "Sí, si además instalas las cerraduras con código, que son otro servicio."
      }
    ],
    "ejemplo": "Ejemplo: en tres cabañas de playa en Las Lajas, el huésped del sábado llega a las 9 de la noche. A las 8:30 la cabaña ya tiene el aire prendido y la luz del portal encendida; el domingo, cuando se va, la escena de salida apaga todo y el dueño lo ve en el celular desde la ciudad."
  },
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
  S01: {
    "como": [
      {
        "titulo": "Conversación con recepción",
        "texto": "Nos cuentas qué profesionales atienden, en qué consultorios, cuánto dura cada tipo de cita y si el recordatorio sale 2 días o 1 día antes."
      },
      {
        "titulo": "El WhatsApp de la clínica",
        "texto": "Conectamos un número de la clínica a la API oficial de WhatsApp. Meta aprueba el texto del recordatorio antes del primer envío."
      },
      {
        "titulo": "La agenda en recepción",
        "texto": "Recepción agenda en la pantalla y el sistema no deja guardar dos citas a la misma hora con el mismo profesional. El paciente también puede pedir cita solo desde la página."
      },
      {
        "titulo": "Recordatorios que insisten",
        "texto": "Al paciente le llega el WhatsApp con un botón para confirmar o cancelar. Si no contesta, se le vuelve a escribir hasta el número de intentos que fijes, y si sigue sin respuesta, recepción ve la cita marcada para llamar."
      }
    ],
    "necesitas": [
      "Un número de teléfono para el WhatsApp de la clínica, que queda conectado al sistema",
      "Una cuenta de Meta Business a nombre de la clínica; si no la tienes, te ayudamos a abrirla",
      "Los horarios de cada profesional y la duración de cada tipo de cita"
    ],
    "no_incluye": [
      "Los mensajes de WhatsApp: Meta los cobra aparte, unos US$0,011 cada uno en Panamá según su tarifa de octubre de 2026",
      "La llamada a quien no contesta: el sistema avisa y la llamada la hace recepción",
      "El expediente clínico del paciente, que es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿El paciente tiene que instalar algo?",
        "r": "No. Recibe un WhatsApp normal y confirma con un botón. Para pedir cita solo, abre una página en el navegador del celular."
      },
      {
        "p": "¿Puedo seguir agendando por teléfono?",
        "r": "Sí. Recepción anota la cita en la agenda como siempre y el recordatorio sale igual."
      },
      {
        "p": "¿Cuánto bajan las ausencias?",
        "r": "No te damos una cifra, porque depende de tus pacientes. En la agenda ves quién confirmó, quién canceló y quién no llegó, y lo mides con tus propios números."
      }
    ],
    "ejemplo": "Ejemplo: en un consultorio de dermatología en David con dos doctoras y una sola recepcionista, los pacientes del jueves reciben el WhatsApp el martes. Quien cancela libera el hueco en la agenda, y el miércoles en la mañana la recepcionista solo llama a los que no contestaron."
  },
  S02: {
    "como": [
      {
        "titulo": "Visita a la sala",
        "texto": "Vamos a la clínica a ver la sala de espera, la pared donde mejor se ve la pantalla y cuántos consultorios llaman pacientes."
      },
      {
        "titulo": "Instalación de la pantalla",
        "texto": "Montamos el televisor en la pared y lo dejamos mostrando los turnos de cada consultorio."
      },
      {
        "titulo": "Turno al llegar",
        "texto": "Recepción anota la llegada del paciente en la computadora y le dice su número de turno, según el consultorio que le toca."
      },
      {
        "titulo": "Llamar al siguiente",
        "texto": "El médico o la asistente toca «siguiente» desde la computadora o el celular. La pantalla muestra el número con un sonido y el tiempo estimado de espera."
      }
    ],
    "necesitas": [
      "Un tomacorriente cerca de donde va el televisor",
      "Internet o Wi-Fi en la clínica, para que recepción, consultorios y pantalla estén conectados",
      "Una computadora o un celular en cada consultorio para llamar al siguiente"
    ],
    "no_incluye": [
      "Cableado eléctrico nuevo si no hay tomacorriente en esa pared",
      "La conexión a internet de la clínica",
      "El sistema de citas con recordatorios, que es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Puedo usar el televisor que ya tengo?",
        "r": "Depende del modelo y de sus entradas; lo revisamos en la visita. Si no sirve, el televisor nuevo va en la propuesta."
      },
      {
        "p": "¿Sale el nombre del paciente en la pantalla?",
        "r": "No. Sale el número de turno y el consultorio, así nadie lee ni oye el nombre de otro paciente."
      }
    ],
    "ejemplo": "Ejemplo: en una clínica privada de La Chorrera con cuatro consultorios, el televisor de la sala muestra «Turno 12, consultorio 3» con un timbre. El pediatra llama al siguiente desde el celular entre paciente y paciente, y la recepcionista ya no se asoma a la sala a gritar nombres."
  },
  S03: {
    "como": [
      {
        "titulo": "Elegir las preguntas",
        "texto": "Decidimos contigo de una a tres preguntas cortas y a qué hora del día siguiente salen."
      },
      {
        "titulo": "Conectar tus atenciones",
        "texto": "La encuesta sale a quienes atendiste ese día. Se toman de tu agenda o de tu sistema; cómo se conecta depende de cuál uses y va en la propuesta."
      },
      {
        "titulo": "Aviso de las malas",
        "texto": "Si alguien responde mal, te llega un aviso al momento con su nombre y lo que dijo, para que lo llames ese mismo día."
      },
      {
        "titulo": "Reseña de las buenas",
        "texto": "A quien responde bien le aparece el enlace para dejar su reseña en Google."
      }
    ],
    "necesitas": [
      "La agenda, sistema o lista donde llevas a quién atendiste, con el WhatsApp de cada uno",
      "El permiso de tus clientes para escribirles por WhatsApp",
      "El enlace de tu negocio en Google Maps"
    ],
    "no_incluye": [
      "Los mensajes de WhatsApp, que Meta cobra aparte por cada uno",
      "Responder las reseñas de Google por ti",
      "Crear o arreglar tu ficha en Google Maps, que es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Esto impide que me pongan una reseña mala en Google?",
        "r": "No. Cualquiera puede reseñarte en Google cuando quiera. Lo que cambia es que te enteras primero y puedes resolver con esa persona."
      },
      {
        "p": "¿Sirve para un restaurante o un hotel?",
        "r": "Sí, si tienes el WhatsApp de tus clientes. La pregunta se ajusta a lo que vendes."
      }
    ],
    "ejemplo": "Ejemplo: en una clínica dental de Penonomé, cada paciente recibe a las 10 de la mañana siguiente: «¿Cómo te fue ayer? Responde del 1 al 5». Un 2 le llega al dueño al celular con el nombre del paciente y la doctora que lo atendió; un 5 recibe el enlace a Google."
  },
  S04: {
    "como": [
      {
        "titulo": "Definir la consulta",
        "texto": "Nos dices qué consultas das por video, cuánto duran, cuánto cobras y si cobras con Yappy, con tarjeta o con los dos."
      },
      {
        "titulo": "Agenda con pago",
        "texto": "El paciente escoge el horario y paga en ese momento. La cita queda confirmada cuando entra el pago."
      },
      {
        "titulo": "El enlace a la sala",
        "texto": "Antes de la cita le llega un recordatorio con el enlace de su sala. Lo abre en el celular o en la computadora, sin instalar nada."
      },
      {
        "titulo": "La consulta",
        "texto": "Tú entras a la misma sala desde tu computadora, atiendes y sigues con el próximo paciente de la agenda."
      }
    ],
    "necesitas": [
      "Una computadora o un celular con cámara y micrófono, y buen internet en el consultorio",
      "Una cuenta para recibir pagos: Yappy Comercial o una pasarela de tarjetas",
      "Tus horarios y precios de consulta"
    ],
    "no_incluye": [
      "La comisión de Yappy o de la pasarela de tarjetas por cada cobro",
      "Los mensajes de WhatsApp del recordatorio, que Meta cobra aparte",
      "La factura electrónica de la consulta; conectarla es otro servicio",
      "Las recetas o documentos firmados que entregues después de la consulta"
    ],
    "preguntas": [
      {
        "p": "¿El paciente necesita una app?",
        "r": "No. Entra desde el enlace, en el navegador del celular o de la computadora."
      },
      {
        "p": "¿Qué pasa si el paciente pagó y no se conecta?",
        "r": "Lo decides tú: reprogramar, devolver o no devolver. Esa regla la ve el paciente antes de pagar."
      },
      {
        "p": "¿Va en la misma agenda que mis citas presenciales?",
        "r": "Sí. Las videoconsultas y las citas en el consultorio están en la misma agenda, así no se cruzan."
      }
    ],
    "ejemplo": "Ejemplo: una psicóloga en El Dorado da consultas de seguimiento por video los martes en la tarde. Una paciente que vive en Chiriquí escoge las 4:00, paga con Yappy y a las 3:30 le llega el WhatsApp con el enlace."
  },
  S05: {
    "como": [
      {
        "titulo": "Revisar tu ficha actual",
        "texto": "Vemos cómo llevas hoy la historia del paciente, en papel o en Excel, y qué campos usas, para que la ficha digital se parezca a la tuya."
      },
      {
        "titulo": "Quién ve qué",
        "texto": "Defines los permisos de cada persona: el médico ve la historia completa y recepción, por ejemplo, solo el contacto y las citas."
      },
      {
        "titulo": "Consentimiento del paciente",
        "texto": "En su primera visita el paciente marca la casilla de consentimiento que nombra la Ley 81 de 2019, y queda guardada con la fecha."
      },
      {
        "titulo": "En la consulta",
        "texto": "Abres la ficha, anotas, subes la foto de control del día y la comparas con las anteriores, ordenadas por fecha."
      }
    ],
    "necesitas": [
      "Tu ficha o formato actual, para copiar sus campos",
      "La lista de quién trabaja en la clínica y qué debe ver cada uno",
      "Una computadora o tableta en cada consultorio"
    ],
    "no_incluye": [
      "Pasar a digital el archivo en papel de años anteriores; si lo quieres, va en la propuesta",
      "La facturación de las consultas",
      "La revisión de tu texto de consentimiento por un abogado"
    ],
    "preguntas": [
      {
        "p": "¿Dónde quedan guardados los datos?",
        "r": "En un servidor contratado para tu clínica. Dónde está y cómo se respalda va escrito en la propuesta, y el aviso que acepta el paciente lo dice."
      },
      {
        "p": "¿Puedo pasar los expedientes que ya tengo en Excel?",
        "r": "Depende de cómo estén ordenados. Lo revisamos con una muestra y en la propuesta te decimos qué se puede pasar."
      }
    ],
    "ejemplo": "Ejemplo: en una clínica de nutrición en Chitré con dos nutricionistas y una asistente, cada paciente tiene su ficha con peso, medidas y fotos de control por fecha. La asistente ve las citas y el teléfono; la historia la ven solo las nutricionistas."
  },
  V01: {
    "como": [
      {
        "titulo": "Cómo atiendes",
        "texto": "Vemos cuántos carros atiendes a la vez y qué servicios das, para que la fila muestre bien cuántos tiene adelante cada cliente."
      },
      {
        "titulo": "El QR de la entrada",
        "texto": "Te damos el QR que lleva a tu página de turnos, para ponerlo en la entrada. El cliente saca turno desde el celular, o se lo saca quien lo recibe."
      },
      {
        "titulo": "Fila en vivo",
        "texto": "El cliente ve cuántos tiene adelante y puede irse a hacer otra cosa mientras espera."
      },
      {
        "titulo": "Aviso de listo",
        "texto": "Cuando terminan, el encargado toca «listo» en el celular y al cliente le llega un WhatsApp para que venga por su carro."
      }
    ],
    "necesitas": [
      "Un celular o tableta en el local para manejar la fila",
      "La lista de servicios que das",
      "Un número para el WhatsApp del negocio"
    ],
    "no_incluye": [
      "Los mensajes de WhatsApp, que Meta cobra aparte por cada uno",
      "Una pantalla de turnos en el local: el cliente ve la fila en su celular",
      "Cobrar en línea, que es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Y el cliente que no quiere usar el celular?",
        "r": "Quien lo recibe le saca el turno en el local. Para el aviso basta con su número de WhatsApp."
      },
      {
        "p": "¿Sirve para un taller mecánico?",
        "r": "Sí. En el taller el turno lo saca recepción y el aviso sale cuando el carro está listo para entregar."
      }
    ],
    "ejemplo": "Ejemplo: en un autolavado de Tocumen, un sábado con fila, el cliente escanea el QR, ve que tiene cinco carros adelante y se va a la panadería de al lado. Cuando terminan de secar su carro le llega el WhatsApp y vuelve."
  },
  V02: {
    "como": [
      {
        "titulo": "Cómo recibes hoy",
        "texto": "Revisamos cómo recibes un vehículo, qué anotas y cómo armas el presupuesto."
      },
      {
        "titulo": "Recepción con fotos",
        "texto": "Al llegar el carro, recepción toma fotos de cada lado con el celular y quedan en la orden junto a la placa."
      },
      {
        "titulo": "Presupuesto por WhatsApp",
        "texto": "El cliente recibe el presupuesto en su WhatsApp y lo aprueba desde el enlace. La aprobación queda guardada en la orden."
      },
      {
        "titulo": "Estado e historial",
        "texto": "La orden avanza de estado hasta la entrega y el cliente recibe el aviso. La próxima vez que vuelve, la placa trae todo su historial."
      }
    ],
    "necesitas": [
      "Un celular o tableta con cámara en recepción",
      "Tus precios de mano de obra más comunes, si quieres que el presupuesto los traiga",
      "Un número para el WhatsApp del taller"
    ],
    "no_incluye": [
      "El inventario de repuestos; eso es el sistema de inventario y compras",
      "La factura electrónica; conectarla es otro servicio",
      "Los mensajes de WhatsApp, que Meta cobra aparte"
    ],
    "preguntas": [
      {
        "p": "¿Las fotos me sirven si el cliente reclama un golpe?",
        "r": "Quedan con fecha y hora, y con ellas le muestras cómo llegó el carro. Lo que valgan en un reclamo formal no depende de nosotros."
      },
      {
        "p": "¿Lo usan también los mecánicos?",
        "r": "Si quieres, sí: cada mecánico ve sus órdenes en el celular y cambia el estado. También funciona solo con recepción."
      }
    ],
    "ejemplo": "Ejemplo: en un taller mecánico de Santiago, un pick-up llega con un ruido en el tren delantero. Recepción le toma seis fotos, el mecánico arma el presupuesto y el dueño lo aprueba por WhatsApp desde su oficina; cuando vuelve para el próximo servicio, la placa trae la reparación anterior."
  },
  V03: {
    "como": [
      {
        "titulo": "Servicios y horarios",
        "texto": "Nos pasas los servicios con su duración y precio, y el horario de cada barbero o estilista."
      },
      {
        "titulo": "La regla de la seña",
        "texto": "Decides cuánto se cobra de seña y qué pasa si el cliente no llega. Esa regla se muestra antes de pagar."
      },
      {
        "titulo": "El cliente reserva",
        "texto": "Desde un enlace, el cliente escoge servicio, profesional y hora libre, y deja la seña con Yappy o tarjeta."
      },
      {
        "titulo": "Recordatorio y día a día",
        "texto": "Antes de la cita le llega el recordatorio para confirmar, y cada profesional ve su agenda del día en el celular."
      }
    ],
    "necesitas": [
      "Los servicios con duración y precio",
      "El horario y los días libres de cada profesional",
      "Una cuenta para cobrar la seña: Yappy Comercial o una pasarela de tarjetas"
    ],
    "no_incluye": [
      "La comisión de Yappy o de la pasarela de tarjetas por cada seña",
      "Los mensajes de WhatsApp de los recordatorios, que Meta cobra aparte",
      "El cobro del resto del servicio en caja"
    ],
    "preguntas": [
      {
        "p": "¿Qué pasa con la seña si el cliente no llega?",
        "r": "Lo decides tú: si se pierde, si se abona a otra cita o con cuántas horas de aviso se devuelve. El cliente ve esa regla antes de pagar."
      },
      {
        "p": "¿Y los que llegan sin cita?",
        "r": "Los anotas en el hueco libre de la agenda, y nadie puede reservar encima."
      },
      {
        "p": "¿Puedo verlo antes de escribirles?",
        "r": "Sí. En esta página hay una demostración de la agenda con datos de ejemplo."
      }
    ],
    "ejemplo": "Ejemplo: en una barbería de Vía España con tres barberos, un cliente reserva para el viernes a las 6:00 con su barbero de siempre y deja la seña con Yappy. El jueves le llega el recordatorio; si cancela, el hueco queda libre para otro."
  },
};
