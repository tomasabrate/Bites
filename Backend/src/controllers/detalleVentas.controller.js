import { pool } from "../database/connection.js";

// export const getDetallesByIdVenta = async (req, res) => {
//   const { id_venta } = req.params;

//   try {
//     // Obtener los detalles de la venta con información del producto
//     const [detalles] = await pool.query(
//       `
//       SELECT
//         dv.*,
//         p.nombre as nombre_producto,
//       FROM DetallesVenta dv
//       JOIN Productos p ON dv.id_producto = p.id_producto
//       WHERE dv.id_venta = ?
//       `,
//       [id_venta]
//     );

//     if (detalles.length === 0) {
//       return res.status(404).json({
//         message: `No se encontraron detalles para la venta con ID ${id_venta}`,
//       });
//     }

//     // Obtener la información general de la venta
//     const [venta] = await pool.query(
//       `
//       SELECT
//         v.*,
//         u.email as email_cliente
//       FROM Ventas v
//       LEFT JOIN usuarios u ON v.uid_cliente = u.uid
//       WHERE v.id_venta = ?
//       `,
//       [id_venta]
//     );

//     if (venta.length === 0) {
//       return res.status(404).json({
//         message: `No se encontró la venta con ID ${id_venta}`,
//       });
//     }

//     // Combinar la información
//     const ventaCompleta = {
//       ...venta[0],
//       detalles: detalles,
//     };

//     res.status(200).json(ventaCompleta);
//   } catch (error) {
//     console.error("Error al obtener detalles de la venta:", error);
//     res.status(500).json({
//       message: "Error al obtener los detalles de la venta",
//       error: error.message,
//     });
//   }
// };

export const getDetallesByIdVenta = async (req, res) => {
  try {
    const { id_venta } = req.params;
    const [detalles] = await pool.query(
      `SELECT dv.id_detalleVenta, dv.cantidad, dv.precio_unitario, dv.subtotal,
              p.nombre as nombre_producto, p.imagenes as imagen_producto
       FROM DetallesVenta dv
       JOIN Productos p ON dv.id_producto = p.id_producto
       WHERE dv.id_venta = ?`,
      [id_venta]
    );

    if (detalles.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron detalles para esta venta" });
    }
    console.log(detalles)
    res.json({
      detalles: detalles,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los detalles de la venta" });
  }
};
