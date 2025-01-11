const API_URL = "http://localhost:3000/ventas"; //DIRECCION DEL BACKEND

//OBTENER ventas
export const getVentas = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw error;
  }
};

//OBTENER VENTAS por uid_comercio

export const getVentasByComercio = async (uid_comercio) => {
  try {
    const response = await fetch(`${API_URL}?uid_comercio=${uid_comercio}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener ventas por comercio:", error);
    throw error;
  }
};

//MODIFICAR UN venta
export const putVenta = async (ventaId, data) => {
  try {
    const response = await fetch(`${API_URL}/${ventaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    console.log(`venta ${ventaId} actualizado con exito!`)
    return await response.json();
  } catch (error) {
    console.error("Error al modificar venta:", error);
    throw error;
  }
};

//OBTENER una venta POR ID
export const getVentaById = async (ventaId) => {
  try {
    const response = await fetch(`${API_URL}/${ventaId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener venta:", error);
    throw error;
  }
};

//CREAR una venta
export const postVenta = async (data) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    console.log("venta cargada");
    return await response.json();
  } catch (error) {
    console.error("Error al crear venta:", error);
    throw error;
  }
};

//ELIMINAR UN venta
export const deleteVenta = async (ventaId) => {
  try {
    const response = await fetch(`${API_URL}/${ventaId}`, {
      method: "DELETE",
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
    console.log(`venta eliminada: ${ventaId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    throw error;
  }
};
