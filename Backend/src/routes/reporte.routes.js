import { Router } from 'express';
import { obtenerReporteVentas } from '../controllers/reporte.controllers.js';

const router = Router();

router.get('/ventas', obtenerReporteVentas);

export default router;
