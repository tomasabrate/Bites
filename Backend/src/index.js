//Dependencias
import { PUERTO } from './config.js';
import app from './app.js';
import routerProductos from './routes/products.routes.js';
import cloudinary from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dturrtxzx',
  api_key: '337961572316383',
  api_secret: 'kp7PKcTyqJIDYY5pCYbPhi9p_Vk',
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
