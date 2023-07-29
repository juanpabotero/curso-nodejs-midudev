// script para crear un servidor web, nos permite recibir request y devolver una respuesta
// Ejecutar con: node http.mjs

import http from 'node:http';
import { findAvailablePort } from './free-port.js';

// para utilizar las variables de entorno
// antes de ejecutar el script, ejecutar en la terminal: export PORT=1234
const desiredPort = process.env.PORT || 3000;

// crear el servidor
const server = http.createServer((request, response) => {
  // este console.log se ve en la consola del servidor, no la del navegador
  // muestra 2 request porque el navegador hace 2 request, una por el
  // recurso solicitado y otra por el favicon
  console.log('request recibido', request.url);
  response.end('Hola mundo');
});

findAvailablePort(desiredPort).then((port) => {
  // el servidor escucha en el puerto indicado
  server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${port}`);
  });
});
