import { pool } from "../database/connection.js";

export const getComprasByCliente = async (req, res) => {
  try {
    // Asegúrate de que estás obteniendo el uid_cliente correctamente
    const { uid_cliente } = req.query;

    // Valida si uid_cliente está definido
    if (!uid_cliente) {
      return res.status(400).send("Falta el parámetro uid_cliente");
    }

    // Ejecuta la consulta
    const [result] = await pool.query(
      `
      SELECT v.* 
      FROM Ventas v 
      INNER JOIN Clientes cli ON v.uid_cliente = cli.uid_cliente 
      WHERE cli.uid_cliente = ?
      `,
      [uid_cliente]
    );

    // Retorna el resultado
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getComprasByCliente: ", error);
    res.status(500).send("500 - Error en la base de datos.");
  }
};
