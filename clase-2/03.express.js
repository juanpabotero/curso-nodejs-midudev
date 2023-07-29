const express = require('express');
const ditto = require('./pokemon/ditto.json');

const PORT = process.env.PORT ?? 1234;

// crear la aplicacion
const app = express();

// deshabilitar la cabecera X-Powered-By por seguridad
// ésta la agrega express por defecto
app.disable('x-powered-by');

// middleware que reemplaza la siguiente funcionalidad
app.use(express.json());

// Middleware permite procesar la request antes de que llegue a la ruta
// puede extraer cookies, validar si el usuario está loggeado,
// extraer información de la request, etc.
// Se puede poner la ruta para la cual se va a ejecutar el middleware o
// dejarlo sin ruta para que se ejecute para todas las requests.

// app.use((req, res, next) => {
//   // el metodo next() permite que la request siga su curso
//   if (req.method !== 'POST') return next();
//   if (req.headers['content-type'] !== 'application/json') return next();

//   // solo llegan request que son POST y que tienen el header Content-Type: application/json
//   let body = '';

//   // escuchar el evento data
//   req.on('data', (chunk) => {
//     body += chunk.toString();
//   });

//   req.on('end', () => {
//     const data = JSON.parse(body);
//     data.timestamp = Date.now();
//     // mutar la request y meter la información en el req.body
//     req.body = data;
//     next();
//   });
// });

// definir la funcion que se ejecuta cuando llega una request
// con el metodo GET y la ruta indicada
app.get('/pokemon/ditto', (req, res) => {
  // para enviar un JSON, express se encarga de convertirlo a string
  // y de agregar la cabecera Content-Type: application/json
  res.json(ditto);
});

app.post('/pokemon', (req, res) => {
  // req.body deberíamos guardarlo en base de datos
  req.body.timestamp = Date.now();
  res.status(201).json(req.body);
});

// forma global de tratar las requests, el .use se ejecuta para todas las requests
// la última request a la que va a llegar
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>');
});

// la aplicacion escucha en el puerto indicado
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
