import React, { useState } from 'react';
import { View, Button, Image, FlatList, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerController = ({ onChange, images }) => {
  const [selectedImages, setSelectedImages] = useState(images || []);

  const pickImages = async () => {
    // Permitir que el usuario seleccione múltiples imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Permitir selección múltiple
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Actualiza el estado local y llama a onChange para notificar al componente padre
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages(newImages);
      onChange(newImages); // Asegúrate de que onChange esté correctamente definido en el componente padre
    }
  };

  return (
    <View>
      <Button title="Seleccionar Imágenes" onPress={pickImages} />
      <FlatList
        data={selectedImages}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={{ width: 100, height: 100 }} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputError: {
    color: 'red',
    marginBottom: 5,
    fontSize: 12,
  },
});
