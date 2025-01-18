import { pool } from "../database/connection.js";

// Obtener todas las ventas
export const getVentas = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Ventas");
    console.log("Lista de Ventas:", result); //muestra en consola
    res.status(200).json(result); //respuesta en el cliente
  } catch (error) {
    console.log("ERROR en GET ventas.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

// Obtener una venta por su ID
export const getVentaById = async (req, res) => {
  const { id_venta } = req.params;
  try {
    const [venta] = await pool.query(
      `
      SELECT * FROM Ventas WHERE id_venta = ?
    `,
      [id_venta]
    );

    if (venta.length === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    console.log("Venta:", venta[0]);
    res.status(200).json({ ...venta[0] });
  } catch (error) {
    console.log("ERROR en GET venta por ID.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

// Obtener ventas por comercio
export const getVentasByComercio = async (req, res) => {
  try {
    const { uid_comercio } = req.query;

    if (!uid_comercio) {
      return res.status(400).send("El parámetro 'uid_comercio' es requerido");
    }

    const [rows] = await pool.query(
      "SELECT * FROM Ventas WHERE uid_comercio = ?",
      [uid_comercio]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .send(
          `No se encontraron ventas para el comercio con UID: ${uid_comercio}`
        );
    }

    console.log(rows);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener ventas por comercio:", error);
    res.status(500).send("500 - Error en la base de datos");
  }
};

// Crear una nueva venta
export const postVenta = async (req, res) => {
  const { carrito, total, metodoPago, uid_cliente, codigo_retiro } = req.body;

  try {
    // Validar que el carrito no esté vacío
    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ message: "El carrito está vacío." });
    }

    // Validar que todos los productos sean del mismo vendedor
    const vendedores = carrito.map((item) => item.uid_comercio);
    const vendedoresUnicos = [...new Set(vendedores)];

    if (vendedoresUnicos.length > 1) {
      return res.status(400).json({
        message:
          "Todos los productos en la venta deben pertenecer al mismo vendedor.",
      });
    }

    // Usar el vendedor único para registrar la venta
    const uid_comercio = vendedoresUnicos[0];

    // Iniciar transacción
    await pool.query("START TRANSACTION");

    try {
      // Crear la venta
      const [ventaResult] = await pool.query(
        `
        INSERT INTO Ventas (uid_comercio, uid_cliente, total, metodo_pago, codigo_retiro, fecha_venta, estado)
        VALUES (?, ?, ?, ?, ?, NOW(), "EN CURSO")
      `,
        [uid_comercio, uid_cliente, total, metodoPago, codigo_retiro]
      );
      const id_venta = ventaResult.insertId;

      // Insertar los detalles de la venta y actualizar la cantidad de cada producto
      for (const item of carrito) {
        const { id_producto, cantidad, precio } = item;

        // Obtener cantidad disponible del producto
        const [productoResult] = await pool.query(
          "SELECT cantidad FROM Productos WHERE id_producto = ?",
          [id_producto]
        );

        if (productoResult.length === 0) {
          throw new Error(`Producto con ID ${id_producto} no encontrado.`);
        }

        const { cantidad: cantidadDisponible } = productoResult[0];

        // Validar cantidad disponible
        if (cantidadDisponible < cantidad) {
          throw new Error(
            `Cantidad insuficiente para el producto con ID ${id_producto}. Cantidad disponible: ${cantidadDisponible}.`
          );
        }

        // Insertar el detalle de la venta
        const subtotal = cantidad * precio;
        await pool.query(
          `
          INSERT INTO DetallesVenta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `,
          [id_venta, id_producto, cantidad, precio, subtotal]
        );

        // Actualizar la cantidad del producto
        await pool.query(
          `
          UPDATE Productos SET cantidad = cantidad - ? WHERE id_producto = ?
        `,
          [cantidad, id_producto]
        );
      }

      // Confirmar transacción
      await pool.query("COMMIT");

      console.log(" - - - VENTA REALIZADA CON EXITO!...", {
        id_venta,
        carrito,
        total,
      });
      res.status(201).json({
        message: "Venta registrada con éxito.",
        id_venta,
      });
    } catch (error) {
      // Revertir transacción en caso de error
      await pool.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("ERROR en POST venta.", error);
    return res.status(500).json({
      message: "Error en la base de datos.",
      error: error.message,
    });
  }
};

// Actualizar una venta
// export const putVenta = async (req, res) => {
//   const { id_venta } = req.params;
//   const { compradorId, vendedorId, productos } = req.body;

//   try {
//     // Actualizar la información principal de la venta
//     const [result] = await pool.query(
//       `
//       UPDATE Ventas SET comprador_id = ?, uid_comercio = ? WHERE id = ?
//     `,
//       [compradorId, vendedorId, id_venta]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Venta no encontrada" });
//     }

//     // Actualizar los productos asociados
//     await pool.query("DELETE FROM DetallesVenta WHERE venta_id = ?", [
//       id_venta,
//     ]);
//     for (const p of productos) {
//       const [producto] = await pool.query(
//         "SELECT precio FROM Productos WHERE id = ?",
//         [p.productoId]
//       );
//       await pool.query(
//         `
//         INSERT INTO DetallesVenta (venta_id, producto_id, cantidadCarrito, subtotal)
//         VALUES (?, ?, ?, ?)
//       `,
//         [
//           id_venta,
//           p.productoId,
//           p.cantidadCarrito,
//           producto[0].precio * p.cantidadCarrito,
//         ]
//       );
//     }

//     res.status(200).json({ message: "Venta actualizada exitosamente" });
//   } catch (error) {
//     console.log("ERROR en PUT venta.", error);
//     return res.status(500).send("500 - Error en la base de datos.");
//   }
// };

//Actualizar el estado de una venta al ser entregado el producto.
export const putEstadoVenta = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { id_venta } = req.params; // ID de la venta desde los parámetros de la solicitud
  const { estado } = req.body; // Nuevo estado desde el cuerpo de la solicitud
  console.log(id_venta, estado)
  try {
    // Construir la consulta SQL para actualizar el estado de la venta
    const query = `
      UPDATE Ventas
      SET estado = ?
      WHERE id_venta = ?
    `;
    const values = [estado, id_venta]; // Valores a insertar en la consulta

    // Ejecutar la consulta
    const [result] = await pool.query(query, values);

    // Verificar si la venta fue actualizada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    // Responder con un mensaje de éxito
    console.log(`Venta ${id_venta} actualizada a estado: ${estado}`);
    res.status(200).json({ message: "Estado de la venta actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el estado de la venta:", error);
    res.status(500).json({
      message: "Error al actualizar el estado de la venta",
      error: error.message,
    });
  }
};

// Eliminar una venta
export const deleteVenta = async (req, res) => {
  const { id_venta } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Ventas WHERE id = ?", [
      id_venta,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    await pool.query("DELETE FROM DetallesVenta WHERE venta_id = ?", [
      id_venta,
    ]);

    res.status(200).send(`Venta con id ${id_venta} eliminada exitosamente`);
  } catch (error) {
    console.log("ERROR en DELETE venta.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};
