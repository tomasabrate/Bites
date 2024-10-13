import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CargarProducto = ({ onSubmit, idVendedor }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [foto, setFoto] = useState(null);
  const [fechaProduccion, setFechaProduccion] = useState(''); // Cambiado el nombre
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [tipo, setTipo] = useState('');

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
      id_vendedor: idVendedor, // Se toma del contexto del usuario autenticado
      nombre,
      precio,
      foto, // Esto se enviará al backend, que debe manejarlo
      fecha_produccion: fechaProduccion,
      fecha_vencimiento: fechaVencimiento,
      cantidad,
      tipo,
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
        placeholder="Fecha de Producción (YYYY-MM-DD)"
        value={fechaProduccion}
        onChangeText={setFechaProduccion}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha de Vencimiento (YYYY-MM-DD)"
        value={fechaVencimiento}
        onChangeText={setFechaVencimiento}
        style={styles.input}
      />
      <TextInput
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Tipo de Producto"
        value={tipo}
        onChangeText={setTipo}
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
