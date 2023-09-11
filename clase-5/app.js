import 'dotenv/config';
import express, { json } from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { createMoviesRouter } from './routes/movies.js';

export const createApp = ({ movieModel }) => {
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
  // creamos las rutas y le pasamos el modelo que queremos usar
  app.use('/movies', createMoviesRouter({ movieModel }));

  // cuando se haga un despliegue en produccion, el puerto lo va a indicar
  // el proveedor de hosting en la variable de entorno PORT
  // por eso es importante dejarlo de esta forma
  const PORT = process.env.PORT ?? 1234;

  // la aplicacion escucha en el puerto indicado
  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
