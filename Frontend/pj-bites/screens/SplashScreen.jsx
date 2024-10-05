import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Temporizador para navegar a la siguiente pantalla después de 2 segundos
    const timer = setTimeout(() => {
      navigation.navigate('Intro'); // Cambia 'Intro' al nombre de la pantalla a la que quieras navegar
    }, 2000); // 2000 ms = 2 segundos

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/xorrito.jpg')} // Ajusta la ruta del zorrito si es necesario
        style={styles.zorritoImage}
      />
      <Text style={styles.title}>Bites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Fondo blanco
  },
  zorritoImage: {
    width: 100,  // Ajusta el tamaño según lo necesites
    height: 100, // Ajusta el tamaño según lo necesites
    marginBottom: 20, // Espacio entre el zorrito y el título
  },
  title: {
    fontSize: 48, // Tamaño de fuente grande
    fontWeight: 'bold',
    color: '#000', // Color del texto negro
  },
});
