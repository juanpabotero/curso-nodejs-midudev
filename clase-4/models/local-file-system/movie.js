// los modelos deberian tener el mismo contrato para poderlos
// intercambiar facilmente

import { randomUUID } from 'node:crypto';
import { readJSON } from '../../utils.js';

const movies = readJSON('./movies.json');

// el modelo es el encargado de la logica de negocio
// obtener, crear, actualizar y eliminar datos
export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  }

  static async getById({ id }) {
    return movies.find((movie) => movie.id === id);
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    };
    movies.push(newMovie);
    return newMovie;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies.splice(movieIndex, 1);
    return true;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    };
    return movies[movieIndex];
  }
}
