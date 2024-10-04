//Server
import express from "express";
import cors from "cors";
const app = express();

//Middleware para entender objetos Json
app.use(express.json());

//Middleware para aceptar peticiones desde fuera (Cross-Origin Resource Sharing = cors)
app.use(cors());

export default app;
