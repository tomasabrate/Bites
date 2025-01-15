// En el archivo services/ventas.js

const API_URL = "http://localhost:3000"; // Asegúrate de que esta es tu URL correcta

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