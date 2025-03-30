import { pool } from "../database/connection.js";
//import admin from "firebase-admin";  //no se para que sirve

// Obtener reseñas por UID del comercio
export const obtenerResenas = async (req, res) => {
    const { uid_comercio, uid_cliente } = req.params;
    const { page = 1, limit = 10, puntuacion } = req.query; // Se agrega "puntuacion" como query param

    const offset = (page - 1) * limit;

    try {
        let query = "SELECT * FROM Resenas WHERE uid_comercio = ? AND uid_cliente != ?";
        let params = [uid_comercio, uid_cliente];

        // Si se especifica una puntuación, agregamos la condición
        if (puntuacion) {
            query += " AND puntuacion = ?";
            params.push(Number(puntuacion));
        }

        query += " LIMIT ? OFFSET ?";
        params.push(Number(limit), Number(offset));

        const [resenas] = await pool.query(query, params);

        res.status(200).json(resenas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener reseñas" });
    }
};



// Crear o actualizar una reseña
export const crearResena = async (req, res) => {
    console.log("Body recibido:", req.body);

    const { uid_cliente, uid_comercio, puntuacion, comentario } = req.body;

    if (!uid_cliente || !uid_comercio || !puntuacion || !comentario) {
        return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    try {
        const query = `
            INSERT INTO Resenas (uid_cliente, uid_comercio, puntuacion, comentario)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE puntuacion = VALUES(puntuacion), comentario = VALUES(comentario)
        `;

        await pool.query(query, [uid_cliente, uid_comercio, puntuacion, comentario]);

        res.status(200).json({ message: "Reseña guardada correctamente" });
    } catch (error) {
        console.error("Error al guardar reseña:", error);
        res.status(500).json({ error: "Error al guardar la reseña" });
    }
};


// Eliminar una reseña
export const eliminarResena = async (req, res) => {
    const { uid_cliente, uid_comercio } = req.body;

    try {
        const query = "DELETE FROM Resenas WHERE uid_cliente = ? AND uid_comercio = ?";
        await pool.query(query, [uid_cliente, uid_comercio]);

        res.status(200).json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la reseña" });
    }
};


export const obtenerResenasByCliente = async (req, res) => {
    const { uid_comercio, uid_cliente } = req.params;

    try {
        const query = "SELECT * FROM Resenas WHERE uid_comercio = ? AND uid_cliente = ?";
        const [resena] = await pool.query(query, [uid_comercio, uid_cliente]);

        if (resena.length > 0) {
            res.status(200).json(resena[0]);
          } else {
            res.status(404).json({ message: "Resena no encontrada" });
          }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener reseñas" });
    }
};