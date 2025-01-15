import {
  getClientes,
  getClienteByUid,
  postCliente,
  deleteCliente
} from "../controllers/clientes.controller.js";
import { Router } from "express";
const routerClientes = Router();

// ENDPOINTS de Clientes
routerClientes.get("/clientes", getClientes);

routerClientes.get("/clientes/:uid_cliente", getClienteByUid);

routerClientes.post("/clientes", postCliente);

routerClientes.delete("/clientes/:uid_cliente", deleteCliente);

export default routerClientes;
