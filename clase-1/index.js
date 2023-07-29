// import os from 'node:os';
// import fs from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

async function leerArchivo() {
  try {
    const data = await fs.readFile('./archivo.txt', 'utf-8');
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
leerArchivo();

const filepath = path.join('carpeta', 'subcarpeta', 'nombreArchivo.txt');
console.log(filepath);

console.log(process.cwd());
console.log(process.env.USERNAME);
