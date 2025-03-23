import { pool } from "../database/connection.js";

// Obtener todas las reservas
export const getReservas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Reservas ORDER BY fecha_creacion DESC');
    return res.status(200).json(rows);
  } catch (error) {
    console.log('ERROR al obtener reservas', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener una reserva por ID
export const getReservaById = async (req, res) => {
  try {
    const { id_reserva } = req.params;
    const [rows] = await pool.query('SELECT * FROM Reservas WHERE id_reserva = ?', [id_reserva]);

    if (rows.length <= 0)
      return res.status(404).json({ message: 'Reserva not found' });

    res.json(rows[0]);
  } catch (error) {
    console.log(`ERROR al obtener reserva: ${id_reserva}`, error)
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva reserva
export const createReserva = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { uid_cliente, uid_comercio, estado, carrito } = req.body;

    //validamos que el carrito no esté vacío
    if (!carrito || carrito.length <= 0)
      return res.status(400).json({ message: 'Cart is required' });

    //fecha de creacion es ahora, y la fecha fin es 30 minutos después
    const [result] = await connection.query(
      'INSERT INTO Reservas (uid_cliente, uid_comercio, fecha_fin, estado, fecha_creacion) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE), ?, NOW())',
      [uid_cliente, uid_comercio, estado]
    );

    const id_reserva = result.insertId;

    //creamos un detalle por cada producto en el carrito
    for (const producto of carrito) {
      await createDetalleReserva(connection, id_reserva, producto);
    }

    await connection.commit();

    return res.status(201).json({
      id_reserva,
      uid_cliente,
      uid_comercio,
      fecha_creacion,
      fecha_fin,
      estado
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
};

//creamos un detalle por cada producto en el carrito para saber que productos reservar.
const createDetalleReserva = async (connection, id_reserva, producto) => {
  try {
    const { id_producto, cantidad, precio } = producto;
    await connection.query(
      'INSERT INTO DetalleReservas (id_reserva, id_producto, cantidad, precio) VALUES (?, ?, ?, ?)',
      [id_reserva, id_producto, cantidad, precio]
    );
  } catch (error) {
    console.log('ERROR al crear detalle de reserva', error);
    throw error;
  }
};

// Eliminar una reserva
export const deleteReserva = async (req, res) => {
  try {
    const { id_reserva } = req.params;

    const [result] = await pool.query('DELETE FROM Reservas WHERE id_reserva = ?', [id_reserva]);

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: 'Reserva not found' });

    return res.status(204).json();
  } catch (error) {
    console.log(`ERROR al eliminar reserva: ${id_reserva}`, error)
    return res.status(500).json({ message: error.message });
  }
};

// Obtener reservas por cliente
export const getReservasByCliente = async (req, res) => {
  try {
    const { uid_cliente } = req.params;
    const [rows] = await pool.query('SELECT * FROM Reservas WHERE id_cliente = ? ORDER BY fecha_reserva DESC', [uid_cliente]);

    if (rows.length <= 0)
      return res.status(404).json({ message: 'No reservations found for this client' });

    return res.status(200).json(rows);
  } catch (error) {
    console.log('ERROR al obtener reservas por cliente', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtener reservas por comercio
export const getReservasBycomercio = async (req, res) => {
  try {
    const { uid_comercio } = req.params;
    const [rows] = await pool.query('SELECT * FROM Reservas WHERE uid_comercio = ? ORDER BY fecha_reserva DESC', [uid_comercio]);

    if (rows.length <= 0)
      return res.status(404).json({ message: 'No reservations found for this vendor' });

    return res.status(200).json(rows);
  } catch (error) {
    console.log(`ERROR al obtener reservas del comercio: ${uid_comercio}`, error);
    return res.status(500).json({ message: error.message });
  }
};

// Actualizar estado de una reserva
// No usamos (req, res) porque solo sera usada en el backend al momento de recibir el pago
export const updateEstadoReserva = async (id_reserva, estado) => {
  const connection = await pool.getConnection();
  try {
    if (!estado) throw new Error('Estado is required');

    await connection.beginTransaction();

    const [result] = await connection.query(
      'UPDATE Reservas SET estado = ?, fecha_actualizacion = NOW() WHERE id_reserva = ?',
      [estado, id_reserva]
    );

    if (result.affectedRows <= 0) throw new Error('Reserva not found');

    const [rows] = await connection.query('SELECT * FROM Reservas WHERE id_reserva = ?', [id_reserva]);

    await connection.commit();

    return ("Reservas actualizadas: ",rows[0]);
  } catch (error) {
    await connection.rollback();
    console.log(`ERROR al actualizar reserva: ${id_reserva}`, error);
    throw error;
  } finally {
    connection.release();
  }
};