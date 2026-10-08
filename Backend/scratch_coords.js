import { pool } from './src/database/connection.js';

async function updateCoords() {
  try {
    await pool.query("UPDATE Comercios SET lat=-31.428576, lon=-64.184824 WHERE uid_comercio='comercio_1'");
    await pool.query("UPDATE Comercios SET lat=-31.430000, lon=-64.180000 WHERE uid_comercio='comercio_2'");
    await pool.query("UPDATE Comercios SET lat=-31.425000, lon=-64.185000 WHERE uid_comercio='comercio_3'");
    console.log('Coordinates updated');
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

updateCoords();
