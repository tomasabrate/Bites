import {
  deleteProducto,
  getProductos,
  postProducto,
  putProducto,
} from '../controllers/products.controllers.js';
import { Router } from 'express';
const routerProductos = Router();

// ENDPOINTS de Productos
routerProductos.get('/productos', getProductos);

routerProductos.post('/productos', postProducto);

routerProductos.put('/productos', putProducto);

routerProductos.delete('/productos', deleteProducto);

export default routerProductos;
