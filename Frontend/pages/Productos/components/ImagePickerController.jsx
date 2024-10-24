import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BotonGenerico from '../../../components/BotonGenerico';

export default function ImagePickerController({
  name,
  control,
  title,
  errors,
}) {
  const [images, setImages] = useState([]);
  const { width } = useWindowDimensions();

  const pickImages = async (onChange) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 2,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        setImages(selectedImages);
        onChange(selectedImages);
      }
    } catch (error) {
      console.error('Error al seleccionar imágenes:', error.message);
    }
  };

  const removeImage = (uri) => {
    const updatedImages = images.filter((image) => image !== uri);
    setImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <View>
            <BotonGenerico title={title} onPress={() => pickImages(onChange)} />

            <FlatList
              data={images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item }}
                    style={styles.image}
                    resizeMode="cover" // Cambia esto a "contain" si prefieres ver toda la imagen
                  />
                  {/* Botón de eliminación como una cruz */}
                  <TouchableOpacity
                    onPress={() => removeImage(item)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeImageText}>✖</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListHeaderComponent={null}
            />
          </View>
        )}
      />
      {errors && errors[name] && (
        <Text style={styles.inputError}>{errors[name].message}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  inputError: {
    justifyContent: 'space-between',
    color: 'red',
    marginBottom: 20,
    marginTop: 10,
    padding: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible
    height: 250, // Mantén una altura fija para el contenedor de imágenes
  },
  image: {
    width: '100%', // Asegura que la imagen ocupe todo el ancho del contenedor
    height: '100%', // Asegura que la imagen ocupe toda la altura del contenedor
    borderRadius: 10, // Bordes redondeados (opcional)
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  removeImageText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
