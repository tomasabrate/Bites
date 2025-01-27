import { pool } from "../database/connection.js";

export const getClientes = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Clientes");
    console.log("Lista de Clientes:", result);
    res.status(200).json(result);
  } catch (error) {
    console.log("ERROR en GET Clientes.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const getClienteByUid = async (req, res) => {
  const { uid_cliente } = req.params;
  try {
    const [result] = await pool.query(
      "SELECT * FROM Clientes WHERE uid_cliente = ?",
      [uid_cliente]
    );

    console.log("Cliente: ", result);

    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: "Cliente no encontrado" });
    }
  } catch (error) {
    console.log("ERROR en GET Clientes.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const postCliente = async (req, res) => {
  const {
    uid_cliente,
    mail,
    nombre,
    apellido,
    fecha_nacimiento,
    domicilio,
    telefono,
    preferencias_alimentarias,
    foto_perfil,
  } = req.body;
  console.log(req.body);
  try {
    const [rows] = await pool.query(
      "INSERT INTO Clientes (uid_cliente, mail, nombre, apellido, fecha_nacimiento, domicilio, telefono, preferencias_alimentarias, foto_perfil) VALUES(?,?,?,?,?,?,?,?,?)",
      [
        uid_cliente,
        mail,
        nombre,
        apellido,
        fecha_nacimiento,
        domicilio,
        telefono,
        preferencias_alimentarias,
        foto_perfil,
      ]
    );

    res.status(201).send({
      uid_cliente,
      mail,
      nombre,
      apellido,
      fecha_nacimiento,
      domicilio,
      telefono,
      preferencias_alimentarias,
      foto_perfil,
    });
    console.log("Perfil de cliente añadido con exito!", req.body);
  } catch (error) {
    console.log("ERROR en POST Clientes.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};


export const deleteCliente = async (req, res) => {
  const { uid_cliente } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM Clientes WHERE uid_cliente = ?", [
      uid_cliente,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado o ya eliminado" });
    }

    res.status(200).send(`Cliente con uid ${uid_cliente} eliminado exitosamente`);
  } catch (error) {
    console.log("ERROR en DELETE cliente.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const deleteLogicoCliente = async (req, res) => {
  const { uid_cliente } = req.params;
  try {
    const [result] = await pool.query("UPDATE Clientes SET activo = 0 WHERE uid_cliente = ?", [uid_cliente]);
    console.log("El cliente se dio de baja correctamente."); 
    res.status(200).json(result);
  } catch (error) {
    console.log("ERROR en PUT cliente.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const putCliente = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { uid_cliente } = req.params; 
  const { mail, nombre, apellido, fecha_nacimiento, domicilio, telefono, preferencias_alimentarias, foto_perfil, activo } = req.body;

  try {
    let query = `
      UPDATE Clientes SET
      uid_cliente = ?, mail = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, domicilio = ?, telefono = ?, 
      preferencias_alimentarias = ?, foto_perfil = ?, activo = ?`;

    const values = [
      uid_cliente, mail, nombre, apellido, fecha_nacimiento, domicilio, telefono, preferencias_alimentarias, foto_perfil, activo
    ];

    if (foto_perfil && foto_perfil.length > 0) {
      query += `, foto_perfil = ?`;
      values.push(foto_perfil.join(',')); 
    }

    query += ` WHERE uid_cliente = ?`;
    values.push(uid_cliente); 

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    console.log("Cliente actualizado: ", req.body);
    res.status(200).json({ message: "Cliente actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    res.status(500).json({
      message: "Error al actualizar el cliente",
      error: error.message,
    });
  }
};