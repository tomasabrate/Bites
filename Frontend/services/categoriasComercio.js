const API_URL = "http://localhost:3000/categoriasComercio";

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