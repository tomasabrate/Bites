import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Asegúrate de instalar este paquete

const Reseña = ({ onSubmit, onCancel }) => {
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(0);
  const [foto, setFoto] = useState(null);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ comentario, calificacion, foto });
    }
  };

  const pickImage = async () => {
    // Permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Es necesario acceder a la galería para seleccionar una foto.");
      return;
    }

    // Seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync();
    
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deja tu Reseña</Text>

      {/* Calificación (estrellas) */}
      <Text style={styles.label}>Calificación:</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setCalificacion(star)}>
            <Text style={calificacion >= star ? styles.starSelected : styles.star}>★</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Comentario */}
      <Text style={styles.label}>Comentario:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        value={comentario}
        onChangeText={setComentario}
      />

      {/* Botón para subir foto */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Subir Foto</Text>
      </TouchableOpacity>
      {foto && <Image source={{ uri: foto }} style={styles.imagePreview} />}

      <View style={styles.buttonContainer}>
        <Button title="Enviar Reseña" onPress={handleSubmit} color="#ff4500" />
        <Button title="Cancelar" onPress={onCancel} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffeae6', // Fondo salmón claro
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: "#ff4500", // Color rojo
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333", // Color gris oscuro
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    fontSize: 32,
    color: '#ccc', // Color gris para estrellas no seleccionadas
    marginRight: 5,
  },
  starSelected: {
    fontSize: 32,
    color: '#ffcc00', // Color amarillo para estrellas seleccionadas
    marginRight: 5,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    height: 100,
    marginBottom: 16,
    backgroundColor: '#fff', // Fondo blanco
  },
  uploadButton: {
    backgroundColor: '#ffcccb', // Color salmón claro
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#333', // Color del texto
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Reseña;
