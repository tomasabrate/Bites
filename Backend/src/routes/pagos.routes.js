import { Router } from 'express';
import { getPagos, createPago, getPagoById,getPagoByPaymentId, updateEstadoPago, deletePago } from '../controllers/pagos.controller.js';

const routerPagos = Router();

routerPagos.get('/pagos', getPagos);
routerPagos.post('/pagos', createPago);
routerPagos.get('/pagos/:id', getPagoById);
routerPagos.get('/pagos/:payment_id', getPagoByPaymentId);
routerPagos.put('/pagos/:id', updateEstadoPago);
routerPagos.delete('/pagos/:id', deletePago);

export default routerPagos;