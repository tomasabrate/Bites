//Dependencias
import { PUERTO } from './config.js';
import app from './app.js';
import routerProductos from './routes/products.routes.js';
const cloudinary = require('cloudinary').v2;

//Manejar cloudinary
cloudinary.config({
  cloud_name: 'tu_cloud_name',
  api_key: 'tu_api_key',
  api_secret: 'tu_api_secret',
});

//Home
app.get('/', (req, res) => {
  res.send('Home page');
});

//Productos
app.use(routerProductos);

//Usuarios
app.get('/usuarios', (req, res) => {
  res.send('GET usuarios');
});

//Locales
app.get('/locales', (req, res) => {
  res.send('GET locales');
});

//Ventas
app.get('/ventas', (req, res) => {
  res.send('GET ventas');
});

//Middleware - Ruta no encontrada
app.use((req, res, next) => {
  res.status(404).send('404 - Ruta no existente.');
});

app.listen(PUERTO, () => {
  console.log(`Server esuchando en el puerto http://localhost:${PUERTO}`);
});
