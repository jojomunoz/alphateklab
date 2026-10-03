// Demos del laboratorio que se muestran en la portada. Las rutas relativas son a la raíz del sitio.
// imagen: captura real de la demo (herramientas/capturas.mjs), nunca una imagen generada.

const MESA = 'https://jojomunoz.github.io/alphateklab-mesa/';
const RESERVAS = 'https://jojomunoz.github.io/alphateklab-reservas/';

export const DEMOS = [
  {
    clave: 'mesa',
    url: MESA,
    nombre: 'Pedir y pagar desde la mesa',
    que: 'La carta de un restaurante de ejemplo con un QR por mesa. Pides desde el teléfono, la comanda aparece en la pantalla de la cocina y en el mapa del salón, y al final divides la cuenta y pones la propina tú.',
    prueba: 'abre la demo en la computadora y escanea con tu teléfono el QR de la mesa.',
    servicios: ['R01', 'R02', 'R03', 'R04', 'R05', 'R06'],
    imagen: 'assets/demos/mesa.webp',
  },
  {
    clave: 'reservas',
    url: RESERVAS,
    nombre: 'Agente de citas y reservas de cabañas',
    que: 'La agenda de un consultorio de ejemplo que recuerda la cita 2 o 1 día antes e insiste hasta que el paciente responde, y el calendario de unas cabañas de ejemplo que avisa cuando un canal como Booking deja de sincronizar.',
    prueba: 'adelanta el reloj de la demo y mira salir los recordatorios.',
    servicios: ['S01', 'H01', 'H02', 'R08'],
    imagen: 'assets/demos/reservas.webp',
  },
  {
    clave: 'recorrido-3d',
    url: 'laboratorio/recorrido-3d/',
    nombre: 'Recorrido 3D de un apartamento',
    que: 'Caminas por un apartamento de ejemplo con el teclado o con el dedo, como en un videojuego, mides paredes y dibujas tu propio plano para recorrerlo.',
    prueba: 'entra al recorrido y camina hasta la cocina.',
    servicios: ['B01', 'B03'],
    imagen: 'assets/demos/recorrido-3d.webp',
  },
  {
    clave: 'recorrido-360',
    url: 'laboratorio/recorrido-360/',
    nombre: 'Recorrido 360 con fotos de cámara 360',
    que: 'Fotos esféricas de interiores unidas en un recorrido: miras alrededor arrastrando o moviendo el teléfono y pasas de un ambiente a otro.',
    prueba: 'abre la demo en el teléfono y gíralo.',
    servicios: ['B01', 'B02'],
    imagen: 'assets/demos/recorrido-360.webp',
  },
  {
    clave: 'camara',
    url: 'laboratorio/camara/',
    nombre: 'Contador de personas con cámara',
    que: 'La cámara de tu equipo cuenta a quien cruza una línea, lleva el aforo y arma un mapa de calor. El video se procesa en tu navegador y no sale de tu equipo.',
    prueba: 'dibuja una línea sobre el video y cruza frente a la cámara.',
    servicios: ['C01', 'C02', 'C03', 'I06'],
    imagen: 'assets/demos/camara.webp',
  },
  {
    clave: 'sensores',
    url: 'laboratorio/sensores/',
    nombre: 'Tablero de sensores de un restaurante',
    que: 'Neveras, consumo eléctrico, tanque de agua y puertas de un restaurante de ejemplo, con avisos cuando algo se sale de lo normal. Los datos salen de un simulador.',
    prueba: 'deja abierta la puerta de la nevera y mira cuándo llega el aviso.',
    servicios: ['R10', 'I01', 'H05', 'I07'],
    imagen: 'assets/demos/sensores.webp',
  },
];
