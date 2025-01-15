import { getComercios, getComercioByUid, postComercio, deleteComercio } from "../controllers/comercios.controller.js";
import { Router } from "express";
const routerComercios = Router();

// ENDPOINTS de Clientes
routerComercios.get("/comercios", getComercios);

routerComercios.get("/comercios/:uid_comercio", getComercioByUid);

routerComercios.post("/comercios", postComercio);

routerComercios.delete("/comercios/:uid_comercio", deleteComercio);

export default routerComercios;