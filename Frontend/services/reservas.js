import { API_URL_BACK } from "./api_back";

export const createReserva = async (reserva) => {
  try {
    const response = await fetch(`${API_URL_BACK}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, body: JSON.stringify(reserva),
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