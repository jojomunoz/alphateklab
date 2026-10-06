// Fotos de terceros del sitio: una entrada por hueco (assets/fotos/<hueco>.webp y <hueco>-800.webp).
// Recortadas a 16:10 y redimensionadas. Las de Unsplash y Openverse son fotos reales; las de la marca (al final)
// son imágenes generadas para alphateklab y lo dicen en su crédito.
// Unsplash: la licencia no exige atribución pero se da igual; «titulo» es descriptivo (no el de la página),
// «fuente» es el perfil del autor e «imagen» el archivo original. Openverse/Flickr: título, autor y licencia
// copiados tal como los da Openverse. Revisado el 3-oct-2026.
export const CREDITOS_FOTOS = {
  'sector-restaurantes': {
    titulo: 'Salón de restaurante a la hora del almuerzo',
    autor: '@negley',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@negley',
    imagen: 'https://images.unsplash.com/photo-1723744910051-da35a92321af',
    alt: 'Mesera de espaldas caminando entre las mesas de un restaurante lleno, con comensales almorzando junto a ventanales',
  },
  'sector-comercio': {
    titulo: 'Minisúper por dentro',
    autor: '@che_3',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@che_3',
    imagen: 'https://images.unsplash.com/photo-1765741836929-af2f9e1968e8',
    alt: 'Interior de un minisúper pequeño con estantes ordenados de golosinas y snacks, una nevera de bebidas y dos personas de espaldas en el mostrador',
  },
  'sector-salud': {
    titulo: 'Sala de espera de una clínica',
    autor: '@benyamin_bohlouli',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@benyamin_bohlouli',
    imagen: 'https://images.unsplash.com/photo-1629909614456-6b1c5c94cecc',
    alt: 'Sala de espera de una clínica, limpia y luminosa, con sofás turquesa, reloj de pared y el mostrador de recepción de madera a la derecha',
  },
  'sector-hospedaje': {
    titulo: 'Cabaña entre la montaña tropical',
    autor: '@yenvu2410',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@yenvu2410',
    imagen: 'https://images.unsplash.com/photo-1754078219069-7565df2033b0',
    alt: 'Cabaña de madera con techo de paja entre palmas y helechos, frente a una montaña cubierta de bosque tropical',
  },
  'sector-inmuebles': {
    titulo: 'Sala de apartamento con ventanales',
    autor: '@summitangel',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@summitangel',
    imagen: 'https://images.unsplash.com/photo-1603072845032-7b5bd641a82a',
    alt: 'Sala de un apartamento moderno en un piso alto, con ventanales de piso a techo que dan a un balcón y a la vegetación de la ciudad',
  },
  'sector-todos': {
    titulo: 'Dueña de negocio trabajando en su local',
    autor: '@omarlopez1',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@omarlopez1',
    imagen: 'https://images.unsplash.com/photo-1687293233471-187c8df1beef',
    alt: 'Dueña de un pequeño estudio, de perfil, trabajando en una laptop sobre un mueble, con sus certificados enmarcados en la pared',
  },
  'sector-educacion': {
    titulo: 'Clase en un aula',
    autor: '@heyquilia',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@heyquilia',
    imagen: 'https://images.unsplash.com/photo-1509062522246-3755977927d7',
    alt: 'Aula con estudiantes sentados de espaldas a la cámara mientras un profesor habla frente a la pizarra',
  },
  'sector-servicios': {
    titulo: 'Autolavado de noche',
    autor: '@fantasyflip',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@fantasyflip',
    imagen: 'https://images.unsplash.com/photo-1632685062337-095b722134ca',
    nota: 'Matrícula del auto difuminada.',
    alt: 'Persona lavando un auto azul con una pistola de agua a presión en un autolavado de noche',
  },
  'tipo-software': {
    titulo: 'Código en pantalla',
    autor: '@cdr6934',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@cdr6934',
    imagen: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    alt: 'Pantalla con código en Python resaltado en colores sobre fondo oscuro, vista de cerca y en ángulo',
  },
  'tipo-web': {
    titulo: 'App web en teléfono y laptop',
    autor: '@plann_images',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@plann_images',
    imagen: 'https://images.unsplash.com/photo-1588058365815-c96ac30ee30f',
    alt: 'Manos de una persona con un teléfono que muestra una galería de fotos y una laptop abierta con la misma app web sobre una mesa de madera',
  },
  'tipo-ia': {
    titulo: 'Asistente de chat en el teléfono',
    autor: '@zulfugarkarimov',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@zulfugarkarimov',
    imagen: 'https://images.unsplash.com/photo-1762330465857-07e4c81c0dfa',
    alt: 'Mano escribiendo en un teléfono con un asistente de chat abierto que pregunta «What can I help with?», con la misma interfaz desenfocada en una pantalla al fondo',
  },
  'tipo-pagos': {
    titulo: 'Pago sin contacto con el teléfono',
    autor: '@jonasleupe',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@jonasleupe',
    imagen: 'https://images.unsplash.com/photo-1509017174183-0b7e0278f1ec',
    alt: 'Mano acercando un teléfono a un lector de pagos sin contacto con el símbolo de pago por aproximación',
  },
  'panama': {
    titulo: 'Cinta Costera, Ciudad de Panamá',
    autor: '@luisalemanmx',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@luisalemanmx',
    imagen: 'https://images.unsplash.com/photo-1632505702897-cc41b0ba3b64',
    alt: 'Cinta Costera de Ciudad de Panamá vista desde lo alto, con palmeras, la avenida Balboa y el skyline de rascacielos junto a la bahía',
  },
  'mesa-qr': {
    titulo: 'Cobro en la mesa de un restaurante',
    autor: '@claybanks',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@claybanks',
    imagen: 'https://images.unsplash.com/photo-1556742205-e10c9486e506',
    alt: 'Mesa de madera de un restaurante vista desde arriba, con un terminal de pago sin contacto que marca la cuenta, un tazón con palillos, la carta y una suculenta',
  },
  'cocina': {
    titulo: 'Comandas en la cocina',
    autor: '@_danbrad',
    licencia: 'Licencia de Unsplash',
    urlLicencia: 'https://unsplash.com/license',
    fuente: 'https://unsplash.com/@_danbrad',
    imagen: 'https://images.unsplash.com/photo-1529003600303-bd51f39627fb',
    alt: 'Cocinero de filipina blanca tomando una comanda impresa del riel de pedidos en la cocina de un restaurante',
  },
};

