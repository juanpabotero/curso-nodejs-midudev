// este seria el punto de entrada de la aplicacion
// podriamos tener un servidor con mysql, otro con postgres, otro con mongo, etc
import { createApp } from './app.js';
import { MovieModel } from './models/local-file-system/movie.js';

// creamos la aplicacion y le pasamos el modelo que queremos usar
createApp({ movieModel: MovieModel });
