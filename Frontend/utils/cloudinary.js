import axios from 'axios';

// Cambia <tu_cloud_name> y <upload_preset> con los valores correctos
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dturrtxzx/image/upload';
const UPLOAD_PRESET = 'BitesPreset';

export const uploadImageToCloudinary = async (image) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: image.uri, // URI de la imagen
      type: image.type || 'image/jpeg', // Tipo MIME
      name: image.fileName || 'image.jpg', // Nombre del archivo
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    console.log('Archivo a subir:', image); // Aquí imprimimos la imagen
    console.log('Datos enviados a Cloudinary:', formData);

    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.secure_url; // URL de la imagen subida
  } catch (error) {
    console.error('Error al subir la imagen:', error.response?.data || error);
    throw error;
  }
};