// Imágenes de la marca (paquete «alphateklab-marca», 3-oct-2026): generadas para alphateklab con IA a partir de los
// prompts de ~/alphateklab/marca/marca/prompts-imagenes.json. Reemplazan a las fotos de stock del mismo hueco.
const MARCA = (titulo, alt) => ({ titulo, autor: 'alphateklab', licencia: 'Imagen generada con IA para alphateklab', urlLicencia: '', fuente: '', alt });
Object.assign(CREDITOS_FOTOS, {
  'marca-heroe': MARCA('Negocios panameños conectados', 'Un local en Panamá donde un cliente pide desde un QR en la mesa, una vendedora cobra con una tableta y una recepción muestra los turnos en pantalla.'),
  'sector-comercio': MARCA('Minisúper de barrio con luz cálida', 'Minisúper de barrio con estantes ordenados; la cajera cobra con una tableta.'),
  'sector-restaurantes': MARCA('Restaurante panameño de gama media', 'Salón de restaurante con vista a la ciudad; un cliente revisa la carta en su teléfono junto a la placa QR de la mesa.'),
  'sector-salud': MARCA('Recepción de clínica dermatológica', 'Recepción cálida de una clínica, con una pantalla de turnos y una paciente frente al mostrador.'),
  'sector-hospedaje': MARCA('Cabaña en las tierras altas de Chiriquí', 'Cabaña de madera entre la vegetación de montaña, con una cerradura de teclado en la puerta.'),
  'mesa-qr': MARCA('Placa con código QR en la mesa', 'Mesa de restaurante con una placa de código QR y un cliente usando su teléfono.'),
  'sector-inmuebles': MARCA('Apartamento con vista a la bahía de Panamá', 'Sala de un apartamento con ventanales hacia la bahía de Panamá y una cámara 360 sobre un trípode.'),
  'sector-servicios': MARCA('Taller mecánico en Panamá', 'Clienta revisando el estado de su carro en el teléfono mientras un mecánico trabaja en el taller.'),
  'sector-educacion': MARCA('Entrada de colegio con lector QR', 'Entrada de un colegio con un lector de QR para marcar la asistencia.'),
  'sector-todos': MARCA('Dueña de negocio revisando su sistema', 'Dueña de una tienda revisando su sistema en una tableta detrás del mostrador.'),
});

Object.assign(CREDITOS_FOTOS, {
  'tipo-software': MARCA('Revisión de un sistema de inventario en una oficina', 'Un desarrollador y la dueña de un negocio revisan juntos un sistema de inventario en una pantalla.'),
  'tipo-web': MARCA('Página de un café en teléfono y laptop', 'Teléfono y laptop sobre una mesa de madera mostrando la misma página de un café.'),
  'tipo-ia': MARCA('Dueño de tienda revisando un chat automático', 'Dueño de una tienda revisando en su teléfono las respuestas automáticas a sus clientes.'),
  'clientes-entrando': MARCA('Clientes entrando a una tienda', 'Clientes entrando a una tienda iluminada por el sol.'),
  'tipo-pagos': MARCA('Pago sin contacto en un restaurante', 'Clienta pagando con el teléfono en la terminal que le acerca el mesero.'),
  'cocina': MARCA('Cocina con pantalla de comandas', 'Cocinero preparando platos frente a una pantalla con las comandas del día.'),
});

// Escenas (3-oct-2026): generadas con IA (ChatGPT) para alphateklab a partir de los prompts de
// ~/Desktop/alphateklab-imagenes-para-gpt-v2.md; productos genéricos, sin marcas. En el sitio dicen «Imagen ilustrativa».
// Con solo software (oct-2026) se fueron las del equipo que ya no hacemos: la placa de la mesa, el lector del colegio,
// la cámara del minisúper y el sensor de la nevera (y sus fotos de tipo, de instalación y de bodega).
Object.assign(CREDITOS_FOTOS, {
  'en-cocina': MARCA('Pantalla de comandas en la cocina de un restaurante', 'La pantalla de cocina de la demo en una tableta, junto a la impresora de comandas de un restaurante'),
});
