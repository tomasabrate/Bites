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

  //OBTENER UN CLIENTE POR UID
  export const getClienteById = async (uid_cliente) => {
    try {
      const response = await fetch(`${API_URL}/${uid_cliente}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error al obtener Cliente:", error);
      throw error;
    }
  };


  export const deleteCliente = async (uid_cliente) => {
    try {
      const response = await fetch(`${API_URL}/${uid_cliente}`, {
        method: "DELETE"
      });
  
      if (response.ok) {
        console.log(`Cliente eliminado: ${uid_cliente}`);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw error;
    }
  };