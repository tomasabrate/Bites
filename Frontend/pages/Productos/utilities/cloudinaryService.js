// cloudinaryService.js
export const uploadImagesToCloudinary = async (images) => {
  const uploadUrl = 'https://api.cloudinary.com/v1_1/dturrtxzx/image/upload';
  const uploadPreset = 'ml_default';

  const uploadPromises = images.map(async (imageUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product-image.jpg',
    });
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.secure_url; // URL de la imagen subida
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      return null; // Manejar errores en la subida
    }
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls.filter((url) => url !== null); // Retornar solo las URLs válidas
};
