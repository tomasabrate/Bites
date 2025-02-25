import { pool } from '../database/connection.js'; // Importamos la conexión

export const obtenerReporteVentas = async (req, res) => {
  try {
    // Consulta SQL para obtener ventas y ganancias por comercio
    const query = `
      SELECT 
        c.uid_comercio, 
        c.nombre_comercio, 
        COUNT(v.id_venta) AS total_ventas, 
        COALESCE(SUM(v.total), 0) AS total_ganancias
      FROM Comercios c
      LEFT JOIN Ventas v ON c.uid_comercio = v.uid_comercio
      GROUP BY c.uid_comercio, c.nombre_comercio
      ORDER BY total_ganancias DESC;
    `;

    // Ejecutar consulta
    const [rows] = await pool.query(query);

    res.json(rows); // Enviar resultados al frontend
  } catch (error) {
    console.error('Error al obtener el reporte de ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
