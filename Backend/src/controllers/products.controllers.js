import { pool } from "../database/connection.js";
import multer from "multer";
import path from "path";
import { Router } from "express";

const routerProductos = Router();

// Configuración de multer para almacenar la imagen
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directorio donde se almacenarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para la imagen
  }
});

const upload = multer({ storage });

// Controlador para obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error("ERROR en GET productos.", error);
    res.status(500).send("500 - Error en la base de datos");
  }
};

// Controlador para obtener solo productos activos
export const getProductosActivos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM productos 
      WHERE cantidad > 0 
      AND (fecha_vencimiento IS NULL OR fecha_vencimiento > NOW())
    `);
    res.json(rows);
  } catch (error) {
    console.error("ERROR en GET productos activos.", error);
    res.status(500).send("500 - Error en la base de datos");
  }
};

// Controlador para crear un nuevo producto
export const postProducto = async (req, res) => {
  const {
    id_vendedor,
    nombre,
    precio,
    fecha_produccion,
    fecha_vencimiento,
    cantidad,
    tipo,
  } = req.body;

  // La ruta de la imagen subida
  const foto = req.file ? req.file.path : null;

  try {
    const [rows] = await pool.query(
      "INSERT INTO productos (id_vendedor, nombre, precio, fecha_produccion, fecha_vencimiento, cantidad, tipo, imagenes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id_vendedor,
        nombre,
        precio,
        fecha_produccion,
        fecha_vencimiento,
        cantidad,
        tipo,
        foto
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
      foto
    });
  } catch (error) {
    console.log("ERROR en POST producto.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};

// Controlador para actualizar un producto
export const putProducto = async (req, res) => {
  const { id_producto, nombre, precio, fecha_produccion, fecha_vencimiento, cantidad, tipo } = req.body;
  
  try {
    const [result] = await pool.query(
      "UPDATE productos SET nombre = ?, precio = ?, fecha_produccion = ?, fecha_vencimiento = ?, cantidad = ?, tipo = ? WHERE id_producto = ?",
      [nombre, precio, fecha_produccion, fecha_vencimiento, cantidad, tipo, id_producto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Producto no encontrado");
    }

    res.send("Producto actualizado exitosamente");
  } catch (error) {
    console.error("ERROR en PUT producto.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};

// Controlador para eliminar un producto
export const deleteProducto = async (req, res) => {
  const { id_producto } = req.body;

  try {
    const [result] = await pool.query(
      "DELETE FROM productos WHERE id_producto = ?",
      [id_producto]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Producto no encontrado");
    }

    res.send("Producto eliminado exitosamente");
  } catch (error) {
    console.error("ERROR en DELETE producto.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};

// ENDPOINTS de Productos
routerProductos.get("/productos", getProductos); // Para obtener todos los productos
routerProductos.get("/productos/activos", getProductosActivos); // Para obtener solo los productos activos
routerProductos.post("/productos", upload.single('foto'), postProducto); // Middleware para subir la imagen
routerProductos.put("/productos", putProducto);
routerProductos.delete("/productos", deleteProducto);

export default routerProductos;
