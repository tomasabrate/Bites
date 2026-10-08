import { MYSQL_URL } from '../config.js';
import mysql from 'mysql2/promise';

const pool = mysql.createPool(MYSQL_URL);

export { pool };
