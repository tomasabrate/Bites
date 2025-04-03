import { API_URL_BACK } from "./api_back";

export const createPreference = async (id_reserva, carrito, succesUrl, failureUrl, pendingUrl) =>{
  try {
    const response = await fetch(`${API_URL_BACK}/mercadopago/create-preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify({id_reserva, carrito, succesUrl, failureUrl, pendingUrl}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("ERROR al crear preferencia:", error);
    throw error;
  }
}

export const getAuthURL = async (uid_comercio) =>{
  try {
    const response = await fetch(`${API_URL_BACK}/mercado-pago/auth-url/:${uid_comercio}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return response.json();

  } catch (error) {
    console.error("ERROR al obtener auth URL:", error);
    throw error;
  }
}