import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ZorritoSelector from '../components/zorritoSelector'; // Asegúrate de importar el selector
import ZorritoForm from '../components/ZorritoForm'; // Importa el formulario

const ClienteProfile = ({ navigation }) => { // Añadido 'navigation' como prop
  const [selectedZorrito, setSelectedZorrito] = useState(null);
  const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const handleZorritoSelect = (zorrito) => {
    setSelectedZorrito(zorrito);
    setShowForm(true); // Muestra el formulario al seleccionar un zorrito
  };

  const handleFormSubmit = (formData) => {
    console.log('Datos enviados:', formData);
    // Aquí puedes manejar los datos del formulario, como enviarlos a una API
    setShowForm(false); // Ocultar el formulario después de enviar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Cliente</Text>
      <ZorritoSelector onSelect={handleZorritoSelect} />
      {showForm && <ZorritoForm onSubmit={handleFormSubmit} />}
      {selectedZorrito && (
        <Text style={styles.selectedZorritoText}>Zorrito seleccionado.</Text>
      )}
      
      {/* Botón para navegar al perfil */}
      <Button
        title="Ver Perfil"
        onPress={() => navigation.navigate('Perfil')} // Navega a la pantalla de perfil
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedZorritoText: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default ClienteProfile;
