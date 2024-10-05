// CargarProducto.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CargarProducto = ({ onSubmit }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState(null);
  const [fechaElaboracion, setFechaElaboracion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const formData = {
      nombre,
      precio,
      foto,
      fechaElaboracion,
      fechaVencimiento,
    };
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del Producto"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Subir Foto del Producto" onPress={pickImage} />
      {foto && <Image source={{ uri: foto }} style={styles.image} />}
      <TextInput
        placeholder="Fecha de Elaboración (YYYY-MM-DD)"
        value={fechaElaboracion}
        onChangeText={setFechaElaboracion}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de Vencimiento (YYYY-MM-DD)"
        value={fechaVencimiento}
        onChangeText={setFechaVencimiento}
        style={styles.input}
      />
      <Button title="Agregar Producto" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default CargarProducto;
