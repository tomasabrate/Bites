//Server
import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';  // Importar la función correcta desde 'url'
import path from "path";

const app = express();

// Obtener __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url); // Convertir la URL actual en una ruta de archivo
const __dirname = path.dirname(__filename);        // Obtener el directorio del archivo actual


//Middleware para entender objetos Json
app.use(express.json());

//Middleware para aceptar peticiones desde fuera (Cross-Origin Resource Sharing = cors)
app.use(cors());


// Servir archivos estáticos desde el directorio "uploads"
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

export default app;
