import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importar funciones de Firebase Authentication

const ReseñaForm = () => {
  const [nombre_comercio, setNombreComercio] = useState('');
  const [puntuacion, setPuntuacion] = useState('');
  const [comentario, setComentario] = useState('');
  const [uid_cliente, setUidCliente] = useState(null); // Estado para el UID del cliente

  // Función para obtener el UID del cliente desde Firebase Auth
  const obtenerUidCliente = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUidCliente(user.uid); // Si el usuario está autenticado, guardamos el UID
      } else {
        Alert.alert('Error', 'No hay usuario autenticado');
      }
    });
  };

  // Llamar a obtenerUidCliente cuando el componente se monte
  useEffect(() => {
    obtenerUidCliente();
  }, []);

  // Función para obtener el UID del comercio
  const obtenerUidComercio = async (nombre_comercio) => {
    try {
      const response = await fetch(`http://localhost:3000/comercios/nombre?nombre_comercio=${nombre_comercio}`);
      const data = await response.json();

      console.log('Respuesta de obtenerUidComercio:', data);

      // Revisar si la respuesta es exitosa y contiene un uid_comercio
      if (response.ok && data.uid_comercio) {
        return data.uid_comercio;
      } else {
        // Mostrar error si no se encuentra el comercio
        Alert.alert('Error', 'Comercio no encontrado');
        return null;
      }
    } catch (error) {
      console.log('Error al obtener UID del comercio:', error);
      Alert.alert('Error', 'Hubo un problema al buscar el comercio');
      return null;
    }
  };

  const enviarReseña = async () => {
    // Validar que todos los campos estén completos
    if (!nombre_comercio || !puntuacion || !comentario) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
  
    const uid_comercio = await obtenerUidComercio(nombre_comercio);
    if (!uid_comercio) return; // Si no se obtiene el UID del comercio, no se envía la reseña
  
    if (!uid_cliente) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }
  
    console.log('Datos a enviar:', { uid_cliente, uid_comercio, puntuacion, comentario });
  
    // Obtener el token de Firebase
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'No se encuentra autenticado');
      return;
    }
  
    try {
      const token = await user.getIdToken(); // Obtiene el token del usuario
  
      // Intentar enviar la reseña a la API con el token en los encabezados
      const response = await fetch('http://localhost:3000/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Enviar el token en los encabezados
        },
        body: JSON.stringify({ uid_cliente, uid_comercio, puntuacion, comentario }),
      });
  
      const data = await response.json();
  
      // Comprobar si la respuesta fue exitosa
      if (response.ok) {
        Alert.alert('Éxito', 'Reseña guardada correctamente');
        // Limpiar los campos del formulario
        setNombreComercio('');
        setPuntuacion('');
        setComentario('');
      } else {
        Alert.alert('Error', data.error || 'Error desconocido');
      }
    } catch (error) {
      // Manejo de errores en caso de fallo de la solicitud
      Alert.alert('Error', 'No se pudo enviar la reseña');
      console.error('Error al enviar la reseña:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre del Comercio:</Text>
      <TextInput
        style={styles.input}
        value={nombre_comercio}
        onChangeText={setNombreComercio}
        placeholder="Escribe el nombre del comercio"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Calificación (1-5):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={puntuacion}
        onChangeText={setPuntuacion}
        placeholder="Ingresa un número"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Comentario:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={comentario}
        onChangeText={setComentario}
        multiline
        placeholder="Escribe tu comentario..."
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={enviarReseña}>
        <Text style={styles.buttonText}>Enviar Reseña</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReseñaForm;
