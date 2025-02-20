import { pool } from "../database/connection.js";
import admin from "firebase-admin"; 

// Obtener reseñas por UID del comercio
export const obtenerResenas = async (req, res) => {
    const { uid_comercio } = req.params;

    try {
        const query = "SELECT * FROM reseñas WHERE uid_comercio = ?";
        const [resenas] = await pool.query(query, [uid_comercio]);

        res.status(200).json(resenas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener reseñas" });
    }
};

// Crear o actualizar una reseña
export const crearResena = async (req, res) => {
    const { uid_cliente, uid_comercio, puntuacion, comentario } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No autorizado. Token no proporcionado" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (decodedToken.uid !== uid_cliente) {
            return res.status(403).json({ error: "El UID del token no coincide con el UID proporcionado" });
        }

        if (!uid_cliente || !uid_comercio || !puntuacion || !comentario) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const query = `
            INSERT INTO reseñas (uid_cliente, uid_comercio, puntuacion, comentario)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE puntuacion = VALUES(puntuacion), comentario = VALUES(comentario)
        `;

        await pool.query(query, [uid_cliente, uid_comercio, puntuacion, comentario]);

        res.status(200).json({ message: "Reseña guardada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al guardar la reseña" });
    }
};

// Eliminar una reseña
export const eliminarResena = async (req, res) => {
    const { uid_cliente, uid_comercio } = req.body;

    try {
        const query = "DELETE FROM reseñas WHERE uid_cliente = ? AND uid_comercio = ?";
        await pool.query(query, [uid_cliente, uid_comercio]);

        res.status(200).json({ message: "Reseña eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la reseña" });
    }
};
