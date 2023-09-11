// permite crear un router
import { Router } from 'express';
import { MovieController } from '../controllers/movies.js';

export const createMoviesRouter = ({ movieModel }) => {
  const moviesRouter = Router();

  // creamos la instancia del controlador y le pasamos el modelo que queremos usar
  // complementa el patron de inyeccion de dependencias
  const movieController = new MovieController({ movieModel });

  moviesRouter.get('/', movieController.getAll);
  moviesRouter.post('/', movieController.create);

  moviesRouter.get('/:id', movieController.getById);
  moviesRouter.delete('/:id', movieController.delete);
  moviesRouter.patch('/:id', movieController.update);

  return moviesRouter;
};
