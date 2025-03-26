import { Router } from "express";
import { obtenerResenas, crearResena, eliminarResena, obtenerResenasByCliente } from "../controllers/resenas.controllers.js"; 

const routerResenas = Router();

// Obtener reseñas por UID del comercio
routerResenas.get("/resenas/:uid_comercio/:uid_cliente", obtenerResenas);

// Crear o actualizar una reseña
routerResenas.post("/resenas", crearResena);

// Eliminar una reseña
routerResenas.delete("/resenas", eliminarResena);

routerResenas.get("/resenas/solo/:uid_comercio/:uid_cliente", obtenerResenasByCliente);

export default routerResenas;