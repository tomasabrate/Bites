import { pool } from "../database/connection.js";

export const getComercios = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM Comercios");
    console.log("Lista de Comercios:", result);
    res.status(200).json(result);
  } catch (error) {
    console.log("ERROR en GET Comercios.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const getComercioByUid = async (req, res) => {
  const { uid_comercio } = req.params;
  try {
    const [result] = await pool.query(
      "SELECT * FROM Comercios WHERE uid_comercio = ?",
      [uid_comercio]
    );

    console.log("Comercio: ", result);

    if (result.length > 0) {
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: "Comercio no encontrado" });
    }
  } catch (error) {
    console.log("ERROR en GET Comercios.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const postComercio = async (req, res) => {
  const {
    uid_comercio,
    mail,
    nombre_comercio,
    id_categoria,
    descripcion,
    direccion,
    telefono,
    horario_apertura,
    horario_cierre,
    zonas_entrega,
    costo_entrega,
    metodos_pago,
    imagenes,
  } = req.body;
  console.log(req.body);
  try {
    const [rows] = await pool.query(
      "INSERT INTO Comercios (uid_comercio, mail, nombre_comercio, id_categoria, descripcion, direccion, telefono, horario_apertura, horario_cierre, zonas_entrega, costo_entrega, metodos_pago, imagenes )" +
        " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        uid_comercio,
        mail,
        nombre_comercio,
        id_categoria,
        descripcion,
        direccion,
        telefono,
        horario_apertura,
        horario_cierre,
        zonas_entrega,
        costo_entrega,
        metodos_pago,
        imagenes,
      ]
    );

    res.status(201).send({
      uid_comercio,
      mail,
      nombre_comercio,
      id_categoria,
      descripcion,
      direccion,
      telefono,
      horario_apertura,
      horario_cierre,
      zonas_entrega,
      costo_entrega,
      metodos_pago,
      imagenes,
    });
    console.log("Perfil de comercio añadido con exito!", req.body);
  } catch (error) {
    console.log("ERROR en POST Comercios.", error);
    return res.status(500).send("500 - Error en la base de datos");
  }
};


export const deleteComercio = async (req, res) => {
  const { uid_comercio } = req.params;

  if (!uid_comercio) {
    return res.status(400).json({ message: "UID de comercio inválido" });
  }

  try {
    const [result] = await pool.query("DELETE FROM Comercios WHERE uid_comercio = ?", [
      uid_comercio,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comercio no encontrado o ya eliminado" });
    }

    res.status(200).send(`Comercio con uid ${uid_comercio} eliminado exitosamente`);
  } catch (error) {
    console.log("ERROR en DELETE comercio.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const deleteLogicoCormecio = async (req, res) => {
  const { uid_comercio } = req.params;
  try {
    const [result] = await pool.query("UPDATE Comercios SET activo = 0 WHERE uid_comercio = ?", [uid_comercio]);
    console.log("El comercio se dio de baja correctamente."); 
    res.status(200).json(result);
  } catch (error) {
    console.log("ERROR en PUT comercio.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

