import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuDesplegable = () => {
  return (
    <View style={styles.menu}>
      <TouchableOpacity><Text style={styles.menuItem}>Mi Perfil</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.menuItem}>Configuraciones</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.menuItem}>Cerrar Sesión</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 60, // Cambia esta posición si es necesario
    left: 0,
    width: 200,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5, // Para Android
    zIndex: 10, // Asegúrate de que el menú esté delante
  },
  menuItem: { fontSize: 16, paddingVertical: 10 },
});

export default MenuDesplegable;
