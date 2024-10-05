import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione una Opción</Text>
      <Button 
        title="Iniciar Sesión" 
        onPress={() => navigation.navigate('Login', { isRegistering: false })} 
      />
      <Button 
        title="Registrarse como Cliente" 
        onPress={() => navigation.navigate('Login', { isRegistering: true })} 
      />
      <Button 
        title="Registrar como Comercio" 
        onPress={() => navigation.navigate('ComercioProfile')} // Asegúrate de que este sea el nombre correcto
      />
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
