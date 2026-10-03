// Detalle de cada servicio (cómo funciona, qué necesitas, qué no incluye, preguntas, ejemplo).
// Redactado por agentes con los datos del catálogo y revisado por otro agente; se junta con herramientas/juntar-fichas.mjs.
export const FICHAS = {
  B01: {
    "como": [
      {
        "titulo": "Nos cuentas la propiedad",
        "texto": "Nos dices dónde queda, cuántos ambientes tiene y para qué lo quieres. Con eso te recomendamos el recorrido con fotos 360 o el 3D con medidas."
      },
      {
        "titulo": "Visita con la cámara",
        "texto": "Vamos a la propiedad con la cámara 360 o el teléfono con LiDAR y tomamos cada ambiente. El equipo lo llevamos nosotros."
      },
      {
        "titulo": "Armamos el recorrido",
        "texto": "Unimos las tomas en un recorrido que se abre en el navegador del teléfono y lo dejamos en tu dominio."
      },
      {
        "titulo": "Lo mandas al interesado",
        "texto": "Pegas el enlace en tu anuncio, en tu página o en el WhatsApp de quien pregunta. Recorre la propiedad antes de pedir la visita."
      }
    ],
    "necesitas": [
      "Alguien que nos abra la propiedad el día de la visita",
      "La propiedad ordenada y con las luces funcionando: el recorrido muestra lo que hay ese día",
      "Un dominio o una página donde publicarlo; si no tienes, lo vemos en la propuesta"
    ],
    "no_incluye": [
      "Las fotos profesionales de la propiedad: son un extra de +$300",
      "Las tomas aéreas con dron, que son otro servicio",
      "Lo que cobre el portal donde anuncias la propiedad",
      "Arreglar o decorar la propiedad antes de la visita"
    ],
    "preguntas": [
      {
        "p": "¿Me conviene el 360 o el 3D?",
        "r": "El 360 son fotos esféricas de cada ambiente: miras alrededor y saltas al siguiente. El 3D se camina libre y trae las medidas. Depende de la propiedad y de para qué lo usas; te lo recomendamos en la propuesta."
      },
      {
        "p": "¿Con esto vendo más rápido o más caro?",
        "r": "No te lo prometemos. El estudio independiente más grande que encontramos (Harvard e Ivey, 2023, 75.178 ventas en Los Ángeles) no halló efecto en el precio al tomar en cuenta la calidad de las fotos, y vio que el recorrido puede alargar el tiempo de venta. Lo que sí logras es que el interesado conozca el espacio antes de ir."
      },
      {
        "p": "¿Puedo ver uno antes de contratar?",
        "r": "Sí. En las demos del sitio hay recorridos de ejemplo que puedes mover con el dedo o el mouse."
      }
    ],
    "ejemplo": "Ejemplo: un agente alquila un apartamento de dos recámaras en El Cangrejo y le escriben muchos interesados desde el extranjero. Les manda el enlace del recorrido 3D y cada uno mide la recámara principal desde su teléfono antes de agendar la visita."
  },
  B02: {
    "como": [
      {
        "titulo": "Lo sumas al recorrido",
        "texto": "Cuando pides el recorrido 360 o 3D, nos dices que también quieres fotos. Se toman en la misma visita, sin otra cita."
      },
      {
        "titulo": "Sesión en la propiedad",
        "texto": "Fotografiamos cada ambiente buscando la mejor luz del lugar y el ángulo que muestra el espacio."
      },
      {
        "titulo": "Edición",
        "texto": "Corregimos la luz y el color de cada foto y te las entregamos listas para subir a tu anuncio."
      },
      {
        "titulo": "Las publicas",
        "texto": "Las usas en los portales, en redes y en tu página, junto al enlace del recorrido."
      }
    ],
    "necesitas": [
      "Contratar también el recorrido 360 o 3D: las fotos se toman en esa visita",
      "La propiedad limpia y ordenada, con cortinas y luces listas"
    ],
    "no_incluye": [
      "Video de la propiedad",
      "Tomas aéreas con dron, que son otro servicio",
      "Decoración o muebles para la sesión"
    ],
    "preguntas": [
      {
        "p": "¿Cuánto cuestan?",
        "r": "$300 más sobre el precio del recorrido 360 o 3D."
      },
      {
        "p": "¿Puedo pedir solo las fotos, sin recorrido?",
        "r": "Hoy las ofrecemos como extra del recorrido, porque salen de la misma visita. Si solo necesitas fotos, escríbenos y lo vemos."
      },
      {
        "p": "¿Cuántas fotos me entregan?",
        "r": "Depende de cuántos ambientes tiene la propiedad. El número va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: una casa de playa en Coronado que se alquila por temporada. En la misma visita del recorrido 360 salen las fotos de la terraza y de cada recámara, que luego sirven para el anuncio y para la página de reservas."
  },
  B03: {
    "como": [
      {
        "titulo": "Escaneo 3D",
        "texto": "El plano sale del escaneo 3D con LiDAR. Si ya pediste el recorrido 3D, es la misma visita."
      },
      {
        "titulo": "Trazamos el plano",
        "texto": "A partir del escaneo dibujamos el plano en planta con las medidas de cada ambiente."
      },
      {
        "titulo": "Te llega en PDF",
        "texto": "Recibes el plano en PDF con los metros cuadrados de cada ambiente, listo para imprimir o adjuntar."
      },
      {
        "titulo": "Lo usas",
        "texto": "Lo pones en la ficha de la propiedad o se lo das a quien te va a cotizar la remodelación."
      }
    ],
    "necesitas": [
      "Acceso a la propiedad para el escaneo, con todas las puertas abiertas",
      "Decirnos si es para anunciar o para remodelar, para marcar lo que te importa"
    ],
    "no_incluye": [
      "Un plano firmado por arquitecto o ingeniero para permisos o trámites",
      "Planos eléctricos, de plomería o de estructura",
      "La medición de los linderos del terreno, que hace un agrimensor"
    ],
    "preguntas": [
      {
        "p": "¿Qué tan exactas son las medidas?",
        "r": "Salen del escaneo con LiDAR y sirven para anunciar y para planear una remodelación. Si vas a construir o a hacer un trámite, que un profesional confirme las medidas en sitio."
      },
      {
        "p": "¿Puedo tener el plano sin el recorrido?",
        "r": "Hace falta la visita de escaneo, porque el plano sale de ahí. Publicar el recorrido o no es decisión tuya."
      }
    ],
    "ejemplo": "Ejemplo: el dueño de una bodega en Juan Díaz la quiere alquilar dividida en dos. Con el plano y los metros cuadrados de cada área, el interesado sabe qué le cabe antes de ir a verla."
  },
  B04: {
    "como": [
      {
        "titulo": "Nos pasas tus propiedades",
        "texto": "Nos das cada propiedad con precio, zona, recámaras y lo que más te preguntan, y las preguntas de filtro que quieres hacer."
      },
      {
        "titulo": "Lo conectamos",
        "texto": "Conectamos el agente al WhatsApp del negocio y a tu calendario, con los horarios en que puedes mostrar."
      },
      {
        "titulo": "Lo probamos contigo",
        "texto": "Le escribimos como si fuéramos interesados hasta que conteste como lo harías tú."
      },
      {
        "titulo": "Te llegan las visitas",
        "texto": "Contesta a cualquier hora, pregunta presupuesto, fecha y financiamiento, y te deja la visita en el calendario. Si alguien pide hablar con una persona, te lo pasa."
      }
    ],
    "necesitas": [
      "Un número de teléfono para el WhatsApp del negocio; si quieres usar el que ya tienes, lo revisamos en la propuesta",
      "Los datos de cada propiedad, y avisar cuando una se vende, se alquila o cambia de precio",
      "Un calendario donde agendar las visitas"
    ],
    "no_incluye": [
      "Lo que Meta cobra por los mensajes de WhatsApp: según su tarifa de octubre de 2026, los primeros 1.000 mensajes de servicio al mes por número no se cobran y después son unos US$0.011 cada uno",
      "Los anuncios pagados para atraer interesados",
      "La visita: la sigues haciendo tú o tu agente"
    ],
    "preguntas": [
      {
        "p": "¿Y si le preguntan algo que no sabe?",
        "r": "Contesta solo con los datos que le cargas de cada propiedad. Lo que no está ahí, te lo pasa a ti en vez de inventarlo."
      },
      {
        "p": "¿Qué pasa con los datos de los interesados?",
        "r": "Se guardan para darte el seguimiento. La Ley 81 de 2019 pide el consentimiento del interesado y decirle para qué se usan sus datos, así que el agente se lo avisa al empezar la conversación."
      },
      {
        "p": "¿Cuánto cuesta?",
        "r": "Depende de cuántas propiedades manejas y de cómo agendas; la cifra va cerrada en la propuesta. Los mensajes de WhatsApp los cobra Meta aparte."
      }
    ],
    "ejemplo": "Ejemplo: una inmobiliaria pequeña de Boquete con 15 casas en venta, que recibe consultas desde el extranjero a medianoche. El agente contesta, pregunta presupuesto y fecha de viaje, y solo agenda a quien tiene las dos cosas claras."
  },
  B05: {
    "como": [
      {
        "titulo": "Nos cuentas cómo vendes",
        "texto": "Vemos cuántas propiedades manejas, en qué zonas y por dónde te escribe la gente hoy."
      },
      {
        "titulo": "Armamos las fichas",
        "texto": "Cada propiedad lleva su ficha con fotos, y con plano y recorrido si los tiene. El sitio se filtra por zona, precio y recámaras."
      },
      {
        "titulo": "Publicamos en tu dominio",
        "texto": "El sitio queda en tu dominio y cada ficha lleva su botón para escribirte por WhatsApp sobre esa propiedad."
      },
      {
        "titulo": "Lo mantienes al día",
        "texto": "Cuando entra o sale una propiedad, se actualiza el sitio. Si la cargas tú o nos avisas, lo definimos en la propuesta."
      }
    ],
    "necesitas": [
      "Fotos y datos de cada propiedad: precio, zona, recámaras y metros",
      "Un número de WhatsApp para recibir los contactos",
      "Tu dominio, si ya tienes uno"
    ],
    "no_incluye": [
      "Los recorridos 3D, los planos y las fotos profesionales de cada propiedad: son servicios aparte",
      "Los anuncios pagados en redes o en buscadores",
      "Publicar tus propiedades en portales de terceros"
    ],
    "preguntas": [
      {
        "p": "¿Tengo que dejar los portales?",
        "r": "No. Tu sitio convive con tus anuncios en los portales. El contacto que llega por tu sitio te llega directo a ti."
      },
      {
        "p": "¿Necesito tener dominio?",
        "r": "Si ya tienes uno, lo usamos. Si no, se registra a nombre de tu negocio y su costo va en la propuesta."
      },
      {
        "p": "¿Puedo subir las propiedades yo mismo?",
        "r": "Si manejas muchas o cambian seguido, conviene un panel para que las subas tú. Depende de tu caso y va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: una inmobiliaria de dos agentes en Santiago de Veraguas con 30 casas y lotes. El comprador filtra por precio y recámaras, abre la ficha con su recorrido y escribe por WhatsApp desde el botón de esa casa."
  },
  B06: {
    "como": [
      {
        "titulo": "Nos dices qué mostrar",
        "texto": "Nos cuentas dónde queda el terreno o el edificio y qué quieres que se vea, como los accesos o la vista. Antes de ir revisamos si la zona tiene restricciones de vuelo."
      },
      {
        "titulo": "Vuelo en sitio",
        "texto": "Vamos con el dron y tomamos fotos y video desde el aire. El dron lo llevamos nosotros."
      },
      {
        "titulo": "Mapa del terreno",
        "texto": "Con las fotos armamos un mapa del terreno visto desde arriba."
      },
      {
        "titulo": "Lo usas al vender",
        "texto": "Te entregamos fotos, video y mapa para el anuncio, la página del proyecto o la reunión con el comprador."
      }
    ],
    "necesitas": [
      "Permiso del dueño o de la administración para volar sobre la propiedad",
      "La ubicación exacta y, si es un terreno, más o menos por dónde van sus límites"
    ],
    "no_incluye": [
      "La medición oficial de linderos: el mapa muestra el terreno, pero no es un plano de agrimensor",
      "Fotos de interiores, que van en el recorrido 360 o 3D o en las fotos profesionales",
      "La inspección técnica de techos u obras, que es el servicio de inspección con dron"
    ],
    "preguntas": [
      {
        "p": "¿Se puede volar en cualquier lugar?",
        "r": "No. Cerca de los aeropuertos y en algunas zonas hay restricciones. Lo revisamos antes de agendar la visita."
      },
      {
        "p": "¿Qué pasa si llueve el día acordado?",
        "r": "Con lluvia o viento fuerte no se vuela. Movemos la fecha."
      }
    ],
    "ejemplo": "Ejemplo: un promotor vende lotes en una finca de Chame. Las tomas aéreas muestran la calle de acceso y la cercanía a la carretera, y el mapa deja ver cómo se reparte la finca."
  },
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
      "El costo de los avisos por WhatsApp: Meta lo cobra por mensaje, unos US$0.011 cada uno en Panamá según su tarifa de octubre de 2026; el aviso en pantalla no tiene ese costo",
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
      "El costo de los mensajes por WhatsApp a clientes que no vuelven: Meta cobra por cada mensaje de promoción, unos US$0.074 en Panamá según su tarifa de octubre de 2026",
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
  I01: {
    "como": [
      {
        "titulo": "Visita al local",
        "texto": "Vemos qué quieres vigilar: neveras, el tablero eléctrico, el tanque o una puerta. Ahí decidimos qué sensor va en cada lugar."
      },
      {
        "titulo": "Instalación",
        "texto": "Ponemos los sensores y la puerta de enlace que los conecta, por Wi-Fi o LoRa según la distancia y las paredes."
      },
      {
        "titulo": "Límites de aviso",
        "texto": "Contigo fijamos a qué temperatura avisar, qué consumo es raro y desde qué nivel del tanque. Los avisos llegan al WhatsApp de quien tú digas."
      },
      {
        "titulo": "Lo miras cuando quieras",
        "texto": "Ves todo en el teléfono o en la computadora y comparas un mes con otro en el historial."
      }
    ],
    "necesitas": [
      "Internet en el local y un enchufe para la puerta de enlace",
      "Acceso a las neveras, el tablero o el tanque el día de la instalación",
      "Los números de WhatsApp de quienes reciben los avisos"
    ],
    "no_incluye": [
      "Lo que Meta cobra por cada aviso por WhatsApp: unos US$0.011 por mensaje en Panamá, según su tarifa de octubre de 2026",
      "La conexión a internet del local",
      "Reparar lo que el sensor detecte, como la nevera que falla o la fuga"
    ],
    "preguntas": [
      {
        "p": "¿Qué pasa si se cae el internet?",
        "r": "El aviso no sale hasta que vuelve la conexión. Si eso te preocupa, se puede usar una puerta de enlace con chip celular; va en la propuesta."
      },
      {
        "p": "¿Sirven los sensores que ya tengo?",
        "r": "Si se pueden conectar, sí. Lo revisamos en la visita."
      },
      {
        "p": "¿Puedo ver cómo se ve antes?",
        "r": "Sí. En el laboratorio del sitio hay un tablero de sensores con datos simulados."
      }
    ],
    "ejemplo": "Ejemplo: una distribuidora de mariscos en Vacamonte con dos cuartos fríos y un tanque de agua. Si un cuarto pasa del límite de madrugada, el encargado recibe el aviso al WhatsApp y el historial muestra desde qué hora empezó a subir."
  },
  I02: {
    "como": [
      {
        "titulo": "Nos cuentas tu flota",
        "texto": "Nos dices cuántos camiones o motos tienes, por dónde se mueven y de qué zonas no deberían salir."
      },
      {
        "titulo": "Rastreador en cada vehículo",
        "texto": "Instalamos un rastreador GPS con chip de datos en cada uno. Necesitamos el vehículo en tu patio mientras lo ponemos."
      },
      {
        "titulo": "Zonas en el mapa",
        "texto": "Marcamos en el mapa las zonas de trabajo. Si un vehículo sale de la suya, te llega un aviso."
      },
      {
        "titulo": "El día en el mapa",
        "texto": "Ves dónde está cada vehículo en vivo y, al cierre, por dónde pasó y cuánto tiempo estuvo detenido en cada parada."
      }
    ],
    "necesitas": [
      "Los vehículos en tu patio el día de la instalación",
      "La lista de vehículos con su placa y quién lo maneja",
      "Las zonas o rutas que cubre cada uno"
    ],
    "no_incluye": [
      "Apagar el motor a distancia o medir el combustible",
      "Cámaras dentro del vehículo",
      "El mantenimiento de los vehículos"
    ],
    "preguntas": [
      {
        "p": "¿Hay que pagar algo cada mes?",
        "r": "Sí. Cada rastreador usa un chip con datos móviles, que tiene un costo mensual. Cuánto y cómo se paga va en la propuesta."
      },
      {
        "p": "¿Funciona en el interior del país?",
        "r": "Reporta en vivo donde hay señal celular. En los tramos sin cobertura el mapa no se actualiza en vivo."
      },
      {
        "p": "¿Tengo que avisarles a los conductores?",
        "r": "Conviene avisarles por escrito que el vehículo lleva rastreador y para qué se usa."
      }
    ],
    "ejemplo": "Ejemplo: una distribuidora de agua en botellón en La Chorrera con cuatro camiones. Al cierre del día, el dueño ve qué camión estuvo una hora detenido fuera de su ruta y en qué calle."
  },
  I03: {
    "como": [
      {
        "titulo": "Visita a la entrada",
        "texto": "Revisamos la pluma o el portón y buscamos dónde va la cámara para que vea la placa de frente."
      },
      {
        "titulo": "Cámara y conexión",
        "texto": "Instalamos la cámara de lectura de placas y la conectamos al controlador de la pluma o del portón."
      },
      {
        "titulo": "Placas autorizadas",
        "texto": "Cargamos la lista de placas que pueden entrar, como las de residentes, empleados o proveedores fijos. Se agregan y se quitan cuando haga falta."
      },
      {
        "titulo": "Abre sola",
        "texto": "Cuando llega un vehículo de la lista, la pluma abre sola. Todos los vehículos quedan en el registro con su hora de entrada y de salida."
      }
    ],
    "necesitas": [
      "Una pluma o un portón con motor que ya funcione",
      "Corriente y red en la entrada",
      "La lista de placas autorizadas"
    ],
    "no_incluye": [
      "La pluma o el motor del portón, si no los tienes",
      "El cobro por tiempo de estacionamiento o los tickets",
      "Obra civil o cableado nuevo hasta la entrada"
    ],
    "preguntas": [
      {
        "p": "¿Y si llega una visita sin placa registrada?",
        "r": "La pluma no abre sola. El guardia la abre como siempre y la entrada queda registrada con la placa."
      },
      {
        "p": "¿Lee las placas de noche?",
        "r": "La cámara se escoge y se coloca para la luz de tu entrada. Lo probamos de día y de noche antes de entregarlo."
      },
      {
        "p": "¿Hay que avisar que hay cámara?",
        "r": "Sí. La ANTAI trata el video de vigilancia como dato sensible y la Ley 81 de 2019 pide informar a las personas. Conviene un letrero visible en la entrada."
      }
    ],
    "ejemplo": "Ejemplo: un edificio de oficinas en Obarrio con 60 estacionamientos para inquilinos. La pluma abre sola a las placas de la lista y la administración sabe a qué hora entró y salió cada carro, incluidas las visitas."
  },
  I04: {
    "como": [
      {
        "titulo": "Visita a las puertas",
        "texto": "Vemos qué puertas quieres controlar, de qué material son y dónde hay corriente cerca."
      },
      {
        "titulo": "Lector y cerradura",
        "texto": "Instalamos en cada puerta el lector de QR o tarjeta y la cerradura electromagnética."
      },
      {
        "titulo": "Permisos por persona",
        "texto": "Cargamos a cada empleado con su horario y sus puertas. Para una visita o un proveedor, creas un pase que vence solo."
      },
      {
        "titulo": "Entran con QR o tarjeta",
        "texto": "Cada entrada queda registrada con nombre y hora. Si alguien deja la empresa, le quitas el permiso desde tu teléfono."
      }
    ],
    "necesitas": [
      "Puertas en buen estado que cierren bien",
      "Corriente cerca de cada puerta e internet en el local",
      "La lista de personas con su horario"
    ],
    "no_incluye": [
      "Cambiar la puerta o el marco",
      "Cámaras de vigilancia en la puerta",
      "Calcular la planilla de pago a partir de la asistencia"
    ],
    "preguntas": [
      {
        "p": "¿Qué pasa si se va la luz?",
        "r": "La cerradura electromagnética se suelta sin corriente, así que nadie queda encerrado. Si necesitas que la puerta siga cerrada durante un apagón, se agrega una batería de respaldo y va en la propuesta."
      },
      {
        "p": "¿QR o tarjeta?",
        "r": "El QR lo lleva cada quien en su teléfono; la tarjeta sirve para quien no quiere usar el suyo. Puedes dar QR a unos y tarjeta a otros, y el lector se escoge para lo que uses."
      },
      {
        "p": "¿Me sirve como control de asistencia?",
        "r": "Sí: cada entrada queda con nombre y hora. Si quieres que esos datos pasen a tu sistema de planilla, la conexión se cotiza aparte."
      }
    ],
    "ejemplo": "Ejemplo: una clínica en Penonomé con una puerta al cuarto de medicamentos. Solo las enfermeras del turno abren con su tarjeta, y el técnico del aire acondicionado entra con un pase que vence a las 5 de la tarde."
  },
  I05: {
    "como": [
      {
        "titulo": "Visita a la zona de trabajo",
        "texto": "Vemos dónde se exige casco y chaleco, cuánta luz hay y si tus cámaras actuales sirven."
      },
      {
        "titulo": "Cámaras y equipo local",
        "texto": "Instalamos las cámaras que falten y un equipo que analiza el video dentro de tu planta."
      },
      {
        "titulo": "Marcamos las zonas",
        "texto": "En la imagen de cada cámara marcamos el área donde el equipo es obligatorio. Fuera de ella no avisa."
      },
      {
        "titulo": "Avisos y reporte",
        "texto": "Cuando alguien entra sin casco o sin chaleco, el supervisor recibe la foto del momento. Cada semana llega el reporte por zona."
      }
    ],
    "necesitas": [
      "Buena luz en las zonas a vigilar, también en el turno de noche si lo hay",
      "Corriente y red donde van las cámaras",
      "Un aviso por escrito a tu personal y letreros de que hay cámaras"
    ],
    "no_incluye": [
      "Los cascos y los chalecos",
      "Saber quién es la persona: el aviso trae la foto, sin el nombre",
      "Grabación de vigilancia contra robos"
    ],
    "preguntas": [
      {
        "p": "¿Puedo usar las cámaras que ya tengo?",
        "r": "Si dan buena imagen de la zona y se pueden conectar al equipo, sí. Lo revisamos en la visita."
      },
      {
        "p": "¿Se equivoca?",
        "r": "Puede pasar. Por eso cada aviso trae la foto: el supervisor la mira y decide."
      },
      {
        "p": "¿El video sale de la planta?",
        "r": "Se analiza en el equipo que queda en tu planta. Lo que sale es el aviso con la foto."
      }
    ],
    "ejemplo": "Ejemplo: una bloquera en Las Cumbres con un patio por donde pasan montacargas. Si alguien cruza la zona marcada sin chaleco, el jefe de patio recibe la foto en el momento, y el viernes ve en qué horas pasó más."
  },
  I06: {
    "como": [
      {
        "titulo": "Vemos la línea",
        "texto": "Revisamos qué se cuenta (sacos, cajas o piezas), cómo pasan y dónde cabe el sensor o la cámara."
      },
      {
        "titulo": "Sensor o cámara",
        "texto": "Si pasan de uno en uno, a veces basta un sensor de barrera. Si pasan juntos o hay de varios tipos, va una cámara."
      },
      {
        "titulo": "Prueba contra el conteo a mano",
        "texto": "Cargamos tus turnos y comparamos lo que cuenta el sistema con un conteo a mano antes de entregarlo."
      },
      {
        "titulo": "Tablero en la oficina",
        "texto": "Desde la oficina ves cuánto va por hora y por turno, sin esperar al cierre."
      }
    ],
    "necesitas": [
      "Acceso a la línea o al portón, con corriente cerca",
      "Red o Wi-Fi que llegue hasta la línea",
      "Los horarios de tus turnos"
    ],
    "no_incluye": [
      "Revisar la calidad o separar piezas dañadas",
      "Pesar lo que pasa: eso es el servicio de básculas conectadas",
      "Pasar el conteo a tu sistema de inventario, que se cotiza aparte"
    ],
    "preguntas": [
      {
        "p": "¿Cuenta bien si las cajas pasan pegadas?",
        "r": "Con sensor de barrera, dos cajas pegadas pueden contar como una; ahí conviene la cámara. Por eso lo comparamos con un conteo a mano antes de entregarlo."
      },
      {
        "p": "¿Puedo ver cómo funciona?",
        "r": "En el laboratorio del sitio hay una demo que usa la cámara de tu computadora o tu teléfono y cuenta a las personas que cruzan una línea. En la planta se hace lo mismo sobre la banda o el portón."
      }
    ],
    "ejemplo": "Ejemplo: un molino de arroz en Chitré que despacha sacos por el portón de carga. El gerente ve desde la oficina cuántos sacos salieron en cada turno, sin esperar la hoja del capataz."
  },
  I07: {
    "como": [
      {
        "titulo": "Escogemos los equipos",
        "texto": "Contigo elegimos los motores, bombas o compresores que más te cuesta tener parados."
      },
      {
        "titulo": "Sensores en cada equipo",
        "texto": "Montamos en cada uno un sensor inalámbrico de vibración y temperatura, y la puerta de enlace que los conecta."
      },
      {
        "titulo": "Línea base",
        "texto": "Primero registramos cómo vibra y cuánto calienta cada equipo cuando trabaja bien. Los avisos se ajustan a esa medida."
      },
      {
        "titulo": "Aviso con la tendencia",
        "texto": "Si un equipo empieza a salirse de su normal, mantenimiento recibe por WhatsApp el aviso con la gráfica de cómo viene cambiando."
      }
    ],
    "necesitas": [
      "La lista de equipos críticos y acceso a ellos",
      "Internet o red en la planta para la puerta de enlace",
      "Una persona de mantenimiento que reciba los avisos"
    ],
    "no_incluye": [
      "La reparación o el mantenimiento del equipo",
      "La causa exacta de la falla: el aviso dice que algo cambió y tu técnico revisa qué es",
      "Lo que Meta cobra por cada aviso por WhatsApp: unos US$0.011 por mensaje en Panamá, según su tarifa de octubre de 2026"
    ],
    "preguntas": [
      {
        "p": "¿Hay que tirar cable hasta la oficina?",
        "r": "No. Los sensores son inalámbricos y le pasan los datos a la puerta de enlace."
      },
      {
        "p": "¿Avisa desde el primer día?",
        "r": "Primero tiene que registrar cómo trabaja cada equipo cuando está bien. Cuánto toma depende del equipo y de sus horarios de uso."
      },
      {
        "p": "¿Me garantiza que no se dañe nada?",
        "r": "No. Te da tiempo de revisar antes de que pare la producción, cuando el daño empieza con más vibración o más calor."
      }
    ],
    "ejemplo": "Ejemplo: una planta de hielo en Santiago con dos compresores y una bomba de agua. Cuando un compresor empieza a calentarse más que su normal, el técnico recibe el aviso y lo revisa en el cambio de turno."
  },
  I08: {
    "como": [
      {
        "titulo": "Revisamos la báscula",
        "texto": "Vemos la marca y el modelo de tu báscula o medidor y si tiene salida de datos."
      },
      {
        "titulo": "La conectamos",
        "texto": "Ponemos el adaptador que pasa la lectura a la red y la mandamos a tu sistema."
      },
      {
        "titulo": "Registro por camión",
        "texto": "El peso entra solo. Quien pesa escoge el camión, el lote o el turno, y nadie copia el número a mano."
      },
      {
        "titulo": "Reporte diario",
        "texto": "Al cierre te llega el reporte del día con lo que se pesó."
      }
    ],
    "necesitas": [
      "Una báscula o un medidor que funcione y tenga salida de datos; si no la tiene, lo vemos en la visita",
      "Red o Wi-Fi cerca de la báscula",
      "Saber a qué sistema o planilla deben llegar los datos"
    ],
    "no_incluye": [
      "La báscula ni su calibración",
      "Leer la placa del camión de forma automática: es el servicio de lectura de placas",
      "Cambiar el sistema que ya usas"
    ],
    "preguntas": [
      {
        "p": "¿Sirve con mi báscula vieja?",
        "r": "Depende de si tiene salida de datos. Lo revisamos en la visita antes de proponerte nada."
      },
      {
        "p": "¿Cambia el peso o la calibración?",
        "r": "No. Lee lo que la báscula marca. La calibración sigue siendo cosa de tu proveedor de la báscula."
      },
      {
        "p": "¿Funciona con el sistema que ya uso?",
        "r": "Depende de si tu sistema acepta datos que vienen de afuera. Lo revisamos contigo y va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: un patio de chatarra en Colón donde las pesadas de los camiones se anotaban en un cuaderno. Ahora el peso entra solo, el pesador marca el camión y el turno, y al cierre el dueño compara lo pesado contra lo pagado."
  },
  I09: {
    "como": [
      {
        "titulo": "Visita al tablero",
        "texto": "Revisamos tu tablero eléctrico, los circuitos que quieres ver por separado y el inversor de los paneles, si tienes."
      },
      {
        "titulo": "Medidores con pinza",
        "texto": "Instalamos medidores con pinza en cada circuito y conectamos la lectura del inversor."
      },
      {
        "titulo": "Cargamos tu tarifa",
        "texto": "Con tus facturas de luz recientes cargamos lo que pagas por kWh, para calcular el ahorro en dinero."
      },
      {
        "titulo": "Pantalla y reporte",
        "texto": "En una pantalla ves cuánto producen los paneles y cuánto gasta cada área. Cada mes te llega el reporte de ahorro."
      }
    ],
    "necesitas": [
      "Acceso al tablero eléctrico",
      "Tus facturas de luz recientes",
      "Acceso a la cuenta o la app del inversor, si tienes paneles",
      "Wi-Fi que llegue al tablero"
    ],
    "no_incluye": [
      "Vender o instalar paneles solares",
      "La limpieza o el mantenimiento de los paneles",
      "Trámites con la empresa de distribución eléctrica"
    ],
    "preguntas": [
      {
        "p": "¿Me sirve si todavía no tengo paneles?",
        "r": "Sí. Ves cuánto gasta cada área, y si un día pones paneles ya tienes con qué comparar."
      },
      {
        "p": "¿Funciona con cualquier inversor?",
        "r": "Depende de si el inversor entrega sus datos. Lo revisamos en la visita con la marca y el modelo."
      },
      {
        "p": "¿Cuánto voy a ahorrar?",
        "r": "No te lo prometemos: medir no ahorra por sí solo. Una revisión de estudios en hogares (ACEEE, 2010) midió entre 4 % y 12 % menos consumo cuando la gente ve su gasto; para negocios no encontramos una cifra independiente."
      }
    ],
    "ejemplo": "Ejemplo: un hotel de 12 habitaciones en Pedasí con paneles en el techo. La dueña ve en una pantalla cuánto producen los paneles y cuánto gastan los aires de las habitaciones frente a la cocina, y cada mes recibe el reporte de ahorro."
  },
  I10: {
    "como": [
      {
        "titulo": "Qué hay que revisar",
        "texto": "Nos dices qué quieres ver: filtraciones en un techo, el avance de una obra o el estado de un terreno. Revisamos si la zona tiene restricciones de vuelo."
      },
      {
        "titulo": "Vuelo",
        "texto": "Volamos el área y tomamos fotos de alta resolución, sin andamios y sin subir a nadie al techo."
      },
      {
        "titulo": "Mapa del área",
        "texto": "Unimos las fotos en un mapa del área completa para ubicar cada punto."
      },
      {
        "titulo": "Informe",
        "texto": "Recibes el informe con las fotos de lo encontrado y su ubicación en el mapa. Con eso decides la reparación o reportas el avance."
      }
    ],
    "necesitas": [
      "Permiso para volar sobre la propiedad o la obra",
      "Decirnos qué buscar: goteras, avance de obra o el estado del terreno",
      "Los planos de la obra, si quieres comparar el avance"
    ],
    "no_incluye": [
      "La reparación del techo o de lo que se encuentre",
      "Un dictamen firmado por un ingeniero",
      "La medición oficial de linderos, que hace un agrimensor"
    ],
    "preguntas": [
      {
        "p": "¿El informe sirve para un trámite o para el seguro?",
        "r": "Es un informe con fotos y su ubicación. No reemplaza el dictamen firmado de un ingeniero, pero le dice a ese ingeniero dónde mirar."
      },
      {
        "p": "¿Se puede volar cada mes para ver el avance de la obra?",
        "r": "Sí. Repetir el vuelo permite comparar un mapa con otro; la frecuencia y el costo van en la propuesta."
      },
      {
        "p": "¿Qué pasa si llueve?",
        "r": "Con lluvia o viento fuerte no se vuela. Se mueve la fecha."
      }
    ],
    "ejemplo": "Ejemplo: una bodega en Tocumen con techo de zinc que gotea en dos pasillos. El vuelo muestra las láminas levantadas y el informe marca en el mapa dónde está cada una, para que el techero vaya directo."
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
  R12: {
    "como": [
      {
        "titulo": "Cómo vendes hoy",
        "texto": "Vemos tus sucursales, tus zonas de entrega, cuántos motorizados tienes y qué te cobran hoy las apps por pedido. Si son varios restaurantes, cómo se reparten las ventas."
      },
      {
        "titulo": "Tu app y tu carta",
        "texto": "Armamos la app con tu marca, tu carta y tus fotos, las zonas por barrio con su costo, y el cobro con Yappy y tarjeta conectado a tu cuenta."
      },
      {
        "titulo": "Motorizados y cocina",
        "texto": "Cada pedido entra a la cocina de la sucursal que corresponde y se asigna a un motorizado, que ve la ruta en su app. El cliente sigue el pedido en su teléfono."
      },
      {
        "titulo": "Publicación",
        "texto": "Subimos la app a Google Play y App Store a nombre de tu negocio. Desde tu panel cambias precios, agotados, horarios y zonas."
      }
    ],
    "necesitas": [
      "Tus motorizados o una empresa de reparto de confianza",
      "Una cuenta para cobrar en línea: Yappy Comercial o una pasarela de tarjeta",
      "Tu carta con precios y fotos"
    ],
    "no_incluye": [
      "Las comisiones de cada pago: las cobra Yappy, el banco o la pasarela",
      "Las cuentas de desarrollador de Google Play y App Store, que se pagan a nombre de tu negocio",
      "La publicidad para que la gente descargue la app"
    ],
    "preguntas": [
      {
        "p": "¿Tengo que dejar PedidosYa o Uber Eats?",
        "r": "No. Muchos restaurantes siguen en las apps para que los encuentren clientes nuevos, y mandan a los que ya los conocen a su propia app, donde no pagan comisión."
      },
      {
        "p": "¿Puedo hacerla con otros restaurantes?",
        "r": "Sí. Varios restaurantes pueden vender en la misma app, con un pedido que junta platos de varios y la cuenta separada para cada uno. Cómo se reparten los costos lo acuerdan entre ustedes."
      },
      {
        "p": "¿Cuánto tarda?",
        "r": "Depende de cuántas sucursales y restaurantes entren y de si ya tienes la carta digital. La fecha va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: dos restaurantes de comida rápida y una heladería de la misma plaza en Brisas del Golf venden en una sola app. El cliente pide hamburguesa y helado en un mismo pedido, un solo motorizado lo lleva, y cada local ve solo sus ventas."
  },
  R13: {
    "como": [
      {
        "titulo": "Tu carta y tus reglas",
        "texto": "Cargamos tu carta con precios y agotados, tus zonas de entrega por barrio con su costo, tu horario y las formas de pago que aceptas."
      },
      {
        "titulo": "El asistente en tu WhatsApp",
        "texto": "Conectamos el asistente a tu número de WhatsApp Business. Toma el pedido, pregunta lo que falte (término de la carne, sin cebolla), confirma la dirección y manda el enlace de pago."
      },
      {
        "titulo": "La comanda sale sola",
        "texto": "Con el pedido confirmado, la comanda se imprime en la cocina o aparece en la pantalla, con la hora y la dirección para el motorizado."
      },
      {
        "titulo": "Cuando hace falta una persona",
        "texto": "Si el cliente pide hablar con alguien o algo no cuadra, el chat pasa a tu equipo con todo lo que se habló."
      }
    ],
    "necesitas": [
      "Un número de WhatsApp Business para el local",
      "Internet estable en la cocina para la impresora o la pantalla",
      "Tu carta con precios"
    ],
    "no_incluye": [
      "El costo de las conversaciones de WhatsApp Business, que cobra Meta",
      "Las comisiones de cada pago en línea",
      "Los motorizados"
    ],
    "preguntas": [
      {
        "p": "¿El cliente se da cuenta de que le contesta un asistente?",
        "r": "Sí, se lo decimos desde el primer mensaje. Puede pedir hablar con una persona cuando quiera."
      },
      {
        "p": "¿Qué pasa si se acaba un plato a media noche?",
        "r": "Lo marcas agotado en tu panel y el asistente deja de ofrecerlo en ese momento."
      },
      {
        "p": "¿Sirve si también vendo por PedidosYa?",
        "r": "Sí. Esto es para los pedidos que ya te llegan por WhatsApp; las apps siguen como están."
      }
    ],
    "ejemplo": "Ejemplo: una pizzería de San Francisco que recibe 60 pedidos por WhatsApp un viernes deja de tener a una persona copiando cada uno. El asistente toma el pedido, cobra con Yappy y la comanda sale impresa en la cocina con la dirección."
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
      "Los mensajes de WhatsApp: Meta los cobra aparte, unos US$0.011 cada uno en Panamá según su tarifa de octubre de 2026",
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
  T01: {
    "como": [
      {
        "titulo": "Conversación sobre tu negocio",
        "texto": "Nos cuentas qué vendes, en qué zona y qué quieres que haga la gente al entrar: escribirte por WhatsApp o llegar al local."
      },
      {
        "titulo": "Textos y fotos reales",
        "texto": "Tomamos tu horario, tus servicios, tu dirección y tus fotos, y escribimos los textos contigo. Cada frase habla de tu negocio."
      },
      {
        "titulo": "Revisas en tu teléfono",
        "texto": "Te mandamos un enlace de prueba para que la veas en el teléfono y pidas cambios. Se publica en tu dominio cuando la apruebas."
      },
      {
        "titulo": "Te escriben desde la página",
        "texto": "El botón abre WhatsApp con tu número y un mensaje ya escrito. La página queda lista para que Google la muestre cuando buscan tu nombre y tu zona."
      }
    ],
    "necesitas": [
      "Fotos de tu local, tus productos o tu trabajo; las del teléfono sirven para empezar",
      "Tu horario, tu dirección y tu número de WhatsApp",
      "La lista de lo que vendes o de los servicios que das",
      "Tu logo, si tienes"
    ],
    "no_incluye": [
      "Tienda en línea con carrito y cobro: es otro servicio",
      "Anuncios pagados en Google, Facebook o Instagram",
      "El manejo de tus redes sociales"
    ],
    "preguntas": [
      {
        "p": "¿El dominio queda a mi nombre?",
        "r": "Sí. Se registra a nombre de tu negocio, así que la página y el correo siguen siendo tuyos aunque un día cambies de proveedor."
      },
      {
        "p": "¿Puedo cambiar yo el horario o un precio?",
        "r": "Depende de cuánto cambia tu información. Si cambia seguido, se deja una forma de editarla tú; si casi no cambia, nos escribes y lo cambiamos. Va en la propuesta."
      },
      {
        "p": "Ya tengo una página vieja. ¿Hay que empezar de cero?",
        "r": "El dominio y el contenido que sirva se aprovechan. El diseño sí se hace nuevo."
      }
    ],
    "ejemplo": "Ejemplo: una clínica veterinaria de Penonomé con una sola sede. La página muestra los servicios con su horario, la dirección con el mapa y un botón que abre WhatsApp con «Hola, quiero una cita para mi perro». Quien la abre en el teléfono ve primero el horario y ese botón."
  },
  T02: {
    "como": [
      {
        "titulo": "Visita para ver el proceso",
        "texto": "Vamos a tu negocio y vemos cómo se hace hoy la tarea: el Excel, el cuaderno o las tres aplicaciones. Hablamos también con quien la hace todos los días."
      },
      {
        "titulo": "Propuesta de la primera versión",
        "texto": "Te decimos qué hará la primera versión, quién la va a usar, qué queda para después y cuánto cuesta."
      },
      {
        "titulo": "Tu equipo la prueba",
        "texto": "Cada persona entra con su usuario y ve lo que le toca a su puesto. Con lo que digan se ajusta antes de dejar el Excel."
      },
      {
        "titulo": "Uso diario con respaldo",
        "texto": "El sistema queda en uso con tus datos y un respaldo diario. Lo que vaya haciendo falta se agrega por partes."
      }
    ],
    "necesitas": [
      "Una persona de tu equipo que conozca el proceso y tenga tiempo para las pruebas",
      "Tus hojas de Excel, formularios o cuadernos de hoy",
      "Computadoras, tabletas o teléfonos con internet donde se va a usar"
    ],
    "no_incluye": [
      "Las computadoras o tabletas del equipo",
      "Pasar a mano años de papeles viejos; si hace falta, se cotiza aparte",
      "Las licencias de otros programas que ya usas"
    ],
    "preguntas": [
      {
        "p": "¿Cuánto tarda?",
        "r": "Depende del tamaño del proceso. Se arranca con una versión pequeña que tu equipo ya pueda usar y se crece desde ahí; el plazo va en la propuesta."
      },
      {
        "p": "¿Qué pasa con lo que tengo en Excel?",
        "r": "Se pasa al sistema al arrancar. Y lo que necesites en Excel para tu contador se puede exportar."
      },
      {
        "p": "¿Por qué no comprar un programa hecho?",
        "r": "Si hay uno que te sirve, te lo decimos. A la medida conviene cuando los programas hechos te obligan a cambiar cómo trabajas o a usar tres a la vez."
      }
    ],
    "ejemplo": "Ejemplo: una empresa de mantenimiento de aires acondicionados en Arraiján lleva las visitas en un Excel compartido y los técnicos llaman a la oficina para saber a dónde van. Con el sistema, la oficina asigna las visitas y cada técnico ve las suyas en el teléfono y marca cuáles terminó."
  },
  T03: {
    "como": [
      {
        "titulo": "Conversación sobre el uso",
        "texto": "Vemos quién la va a usar, para qué y cada cuánto. Si una página web te resuelve lo mismo, te lo decimos antes de cotizar."
      },
      {
        "titulo": "Pantallas que pruebas",
        "texto": "Diseñamos las pantallas y las pruebas en tu teléfono antes de terminarla, incluido lo que pasa cuando no hay señal."
      },
      {
        "titulo": "Publicación en las tiendas",
        "texto": "La subimos a Google Play y al App Store con las cuentas de tu negocio. Apple y Google la revisan antes de aprobarla."
      },
      {
        "titulo": "La descargan y la usan",
        "texto": "La gente la busca con el nombre de tu negocio y la instala. Lo que se anota sin señal se envía cuando el teléfono vuelve a conectarse."
      }
    ],
    "necesitas": [
      "Cuentas de desarrollador de Apple y de Google a nombre de tu negocio",
      "Tu logo y tus colores",
      "El contenido que va a mostrar: productos, servicios, rutas o formularios"
    ],
    "no_incluye": [
      "Lo que cobran Apple y Google por las cuentas de desarrollador",
      "La aprobación en las tiendas: la deciden Apple y Google",
      "Los teléfonos de tu equipo, si la app es para ellos"
    ],
    "preguntas": [
      {
        "p": "¿Necesito una app o me basta una página?",
        "r": "Si tus clientes te visitan de vez en cuando, te basta una página. La app vale la pena cuando la abren seguido o hay que usarla sin señal, como un vendedor en ruta."
      },
      {
        "p": "¿Funciona en Android y en iPhone?",
        "r": "Sí, en los dos."
      },
      {
        "p": "¿Cuánto tarda en salir en las tiendas?",
        "r": "La revisión la hacen Apple y Google, y ese tiempo no depende de nosotros. El tiempo de desarrollo va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: una distribuidora de productos de limpieza en Juan Díaz con cuatro vendedores en ruta por el interior. Cada vendedor toma los pedidos en la app aunque no tenga señal en la carretera, y los pedidos llegan a la oficina cuando el teléfono se conecta."
  },
  T04: {
    "como": [
      {
        "titulo": "Nos muestras la tarea",
        "texto": "La persona que la hace nos muestra cómo la hace cada día: de dónde copia, a dónde pega y qué revisa. Así vemos qué puede hacerse solo y qué necesita a alguien."
      },
      {
        "titulo": "Conectamos tus herramientas",
        "texto": "Unimos el correo, la hoja de cálculo, WhatsApp o tu sistema para que el dato pase de uno a otro sin copiarlo."
      },
      {
        "titulo": "Corre en paralelo",
        "texto": "Al principio la automatización trabaja mientras la persona sigue haciendo la tarea a mano, y se comparan los resultados."
      },
      {
        "titulo": "Funciona sola y avisa",
        "texto": "Los pedidos se registran y los reportes llegan a su hora. Si algo falla, te llega un aviso en vez de enterarte a fin de mes."
      }
    ],
    "necesitas": [
      "Acceso a las cuentas que se van a conectar: correo, hojas de cálculo, tu sistema",
      "La persona que hace hoy la tarea, para que la muestre",
      "Ejemplos reales de un pedido, una cotización o un reporte de los de siempre"
    ],
    "no_incluye": [
      "La mensualidad de la herramienta donde corre, si es de pago (Make o Zapier, por ejemplo)",
      "Cambiarte de sistema de ventas o de contabilidad",
      "Las decisiones que piden criterio de una persona: esas quedan para revisión"
    ],
    "preguntas": [
      {
        "p": "¿Qué tareas se pueden automatizar?",
        "r": "Las que se repiten igual: copiar pedidos a una hoja, mandar el mismo reporte cada lunes, pasar los datos de un formulario al sistema. Si cada caso es distinto, se automatiza la parte que se repite."
      },
      {
        "p": "¿Y si algo cambia y deja de funcionar?",
        "r": "Está hecha para avisar cuando falla. Lo que cuesta mantenerla después va en la propuesta."
      },
      {
        "p": "¿Tengo que pagar programas nuevos?",
        "r": "Depende de dónde corra. Hay herramientas que se pagan por mes y otras que se instalan sin licencia, como n8n; te decimos cuál conviene y por qué."
      }
    ],
    "ejemplo": "Ejemplo: una distribuidora de huevos en Chitré recibe los pedidos de las tiendas por correo y alguien los pasa a un Excel cada noche. La automatización arma sola la hoja del reparto del día siguiente y le manda el resumen al dueño a las 6 de la mañana."
  },
  T05: {
    "como": [
      {
        "titulo": "Reunimos tu información",
        "texto": "Juntamos las preguntas que tus clientes hacen siempre y sus respuestas: catálogo, precios, horario, ubicación y cómo pedir o agendar."
      },
      {
        "titulo": "Escogemos dónde vive",
        "texto": "Si te alcanza con el asistente que trae WhatsApp Business, lo configuramos ahí. Si tiene que tomar pedidos en tu sistema o agendar en tu agenda, se hace uno a la medida."
      },
      {
        "titulo": "Prueba con preguntas reales",
        "texto": "Antes de encenderlo le hacemos las preguntas que te mandaron tus clientes la semana pasada y corregimos lo que conteste mal."
      },
      {
        "titulo": "Contesta y pasa el resto",
        "texto": "Contesta a cualquier hora con tu información, toma pedidos o agenda citas. Si el cliente pide hablar con alguien o pregunta algo que no está en esa información, te pasa la conversación."
      }
    ],
    "necesitas": [
      "Un número con WhatsApp Business para el negocio",
      "Tu lista de precios, tu horario y las preguntas que más te hacen",
      "Alguien que atienda las conversaciones que el asistente le pasa"
    ],
    "no_incluye": [
      "Lo que Meta cobra por los mensajes que se pagan, como las promociones; depende del tipo de mensaje",
      "El teléfono o la línea del negocio",
      "Respuestas sobre lo que no le diste: eso lo pasa a una persona"
    ],
    "preguntas": [
      {
        "p": "¿Puede inventar un precio?",
        "r": "Se configura para contestar solo con tu información y pasarte lo que no sabe. Igual, al principio revisamos contigo sus conversaciones para corregir lo que conteste mal."
      },
      {
        "p": "¿WhatsApp cobra por esto?",
        "r": "Depende del tipo de mensaje. Contestarle a un cliente que te escribió cuesta poco o nada; los mensajes que el negocio manda primero, como las promociones, Meta los cobra uno por uno."
      },
      {
        "p": "¿Mis clientes van a saber que es un asistente?",
        "r": "Sí. Se presenta como el asistente del negocio y ofrece pasar con una persona."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de repuestos de motos en La Chorrera recibe por WhatsApp las mismas preguntas hasta tarde: si hay una pieza, cuánto cuesta y a qué hora abren. El asistente contesta con la lista de precios y el horario, y deja para el encargado lo que no está en la lista."
  },
  T06: {
    "como": [
      {
        "titulo": "Vemos cómo cotizas hoy",
        "texto": "Revisamos una cotización tuya de las de siempre: renglones, descuentos, ITBMS y quién la aprueba."
      },
      {
        "titulo": "Cargamos tu catálogo",
        "texto": "Pasamos tus productos con precio y existencias al cotizador, desde tu sistema o desde tu Excel."
      },
      {
        "titulo": "Arma y pide aprobación",
        "texto": "El vendedor busca los productos, pone cantidades y descuentos, y la cotización pasa por quien aprueba antes de salir."
      },
      {
        "titulo": "El cliente recibe el PDF",
        "texto": "Sale en PDF con tu logo y queda en el historial del cliente, para encontrarla cuando vuelva a llamar."
      }
    ],
    "necesitas": [
      "Tu lista de productos con precios, en tu sistema o en Excel",
      "Tu logo y lo que va en la cotización: RUC, condiciones, vigencia",
      "Quién aprueba los descuentos y hasta cuánto puede dar cada vendedor"
    ],
    "no_incluye": [
      "La factura electrónica: es otro servicio",
      "El cobro en línea de la cotización aprobada",
      "Contar la mercancía en la bodega: el cotizador muestra las existencias que tiene tu sistema"
    ],
    "preguntas": [
      {
        "p": "¿Se conecta con mi sistema de inventario?",
        "r": "Si tu sistema deja sacar los datos, sí, y las existencias se ven al día. Si no, el catálogo se mantiene en el cotizador. Lo vemos en la primera conversación."
      },
      {
        "p": "¿Puedo cotizar desde el teléfono?",
        "r": "Sí. El vendedor la puede armar en la visita al cliente."
      },
      {
        "p": "¿Calcula el ITBMS?",
        "r": "Sí, por renglón, con la tasa que le toca a cada producto."
      }
    ],
    "ejemplo": "Ejemplo: una ferretería de Santiago con tres vendedores que cotizan a contratistas por WhatsApp. Cada vendedor arma la cotización con las existencias del día, el encargado aprueba los descuentos grandes y el contratista recibe el PDF con el logo de la ferretería."
  },
  T07: {
    "como": [
      {
        "titulo": "Vemos cómo facturas hoy",
        "texto": "Revisamos tu sistema de ventas, cuántas facturas haces al mes y si ya tienes un PAC, que es el proveedor autorizado por la DGI."
      },
      {
        "titulo": "Escogemos el PAC",
        "texto": "Si no tienes, te ayudamos a escoger uno de la lista oficial de la DGI. El contrato con el PAC queda a nombre de tu negocio."
      },
      {
        "titulo": "Conectamos y probamos",
        "texto": "Cada venta de tu sistema se manda al PAC sin volver a escribirla. Probamos facturas y notas de crédito antes de usarla con clientes."
      },
      {
        "titulo": "Facturas al vender",
        "texto": "El cliente recibe la factura por correo o WhatsApp. Si hay una devolución, la nota de crédito sale del mismo sistema."
      }
    ],
    "necesitas": [
      "Tu RUC y tu registro en la DGI al día",
      "Un sistema de ventas o un punto de venta que se pueda conectar",
      "Contrato con un PAC autorizado, o la decisión de cuál contratar"
    ],
    "no_incluye": [
      "La mensualidad o el plan anual del PAC, que se le paga a ese proveedor",
      "La asesoría contable o fiscal: eso lo ve tu contador",
      "El punto de venta, si todavía no tienes uno: es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Estoy obligado a facturar electrónicamente?",
        "r": "La DGI dice que desde el 1 de marzo de 2024 los únicos sistemas de facturación son la factura fiscal y la factura electrónica. Si te toca a ti y desde cuándo, confírmalo con tu contador."
      },
      {
        "p": "¿Me sirve el facturador gratuito de la DGI?",
        "r": "Es para negocios con ingresos de hasta B/.36.000 al año y no más de 100 documentos al mes. Si cumples las dos condiciones, puede que te alcance y no necesites este servicio; te lo decimos en la conversación."
      },
      {
        "p": "Ya tengo un PAC. ¿Hay que cambiarlo?",
        "r": "No necesariamente. Primero vemos si tu sistema se puede conectar con ese PAC."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de materiales eléctricos en Colón que vende desde su sistema y después vuelve a escribir cada factura en el portal del PAC. Con la conexión, la factura sale al confirmar la venta y le llega al cliente por WhatsApp."
  },
  T08: {
    "como": [
      {
        "titulo": "Escoges tus cifras",
        "texto": "Nos dices qué números miras cada semana y de dónde los sacas hoy: el sistema de ventas, un Excel o el cierre de caja."
      },
      {
        "titulo": "Conectamos las fuentes",
        "texto": "El tablero lee los datos de tu sistema o de tus hojas de cálculo, sin que nadie los copie."
      },
      {
        "titulo": "Revisas que cuadre",
        "texto": "Comparamos las cifras del tablero con un cierre que ya conoces. Si no cuadran, se busca por qué antes de usarlo."
      },
      {
        "titulo": "Lo miras cuando quieras",
        "texto": "Lo abres en el teléfono o en la computadora, con ventas por día, por producto y por vendedor frente a la semana y el mes anteriores. El resumen también te llega por correo."
      }
    ],
    "necesitas": [
      "Un sistema de ventas o unas hojas de cálculo que se llenen todos los días",
      "Acceso a esos datos",
      "La lista de las cifras que de verdad miras"
    ],
    "no_incluye": [
      "Un televisor para la oficina: el tablero se ve en el teléfono y en la computadora",
      "Pasar a digital las ventas que hoy se anotan en papel",
      "Cambiar tu sistema de ventas"
    ],
    "preguntas": [
      {
        "p": "¿Y si mis ventas están en papel?",
        "r": "Primero tienen que estar en un sistema o en una hoja que se llene a diario. Si no lo están, conviene empezar por eso, con un punto de venta o un sistema a medida."
      },
      {
        "p": "¿Cada cuánto se actualiza?",
        "r": "Depende de la fuente: algunos sistemas dan los datos al momento y otros una vez al día. Te lo decimos al revisar tu sistema."
      }
    ],
    "ejemplo": "Ejemplo: dos panaderías del mismo dueño en David, con caja en cada local. El lunes temprano le llega por correo cuánto vendió cada local la semana anterior y qué productos subieron o bajaron frente a la semana previa."
  },
  T09: {
    "como": [
      {
        "titulo": "Abrimos tus cuentas de cobro",
        "texto": "Te ayudamos a abrir Yappy Comercial y una pasarela de tarjeta a nombre de tu negocio, o usamos las que ya tengas."
      },
      {
        "titulo": "Botón y enlaces de pago",
        "texto": "Ponemos el botón de pago en tu página y te enseñamos a crear enlaces de pago para mandarlos por WhatsApp."
      },
      {
        "titulo": "Confirmación automática",
        "texto": "Cuando el cliente paga, la confirmación llega sola a tu sistema o a tu correo. Nadie tiene que revisar capturas de pantalla."
      },
      {
        "titulo": "Cobras desde el chat",
        "texto": "Mandas el enlace con el monto, el cliente paga con Yappy o con tarjeta y ves el pago confirmado."
      }
    ],
    "necesitas": [
      "Una cuenta bancaria a nombre del negocio",
      "Yappy Comercial o una pasarela de tarjeta, o los papeles para abrirlas",
      "Tu página web o tu sistema, si el pago se va a conectar ahí"
    ],
    "no_incluye": [
      "La comisión que cobran Yappy o la pasarela por cada pago",
      "Una tienda en línea con catálogo y carrito: es otro servicio",
      "La factura electrónica de cada venta"
    ],
    "preguntas": [
      {
        "p": "¿Puedo cobrar con Stripe?",
        "r": "Stripe no opera en Panamá. Usamos medios que sí: Yappy y pasarelas de tarjeta que trabajan aquí, como Tilopay o PagueloFacil."
      },
      {
        "p": "¿Cuánto me cobran por cada pago?",
        "r": "Lo cobra Yappy o la pasarela, no nosotros. Yappy Comercial publica 1 % más ITBMS por transacción; con tarjeta la comisión es mayor y cambia según la pasarela."
      },
      {
        "p": "¿Cuándo me llega la plata?",
        "r": "Según su página, Yappy Comercial acredita al día siguiente. Con tarjeta depende de la pasarela que escojas."
      }
    ],
    "ejemplo": "Ejemplo: una pastelería de encargos en Betania que pide un adelanto por transferencia y después revisa en WhatsApp las capturas que le mandan. Ahora manda el enlace de pago con el monto del adelanto, y el pedido queda confirmado cuando entra el pago."
  },
  T10: {
    "como": [
      {
        "titulo": "Recorrido midiendo la señal",
        "texto": "Vamos al local y medimos la señal en cada área: el salón, la caja, la bodega, la terraza. Vemos dónde está el módem del proveedor y por dónde puede pasar el cable."
      },
      {
        "titulo": "Propuesta con ubicaciones",
        "texto": "Te decimos cuántos puntos de acceso hacen falta, dónde va cada uno y por dónde pasa el cable, con el equipo detallado."
      },
      {
        "titulo": "Instalación con dos redes",
        "texto": "Instalamos los puntos de acceso, el enrutador y el cableado. La caja y las cámaras quedan en una red y los clientes en otra, con su propia clave."
      },
      {
        "titulo": "Respaldo cuando se cae",
        "texto": "Si se cae el internet principal, la caja pasa sola a la conexión de respaldo y sigue cobrando."
      }
    ],
    "necesitas": [
      "Internet contratado con un proveedor",
      "Una segunda conexión para el respaldo, como otra línea o un chip de datos, a nombre del negocio",
      "Tomacorrientes donde van el enrutador y los equipos",
      "Permiso del dueño del local para pasar cable, si alquilas"
    ],
    "no_incluye": [
      "La mensualidad de los proveedores de internet",
      "Trabajos eléctricos, como tomacorrientes o circuitos nuevos",
      "El registro de clientes al entrar al Wi-Fi: es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Hay que romper paredes?",
        "r": "Lo normal es pasar el cable por canaletas o por el cielo raso. Lo vemos en la visita y queda escrito en la propuesta."
      },
      {
        "p": "Con el respaldo, ¿ya no me quedo sin internet?",
        "r": "La caja sigue en línea si se cae un proveedor. Si se caen los dos, o se va la luz, se cae igual."
      },
      {
        "p": "¿Sigo usando el módem que me dio el proveedor?",
        "r": "Sí, por ahí sigue entrando el internet. Lo que se agrega es lo que reparte la señal y separa las redes."
      }
    ],
    "ejemplo": "Ejemplo: un restaurante de dos pisos en El Cangrejo donde el Wi-Fi no llega a la terraza y los clientes usan la misma red que la caja. Queda un punto de acceso por piso, una red para clientes con su clave, y la caja pasa al chip de datos cuando se cae el internet."
  },
  T11: {
    "como": [
      {
        "titulo": "Visita al local",
        "texto": "Recorremos el local contigo y vemos qué quieres cubrir: la caja, la puerta, la bodega o el estacionamiento."
      },
      {
        "titulo": "Dónde va cada cámara",
        "texto": "Te proponemos dónde va cada cámara y qué ve, con el equipo detallado: cámaras, grabador y disco."
      },
      {
        "titulo": "Instalación y usuarios",
        "texto": "Instalamos y dejamos el acceso en el teléfono de cada persona con su propio usuario. El encargado ve las cámaras sin tener la clave del dueño."
      },
      {
        "titulo": "Ver y buscar grabaciones",
        "texto": "Miras en vivo desde donde estés y, si pasa algo, buscas la grabación por día y hora."
      }
    ],
    "necesitas": [
      "Internet en el local para verlas desde el teléfono",
      "Un lugar seguro y con corriente para el grabador",
      "La lista de personas que van a tener acceso"
    ],
    "no_incluye": [
      "Una central de monitoreo o un guardia mirando las cámaras",
      "Batería de respaldo para los apagones; si la quieres, va en la propuesta",
      "Avisos con IA de personas, filas o placas: son otros servicios",
      "Trabajos eléctricos nuevos"
    ],
    "preguntas": [
      {
        "p": "¿Cuántos días guarda la grabación?",
        "r": "Depende de cuántas cámaras tengas, de la calidad de imagen y del tamaño del disco. Con esos datos te lo decimos en la propuesta."
      },
      {
        "p": "¿Sirven las cámaras que ya tengo?",
        "r": "Si son cámaras IP y funcionan, se revisan en la visita y se usan."
      },
      {
        "p": "¿Tengo que poner un letrero?",
        "r": "Te lo recomendamos. La imagen de una persona es un dato personal, y la Ley 81 de 2019 pide informar a la gente cuando se recogen sus datos."
      }
    ],
    "ejemplo": "Ejemplo: un minisúper en San Miguelito con una caja, una bodega atrás y la puerta a la calle. Quedan cámaras en la caja, en la bodega y en la entrada, y el dueño revisa desde su casa la grabación de la hora del cierre."
  },
  T12: {
    "como": [
      {
        "titulo": "Escoges el nombre",
        "texto": "Buscamos qué nombres están libres en .com o en .com.pa, y escoges el que tus clientes van a recordar."
      },
      {
        "titulo": "Registro a tu nombre",
        "texto": "El dominio se registra a nombre de tu negocio, para que siga siendo tuyo pase lo que pase."
      },
      {
        "titulo": "Una cuenta por persona",
        "texto": "Creamos las cuentas (ventas@, administracion@ o el nombre de cada uno) y las configuramos en su teléfono y su computadora."
      },
      {
        "titulo": "Escribes desde tu dominio",
        "texto": "Tu equipo manda y recibe desde ventas@tunegocio.com en el mismo teléfono donde antes usaba el Gmail."
      }
    ],
    "necesitas": [
      "El nombre que quieres y una segunda opción",
      "La lista de personas que necesitan correo",
      "Los teléfonos y computadoras donde se va a configurar",
      "Si ya tienes dominio, el acceso a la cuenta donde lo compraste"
    ],
    "no_incluye": [
      "Lo que cobran cada año el registro del dominio y el proveedor del correo: va detallado aparte en la propuesta",
      "La compra del dominio, si ya tienes uno: se usa el tuyo",
      "La página web: es otro servicio"
    ],
    "preguntas": [
      {
        "p": "Ya tengo un dominio. ¿Lo pierdo?",
        "r": "No. Usamos el tuyo; solo necesitamos acceso a la cuenta donde está registrado."
      },
      {
        "p": "¿Puedo seguir usando mi Gmail?",
        "r": "Sí. Lo que cambia es que tus clientes escriben a la dirección del negocio, y esa cuenta se queda con el negocio aunque un empleado se vaya."
      },
      {
        "p": "¿.com o .com.pa?",
        "r": "Los dos sirven. Escoge el que esté libre y se recuerde fácil; si vendes solo en Panamá, .com.pa deja claro de dónde eres."
      }
    ],
    "ejemplo": "Ejemplo: una empresa de fumigación en Arraiján con tres personas que cotizan desde sus Gmail personales. Cada una queda con su cuenta del negocio configurada en el teléfono, y los clientes reciben las cotizaciones desde el dominio de la empresa."
  },
  T13: {
    "como": [
      {
        "titulo": "Revisamos tu perfil",
        "texto": "Buscamos si tu negocio ya aparece en Google Maps, quién creó el perfil y qué datos tiene mal: horario, teléfono o ubicación."
      },
      {
        "titulo": "Completamos y verificamos",
        "texto": "Llenamos el perfil con tu categoría, horario, fotos y teléfono. Google pide verificar que el negocio existe, y el método lo escoge Google."
      },
      {
        "titulo": "Pedimos reseñas",
        "texto": "Te dejamos un enlace directo para que tus clientes te dejen una reseña en Google, listo para mandarlo por WhatsApp después de cada compra."
      },
      {
        "titulo": "Respondes cada reseña",
        "texto": "Cuando entra una reseña, buena o mala, la respondes desde el teléfono. Las fotos y el horario quedan al día, también el de los feriados."
      }
    ],
    "necesitas": [
      "Una dirección donde atiendes al público, o la zona donde das servicio",
      "Acceso al Gmail con el que se creó el perfil, si ya existe",
      "Fotos de la fachada, del local y de tus productos o trabajos"
    ],
    "no_incluye": [
      "Anuncios pagados en Google",
      "Borrar reseñas malas: solo Google las quita, y solo si violan sus reglas",
      "Reseñas escritas por nosotros o compradas: van contra las reglas de Google"
    ],
    "preguntas": [
      {
        "p": "¿Me garantizan salir primero en el mapa?",
        "r": "No. Nadie puede garantizarlo: Google ordena según lo cerca que está quien busca, lo bien que tu perfil coincide con lo que busca y lo conocido que es tu negocio, reseñas incluidas."
      },
      {
        "p": "¿Pueden quitar una reseña mala?",
        "r": "No. Solo Google la quita, y solo si viola sus reglas. Lo que sí puedes es responderla con calma y con los hechos, porque la leen los próximos clientes."
      },
      {
        "p": "No tengo local. ¿Puedo aparecer?",
        "r": "Sí. Google deja mostrar la zona donde das servicio sin publicar tu dirección."
      }
    ],
    "ejemplo": "Ejemplo: un taller de bicicletas en Boquete que sale en Google con un horario viejo y sin fotos. Queda con el horario correcto, fotos del taller y un enlace que el dueño manda por WhatsApp después de cada reparación para pedir la reseña."
  },
  T14: {
    "como": [
      {
        "titulo": "Visita a la bodega",
        "texto": "Vemos cómo entra y sale hoy la mercancía, cuántas bodegas tienes y cómo anotas las compras."
      },
      {
        "titulo": "Cargamos tus productos",
        "texto": "Pasamos cada producto al sistema con su código, costo, mínimo y existencia, desde tu Excel o tu sistema actual."
      },
      {
        "titulo": "Entradas y salidas con lector",
        "texto": "Cada entrada y cada salida se registra pasando el código de barras, en la bodega que corresponde."
      },
      {
        "titulo": "Aviso y orden de compra",
        "texto": "Cuando un producto baja de su mínimo te llega el aviso, y la orden de compra al proveedor sale desde el mismo sistema."
      }
    ],
    "necesitas": [
      "La lista de tus productos con código y costo, aunque esté incompleta",
      "Un conteo de lo que hay en cada bodega para arrancar",
      "La lista de tus proveedores",
      "Computadora, tableta o teléfono con internet en la bodega"
    ],
    "no_incluye": [
      "La caja y el cobro: eso es el punto de venta",
      "La contabilidad: el sistema lleva existencias y compras, no tus libros",
      "La factura electrónica: es otro servicio"
    ],
    "preguntas": [
      {
        "p": "¿Tengo que comprar lectores?",
        "r": "El sistema lee el código de barras con un lector o con la cámara del teléfono. Si ya tienes lectores, se usan; si hacen falta más, van en la propuesta."
      },
      {
        "p": "¿Se descuenta solo lo que vendo en caja?",
        "r": "Si tu punto de venta deja sacar los datos, sí. Lo revisamos en la visita."
      },
      {
        "p": "¿Sirve si tengo varias bodegas?",
        "r": "Sí. Cada bodega lleva sus propias existencias."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de alimento para animales en Aguadulce, con dos bodegas, que se entera de que se acabó un alimento cuando un cliente lo pide. El sistema avisa cuando quedan pocos sacos y el encargado manda la orden de compra al proveedor desde ahí."
  },
  T15: {
    "como": [
      {
        "titulo": "Repasamos tu forma de vender",
        "texto": "Vemos los pasos de una venta tuya, desde el primer mensaje hasta el cobro, y quién hace cada uno."
      },
      {
        "titulo": "Pasamos tus clientes",
        "texto": "Cargamos tus clientes desde el Excel, la libreta o los contactos del teléfono, con lo que se sepa de cada uno."
      },
      {
        "titulo": "Cada vendedor con su lista",
        "texto": "Cada vendedor ve sus clientes, en qué etapa va cada venta y qué le toca hacer hoy."
      },
      {
        "titulo": "Tú ves el embudo",
        "texto": "Ves cuántas ventas hay en cada etapa y cómo va cada vendedor, sin pedir un reporte."
      }
    ],
    "necesitas": [
      "Tu lista de clientes, en el formato que la tengas",
      "Los pasos de tu venta, aunque sea de palabra",
      "Vendedores dispuestos a anotar cada contacto"
    ],
    "no_incluye": [
      "Listas de prospectos compradas",
      "Envíos masivos de promociones por correo o WhatsApp",
      "La facturación y el cobro"
    ],
    "preguntas": [
      {
        "p": "¿Mis vendedores lo van a usar?",
        "r": "Si les toma más tiempo que la libreta, no. Por eso se arma con los pasos que ya siguen y se prueba con ellos antes de dejar lo de antes."
      },
      {
        "p": "¿Se conecta con WhatsApp?",
        "r": "Se puede. Cómo, depende de si usas WhatsApp Business en el teléfono o la conexión oficial de Meta; va en la propuesta."
      },
      {
        "p": "¿Puedo guardar los datos de mis clientes?",
        "r": "Sí. La Ley 81 de 2019 pide que la persona sepa para qué guardas sus datos y que pueda pedir que los corrijas o los borres. Si tienes dudas sobre tu caso, consúltalo con tu abogado."
      }
    ],
    "ejemplo": "Ejemplo: una empresa de toldos y cortinas en Las Tablas con dos vendedores que anotan las visitas en una libreta. Cada cotización enviada queda en el sistema con fecha de seguimiento, y cada mañana el vendedor ve a quién tiene que llamar."
  },
  T16: {
    "como": [
      {
        "titulo": "Qué ve tu cliente",
        "texto": "Decidimos contigo qué puede ver cada cliente: pedidos, facturas, documentos y en qué va su trabajo."
      },
      {
        "titulo": "De dónde salen los datos",
        "texto": "El portal toma los datos de tu sistema o de donde los guardas hoy, para que nadie los suba dos veces."
      },
      {
        "titulo": "Acceso por cliente",
        "texto": "Cada cliente recibe su usuario y ve solo lo suyo."
      },
      {
        "titulo": "El cliente lo ve solo",
        "texto": "En vez de escribirte para preguntar en qué va su pedido o pedirte otra vez la factura, entra y lo ve."
      }
    ],
    "necesitas": [
      "Saber dónde están hoy tus pedidos, facturas y documentos",
      "El correo o el teléfono de cada cliente que va a tener acceso",
      "Una persona de tu equipo que actualice el estado de cada trabajo"
    ],
    "no_incluye": [
      "Una app en las tiendas: el portal se abre en el navegador",
      "El cobro en línea de las facturas: es otro servicio",
      "Subir a mano los documentos de años anteriores"
    ],
    "preguntas": [
      {
        "p": "¿Mi cliente tiene que instalar algo?",
        "r": "No. Entra desde el navegador del teléfono o de la computadora con su usuario."
      },
      {
        "p": "¿Quién sube los documentos?",
        "r": "Tu equipo, o salen solos de tu sistema si se puede conectar. Lo vemos en la primera conversación."
      },
      {
        "p": "¿Un cliente puede ver lo de otro?",
        "r": "No. Cada usuario ve solo lo de su empresa."
      }
    ],
    "ejemplo": "Ejemplo: una imprenta en Río Abajo que recibe llamadas todo el día preguntando si ya están listos los volantes. Cada cliente entra al portal, ve si su trabajo está en diseño, en impresión o listo para retirar, y descarga su factura."
  },
  T17: {
    "como": [
      {
        "titulo": "Revisamos tus documentos",
        "texto": "Vemos qué contratos y formularios firmas hoy en papel y quién los firma."
      },
      {
        "titulo": "Preparamos el envío",
        "texto": "Dejamos tus documentos listos para mandarlos por enlace, con los espacios que llena cada firmante."
      },
      {
        "titulo": "Firma desde el teléfono",
        "texto": "El cliente abre el enlace, lee el documento y firma en la pantalla del teléfono."
      },
      {
        "titulo": "Registro de cada firma",
        "texto": "Cada documento firmado queda guardado con quién firmó y cuándo, y lo encuentras por cliente cuando lo necesites."
      }
    ],
    "necesitas": [
      "Los contratos o formularios que quieres firmar en línea, ya revisados por tu abogado",
      "El correo o el WhatsApp de quienes firman"
    ],
    "no_incluye": [
      "Redactar o revisar los contratos: eso es de tu abogado",
      "El costo del proveedor acreditado, si necesitas firma con pleno valor legal",
      "Notariar documentos"
    ],
    "preguntas": [
      {
        "p": "¿La firma desde el teléfono vale legalmente?",
        "r": "Deja registro de quién firmó y cuándo. Si un documento exige firma con pleno valor legal, se conecta con un proveedor acreditado. Qué firma pide cada documento lo confirma tu abogado."
      },
      {
        "p": "¿El cliente necesita una cuenta?",
        "r": "No para la firma desde el enlace. Con un proveedor acreditado puede que le pidan verificar su identidad."
      }
    ],
    "ejemplo": "Ejemplo: una empresa de alquiler de equipo de construcción en Tocumen que hace firmar el contrato en papel cuando el cliente retira la mezcladora. El contrato le llega al cliente por WhatsApp antes de retirar, lo firma en el teléfono y la empresa guarda el registro con la hora de la firma."
  },
  T18: {
    "como": [
      {
        "titulo": "Revisión de la oficina",
        "texto": "Vemos qué es lo importante y dónde está: qué computadoras, qué carpetas, qué cuentas y quién tiene las contraseñas."
      },
      {
        "titulo": "Copias automáticas",
        "texto": "Instalamos el disco o el servicio de respaldo y programamos copias diarias de lo importante, con una copia fuera de la oficina."
      },
      {
        "titulo": "Probamos que se recupera",
        "texto": "Restauramos archivos de prueba para comprobar que la copia sirve. Un respaldo que nadie ha probado puede fallar el día que hace falta."
      },
      {
        "titulo": "Claves y accesos en orden",
        "texto": "Tu equipo guarda sus claves en un gestor de contraseñas, y cuando alguien se va es fácil quitarle los accesos."
      }
    ],
    "necesitas": [
      "Acceso a las computadoras y cuentas que se van a respaldar",
      "Saber qué información no se puede perder: contabilidad, clientes, diseños",
      "Internet en la oficina para la copia de afuera"
    ],
    "no_incluye": [
      "Recuperar archivos de un disco que se dañó antes de empezar",
      "Computadoras nuevas, si las actuales ya no reciben actualizaciones",
      "La mensualidad del servicio de respaldo en la nube, si se usa uno: se le paga a ese proveedor"
    ],
    "preguntas": [
      {
        "p": "Ya copio todo a un disco externo. ¿No basta?",
        "r": "Si ese disco está en la misma oficina, un robo, un incendio o un virus que bloquea los archivos se pueden llevar las dos cosas. Por eso una copia va afuera."
      },
      {
        "p": "¿Cada cuánto se prueba el respaldo?",
        "r": "La primera prueba se hace al instalarlo. Cada cuánto se repite va en la propuesta."
      }
    ],
    "ejemplo": "Ejemplo: una oficina de contabilidad en Bella Vista con seis computadoras, donde los archivos de los clientes viven en la computadora de la contadora principal. Cada noche se copian solos, con una copia fuera de la oficina, y las claves de los portales de la DGI y la CSS pasan de una libreta a un gestor de contraseñas."
  },
  T19: {
    "como": [
      {
        "titulo": "Inventario de tus equipos",
        "texto": "Anotamos cada computadora, impresora y licencia de la oficina, quién la usa y cuándo se compró."
      },
      {
        "titulo": "Acceso remoto con permiso",
        "texto": "Instalamos el acceso remoto, con tu permiso, para resolver sin visita lo que no la necesita."
      },
      {
        "titulo": "Escribes por WhatsApp",
        "texto": "Cuando la impresora no imprime o el correo no sale, nos escribes por WhatsApp y lo vemos de forma remota."
      },
      {
        "titulo": "Visita cuando hace falta",
        "texto": "Si el problema es físico, vamos a la oficina. Lo que haya que comprar o cambiar te lo decimos antes y lo apruebas."
      }
    ],
    "necesitas": [
      "Una persona de contacto en la oficina",
      "Permiso para instalar el acceso remoto en las computadoras",
      "Las facturas o claves de las licencias que ya tienes, si las encuentras"
    ],
    "no_incluye": [
      "Las piezas y los equipos nuevos: se aprueban antes y se cobran aparte",
      "Las licencias de los programas que usas",
      "El soporte interno de programas de otro proveedor, como tu sistema de contabilidad: ese lo da quien te lo vende"
    ],
    "preguntas": [
      {
        "p": "¿Cuánto tardan en responder?",
        "r": "Depende del acuerdo. El tiempo de respuesta queda escrito en la propuesta."
      },
      {
        "p": "¿Se paga por mes o por visita?",
        "r": "Depende del tamaño de tu oficina y de cuánto soporte necesitas. La forma de pago va en la propuesta."
      },
      {
        "p": "¿Pueden entrar a mi computadora sin que yo sepa?",
        "r": "No. Entramos cuando tú lo pides, y ves en tu pantalla lo que hacemos."
      }
    ],
    "ejemplo": "Ejemplo: una agencia de viajes en Paitilla con ocho computadoras y una impresora compartida, sin nadie de sistemas. Cuando a una agente no le sale el correo, escribe por WhatsApp y se resuelve en remoto; cuando la impresora se daña, se agenda la visita."
  },
  T20: {
    "como": [
      {
        "titulo": "Mapa de tus sistemas",
        "texto": "Anotamos qué sistemas usas (tienda en línea, ventas, contabilidad, Yappy, banco) y qué datos copia alguien de uno a otro."
      },
      {
        "titulo": "Vemos cómo se conectan",
        "texto": "Revisamos si cada sistema tiene API o deja exportar archivos. Si alguno no deja sacar los datos, te lo decimos antes de cotizar."
      },
      {
        "titulo": "Conexión en paralelo",
        "texto": "Conectamos los sistemas y, por un tiempo, comparamos lo que pasan solos con lo que hacía la persona a mano."
      },
      {
        "titulo": "Los datos se pasan solos",
        "texto": "Los datos pasan de un sistema a otro a la hora programada. Si algo no cuadra, como un pago sin pedido, te llega un aviso."
      }
    ],
    "necesitas": [
      "Acceso de administrador a cada sistema",
      "El contacto del soporte de cada sistema, por si hay que pedir una clave de API",
      "Alguien que sepa qué tiene que cuadrar con qué"
    ],
    "no_incluye": [
      "Lo que cobre tu sistema por dar acceso a su API, si cobra",
      "Cambiarte de sistema",
      "Arreglar fallas internas de los sistemas de otros proveedores"
    ],
    "preguntas": [
      {
        "p": "¿Y si mi sistema no tiene API?",
        "r": "A veces se puede con el archivo que el sistema exporta. Si no hay forma, te lo decimos antes de cotizar."
      },
      {
        "p": "¿Se puede conectar con mi banco?",
        "r": "Depende de lo que permita tu banco. Lo revisamos con tu caso y va en la propuesta."
      },
      {
        "p": "¿Cada cuánto se pasan los datos?",
        "r": "Depende de lo que permita cada sistema: al momento, cada hora o una vez al día."
      }
    ],
    "ejemplo": "Ejemplo: una tienda de ropa en Calidonia que vende en el local y en su tienda en línea, donde cada noche alguien cuadra a mano las existencias de las dos. Con la conexión, una venta en cualquiera descuenta de las mismas existencias, y si entra un pago de Yappy sin pedido, llega un aviso."
  },
  T21: {
    "como": [
      {
        "titulo": "Nos mandas ejemplos",
        "texto": "Nos pasas ejemplos reales de lo que recibes, como facturas de proveedores, órdenes o formularios, en foto o en PDF."
      },
      {
        "titulo": "Qué datos sacar",
        "texto": "Escogemos contigo qué datos salen de cada documento (proveedor, RUC, fecha, total, ITBMS) y a dónde van."
      },
      {
        "titulo": "Lo dudoso se marca",
        "texto": "Lo que la IA no lee con seguridad, como una foto borrosa o un total que no cuadra, queda marcado para que una persona lo revise antes de guardarlo."
      },
      {
        "titulo": "Subes la foto",
        "texto": "Tu equipo sube la foto o el PDF y los datos aparecen en tu sistema o en tu Excel."
      }
    ],
    "necesitas": [
      "Ejemplos reales de cada tipo de documento",
      "El sistema o la hoja de Excel donde deben quedar los datos",
      "Una persona que revise lo que queda marcado"
    ],
    "no_incluye": [
      "La contabilidad: los datos llegan a tu hoja, el registro contable lo hace tu contador",
      "La garantía de que nunca se equivoca: por eso lo dudoso pasa por una persona",
      "Digitalizar los archivos en papel de años anteriores"
    ],
    "preguntas": [
      {
        "p": "¿Lee documentos escritos a mano?",
        "r": "Depende de la letra, y lee con menos seguridad que un PDF impreso. Lo probamos con tus propios ejemplos antes de cotizar."
      },
      {
        "p": "¿A dónde van mis documentos?",
        "r": "Se procesan con un servicio de inteligencia artificial. En la propuesta te decimos cuál, dónde guarda los datos y por cuánto tiempo."
      },
      {
        "p": "¿Qué pasa si se equivoca?",
        "r": "Lo que no lee con seguridad se marca para revisión. Igual conviene que, al principio, alguien revise una muestra de lo que guarda."
      }
    ],
    "ejemplo": "Ejemplo: un restaurante en Costa del Este que recibe las facturas de sus proveedores en papel, por correo y por WhatsApp, y la administradora las pasa a Excel cada fin de semana. Ahora les toma una foto y el proveedor, la fecha, el total y el ITBMS entran solos a la hoja; ella revisa solo las marcadas."
  },
  T22: {
    "como": [
      {
        "titulo": "Nos cuentas las tareas",
        "texto": "Antes del taller nos dices qué hace tu equipo cada día: correos, cotizaciones, resúmenes, reportes."
      },
      {
        "titulo": "Ejercicios con tu negocio",
        "texto": "Preparamos los ejercicios con documentos y casos de tu negocio, sin datos personales de clientes."
      },
      {
        "titulo": "Taller práctico",
        "texto": "Cada persona usa la IA en su computadora o su teléfono durante la sesión, con sus propias tareas."
      },
      {
        "titulo": "Plantillas para cada día",
        "texto": "Al terminar se quedan con plantillas para las tareas de siempre y con la guía de qué datos no subir."
      }
    ],
    "necesitas": [
      "La lista de las tareas que más tiempo le quitan a tu equipo",
      "Una computadora o un teléfono con internet por persona",
      "Un espacio donde todos vean la pantalla, si es en tu oficina"
    ],
    "no_incluye": [
      "Las suscripciones de pago a las herramientas de IA",
      "Configurar asistentes o automatizaciones para tu negocio: son otros servicios",
      "Clases de computación básica"
    ],
    "preguntas": [
      {
        "p": "¿Mi equipo tiene que saber de tecnología?",
        "r": "No. Basta con que usen el correo y el teléfono a diario."
      },
      {
        "p": "¿Qué datos no deben subir a la IA?",
        "r": "Datos personales de clientes o pacientes, contraseñas y lo que firmaste como confidencial. La guía lo deja por escrito, con la Ley 81 de 2019 en cuenta."
      },
      {
        "p": "¿Hay que pagar una herramienta?",
        "r": "Para empezar, no: hay versiones gratuitas. Si a tu equipo le conviene una de pago, te decimos cuál y por qué."
      }
    ],
    "ejemplo": "Ejemplo: un despacho de abogados de cinco personas en Obarrio. En el taller practican con un contrato de ejemplo: lo resumen, sacan las fechas de vencimiento y redactan el correo al cliente. Se quedan con la guía de qué expedientes no se suben."
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
        "r": "Sí. Arriba, en «Probar la demo», está la agenda de citas con datos de ejemplo."
      }
    ],
    "ejemplo": "Ejemplo: en una barbería de Vía España con tres barberos, un cliente reserva para el viernes a las 6:00 con su barbero de siempre y deja la seña con Yappy. El jueves le llega el recordatorio; si cancela, el hueco queda libre para otro."
  },
};
