import { pool } from '../database/connection.js';
import cloudinary from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'tu_cloud_name',
  api_key: 'tu_api_key',
  api_secret: 'tu_api_secret',
});

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
        folder: 'tu_carpeta', // Carpeta en Cloudinary
      });
      imageUrls.push(result.secure_url); // Guardar la URL
    }

    // Guardar el producto en la base de datos
    const [rows] = await pool.query(
      'INSERT INTO Productos (id_vendedor,id_categoria,nombre,descripcion,precio,descuento,fecha_produccion,fecha_vencimiento,tipo,cantidad,activo,image_url) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
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
