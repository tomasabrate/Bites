import { getComprasByCliente } from "../controllers/compras.controller.js";
import { Router } from "express";

const routerCompras = Router();

routerCompras.get('/compras/',getComprasByCliente);

export default routerCompras;