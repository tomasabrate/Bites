const API_URL = "http://localhost:3000/clientes";

//CREAR UN PERFIL CLIENTE
export const postCliente = async (data) => {
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
      console.log("Cliente cargado");
      return await response.json();
    } catch (error) {
      console.error("Error al crear cliente:", error);
      throw error;
    }
  };