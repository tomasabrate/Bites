const API_URL = "http://localhost:3000/productos"; //DIRECCION DEL BACKEND

//OBTENER PRODUCTOS
export const getProductos = async () => {
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
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

//MODIFICAR UN PRODUCTO
export const putProducto = async (productoId, data) => {
  try {
    const response = await fetch(`${API_URL}/${productoId}`, {
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
    console.log(`Producto ${productoId} actualizado con exito!`)
    return await response.json();
  } catch (error) {
    console.error("Error al modificar producto:", error);
    throw error;
  }
};

//OBTENER UN PRODUCTO POR ID
export const getProductoById = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};

//CREAR UN PRODUCTO
export const postProducto = async (data) => {
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
    console.log("Producto cargado");
    return await response.json();
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

//ELIMINAR UN PRODUCTO
export const deleteProducto = async (productoId) => {
  try {
    const response = await fetch(`${API_URL}/${productoId}`, {
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
    console.log(`Producto eliminado: ${productoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

//BAJA LOGICA DE UN PRODUCTO
export const deleteLogicoProducto = async (productoId) => {
  try {
    const response = await fetch(`${API_URL}/baja/${productoId}`, {
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
    console.log(`Producto bajado: ${productoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al bajar producto:", error);
    throw error;
  }
};
