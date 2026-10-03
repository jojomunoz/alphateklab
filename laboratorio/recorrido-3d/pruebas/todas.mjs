// Entrada de «node --test pruebas/»: en Node 22 el runner no expande una carpeta a sus archivos de prueba, así que
// la ejecuta como módulo (package.json → main) y aquí se cargan todos los *.test.mjs de la carpeta.
// «node --test» sin argumentos, desde la carpeta de la demo, los encuentra por su cuenta.
import { readdirSync } from 'node:fs';

const aqui = new URL('.', import.meta.url);
for (const f of readdirSync(aqui).filter((n) => n.endsWith('.test.mjs')).sort()) await import(new URL(f, aqui));
