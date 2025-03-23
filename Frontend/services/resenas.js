import { API_URL_BACK } from "./api_back";
const API_URL = API_URL_BACK + '/resenas'; 

//OBTENER PRODUCTOS
export const getResenas = async (uid_comercio, page = 1, limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/${uid_comercio}?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
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