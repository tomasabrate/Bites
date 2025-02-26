import { config } from "dotenv";

config(); //Ejecutando este metodo ya estamos leyendo las variables de entorno

export const PORT = process.env.PORT || 3000;

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_DATABASE = process.env.DB_DATABASE || "";
export const DB_PORT = process.env.DB_PORT || 3306;
