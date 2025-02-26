import { pool } from '../database/connection.js'; // Importamos la conexión
import XLSX from 'xlsx';

export const obtenerReporteVentas = async (req, res) => {
  try {
    // Consulta SQL para obtener ventas y ganancias por comercio
    const query = `
      SELECT 
        c.uid_comercio, 
        c.nombre_comercio, 
        COUNT(v.id_venta) AS total_ventas, 
        COALESCE(SUM(v.total), 0) AS total_ganancias
      FROM Comercios c
      LEFT JOIN Ventas v ON c.uid_comercio = v.uid_comercio
      GROUP BY c.uid_comercio, c.nombre_comercio
      ORDER BY total_ganancias DESC;
    `;

    // Ejecutar consulta
    const [rows] = await pool.query(query);

    res.json(rows); // Enviar resultados al frontend
  } catch (error) {
    console.error('Error al obtener el reporte de ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerProductosHistoricos = async (req, res) => {
  try {
    const { uid_comercio } = req.params;

    const query = `
      SELECT 
        p.nombre,
        SUM(dv.cantidad) AS cantidad_vendida
      FROM DetallesVenta dv
      INNER JOIN Productos p ON dv.id_producto = p.id_producto
      INNER JOIN Ventas v ON dv.id_venta = v.id_venta
      WHERE v.uid_comercio = ?
        AND v.estado = 'ENTREGADO'
      GROUP BY p.nombre
      ORDER BY cantidad_vendida DESC;
    `;

    const [productos] = await pool.query(query, [uid_comercio]);

    res.json(
      productos.map((p) => ({
        nombre: p.nombre,
        cantidad_vendida: Number(p.cantidad_vendida),
      }))
    );
  } catch (error) {
    console.error('Error en productos históricos:', error);
    res.status(500).json({ error: 'Error al obtener histórico' });
  }
};

export const obtenerReportePorComercio = async (req, res) => {
  try {
    const { uid_comercio } = req.params;
    console.log(`Solicitando reporte para comercio: ${uid_comercio}`); // ← Log de depuración

    // Consulta ventas últimos 6 meses (incluyendo meses sin ventas)
    const queryVentas = `
      WITH meses AS (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m') AS mes
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 4 MONTH), '%Y-%m')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 2 MONTH), '%Y-%m')
        UNION SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m')
        UNION SELECT DATE_FORMAT(CURDATE(), '%Y-%m')
      )
      SELECT 
        meses.mes,
        COALESCE(SUM(v.total), 0) AS total_ventas
      FROM meses
      LEFT JOIN Ventas v 
        ON DATE_FORMAT(v.fecha_venta, '%Y-%m') = meses.mes
        AND v.uid_comercio = ?
        AND v.estado = 'ENTREGADO'  
      GROUP BY meses.mes
      ORDER BY meses.mes ASC;
    `;

    // Consulta productos más vendidos
    const queryProductos = `
      SELECT 
        p.nombre,
        SUM(dv.cantidad) AS cantidad_vendida
      FROM DetallesVenta dv
      INNER JOIN Productos p ON dv.id_producto = p.id_producto
      INNER JOIN Ventas v ON dv.id_venta = v.id_venta
      WHERE v.uid_comercio = ?
        AND v.estado = 'ENTREGADO'  
      GROUP BY p.nombre
      ORDER BY cantidad_vendida DESC
      LIMIT 5;
    `;

    console.log(
      'Ejecutando consulta ventas:',
      queryVentas.replace(/\s+/g, ' ')
    );
    console.log('Parámetros:', [uid_comercio]);

    const [ventasMensuales] = await pool.query(queryVentas, [uid_comercio]);
    const [productosMasVendidos] = await pool.query(queryProductos, [
      uid_comercio,
    ]);

    // Después de obtener resultados
    console.log('Ventas raw:', ventasMensuales);
    console.log('Productos raw:', productosMasVendidos);

    console.log('Resultados ventas:', ventasMensuales); // ← Log resultados
    console.log('Resultados productos:', productosMasVendidos);

    res.json({
      ventasMensuales: ventasMensuales.map((v) => ({
        mes: v.mes,
        total_ventas: Number(v.total_ventas), // ← Convertir a número
      })),
      productosMasVendidos: productosMasVendidos.map((p) => ({
        nombre: p.nombre,
        cantidad_vendida: Number(p.cantidad_vendida), // ← Convertir a número
      })),
    });
  } catch (error) {
    console.error('Error en controlador:', error);
    res.status(500).json({
      error: 'Error interno',
      detalle: error.message, // ← Mensaje detallado
    });
  }
};
export const generarExcelReportes = async (req, res) => {
  try {
    const { uid_comercio } = req.params;

    // Consulta para ventas mensuales
    const queryVentas = `
      SELECT 
        DATE_FORMAT(fecha_venta, '%Y-%m') AS mes,
        SUM(total) AS total_ventas
      FROM Ventas
      WHERE uid_comercio = ?
        AND estado = 'ENTREGADO'
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 6;
    `;

    // Consulta para productos
    const queryProductos = `
      SELECT 
        p.nombre,
        SUM(dv.cantidad) AS cantidad_vendida
      FROM DetallesVenta dv
      INNER JOIN Productos p ON dv.id_producto = p.id_producto
      INNER JOIN Ventas v ON dv.id_venta = v.id_venta
      WHERE v.uid_comercio = ?
      GROUP BY p.nombre
      ORDER BY cantidad_vendida DESC;
    `;

    // Ejecutar consultas
    const [ventas] = await pool.query(queryVentas, [uid_comercio]);
    const [productos] = await pool.query(queryProductos, [uid_comercio]);

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new();

    // Hoja de ventas
    const ventasData = ventas.map((v) => ({
      Mes: v.mes,
      'Ventas Totales (USD)': v.total_ventas,
      Estado: 'Completado',
    }));
    const ventasSheet = XLSX.utils.json_to_sheet(ventasData);
    XLSX.utils.book_append_sheet(workbook, ventasSheet, 'Ventas Mensuales');

    // Hoja de productos
    const productosData = productos.map((p) => ({
      Producto: p.nombre,
      'Unidades Vendidas': p.cantidad_vendida,
    }));
    const productosSheet = XLSX.utils.json_to_sheet(productosData);
    XLSX.utils.book_append_sheet(
      workbook,
      productosSheet,
      'Productos Vendidos'
    );

    // Generar buffer
    const buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      bookSST: false,
    });

    // Configurar headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte_${uid_comercio}.xlsx`
    );

    // Enviar archivo
    res.end(buffer);
  } catch (error) {
    console.error('Error generando Excel:', error);
    res.status(500).json({
      error: 'Error generando reporte',
      detalle: error.message,
    });
  }
};
