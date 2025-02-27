import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, DB_PORT } from '../config.js';
import mysql from "mysql2/promise"; //IMPORTANTE agregar el "/promise" que es lo que nos permite usar promesas async await

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_PORT:", process.env.DB_PORT);

export const pool = mysql.createPool({
  host: DB_HOST, 
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  idleTimeout: 10000,
});
