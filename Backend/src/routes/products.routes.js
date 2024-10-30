import { deleteProducto, getProductos, postProducto, putProducto, getProductosById } from "../controllers/products.controllers.js";
import { Router } from "express";
const routerProductos = Router();

// ENDPOINTS de Productos
routerProductos.get("/productos", getProductos);

routerProductos.get("/productos/:id_producto", getProductosById);

routerProductos.post("/productos", postProducto);

routerProductos.put("/productos/:id_producto", putProducto);

routerProductos.delete('/productos/:id_producto', deleteProducto);

export default routerProductos;