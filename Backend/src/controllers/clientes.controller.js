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
