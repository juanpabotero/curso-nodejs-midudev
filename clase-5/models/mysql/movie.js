// los modelos deberian tener el mismo contrato para poderlos
// intercambiar facilmente

import mysql from 'mysql2/promise';
import crypto from 'node:crypto';

const DEFAULT_CONFIG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// crear la conexion
const config = process.env.DATABASE_URL ?? DEFAULT_CONFIG;
const connection = await mysql.createConnection(config);

export class MovieModel {
  static async getAll({ genre }) {
    // TODO: implementar el filtro por genero
    // if (genre) {
    //   const lowerCaseGenre = genre.toLowerCase();
    //   // el ? sirve para hacer una interpolacion segura y los va a ir
    //   // reemplazando por los valores que se pasen en el array,
    //   // el primer ? lo reemplaza por el primer valor del array y
    //   // asi sucesivamente
    //   // no se deberia hacer con la interpolacion de strings porque
    //   // es insegura y puede ser vulnerable a ataques de inyeccion
    //   const [genres] = await connection.query(
    //     'select id, name from genres where lower(name) = ?;',
    //     [lowerCaseGenre]
    //   );
    // }

    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      // el ? sirve para hacer una interpolacion segura y los va a ir
      // reemplazando por los valores que se pasen en el array,
      // el primer ? lo reemplaza por el primer valor del array y
      // asi sucesivamente
      // no se deberia hacer con la interpolacion de strings porque
      // es insegura y puede ser vulnerable a ataques de inyeccion
      const [genres] = await connection.query(
        'select id, name from genres where lower(name) = ?;',
        [lowerCaseGenre]
      );

      if (genres.length === 0) return [];

      const [{ id: genreId }] = genres;

      console.log('genreId', genreId);

      const [moviesIds] = await connection.query(
        `SELECT BIN_TO_UUID(movie_id) movie_id
        FROM movie_genres WHERE genre_id = ?;`,
        [genreId]
      );

      console.log('moviesIds', moviesIds);

      if (moviesIds.length === 0) return [];

      const moviesIdsArray = moviesIds.map(({ movie_id }) => movie_id);

      console.log('moviesIdsArray', moviesIdsArray);

      const [movies] = await connection.query(
        `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movies WHERE id IN (?);`,
        [moviesIdsArray]
      );

      console.log('movies', movies);

      return movies;
    }

    // const [movies] = await connection.query(
    //   'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movies;'
    // );

    // // const [movies] = await connection.query(
    // //   'SELECT BIN_TO_UUID(movie_id) movie_id, genre_id FROM movie_genres;'
    // // );

    // return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
      FROM movies WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    if (movies.length === 0) return null;

    return movies[0];
  }

  static async create({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre: genreInput
    } = input;

    // TODO: crear la conexion de genre

    // crear el id de la pelicula
    // const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    // const [{ uuid }] = uuidResult;
    const uuid = crypto.randomUUID();

    try {
      await connection.query(
        `INSERT INTO movies (id, title, year, director, duration, poster, rate)
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
        [uuid, title, year, director, duration, poster, rate]
      );
    } catch (error) {
      // errores de bases de datos no deberia verlos el usuario
      // enviar la traza a un servicio interno
      throw new Error('Error al crear la pelicula');
    }

    for (const genre of genreInput) {
      console.log('genre', genre);
      try {
        await connection.query(
          `INSERT INTO movie_genres (movie_id, genre_id) VALUES
          ((SELECT id FROM movies WHERE title = ?), (SELECT id FROM genres WHERE name = ?));`,
          [title, genre]
        );
      } catch (error) {
        // errores de bases de datos no deberia verlos el usuario
        // enviar la traza a un servicio interno
        throw new Error(error);
      }
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
      FROM movies WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    );

    return movies[0];
  }

  static async delete({ id }) {
    const [movies] = await connection.query(
      `DELETE FROM movies 
      WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    return movies.affectedRows > 0;
  }

  static async update({ id, input }) {
    // consultar la pelicula
    const [moviesToUpdate] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
      FROM movies WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    // si no existe la pelicula, devolver null
    if (moviesToUpdate.length === 0) return null;

    // extraer la pelicula del array
    let movieToUpdate = moviesToUpdate[0];

    // actualizar la pelicula con los nuevos valores
    movieToUpdate = {
      ...movieToUpdate,
      ...input
    };

    const {
      title,
      year,
      director,
      duration,
      poster,
      rate
      // genre: genreInput
    } = movieToUpdate;

    // actualizar la pelicula en la base de datos
    try {
      await connection.query(
        `UPDATE movies SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ?
        WHERE id = UUID_TO_BIN(?);`,
        [title, year, director, duration, poster, rate, id]
      );
    } catch (error) {
      // errores de bases de datos no deberia verlos el usuario
      // enviar la traza a un servicio interno
      throw new Error('Error al actualizar la pelicula');
    }

    // consultar la pelicula actualizada
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
      FROM movies WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    return movies[0];
  }
}
