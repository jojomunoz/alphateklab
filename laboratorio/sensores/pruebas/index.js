// En Node 22, `node --test pruebas/` toma la carpeta como un módulo y carga este archivo.
// Aquí se cargan todas las pruebas de la carpeta para que ese comando las corra todas.
// (`node --test` desde laboratorio/sensores/ las encuentra solas y no pasa por aquí.)
const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { pathToFileURL } = require('node:url');

const archivos = readdirSync(__dirname)
  .filter((f) => f.endsWith('.test.mjs'))
  .sort();
archivos.reduce((cadena, f) => cadena.then(() => import(pathToFileURL(join(__dirname, f)).href)), Promise.resolve());
