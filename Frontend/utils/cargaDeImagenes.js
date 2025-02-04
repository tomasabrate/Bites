//Imagenes
// import { uploadImageToCloudinary } from "../../utils/cloudinary";

import axios from "axios";

export const CargaDeImagenes = async (data) => {
  try {
    console.log("Contenido de data.imagenes:", data.imagenes);
    console.log(
      "Tipo de data.imagenes:",
      Array.isArray(data.imagenes) ? "Array" : typeof data.imagenes
    );

    const urlsImagenes = await Promise.all(
      (data.imagenes || []).map(async (imagen) => {
        const formData = new FormData();
        formData.append("file", imagen); // Asegúrate de que es un base64 o URI completo
        formData.append("upload_preset", "BitesPreset");

        try {
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dturrtxzx/image/upload",
            formData
          );
          return response.data.secure_url;
        } catch (error) {
          console.error("Error subiendo imagen:", error);
          return null; // Retorna null para excluirla si falla
        }
      })
    );

    const validUrlsImagenes = urlsImagenes.filter((url) => url !== null);

    // // Verifica si se subieron imágenes
    // if (validUrlsImagenes.length === 0) {
    //   showAlert('No se pudo cargar ninguna imagen. Intenta nuevamente.');
    //   return;
    // }

    // Si solo hay una imagen, enviar solo la URL
    if (validUrlsImagenes.length === 1) {
      console.log("se envio la imagen [0]")
      return validUrlsImagenes[0]; // Enviar solo la URL
    } else {
      // Si hay más de una, unirlas con ';'
      return validUrlsImagenes.join(";");
    }
  } catch (error) {
    console.error("Error al cargar las imágenes:", error);
  }
};
