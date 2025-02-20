import { pool } from "../database/connection.js";



export const getComerciosNombre = async (req, res) => {
  const { nombre_comercio } = req.query;
  try {
      const [comercio] = await pool.query('SELECT uid_comercio FROM Comercios WHERE nombre_comercio = ?', [nombre_comercio]);

      if (comercio.length > 0) {
          res.json({ uid_comercio: comercio[0].uid_comercio });
      } else {
          res.status(404).json({ error: 'Comercio no encontrado' });
      }
  } catch (error) {
      console.log("Error al buscar el comercio:", error);  // Añadir log para detalles de error
      res.status(500).json({ error: 'Error al buscar el comercio' });
  }
};



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
    foto_perfil,
  } = req.body;
  console.log(req.body);
  try {
    const [rows] = await pool.query(
      "INSERT INTO Comercios (uid_comercio, mail, nombre_comercio, id_categoria, descripcion, direccion, telefono, horario_apertura, horario_cierre, zonas_entrega, costo_entrega, metodos_pago, imagenes, foto_perfil )" +
        " VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
        foto_perfil,
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
      foto_perfil
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

export const putComercio = async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { uid_comercio } = req.params; 
  const { mail, nombre_comercio, id_categoria, descripcion, direccion, telefono, horario_apertura, horario_cierre, zonas_entrega, costo_entrega, 
    metodos_pago, imagenes, activo, foto_perfil } = req.body;

  try {
    let query = `
      UPDATE Comercios SET
      uid_comercio = ?, mail = ?, nombre_comercio = ?, id_categoria = ?, descripcion = ?, direccion = ?, telefono = ?, horario_apertura = ?, horario_cierre = ?, 
      zonas_entrega = ?, costo_entrega = ?, metodos_pago = ?, imagenes = ?, activo = ?, foto_perfil = ?`;

    const values = [
      uid_comercio, mail, nombre_comercio, id_categoria, descripcion, direccion, telefono, horario_apertura, horario_cierre, zonas_entrega, 
      costo_entrega, metodos_pago, imagenes, activo, foto_perfil
    ];

    query += ` WHERE uid_comercio = ?`;
    values.push(uid_comercio); 

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Comercio no encontrado" });
    }

    console.log("Comercio actualizado: ", req.body);
    res.status(200).json({ message: "Comercio actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el comercio:", error);
    res.status(500).json({
      message: "Error al actualizar el comercio",
      error: error.message,
    });
  }
};