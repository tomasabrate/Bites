const API_URL = "http://localhost:3000/compras"; //DIRECCION DEL BACKEND


//OBTENER COMPRAS POR CLIENTE -- usamos la misma tabla ventas de la bd pero filtramos por uid_cliente
export const getComprasByCliente = async (uid_cliente) => {
  try {
    const response = await fetch(`${API_URL}?uid_cliente=${uid_cliente}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener compras por cliente:", error);
    throw error;
  }
};
