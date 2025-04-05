import { Payment, MercadoPagoConfig, Preference, OAuth } from "mercadopago";
import { updateEstadoReserva } from "./reservas.controller.js";
import { registrarVentaMP } from "./ventas.controllers.js";

const marketplace = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN_MARKETPLACE });

//Webhook para recibir notificaciones de pago
export const webhookMP = async (req, res) => {
  try {
    const { type, data } = req.body;
    console.log("Webhook recibido:", req.body);

    //verificamos el tipo de webhook
    if (type != "payment") {
      console.log("Tipo de webhook incorrecto");
      return res.status(200).send("OK");
    }
    //obtenemos el pago
    const payment = await Payment(marketplace).get(data.id);
    //verificamos si esta aprobado
    if (payment.status === "approved") {
      console.log("Pago aprobado");
      //guardamos el pago en la base de datos
      await createPago("aprobado", data.id, payment.external_reference);

      //actualizamos el estado de la reserva a "finalizada"
      await updateEstadoReserva(id_reserva = payment.external_reference, "finalizada");

      //registramos la venta desde la reserva
      await registrarVentaMP(payment.external_reference);
    } else if (payment.status === "pending") {
      console.log("Pago pendiente");
      await createPago("pendiente", payment_id = data.id, id_reserva = payment.external_reference); //creamos el pago en nuestra base de datos
    } else {
      console.log("Pago rechazado");
      await createPago("rechazado", data.id, payment.external_reference); //creamos el pago en nuestra base de datos
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error");
  }
}

//creamos una preferencia de pago
export const createPreference = async (req, res) => {
  try {
    const { carrito, id_reserva, succesUrl, failureUrl, pendingUrl } = req.body;

    //obtenemos todos los productos del carrito
    const items = carrito.map((item) => ({
      id: item.id,
      title: item.nombre,
      unit_price: (item.precio - (item.precio * item.descuento) / 100),
      quantity: item.cantidad,
    }));

    //creamos la preferencia de pago
    const preference = await new Preference(marketplace).create({
      body: {
        items: items,
        metadata: {
          text,
        },
        external_reference: id_reserva,//referencia externa para identificar la venta en nuestra base de datos
        //los back_urls se manejan con DeepLinks, estos son creados en el front y pasados en el body de la request.
        back_urls: {
          success: succesUrl,
          failure: failureUrl,
          pending: pendingUrl
        },
        notification_url: `${process.env.API_URL}/mercado-pago/webhook`,//para recibir notificaciones de pago tenemos que exponer nuestro server
        marketplace_fee: 5,
      },
    });

    res.status(200).json("Preferencia de pago: ", preference);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");

  }
}

//Obtenemos la URL de autorizacion de MP para el comercio
//Se llama desde el frontend
export const authMP = async (req, res) => {
  try {
    const { uid_comercio } = req.params;

    // Generar un identificador único (state)
    const state = `${uid_comercio}-${Math.random().toString(36).substring(2, 15)}`;

    const url = new OAuth(marketplace).getAuthorizationURL({
      options: {
        client_id: process.env.MP_PUBLIC_CLIENT_ID,
        redirect_uri: `${process.env.API_URL}/mercado-pago/connect`,
        state: state
      }
    });

    console.log(url);
    return res.status(200).json(url);
  } catch (error) {
    console.log("ERROR al crear URL de OAuth", error);
    return res.status(500).json("ERROR al crear URL de OAuth");
  }
}

//Conectar a un vendedor con el code de autorizacion
export const connect = async (code) => {

  //obtenemos las credenciales desde mercado apgo
  const credentials = await new OAuth(marketplace).create({
    body: {
      client_id: process.env.MP_PUBLIC_CLIENT_ID,
      client_secret: process.env.MP_PRIVATE_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.API_URL}/mercado-pago/connect`,
    }
  })

  return credentials;
}

//Obtengo el codigo de autorizacion y actualizo las credenciales del comercio en la bd
export const webhookCodeMP = async (req, res) => {
  try {
    //obtenemos el codigo de autorizacion y el state
    //Creo que viene en el req.params, probar con ambos
    const { code, state } = req.body;

    // Extraer el uid_comercio del state
    const uid_comercio = state.split('-')[0];

    //Conectamos al usuario con el code y obtenemos sus credenciales
    const credentials = await connect(code);
    console.log(credentials);

    //Actualizamos las credenciales del comercio en la bd
    await updateCredentialsComercio(uid_comercio, credentials);
    console.log("Credenciales actualizadas");

    return res.status(200).json("OK");
  } catch (error) {
    console.log("ERROR al obtener el Authorization Code", error);
    return res.status(500).json("ERROR al obtener el Authorization Code")
  }
};