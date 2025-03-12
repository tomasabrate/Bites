import { getComercios, getComercioByUid, postComercio, deleteComercio, deleteLogicoCormecio, putComercio, getComerciosForMaps } from "../controllers/comercios.controller.js";
import { Router } from "express";
const routerComercios = Router();

// ENDPOINTS de Clientes
routerComercios.get("/comercios", getComercios);

routerComercios.get("/comercios/:uid_comercio", getComercioByUid);

routerComercios.post("/comercios", postComercio);

routerComercios.delete("/comercios/:uid_comercio", deleteComercio);

routerComercios.delete("/comercios/baja/:uid_comercio", deleteLogicoCormecio);

routerComercios.put("/comercios/:uid_comercio", putComercio);

routerComercios.get("/comercios/maps", getComerciosForMaps);


export default routerComercios;