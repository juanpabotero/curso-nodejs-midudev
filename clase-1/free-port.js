// aplicación para devolver un puerto disponible
// Ejecutar con: node free-port.mjs

// paquete para hacer conexión con el protocolo tcp, es mas rápido que http
import net from 'node:net';

export function findAvailablePort(desiredPort) {
  return new Promise((resolve, reject) => {
    // crear el servidor
    const server = net.createServer();

    // escuchar el servidor en el puerto deseado
    server.listen(desiredPort, () => {
      // server.address().port nos permite saber el puerto
      const { port } = server.address();
      // cerrar el servidor
      server.close(() => {
        resolve(port);
      });
    });

    // si hay un error al escuchar el puerto
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        // el puerto 0 indica que el sistema operativo elija un puerto disponible
        /* no es recomendable en producción, siempre va a ser un puerto que este disponible y
          normalmente se redirecciona al puerto 80. */
        findAvailablePort(0).then((port) => resolve(port));
      } else {
        reject(error);
      }
    });
  });
}
