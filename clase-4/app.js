import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { moviesRouter } from './routes/movies.js';

// EN EL FUTURO: el import del json será así:
// import movies from './movies.json' with { type: 'json'};

// como leer un json en ESModules
// import fs from 'node:fs';
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));

// como leer un json en ESModules recomendado por ahora
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);
// const movies = require('./movies.json');

// Inicializar express
const app = express();

// captura la request y detecta si tiene que hacer la transformacion
// de JSON a string y agregar la cabecera Content-Type: application/json
app.use(json());

// habilitar cors con la configuracion por defecto, acepta cualquier origen
// app.use(cors());

// habilitar cors con configuracion personalizada
app.use(corsMiddleware());

// deshabilitar la cabecera X-Powered-By por seguridad
// esta la agrega express por defecto
app.disable('x-powered-by');

// Todos los recursos que sean MOVIES se identifican con /movies
// cuando se accede a /movies, se cargaran las rutas de moviesRouter
app.use('/movies', moviesRouter);

// cuando se haga un despliegue en produccion, el puerto lo va a indicar
// el proveedor de hosting en la variable de entorno PORT
// por eso es importante dejarlo de esta forma
const PORT = process.env.PORT ?? 1234;

// la aplicacion escucha en el puerto indicado
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
