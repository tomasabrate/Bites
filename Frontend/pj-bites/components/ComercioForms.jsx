import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ComercioForm = ({ onSubmit }) => {
  const [businessName, setBusinessName] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleSubmit = () => {
    const formData = { businessName, photo };
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Comercio"
        value={businessName}
        onChangeText={setBusinessName}
      />
      {/* Aquí puedes añadir la lógica para subir una imagen */}
      <Button title="Subir Foto del Comercio" onPress={() => {/* Lógica para subir foto */}} />
      <Button title="Crear Cuenta" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: '90%',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
});

export default ComercioForm;
