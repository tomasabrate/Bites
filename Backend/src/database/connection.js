import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
} from '../config.js';
import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.MYSQL_URL);

export { pool };
