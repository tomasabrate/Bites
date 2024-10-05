import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Perfil() {
  // Aquí podrías obtener información del perfil del usuario
  const userInfo = {
    name: 'Juan Perez',
    email: 'juan.perez@example.com',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>
      <Text style={styles.label}>Nombre: {userInfo.name}</Text>
      <Text style={styles.label}>Email: {userInfo.email}</Text>
      {/* Puedes agregar más campos o botones para editar */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffeae6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
