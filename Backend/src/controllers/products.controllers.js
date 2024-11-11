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
    imagenes, // Campo adicional para las URLs de las imágenes
  } = req.body;

  console.log(req.body);

  // Verifica si "imagenes" es un array o una cadena
  let imagenesFinales;
  if (Array.isArray(imagenes)) {
    // Si es un array, une las imágenes con ';'
    imagenesFinales = imagenes.join(';');
  } else if (typeof imagenes === 'string') {
    // Si es una cadena, solo usa el valor tal cual
    imagenesFinales = imagenes;
  } else {
    // Si no es ni un array ni una cadena, usa null
    imagenesFinales = null;
  }

  try {
    const [rows] = await pool.query(
      `INSERT INTO Productos (
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
         imagenes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        imagenesFinales, // Envia la variable imagenesFinales procesada
      ]
    );

    res.status(201).send({
      id_producto: rows.insertId,
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
      imagenes: imagenesFinales, // También devuelve el valor final de imagenes
    });

    console.log('Producto añadido con éxito!', req.body);
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
