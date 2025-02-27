//Dependencias
import { PORT } from "./config.js";
import app from "./app.js";
import routerProductos from "./routes/products.routes.js";
import routerClientes from "./routes/clientes.routes.js";
import routerComercios from "./routes/comercio.routes.js";
import routerVentas from "./routes/ventas.routes.js";
import routerCompras from "./routes/compras.routes.js";
import routerDetalleVenta from "./routes/detalleVentas.routes.js";
import routerCategoriasComercio from "./routes/categoriasComercio.routes.js";
// import cron from "node-cron.js";
// import { deleteExpiredOrEmptyProducts } from "./controllers/products.controllers.js";

import reportesRoutes from './routes/reporte.routes.js';

//Home
app.get('/', (req, res) => {
  res.send('Home Page');
});

//Productos
app.use(routerProductos);

//Clientes
app.use(routerClientes);

//Comercios
app.use(routerComercios);

//Ventas
app.use(routerVentas);

//DetalleVenta
app.use(routerDetalleVenta);

//Compras
app.use(routerCompras);

//Categorias Comercio
app.use(routerCategoriasComercio);

app.use('/reportes', reportesRoutes);

//Eliminar productos vencidos o agotados
// cron.schedule("0 0 * * *", async () => {
//   try {
//     console.log("Iniciando limpieza de productos...");
//     await deleteExpiredOrEmptyProducts();
//     console.log("Limpieza completada.");
//   } catch (error) {
//     console.error("Error en el cron job:", error);
//   }
// });

//Middleware - Ruta no encontrada
app.use((req, res, next) => {
  res.status(404).send('404 - Ruta no existente.');
});

app.listen(PORT, () => {
  console.log(`Server esuchando en el puerto http://localhost:${PORT}`);
});
