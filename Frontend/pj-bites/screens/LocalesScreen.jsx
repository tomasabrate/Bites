// Locales.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import Mapa from './MapaScreen'; // Asegúrate de la ruta correcta

const Locales = ({ navigation }) => {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener locales del backend
  const obtenerLocales = async () => {
    try {
      const response = await fetch('http://localhost:3000/locales'); 
      const data = await response.json();
      setLocales(data);
    } catch (error) {
      console.error('Error al obtener locales:', error);
      setError('Error al obtener locales. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerLocales();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Locales Disponibles</Text>
      {loading ? (
        <Text style={styles.loadingText}>Cargando locales...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={locales}
          keyExtractor={(item) => item.id_local.toString()}
          renderItem={({ item }) => (
            <View style={styles.localCard}>
              <Text style={styles.localName}>{item.nombre}</Text>
              <Button
                title="Ver Productos"
                onPress={() => navigation.navigate('Productos', { localId: item.id_local })}
                color="#FF6347"
              />
            </View>
          )}
        />
      )}
      
      {/* Mapa de productos activos */}
      <Mapa />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C8102E',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
  },
  localCard: {
    marginBottom: 15,
    padding: 20,
    backgroundColor: '#FFE6E6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8102E',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  localName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C8102E',
  },
});

export default Locales;