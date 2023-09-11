// los modelos deberian tener el mismo contrato para poderlos
// intercambiar facilmente

import mysql from 'mysql2/promise';

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
    if (genre) {
      // const lowerCaseGenre = genre.toLowerCase();
      // el ? sirve para hacer una interpolacion segura y los va a ir
      // reemplazando por los valores que se pasen en el array,
      // el primer ? lo reemplaza por el primer valor del array y
      // asi sucesivamente
      // no se deberia hacer con la interpolacion de strings porque
      // es insegura y puede ser vulnerable a ataques de inyeccion
      // const [genres] = await connection.query(
      //   'select id, name from genre where lower(name) = ?;',
      //   [lowerCaseGenre]
      // );
    }

    const [movies] = await connection.query(
      'select title, year, director, duration, poster, rate, BIN_TO_UUID(id) id from movie;'
    );

    return movies;
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
      FROM movie WHERE id = UUID_TO_BIN(?);`,
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
      rate
      // genre: genreInput
    } = input;

    // TODO: crear la conexion de genre

    // crear el id de la pelicula
    const [uuidResult] = await connection.query('SELECT UUID() uuid;');
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
        [uuid, title, year, director, duration, poster, rate]
      );
    } catch (error) {
      // errores de bases de datos no deberia verlos el usuario
      // enviar la traza a un servicio interno
      throw new Error('Error al crear la pelicula');
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    );

    return movies[0];
  }

  static async delete({ id }) {
    // TODO: implementar el delete
  }

  static async update({ id, input }) {
    // TODO: implementar el update
  }
}
