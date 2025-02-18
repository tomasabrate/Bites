import { deleteProducto, getProductos, postProducto, putProducto, getProductosById, deleteLogicoProducto, getProductosByUidComercio } from "../controllers/products.controllers.js";
import { Router } from "express";
const routerProductos = Router();

// ENDPOINTS de Productos
routerProductos.get("/productos", getProductos);

routerProductos.get("/productos/:id_producto", getProductosById);

routerProductos.get("/productos/comercio/:uid_comercio", getProductosByUidComercio);

routerProductos.post("/productos", postProducto);

routerProductos.put("/productos/:id_producto", putProducto);

routerProductos.delete('/productos/:id_producto', deleteProducto);

routerProductos.delete('/productos/baja/:id_producto', deleteLogicoProducto);

export default routerProductos;