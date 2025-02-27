import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, DB_PORT } from '../config.js';
import mysql from "mysql2/promise"; //IMPORTANTE agregar el "/promise" que es lo que nos permite usar promesas async await

const pool = mysql.createPool(process.env.MYSQL_URL);

export { pool };