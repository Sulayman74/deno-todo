import { Client } from "../deps.ts";

const client = new Client({
  user: "postgres",
  password: "pirate",
  database: "tododb",
  hostname: "localhost",
  port: 5432,
});

// export async function createTable() {
//   await client.queryObject(`
//     CREATE TABLE IF NOT EXISTS todos (
//       id SERIAL PRIMARY KEY,
//       title TEXT NOT NULL,
//       is_completed BOOLEAN DEFAULT FALSE,
//       userid INT NOT NULL
//     );
//   `);
//   console.log("Table 'todos' créée avec succès.");
//   // Création de la table 'users'
//   await client.queryObject(`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       username VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL UNIQUE,
//       password TEXT NOT NULL
//     );
//   `);

// }

export async function connectDB() {
  await client.connect();
}

export async function disconnectDB() {
  await client.end();
}

export { client };