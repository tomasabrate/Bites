import { getCategoriasComercio, getCategoriaComercioById } from "../controllers/categoriasComercio.controller.js";
import { Router } from "express";
const routerCategoriasComercio = Router();

// ENDPOINTS de Categorías Comercio
routerCategoriasComercio.get("/categoriasComercio", getCategoriasComercio);

routerCategoriasComercio.get("/categoriasComercio/:id_categoria", getCategoriaComercioById);


export default routerCategoriasComercio;