// Escalones por tipo de negocio: empezar por lo básico y crecer (Edwin, 2-oct: que la oferta vaya al nivel de lo que
// el cliente necesita). Cada escalón incluye los anteriores. Sin precios: salen de la propuesta.
// Solo software (oct-2026): se quitaron los equipos. A la tienda le quedaba vacío el último escalón (contador, mapa de
// calor, inventario por escaneo y cámaras) y va con la caja y el inventario; a bienes raíces le quedaban vacíos los dos
// primeros (recorrido, fotos y planos) y va del sitio propio al agente de WhatsApp y al seguimiento hasta la firma.
// La escalera de bodegas y oficinas se fue con su página.

export const ESCALONES = ['Para empezar', 'Un paso más', 'Completo'];

export const PAQUETES = [
  { sector: 'restaurantes', nombre: 'Restaurante', niveles: [['R01'], ['R02', 'R05'], ['R04', 'R11', 'T07']] },
  { sector: 'comercio', nombre: 'Tienda', niveles: [['T01', 'T09'], ['C06', 'C08'], ['R11', 'T14']] },
  { sector: 'salud', nombre: 'Consultorio o clínica', niveles: [['S01'], ['S03', 'T01'], ['S02', 'T05']] },
  { sector: 'hospedaje', nombre: 'Cabañas u hotel pequeño', niveles: [['H01', 'H02'], ['H04'], ['S03']] },
  { sector: 'inmuebles', nombre: 'Agente de bienes raíces', niveles: [['B05'], ['B04'], ['T15', 'T17']] },
];
