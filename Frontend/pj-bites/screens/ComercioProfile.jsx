import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ComercioForm from '../components/ComercioForms'; // Asegúrate de que la ruta sea correcta

const ComercioProfile = ({ navigation }) => {
  const handleFormSubmit = (formData) => {
    console.log('Datos del Comercio:', formData);
    // Aquí puedes manejar el registro del comercio, como enviarlo a un backend
  };

  return (
    <View style={styles.container}>
      <ComercioForm onSubmit={handleFormSubmit} />
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
});

export default ComercioProfile;
