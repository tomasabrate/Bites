// Carrusel.jsx
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const Carrusel = () => {
  const images = [
    require('../assets/carrucel/1.png'),
    require('../assets/carrucel/2.png'),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1)); // Valor inicial de opacidad

  useEffect(() => {
    const interval = setInterval(() => {
      fadeAnim.setValue(0); // Comienza la animación de desvanecimiento
      Animated.timing(fadeAnim, {
        toValue: 1, // Termina en opacidad completa
        duration: 1000, // Duración de la animación
        useNativeDriver: true,
      }).start();

      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length); // Cambia de imagen
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [fadeAnim, images.length]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={images[currentIndex]}
        style={[styles.image, { opacity: fadeAnim }]} // Aplicar el estilo de opacidad
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Ocupa todo el ancho
    height: 200, // Altura del carrusel
    overflow: 'hidden', // Oculta el desbordamiento
  },
  image: {
    width: '100%', // Ocupa todo el ancho
    height: '100%', // Ocupa toda la altura del contenedor
    borderRadius: 10,
  },
});

export default Carrusel;
