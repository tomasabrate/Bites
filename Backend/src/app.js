//Server
import  express  from "express";
const app = express();

//Middleware para entender objetos Json
app.use(express.json());

export default app;
