import { API_URL_BACK } from "./api_back";
const API_URL = API_URL_BACK; 

export const getDetallesByIdVenta = async (id_venta) => {
  try {
    const response = await fetch(`${API_URL}/ventas/${id_venta}/detalles`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener detalles de la venta:", error);
    throw error;
  }
};