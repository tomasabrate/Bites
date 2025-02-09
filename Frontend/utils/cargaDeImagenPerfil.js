import axios from "axios";

export const CargaDeImagenPerfil = async (imageUri) => {
  try {
    let imageUrl = null;
    console.log('Imagen:', imageUri);
    
    if (imageUri.startsWith('http')) {
      imageUrl = imageUri;
    } else {
      const formDataImagen = new FormData();
      formDataImagen.append('file', imageUri); // Asegúrate de que es un base64 o URI completo
    }
    formDataImagen.append('upload_preset', 'BitesPreset');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dturrtxzx/image/upload',
        formDataImagen
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  } catch (error) {
    console.error("Error al cargar las imagen:", error);
  }
};
