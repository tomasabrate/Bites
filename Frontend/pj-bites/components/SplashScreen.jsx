import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Simulamos una carga de 2 segundos antes de pasar a la siguiente pantalla
    const timer = setTimeout(() => {
      onFinish(); // Llama a la función para terminar la carga
    }, 2000); // Cambia este tiempo según lo necesites

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bites</Text>
      <Image
        source={require('../assets/xorrito.jpg')} // Asegúrate de que esta ruta sea correcta
        style={styles.zorrito}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffeae6',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  zorrito: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
});

export default SplashScreen;
