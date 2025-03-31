import { API_URL_BACK } from "./api_back";
const API_URL = API_URL_BACK + '/resenas'; 

//OBTENER PRODUCTOS
export const getResenas = async (uid_comercio, uid_cliente, page, puntuacion = null) => {
  try {
      let url = `${API_URL}/${uid_comercio}/${uid_cliente}?page=${Number(page)}&limit=10`;
      
      // Si el usuario seleccionó un número de estrellas, lo agregamos a la URL
      if (puntuacion) {
          url += `&puntuacion=${puntuacion}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
  } catch (error) {
      console.error("Error al obtener reseñas:", error);
      throw error;
  }
};



export const postResena = async (data) => {
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
    console.log("Reseña cargada con exito");
    return await response.json();
  } catch (error) {
    console.error("Error al cargar reseña:", error);
    throw error;
  }
};


export const getResenasByCliente = async (uid_comercio, uid_cliente) => {
  try {
    const response = await fetch(`${API_URL}/solo/${uid_comercio}/${uid_cliente}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener reseña:", error);
    throw error;
  }
};