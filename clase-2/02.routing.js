const http = require('node:http');

// commonJS -> modulos clásicos de node
const dittoJSON = require('./pokemon/ditto.json');

const processRequest = (req, res) => {
  const { method, url } = req;

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          // agregar cabeceras segun la respuesta que se envia
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          // devolver el JSON como string
          return res.end(JSON.stringify(dittoJSON));
        default:
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          return res.end('<h1>404</h1>');
      }

    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = '';

          // escuchar el evento data, porque la información va llegando
          // como un flujo de datos y se debe ir guardando
          req.on('data', (chunk) => {
            // chunk es un buffer (dato binario), por eso se debe transformar a string
            body += chunk.toString();
          });

          // escuchar el evento end, cuando ya se terminó de recibir la información
          req.on('end', () => {
            const data = JSON.parse(body);
            // escribir la cabecera de la respuesta, una alternativa a los otros metodos
            res.writeHead(201, {
              'Content-Type': 'application/json; charset=utf-8'
            });

            data.timestamp = Date.now();
            res.end(JSON.stringify(data));
          });

          break;
        }

        default:
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          return res.end('404 Not Found');
      }
  }
};

// crear el servidor
const server = http.createServer(processRequest);

// el servidor escucha en el puerto indicado
server.listen(1234, () => {
  console.log('server listening on port http://localhost:1234');
});
