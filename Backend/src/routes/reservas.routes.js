import { Router } from 'express';
import {
  getReservas,
  getReservaById,
  createReserva,
  updateEstadoReserva,
  deleteReserva,
  cancelarReserva
} from '../controllers/reservas.controller.js';

const routerReservas = Router();

routerReservas.get('/reservas', getReservas);
routerReservas.get('/reservas/:id', getReservaById);
routerReservas.post('/reservas', createReserva);
// routerReservas.put('/reservas/:id', updateEstadoReserva);
routerReservas.delete('/reservas/:id', deleteReserva);
routerReservas.put("/reservas/:id_reserva/cancelar", cancelarReserva);


export default routerReservas;