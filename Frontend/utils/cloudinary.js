/*
export const uploadToCloudinary = async (image) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image.uri,
    type: image.type,
    name: image.fileName || 'image.jpg',
  });
  formData.append('upload_preset', 'BitesPreset');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dturrtxzx/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error.message || 'Error uploading image');
    }

    return result.secure_url; // Asegúrate de usar `secure_url`
  } catch (error) {
    console.error('Error en uploadToCloudinary:', error);
    throw error; // Lanza el error para manejarlo en `handleImageUpload`
  }
};
*/
const uploadToCloudinary = async (image) => {
  if (!image || !image.uri) {
    throw new Error('Invalid image format');
  }

  const data = new FormData();
  data.append('file', {
    uri: image.uri,
    type: image.type || 'image/jpeg', // Default fallback
    name: image.fileName || 'upload.jpg',
  });
  data.append('upload_preset', 'BitesPreset');
  data.append('cloud_name', 'dturrtxzx');

  try {
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dturrtxzx/image/upload',
      {
        method: 'POST',
        body: data,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};
