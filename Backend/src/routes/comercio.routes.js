import { getComercios, getComercioByUid, postComercio, deleteComercio, deleteLogicoCormecio, putComercio, getComerciosForMaps, getComercioCredentialsMP } from "../controllers/comercios.controller.js";
import { Router } from "express";
const routerComercios = Router();

// ENDPOINTS de Comercios
routerComercios.get("/comercios", getComercios);

routerComercios.get("/comercios/:uid_comercio", getComercioByUid);

routerComercios.post("/comercios", postComercio);

routerComercios.delete("/comercios/:uid_comercio", deleteComercio);

routerComercios.delete("/comercios/baja/:uid_comercio", deleteLogicoCormecio);

routerComercios.put("/comercios/:uid_comercio", putComercio);

routerComercios.get("/comercios/maps/info", getComerciosForMaps);

//obtiene las credenciales de mercado pago de un comercio
routerComercios.get("/comercios/auth-mercado-pago/:uid_comercio", getComercioCredentialsMP);


export default routerComercios;