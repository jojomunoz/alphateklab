// Escalones por tipo de negocio: empezar por lo básico y crecer (Edwin, 2-oct: que la oferta vaya al nivel de lo que
// el cliente necesita). Cada escalón incluye los anteriores. Sin precios: salen de la propuesta.

export const ESCALONES = ['Para empezar', 'Un paso más', 'Completo'];

export const PAQUETES = [
  { sector: 'restaurantes', nombre: 'Restaurante', niveles: [['R01'], ['R02', 'R03', 'R05'], ['R04', 'R11', 'T07', 'R10']] },
  { sector: 'comercio', nombre: 'Tienda', niveles: [['T01', 'T09'], ['C06', 'C08', 'C09'], ['C01', 'C02', 'C04', 'T11']] },
  { sector: 'salud', nombre: 'Consultorio o clínica', niveles: [['S01'], ['S03', 'T01'], ['S02', 'T05', 'R10']] },
  { sector: 'hospedaje', nombre: 'Cabañas u hotel pequeño', niveles: [['H01', 'H02'], ['H04', 'H03'], ['H05', 'C09', 'S03']] },
  { sector: 'inmuebles', nombre: 'Agente de bienes raíces', niveles: [['B01'], ['B02', 'B03'], ['B05', 'B04', 'B06']] },
  { sector: 'operacion', nombre: 'Bodega, oficina o planta', niveles: [['T11', 'T10'], ['I01', 'I04'], ['I07', 'I08', 'I06', 'T08']] },
];
