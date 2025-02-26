import { Router } from 'express';
import { obtenerReporteVentas } from '../controllers/reporte.controllers.js';
import { obtenerReportePorComercio } from '../controllers/reporte.controllers.js';
import { obtenerProductosHistoricos } from '../controllers/reporte.controllers.js';
import { generarExcelReportes } from '../controllers/reporte.controllers.js';

const router = Router();

router.get('/ventas', obtenerReporteVentas);

router.get('/ventas/:uid_comercio', obtenerReportePorComercio);

router.get('/ventas/historico/:uid_comercio', obtenerProductosHistoricos);

router.get('/excel/:uid_comercio', generarExcelReportes);

export default router;
