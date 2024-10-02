import { config } from "dotenv";

config(); //Ejecutando este metodo ya estamos leyendo las variables de entorno

export const PUERTO = process.env.PORT || 4000;
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_DATABASE = process.env.DB_DATABASE || "";
