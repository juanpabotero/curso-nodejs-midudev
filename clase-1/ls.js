// script para listar archivos y carpetas de un directorio
// Ejecutar con: node ls.mjs
// Ejecutar con: node ls.mjs carpeta

import fs from 'node:fs/promises';
import path from 'node:path';
import pc from 'picocolors';

const folder = process.argv[2] || '.';

async function ls(folder) {
  let files;
  try {
    files = await fs.readdir(folder);
  } catch {
    console.error(pc.bgRed(`No se pudo leer la carpeta ${folder}`));
    process.exit(1);
  }

  const filesPromises = files.map(async (file) => {
    const filePath = path.join(folder, file);
    let stats;
    try {
      stats = await fs.stat(filePath); // información del archivo
    } catch {
      console.error(`No se pudo leer el archivo ${file}`);
      process.exit(1);
    }

    const isDirectory = stats.isDirectory();
    const fileType = isDirectory ? 'd' : 'f';
    const fileSize = stats.size.toString();
    const fileModified = stats.mtime.toLocaleString();

    return `${fileType} ${pc.blue(file.padEnd(20))} ${pc.green(fileSize.padStart(10))} ${pc.yellow(fileModified)}`;
  });

  const filesInfo = await Promise.all(filesPromises);
  filesInfo.forEach((fileInfo) => console.log(fileInfo));
}

ls(folder);
