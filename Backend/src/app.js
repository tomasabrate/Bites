//Server
import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
const app = express();

//Middleware para aceptar peticiones desde fuera (Cross-Origin Resource Sharing = cors)
app.use(cors());
app.options('*', cors()); 

//Middleware para entender objetos Json
app.use(express.json());

// Aumenta el límite de tamaño de payload para JSON
// app.use(bodyParser.json({ limit: "100mb" }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Aumenta el límite de tamaño de payload para URL-encoded
// app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

export default app;
