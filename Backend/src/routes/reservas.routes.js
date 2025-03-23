import { Router } from 'express';
import {
  getReservas,
  getReservaById,
  createReserva,
  updateEstadoReserva,
  deleteReserva
} from '../controllers/reservas.controller.js';

const routerReservas = Router();

routerReservas.get('/reservas', getReservas);
routerReservas.get('/reservas/:id', getReservaById);
routerReservas.post('/reservas', createReserva);
// routerReservas.put('/reservas/:id', updateEstadoReserva);
routerReservas.delete('/reservas/:id', deleteReserva);

module.exports = routerReservas;