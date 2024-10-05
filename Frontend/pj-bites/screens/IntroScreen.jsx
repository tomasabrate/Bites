import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function IntroScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Bites</Text>
      <Text style={styles.subtitle}>Una app para mejorar tu experiencia de compra</Text>
      <Text style={styles.slogan}>Conectando sabores y oportunidades</Text>
      <Button 
        title="Comenzar" 
        onPress={() => navigation.navigate('LoginSelection')} 
        color="#FF6347" // Color del botón en rojo
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
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF6347', // Tono rojo
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#555', // Color gris para el subtítulo
    textAlign: 'center',
    marginBottom: 20,
  },
  slogan: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FF6347', // Tono rojo
    marginBottom: 30,
    textAlign: 'center',
  },
});
