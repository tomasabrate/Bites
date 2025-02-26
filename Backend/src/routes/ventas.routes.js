import {
  deleteVenta,
  getVentaById,
  getVentas,
  getVentasByComercio,
  postVenta,
  putEstadoVenta,
  // putVenta,
} from '../controllers/ventas.controllers.js';
import { Router } from 'express';

const routerVentas = Router();

// ENDPOINTS de Ventas
routerVentas.get('/ventas', getVentas);

routerVentas.get('/ventas/:id_venta', getVentaById);

routerVentas.get('/ventas/', getVentasByComercio);

routerVentas.post('/ventas', postVenta);

// routerVentas.put("/ventas/:id_venta", putVenta);

routerVentas.put('/ventas/:id_venta', putEstadoVenta);

routerVentas.delete('/ventas/:id_venta', deleteVenta);

export default routerVentas;
