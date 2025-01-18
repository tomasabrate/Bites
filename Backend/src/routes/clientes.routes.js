import {
  getClientes,
  getClienteByUid,
  postCliente,
  deleteCliente,
  deleteLogicoCliente
} from "../controllers/clientes.controller.js";
import { Router } from "express";
const routerClientes = Router();

// ENDPOINTS de Clientes
routerClientes.get("/clientes", getClientes);

routerClientes.get("/clientes/:uid_cliente", getClienteByUid);

routerClientes.post("/clientes", postCliente);

routerClientes.delete("/clientes/:uid_cliente", deleteCliente);

routerClientes.delete("/clientes/baja/:uid_cliente", deleteLogicoCliente);

export default routerClientes;
