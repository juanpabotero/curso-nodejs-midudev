import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

// el controlador es el encargado de controlar el flujo de la aplicacion
export class MovieController {
  // iyección de dependencias
  // inyectamos el modelo en el constructor
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = async (req, res) => {
    // req.query es un objeto con los parametros de la query string
    const { genre } = req.query;
    // la logica de filtrado la delegamos al modelo
    const movies = await this.movieModel.getAll({ genre });
    // para enviar un JSON, express se encarga de convertirlo a string
    // y de agregar la cabecera Content-Type: application/json
    res.json(movies);
  };

  getById = async (req, res) => {
    // req.params es un objeto con los parametros de la ruta
    // en este caso, el id
    const { id } = req.params;
    // la logica de filtrado la delegamos al modelo
    const movie = await this.movieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).json({ message: 'Movie not found' });
  };

  create = async (req, res) => {
    // req.body es un objeto con los datos enviados en el body
    // validar los datos recibidos con zod
    const result = validateMovie(req.body);
    if (!result.success) {
      // 400 Bad Request
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    // la logica de crear la delegamos al modelo
    const newMovie = await this.movieModel.create({ input: result.data });
    // 201 Created
    // al devolver el recurso creado, se actualiza la caché del navegador
    return res.status(201).json(newMovie);
  };

  delete = async (req, res) => {
    // req.params es un objeto con los parametros de la ruta
    // en este caso, el id
    const { id } = req.params;
    // la logica de eliminar la delegamos al modelo
    const result = await this.movieModel.delete({ id });
    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    return res.json({ message: 'Movie deleted' });
  };

  update = async (req, res) => {
    // req.body es un objeto con los datos enviados en el body
    // validar los datos recibidos con zod
    const result = validatePartialMovie(req.body);
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    // req.params es un objeto con los parametros de la ruta, en este caso, el id
    const { id } = req.params;
    // la logica de actualizar la delegamos al modelo
    const updatedMovie = await this.movieModel.update({
      id,
      input: result.data
    });
    if (updatedMovie) {
      return res.json(updatedMovie);
    }
    return res.status(404).json({ message: 'Movie not found' });
  };
}
