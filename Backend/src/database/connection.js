import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from '../config.js';
import mysql from "mysql2/promise"; //IMPORTANTE agregar el "/promise" que es lo que nos permite usar promesas async await

export const pool = mysql.createPool({
  host: DB_HOST, //si tuvieramos algun servicio en la nube, aqui iria la IP
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  idleTimeout: 10000,
});
