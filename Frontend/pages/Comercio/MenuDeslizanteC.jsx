import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from "@react-navigation/native";
import ModalCerrarSesion from '../../components/ModalCerrarSesion';

const MenuDeslizanteC = ({ setPaginaActual }) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [modalCSVisible, setModalCSVisible] = useState(false);

  return (
    <View style={styles.menu}>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('PerfilComercio')}>
        <Icon name="user" size={20} color="#000" />
        <Text style={styles.menuText}>Mi Perfil</Text>
      </TouchableOpacity>

      {/* NUEVO: Información del comercio */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('InfoPerfilComercio', { uid_comercio: user.uid })}
      >
        <Icon name="info-circle" size={20} color="#000" />
        <Text style={styles.menuText}>Información del comercio</Text>
      </TouchableOpacity>

      {/* NUEVO: Editar información del perfil */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('EditarPerfilComercio', { uid_comercio: user.uid })}
      >
        <Icon name="edit" size={20} color="#000" />
        <Text style={styles.menuText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setPaginaActual("Dashboard")}>
        <Icon name="bar-chart" size={20} color="#000" />
        <Text style={styles.menuText}>Estadísticas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setPaginaActual("Reportes")}>
        <Icon name="line-chart" size={20} color="#000" />
        <Text style={styles.menuText}>Reportes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setPaginaActual("MisVentas")}>
        <Icon name="bookmark" size={20} color="#000" />
        <Text style={styles.menuText}>Mis Ventas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => setModalCSVisible(true)}>
        <Icon name="sign-out" size={20} color="#000" />
        <Text style={styles.menuText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <ModalCerrarSesion
        visible={modalCSVisible}
        onClose={() => setModalCSVisible(false)}
      />

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MenuDeslizanteC;