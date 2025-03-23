import { Router } from "express";
import { webhookMP, createPreference, authMP, webhookCodeMP } from "../controllers/mercadoPago.controller.js";

const routerMP = Router();

//recibe las notificaciones de pago
routerMP.post("/mercado-pago/webhook", webhookMP);

//crea la preferencia de pago
routerMP.get("/mercado-pago/create-preference", createPreference);

//recibe el codigo de autorizacion de mercado pago
routerMP.post("/mercado-pago/connect", webhookCodeMP)

//Obtenemos la URL de autorizacion de MP para el comercio
routerMP.get("/mercado-pago/auth-url/:uid_comercio", authMP)


export default routerMP;