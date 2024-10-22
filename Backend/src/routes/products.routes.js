import { deleteProducto, getProductos, postProducto, putProducto } from "../controllers/products.controllers.js";
import { Router } from "express";
const routerProductos = Router();


// Añadidos para poder guardar imgs
import upload from "../middlewares/upload.middleware.js"; // Importar el middleware

// ENDPOINTS de Productos
routerProductos.get("/productos", getProductos);
routerProductos.post("/productos", upload.array('imagenes', 5), postProducto); // 'imagenes' es el nombre del campo de imágenes
routerProductos.put("/productos", putProducto);
routerProductos.delete("/productos", deleteProducto);

export default routerProductos;
