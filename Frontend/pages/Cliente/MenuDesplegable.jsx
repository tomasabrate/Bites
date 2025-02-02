import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // O la familia de íconos que prefieras
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from "@react-navigation/native";

const MenuDesplegable = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PerfilCliente')}>
        <Icon name="user" size={20} color="#000" />
        <Text style={styles.menuText}>Mi Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="cog" size={20} color="#000" />
        <Text style={styles.menuText}>Configuraciones</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={async () => {
          try {
            await logout();
            navigation.navigate('Login');
            console.log('Sesion cerrada');
          } catch (error) {
            console.error('No se pudo cerrar sesión:', error);
          }
        }}
      >
        <Icon name="sign-out" size={20} color="#000" />
        <Text style={styles.menuText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    top: 60,
    left: 0,
    width: 220,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: 'row', // Para alinear el ícono y el texto en fila
    alignItems: 'center', // Centrar ícono y texto verticalmente
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10, // Espacio entre el ícono y el texto
    fontSize: 16,
  },
});

export default MenuDesplegable;
