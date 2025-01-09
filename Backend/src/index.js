//Dependencias
import { PUERTO } from "./config.js";
import app from "./app.js";
import routerProductos from "./routes/products.routes.js";
import routerClientes from "./routes/clientes.routes.js";
import routerComercios from "./routes/comercio.routes.js";
import routerVentas from "./routes/ventas.routes.js";
import routerCategoriasComercio from "./routes/categoriasComercio.routes.js";

//Home
app.get("/", (req, res) => {
  res.send("Home page");
});

//Productos
app.use(routerProductos);

//Clientes
app.use(routerClientes);

//Comercios
app.use(routerComercios);

//Ventas
app.use(routerVentas);

//Categorias Comercio
app.use(routerCategoriasComercio);

//Middleware - Ruta no encontrada
app.use((req, res, next) => {
  res.status(404).send("404 - Ruta no existente.");
});

app.listen(PUERTO, () => {
  console.log(`Server esuchando en el puerto http://localhost:${PUERTO}`);
});
