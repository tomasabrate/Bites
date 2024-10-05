import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido a Bites</Text>
      <Text style={styles.subtext}>Una app para mejorar tu experiencia de compra</Text>
      <Text style={styles.slogan}>Conectando sabores y oportunidades</Text>
      <Button 
        title="Comenzar" 
        onPress={() => navigation.navigate('LoginSelection')} 
      />
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 18,
    marginBottom: 20,
  },
  slogan: {
    fontSize: 16,
    color: 'red', // Letras rojas
    marginBottom: 20,
  },
});
