import { API_URL_BACK } from "./api_back";
const API_URL = API_URL_BACK; 

export const getCategoriasComercio = async () => {
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
    console.error("Error al obtener categorias:", error);
    throw error;
  }
};

export const getCategoriaComercioById = async (id_categoria) => {
    try {
      const response = await fetch(`${API_URL}/${id_categoria}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener categoria:", error);
      throw error;
    }
  };