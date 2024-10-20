import React from 'react';
import { View, StyleSheet, Text, FlatList, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Mapa = () => {
  const navigation = useNavigation();

  // Lista de locales activos como ejemplo
  const localesActivos = [
    { id: '1', nombre: 'Local 1' },
    { id: '2', nombre: 'Local 2' },
    { id: '3', nombre: 'Local 3' },
    // Agrega más locales según sea necesario
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.mapText}>Lista de Locales Activos</Text>
      <FlatList
        data={localesActivos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.localContainer}>
            <Text style={styles.localText}>{item.nombre}</Text>
          </View>
        )}
      />

      {/* Cartel para el mapa de Google Maps */}
      <Text style={styles.mapPlaceholder}>Acá va el mapa de Google Maps</Text>

      {/* Botón para volver atrás */}
      <Button title="Volver atrás" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  mapText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  localContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    borderRadius: 4,
  },
  localText: {
    fontSize: 16,
  },
  mapPlaceholder: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Mapa;
