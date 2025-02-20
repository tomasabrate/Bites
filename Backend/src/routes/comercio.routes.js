import { getComercios, getComercioByUid, postComercio, deleteComercio, deleteLogicoCormecio, putComercio, getComerciosNombre } from "../controllers/comercios.controller.js"; // Importa la función
import { Router } from "express";
const routerComercios = Router();


// ENDPOINTS de Comercios
routerComercios.get("/comercios", getComercios);
routerComercios.get("/comercios/nombre", getComerciosNombre); // Ruta añadida para buscar por nombre
routerComercios.get("/comercios/:uid_comercio", getComercioByUid);
routerComercios.post("/comercios", postComercio);
routerComercios.delete("/comercios/:uid_comercio", deleteComercio);
routerComercios.delete("/comercios/baja/:uid_comercio", deleteLogicoCormecio);
routerComercios.put("/comercios/:uid_comercio", putComercio);

export default routerComercios;
