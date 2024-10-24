import { pool } from '../database/connection.js';
import cloudinary from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dturrtxzx',
  api_key: '337961572316383',
  api_secret: 'kp7PKcTyqJIDYY5pCYbPhi9p_Vk',
});

export const getProductos = async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM Productos');
    console.log(result); //muestra en consola
    res.status(200).json(result); //respuesta en el cliente
  } catch (error) {
    console.log('ERROR en GET productos.', error);
    return res.status(500).send('500 - Error en la base de datos.');
  }
};

export const postProducto = async (req, res) => {
  const {
    id_vendedor,
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
    images, // Asegúrate de que este campo esté en tu frontend
  } = req.body;

  try {
    const imageUrls = [];

    // Subir las imágenes a Cloudinary
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'BitesImages', // Carpeta en Cloudinary
      });
      imageUrls.push(result.secure_url); // Guardar la URL
    }

    // Guardar el producto en la base de datos
    const [rows] = await pool.query(
      'INSERT INTO Productos (id_vendedor,id_categoria,nombre,descripcion,precio,descuento,fecha_produccion,fecha_vencimiento,tipo,cantidad,activo,imagenes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        id_vendedor,
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
        JSON.stringify(imageUrls), // Guardar las URLs como JSON si son múltiples
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
      imageUrls, // También puedes devolver las URLs si lo deseas
    });
  } catch (error) {
    console.log('ERROR en POST producto.', error);
    return res.status(500).send('500 - Error en la base de datos');
  }
};

export const putProducto = (req, res) => {
  res.status(200).send('PUT producto');
};

export const deleteProducto = (req, res) => {
  res.status(200).send('DELETE producto');
};
