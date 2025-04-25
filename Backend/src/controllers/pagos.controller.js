import { pool } from "../database/connection.js";

export const getPagos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Pagos ORDER BY fecha_creacion DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPagoById = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const [rows] = await pool.query("SELECT * FROM Pagos WHERE id_pago = ?", [
      id_pago,
    ]);
    if (rows.length <= 0)
      return res.status(404).json({ message: "Pago not found" });
    console.log(rows[0]);

    return res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//esta llamaremos desde el front para verificar el estado del pago.
export const getPagoByPaymentId = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Pagos WHERE payment_id = ?",
      [payment_id]
    );
    if (rows.length <= 0)
      return res.status(404).json({ message: "Pago not found" });
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(`ERROR al obtener pago por payment_id: ${payment_id}`, error);
    return res.status(500).json({ message: error.message });
  }
};

export const createPago = async (payment) => {
  const connection = await pool.getConnection();
  try {
    const {
      status,
      id,
      payer,
      transaction_amount,
      date_approved,
      external_reference,
      date_created
    } = payment;
    const email = payer.email;
    await connection.query(
      "INSERT INTO Pagos (estado, payment_id, email_pagador, monto, fecha_aprobacion, id_reserva, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        status,
        id,
        email,
        transaction_amount,
        date_approved,
        external_reference, 
        date_created
      ]
    );
    console.log("Pago creado en la base de datos...");
  } catch (error) {
    console.error("Error al crear el pago:", error);
  } finally {
    connection.release();
  }
};

// Actualizar el id_venta en el pago
export const updatePagoVenta = async (id_venta, payment_id) => {
  try {
    const [result] = await pool.query(
      "UPDATE Pagos SET id_venta = ? WHERE payment_id = ?",
      [id_venta, payment_id]
    );
    if (result.affectedRows === 0) {
      return "ERROR -- Pago no encontrado";
    } else {
      return `Pago con payment_id = ${payment_id} actualizado con id_venta: ${id_venta}`;
    }
  } catch (error) {
    console.log(`ERROR al actualizar id_venta del pago: ${payment_id}`, error);
  }
};

//actualizamos el estado del pago, no usamos (req,res) porque solo se actualizara desde el webhook
export const updateEstadoPago = async (estado, payment_id) => {
  try {
    const [result] = await pool.query(
      "UPDATE Pagos SET fecha_actualizacion = NOW(), estado = ? WHERE id_pago = ?",
      [estado, payment_id]
    );
    if (result.affectedRows === 0) {
      return "ERROR -- Pago no encontrado";
    } else {
      return `Pago con payment_id = ${payment_id} actualizado a estado: ${estado}`;
    }
  } catch (error) {
    console.log(`ERROR al actualizar estado del pago: ${payment_id}`, error);
  }
};

export const deletePago = async (req, res) => {
  try {
    const { id_pago } = req.params;
    const [result] = await pool.query("DELETE FROM Pagos WHERE id_pago = ?", [
      id_pago,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Pago not found" });
    return res.json({ message: "Pago deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
