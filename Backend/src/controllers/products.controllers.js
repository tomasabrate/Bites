import { pool } from "../database/connection.js";

export const getProductos = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM productos");
    console.log(result);//muestra en consola
    res.status(200).json(result);//respuesta en el cliente
  } catch (error) {
    console.log("ERROR en GET productos.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const postProducto = async (req, res) => {
  const {
    id_vendedor,
    nombre,
    precio,
    fecha_produccion,
    fecha_vencimiento,
    cantidad,
    tipo,
  } = req.body;//no hace falta validar el req.body
  try {
    const [rows] = await pool.query(
      "INSERT INTO productos (id_vendedor,nombre,precio,fecha_produccion,fecha_vencimiento,cantidad,tipo) VALUES(?,?,?,?,?,?,?)",
      [
        id_vendedor,
        nombre,
        precio,
        fecha_produccion,
        fecha_vencimiento,
        cantidad,
        tipo,
      ]
    );

    res.status(201).send({
      id_producto: rows.insertId,
      id_vendedor,
      nombre,
      precio,
      fecha_produccion,
      fecha_vencimiento,
      cantidad,
      tipo,
    });
  } catch (error) {
    console.log("ERROR en POST producto.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};

export const putProducto = (req, res) => {
  res.status(200).send("PUT producto");
};

export const deleteProducto = (req, res) => {
  res.status(200).send("DELETE producto");
};
