import { API_URL_BACK } from "./api_back";
const API_URL = API_URL_BACK + '/comercios'; 

//CREAR UN PERFIL DE COMERCIO
export const postComercio = async (data) => {
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
      console.log("Comercio cargado");
      return await response.json();
    } catch (error) {
      console.error("Error al crear comercio:", error);
      throw error;
    }
  };

//OBTENER UN COMERCIO POR UID
export const getComercioById = async (uid_comercio) => {
  try {
    const response = await fetch(`${API_URL}/${uid_comercio}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error al obtener Comercio:", error);
    throw error;
  }
};

export const deleteComercio = async (uid_comercio) => {
  try {
    const response = await fetch(`${API_URL}/${uid_comercio}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log(`Comercio eliminado: ${uid_comercio}`);
      return { success: true };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error al eliminar comercio:", error);
    throw error;
  }
};

  export const deleteLogicoComercio = async (uid_comercio) => {
    try {
      const response = await fetch(`${API_URL}/baja/${uid_comercio}`, {
        method: "DELETE"
      });
  
      if (response.ok) {
        console.log(`Ha sido de baja el comercio: ${uid_comercio}`);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Error ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error al dar de baja comercio:", error);
      throw error;
    }
  };

  export const putComercio = async (uid_comercio, data) => {
      try {
        const response = await fetch(`${API_URL}/${uid_comercio}`, {
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
        console.log(`Comercio ${uid_comercio} actualizado con exito!`)
        return await response.json();
      } catch (error) {
        console.error("Error al modificar comercio:", error);
        throw error;
      }
    };

    export const getComerciosForMaps = async () => {
      try {
        const response = await fetch(`${API_URL}/maps`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Error ${response.status}: ${response.statusText}`
          );
        }
        return await response.json();
      } catch (error) {
        console.error("Error al obtener comercios:", error);
        throw error;
      }
    };