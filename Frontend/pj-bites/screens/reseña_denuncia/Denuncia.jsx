import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const Denuncia = ({ onSubmit, onCancel }) => {
  const [descripcion, setDescripcion] = useState('');
  const [consumido, setConsumido] = useState(null);
  const [malestar, setMalestar] = useState(null);
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (descripcion.trim() === '') {
      setError('La descripción es requerida.');
      return;
    }

    if (onSubmit) {
      onSubmit({ descripcion, consumido, malestar, foto });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleMalestar = (value) => {
    setMalestar(value);
    if (consumido === true && value === true) {
      Alert.alert(
        'Alerta',
        'Se recomienda que te dirijas al hospital más cercano.',
        [{ text: 'Entendido' }]
      );
    }
  };

  const getButtonStyles = (selected) => ({
    backgroundColor: selected ? '#FFB6C1' : '#FFFFFF', // Rojo salmón si está seleccionado
    padding: 10,
    borderRadius: 5,
    margin: 5,
  });

  const getButtonTextStyles = (selected) => ({
    color: selected ? '#000000' : '#000000', // Color del texto
    fontWeight: 'bold',
    textAlign: 'center',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Realiza una Denuncia</Text>

      <Text>Descripción:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        rows={4}
        value={descripcion}
        onChangeText={setDescripcion}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text>¿Consumiste el producto?</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity style={getButtonStyles(consumido === true)} onPress={() => setConsumido(true)}>
          <Text style={getButtonTextStyles(consumido === true)}>Sí</Text>
        </TouchableOpacity>
        <TouchableOpacity style={getButtonStyles(consumido === false)} onPress={() => setConsumido(false)}>
          <Text style={getButtonTextStyles(consumido === false)}>No</Text>
        </TouchableOpacity>
      </View>

      {consumido === true && (
        <>
          <Text>¿Sentiste algún malestar?</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity style={getButtonStyles(malestar === true)} onPress={() => handleMalestar(true)}>
              <Text style={getButtonTextStyles(malestar === true)}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={getButtonStyles(malestar === false)} onPress={() => handleMalestar(false)}>
              <Text style={getButtonTextStyles(malestar === false)}>No</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <Button title="Subir foto del producto" onPress={pickImage} style={styles.uploadButton} />
      {foto && <Text style={styles.photoText}>Foto seleccionada: {foto}</Text>}

      <View style={styles.buttonContainer}>
        <Button title="Enviar Denuncia" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={onCancel} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 24, marginBottom: 16 },
  textArea: { borderWidth: 1, borderRadius: 8, padding: 8, height: 100, marginBottom: 16 },
  error: { color: 'red', marginBottom: 16 },
  radioContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  photoText: { marginTop: 8, color: 'green' },
  buttonContainer: { 
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default Denuncia;
