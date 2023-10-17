// TODO: cambiar el uso de turso por otro cliente de SQL

import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
// importar el cliente de libsql de turso
// import { createClient } from '@libsql/client';

// importar el servidor de Socket.io
import { Server } from 'socket.io';
// importar el modulo para crear servidores HTTP
import { createServer } from 'node:http';

// cargar las variables de entorno
dotenv.config();

const port = process.env.PORT || 3000;

// inicializar la aplicación
const app = express();
// crear el servidor HTTP
const server = createServer(app);
// crear el servidor de Socket.io
const io = new Server(server, {
  // recuperar el estado de conexión de los clientes
  // para evitar perder información si no hay conexión
  connectionStateRecovery: {}
});

// crear la conexión a la base de datos de turso
// const db = createClient({
//   url: 'libsql://cuddly-wasp-midudev.turso.io',
//   authToken: process.env.DB_TOKEN
// });

// crear la tabla de mensajes
// await db.execute(`
//   CREATE TABLE IF NOT EXISTS messages (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     content TEXT,
//     user TEXT
//   )
// `);

// escuchar eventos de conexión
io.on('connection', async (socket) => {
  console.log('Un cliente se ha conectado');

  // escuchar cuando se desconecta un cliente
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });

  // escuchar un evento personalizado
  // el evento 'chat message' es emitido por el cliente
  socket.on('chat message', async (msg) => {
    // guardar el mensaje en la base de datos
    // let result;
    // const username = socket.handshake.auth.username ?? 'anonymous';
    // console.log({ username });
    // try {
    //   result = await db.execute({
    //     sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
    //     args: { msg, username }
    //   });
    // } catch (e) {
    //   console.error(e);
    //   return;
    // }
    // emitir el evento con los datos de la base de datos
    // io.emit('chat message', msg, result.lastInsertRowid.toString(), username);

    // emitir el evento a todos los clientes conectados
    io.emit('chat message', msg);
  });

  // recuperar los mensajes sin conexión
  // if (!socket.recovered) {
  //   try {
  //     const results = await db.execute({
  //       sql: 'SELECT id, content, user FROM messages WHERE id > ?',
  //       args: [socket.handshake.auth.serverOffset ?? 0]
  //     });

  //     results.rows.forEach((row) => {
  //       socket.emit('chat message', row.content, row.id.toString(), row.user);
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
});

// utilizar el logger de Morgan en modo desarrollo
app.use(logger('dev'));

app.get('/', (req, res) => {
  // servir un archivo en concreto
  // process.cwd() es el directorio actual (current working directory),
  // la carpeta en la que se ha iniciado el proceso de Node
  res.sendFile(`${process.cwd()}/client/index.html`);
});

// escuchar el servidor
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
