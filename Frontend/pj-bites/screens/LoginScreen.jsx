import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ZorritoForm from '../components/ZorritoForm'; // Asegúrate de que la ruta sea correcta

export default function LoginScreen({ route }) {
  const { isRegistering } = route.params; // Obtener el parámetro de la navegación
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const handleSubmit = (formData) => {
    if (isRegistering) {
      // Lógica para registrar al usuario
      console.log('Registrando usuario:', formData);
      // Puedes agregar lógica para enviar datos a tu API aquí
    } else {
      // Lógica para iniciar sesión
      console.log('Iniciando sesión con:', formData); // Aquí puedes obtener email y contraseña
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</Text>
      {isRegistering ? (
        <ZorritoForm onSubmit={handleSubmit} />
      ) : (
        <>
          {/* Aquí puedes agregar campos para iniciar sesión si no es registro */}
          <Text style={styles.subtext}>Iniciar sesión con tu email y contraseña:</Text>
          {/* Campos para email y contraseña */}
          <Button title="Iniciar Sesión" onPress={() => handleSubmit({ email: 'example@example.com', password: 'password' })} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtext: {
    marginBottom: 20,
    fontSize: 16,
  },
});
