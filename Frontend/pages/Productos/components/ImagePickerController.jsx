import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { FlatList, StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerController({ name, control, title, errors }) {
  const [images, setImages] = useState([]);

  const pickImages = async (onChange) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 5, // Permitir hasta 5 imágenes
        quality: 0.5,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setImages([...images, ...selectedImages]); // Agregar las nuevas imágenes a las existentes
        onChange([...images, ...selectedImages]);  // Pasar las imágenes seleccionadas al formulario
      }
    } catch (error) {
      console.error("Error al seleccionar imágenes:", error.message);
    }
  };

  const removeImage = (uri) => {
    const filteredImages = images.filter((image) => image !== uri);
    setImages(filteredImages);
    control.setValue(name, filteredImages); // Actualizar el valor en el formulario
  };

  return (
    <View>
      <Button title={title} onPress={() => pickImages(control.setValue)} color={'#ff6347'} />
      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(item)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {errors[name] && <Text style={styles.inputError}>{errors[name].message}</Text>}
    </View>
  );
}

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
