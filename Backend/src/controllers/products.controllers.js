import { pool } from "../database/connection.js";

export const getProductos = async (req, res) => {
  try {
    // const [result] = await pool.query("SELECT * FROM Productos p JOIN where p.cantidad > 0");//para que solo se devuelvan productos con cantidad > 0
    const [result] = await pool.query("SELECT p.id_producto, p.uid_comercio, c.nombre_comercio, p.id_categoria, p.nombre, p.descripcion, p.precio, p.descuento, p.fecha_produccion, p.fecha_vencimiento, p.tipo, p.cantidad, p.imagenes, p.activo FROM Productos p JOIN Comercios c ON p.uid_comercio = c.uid_comercio WHERE p.cantidad > 0  AND p.activo = 1");
    //esta consulta devuelve todos los datos de productos mas el nombre del comercio al que pertenece.
    console.log("Lista de Productos:", result); //muestra en consola
    res.status(200).json(result); //respuesta en el cliente
  } catch (error) {
    console.log("ERROR en GET productos.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const getProductosById = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const [result] = await pool.query(
      "SELECT * FROM Productos WHERE id_producto = ?",
      [id_producto] // Asegúrate de pasar id_producto como un array
    );

    console.log("Productos", result); // muestra en consola

    // Verifica si se obtuvo un producto
    if (result.length > 0) {
      res.status(200).json(result[0]); // devuelve el primer producto como objeto
    } else {
      res.status(404).json({ message: "Producto no encontrado" }); // Manejo de caso sin producto
    }
  } catch (error) {
    console.log("ERROR en GET productos.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const postProducto = async (req, res) => {
  const {
    uid_comercio,
    id_categoria,
    nombre,
    descripcion,
    precio,
    descuento,
    fecha_produccion,
    fecha_vencimiento,
    tipo,
    cantidad,
    activo,
  } = req.body; //no hace falta validar el req.body
  console.log(req.body);
  try {
    const [rows] = await pool.query(
      "INSERT INTO Productos (uid_comercio,id_categoria,nombre,descripcion,precio,descuento,fecha_produccion,fecha_vencimiento,tipo,cantidad,activo) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      [
        uid_comercio,
        id_categoria,
        nombre,
        descripcion,
        precio,
        descuento,
        fecha_produccion,
        fecha_vencimiento,
        tipo,
        cantidad,
        activo,
      ]
    );

    res.status(201).send({
      id_producto: rows.insertId,
      id_categoria,
      nombre,
      descripcion,
      precio,
      descuento,
      fecha_produccion,
      fecha_vencimiento,
      tipo,
      cantidad,
      activo,
    });
    console.log("Producto añadido con exito!", req.body);
  } catch (error) {
    console.log("ERROR en POST producto.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};

export const putProducto = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { id_producto } = req.params; // ID del producto desde los parámetros de la solicitud
  const {
    uid_comercio,
    id_categoria,
    nombre,
    descripcion,
    precio,
    descuento,
    fecha_produccion,
    fecha_vencimiento,
    tipo,
    cantidad,
    imagenes,
    activo,
  } = req.body; // Datos del producto desde el cuerpo de la solicitud

  try {
    // Construir la consulta SQL dinámica
    let query = `
      UPDATE Productos SET
        uid_comercio = ?,
        id_categoria = ?,
        nombre = ?,
        descripcion = ?,
        precio = ?,
        descuento = ?,
        fecha_produccion = ?,
        fecha_vencimiento = ?,
        tipo = ?,
        cantidad = ?,
        activo = ?
    `;
    const values = [
      uid_comercio,
      id_categoria,
      nombre,
      descripcion,
      precio,
      descuento,
      fecha_produccion,
      fecha_vencimiento,
      tipo,
      cantidad,
      activo,
    ];

    // Incluir el campo `imagenes` si tiene datos
    if (imagenes && imagenes.length > 0) {
      query += `, imagenes = ?`;
      values.push(imagenes.join(',')); // Convierte el array en una cadena de texto
    }

    query += ` WHERE id_producto = ?`;
    values.push(id_producto); // ID del producto para la cláusula WHERE

    // Ejecutar la consulta
    const [result] = await pool.query(query, values);

    // Verificar si el producto fue actualizado
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Responder con un mensaje de éxito
    console.log("Producto actualizado: ", req.body);
    res.status(200).json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};


export const deleteProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    const [result] = await pool.query(
      "DELETE FROM Productos WHERE id_producto = ?",
      [id_producto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Producto no encontrado");
    }

    res
      .status(200)
      .send(`Producto con id ${id_producto} eliminado exitosamente`);
  } catch (error) {
    console.log("ERROR en DELETE producto.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};


// Función para eliminar productos vencidos o agotados
export const deleteExpiredOrEmptyProducts = async (req, res) => {
  try {
    // Consulta SQL para eliminar productos con cantidad <= 0 o fecha vencida
    const [result] = await pool.query(
      `
      DELETE FROM Productos
      WHERE cantidad <= 0 OR fecha_vencimiento <= CURDATE();
      `
    );

    // Verifica si se eliminaron productos
    if (result.affectedRows === 0) {
      return res
        .status(200)
        .send("No se encontraron productos para eliminar.");
    }

    res.status(200).send(
      `Se eliminaron ${result.affectedRows} producto(s) cuya cantidad es menor o igual a 0 o cuya fecha de vencimiento ha pasado.`
    );
  } catch (error) {
    console.error("ERROR al eliminar productos:", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};


export const deleteLogicoProducto = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const [result] = await pool.query("UPDATE Productos SET activo = 0 WHERE id_producto = ?", [id_producto]);
    console.log("El producto se dio de baja correctamente."); 
    res.status(200).json(result);
  } catch (error) {
    console.log("ERROR en PUT producto.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};