import { Router } from "express";
import { obtenerResenas, crearResena, eliminarResena } from "../controllers/resenas.controllers.js"; 

const routerResenas = Router();

// Obtener reseñas por UID del comercio
routerResenas.get("/resenas/:uid_comercio", obtenerResenas);

// Crear o actualizar una reseña
routerResenas.post("/resenas", crearResena);

// Eliminar una reseña
routerResenas.delete("/resenas", eliminarResena);

export default routerResenas;