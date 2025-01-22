import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BotonGenerico from '../../../components/BotonGenerico';
import { set } from '@react-native-firebase/database';

export default function ImagePickerController({
  name,
  control,
  title,
  label,
  errors,
  setImagenes,
}) {
  const [images, setImages] = useState([]);

  const pickImages = async (onChange) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        // allowsEditing: true,
        //selectionLimit: 1,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(JSON.stringify(result, null, 2));
      if (result.cancelled) {
        const selectedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image/jpeg',
          name: asset.uri.split('/').pop() || 'image.jpg',
        })); // Obtener las URIs de las imágenes
        setImages(selectedImages); // Actualizar el estado local
        onChange(selectedImages); // Pasar las imágenes seleccionadas al formulario
        setImagenes(selectedImages);
      }
    } catch (error) {
      console.error('Error en pickImages:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <View style={styles.buttonContainer}>
            <BotonGenerico title={title} onPress={() => pickImages(onChange)} />
          </View>
        )}
      />
      {errors && errors[name] && (
        <Text style={styles.inputError}>{errors[name].message}</Text>
      )}
      {images.length > 0 && (
        <FlatList
          data={images}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageListContainer}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
        />
      )}
    </View>
  );
}

const width = Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  buttonContainer: {
    marginBottom: 15,
    height: 70,
  },
  inputError: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  imageListContainer: {
    paddingVertical: 10,
    height: width * 0.6,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
