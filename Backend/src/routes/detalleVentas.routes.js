import { Router } from "express";
import { getDetallesByIdVenta } from "../controllers/detalleVentas.controller.js";
const routerDetalleVenta = Router();

routerDetalleVenta.get("/ventas/:id_venta/detalles", getDetallesByIdVenta); // Añadir esta ruta

export default routerDetalleVenta;
