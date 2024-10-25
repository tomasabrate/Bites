import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ImageBackground } from 'react-native';

export default function IntroScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollY, {
        toValue: 1,
        duration: 15000,
        useNativeDriver: true,
      })
    ).start();
  }, [scrollY]);

  const translateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -windowHeight],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { transform: [{ translateY }] }]}>
        <ImageBackground
          source={require('../assets/fondos/fondo 2.png')}
          style={styles.background}
          resizeMode="cover"
        />
        <ImageBackground
          source={require('../assets/fondos/fondo 2.png')}
          style={styles.background}
          resizeMode="cover"
        />
      </Animated.View>

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bites</Text>
          <Text style={styles.subtitle}>Uniendo sabores y oportunidades</Text>
        </View>

        <TouchableOpacity 
          style={styles.customButton} 
          onPress={() => navigation.navigate('LoginSelection')}
        >
          <Text style={styles.buttonText}>Comenzar a Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 48, // Tamaño más grande
    fontWeight: 'bold', // Usar negrita
    color: '#FF6347',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20, // Tamaño ajustado
    fontStyle: 'italic', // Texto en cursiva
    color: '#333',
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    marginTop: 20, // Espacio entre el texto y el botón
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
