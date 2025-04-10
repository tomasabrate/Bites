import axios from "axios";

export const CargaDeImagenPerfil = async (imageUri) => {
  try {
    let imageUrl = null;
    let formDataImagen = null;
    console.log('Imagen:', imageUri);

    if (imageUri.startsWith('http')) {
      imageUrl = imageUri;
    } else {
      formDataImagen = new FormData();

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], 'profile_image.jpg', { type: 'image/jpeg' });
      formDataImagen.append('file', file);
    }

    if (formDataImagen) {
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
    } else {
      return imageUrl;
    }
  } catch (error) {
    console.error("Error al cargar las imagen:", error);
    return null;
  }
};