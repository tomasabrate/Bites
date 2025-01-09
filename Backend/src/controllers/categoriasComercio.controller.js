import { pool } from "../database/connection.js";

export const getCategoriasComercio = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM CategoriasComercio");
    console.log("Lista de categorias:", result);
    res.status(200).json(result);
  } catch (error) {
    console.log("ERROR en GET Comercios.", error);
    return res.status(500).send("500 - Error en la base de datos.");
  }
};

export const getCategoriaComercioById = async (req, res) => {
    const { id_categoria } = req.params;
    try {
      const [result] = await pool.query(
        "SELECT * FROM CategoriasComercio WHERE id_categoria = ?",
        [id_categoria]
      );
  
      console.log("Categoria Comercio: ", result);
  
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: "Categoria no encontrado" });
      }
    } catch (error) {
      console.log("ERROR en GET Comercios.", error);
      return res.status(500).send("500 - Error en la base de datos.");
    }
  };