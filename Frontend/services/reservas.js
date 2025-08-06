import { API_URL_BACK } from "./api_back";

export const createReserva = async (uid_cliente, uid_comercio, carrito, estado) => {
  try {
    const response = await fetch(`${API_URL_BACK}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify({uid_cliente, uid_comercio, carrito, estado}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("ERROR al crear reserva:", error);
    throw error;
  }
};

export const cancelarReservaFront = async (id_reserva) => {
  try {
    const response = await fetch(`${API_URL_BACK}/reservas/${id_reserva}/cancelar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("ERROR al cancelar reserva:", error);
    throw error;
  }
};
