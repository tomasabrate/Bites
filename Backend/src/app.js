//Server
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

//Middleware para entender objetos Json
app.use(express.json());

//Middleware para aceptar peticiones desde fuera (Cross-Origin Resource Sharing = cors)
app.use(cors());

// Aumenta el límite de tamaño de payload para JSON
app.use(bodyParser.json({ limit: '100mb' }));

// Aumenta el límite de tamaño de payload para URL-encoded
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

export default app;
