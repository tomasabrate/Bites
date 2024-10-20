import { deleteProducto, getProductos, postProducto, putProducto, getProductosActivos } from "../controllers/products.controllers.js";
import { Router } from "express";

const routerProductos = Router();

// ENDPOINTS de Productos
routerProductos.get("/productos", getProductos); // Obtener todos los productos
routerProductos.get("/productos/activos", getProductosActivos); // Obtener solo productos activos
routerProductos.post("/productos", postProducto); // Crear un nuevo producto
routerProductos.put("/productos", putProducto); // Actualizar un producto
routerProductos.delete("/productos", deleteProducto); // Eliminar un producto

export default routerProductos;
