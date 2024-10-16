import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerController({
  name,
  control,
  title,
  label,
  errors,
}) {
  const [images, setImages] = useState([]);
  const { width } = useWindowDimensions(); //para tener el width de el dispositivo que esta usando la app

  const pickImages = async (onChange) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        // allowsEditing: true,
        selectionLimit: 2,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(JSON.stringify(result, null, 2));
      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => asset.uri); // Obtener las URIs de las imágenes
        setImages(selectedImages); // Actualizar el estado local
        onChange(selectedImages); // Pasar las imágenes seleccionadas al formulario
      }
    } catch (error) {
      console.error("Error al seleccionar imágenes:", error.message);
    }
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={( {field: { onChange, value }}) => (
          <FlatList
            data={images}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              <Image
                source={{ uri: item }}
                style={{ width: width, height: 250, marginVertical: 5 }}
              />;
            }}
            ListHeaderComponent={
              <View>
                <Text>Imagenes</Text>
                <Button title={title} onPress={() => pickImages(onChange)} />
              </View>
            }
          />
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
    justifyContent: "space-between",
    color: "red",
    marginBottom: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
});
