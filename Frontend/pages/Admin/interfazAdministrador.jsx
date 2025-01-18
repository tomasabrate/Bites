import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, ActivityIndicator, StyleSheet, Alert, TextInput, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import firebaseApp from '../../firebase_config';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { getAuth } from "firebase/auth";

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const navItems = [
  { name: 'Dashboard', icon: 'bar-chart' },
  { name: 'Productos', icon: 'dropbox' },
  { name: 'Pedidos', icon: 'credit-card' },
  { name: 'Mostrar Usuarios', icon: 'users' },
  { name: 'Denuncias y Soporte', icon: 'exclamation-triangle' },
  { name: 'Configuración', icon: 'cog' },

];

export default function InterfazAdministrador() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);


  const navigation = useNavigation();
  const { logout } = useAuth();

  const user = auth.currentUser;

  const fetchProductsSQL = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/productos');
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usuariosRef = collection(firestore, 'usuarios');
      const q = query(
        usuariosRef,
        where('rol', 'in', ['Comercio', 'Cliente']),
        where('perfilCompleto', '==', true),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usersList);
      setFilteredUsuarios(usersList);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeNav === 'Mostrar Usuarios') {
      if (user) {
        fetchUsers();
      } else {
        console.error("Usuario no autenticado");
      }
    } else if (activeNav === 'Productos') {
      fetchProductsSQL();
    }
  }, [activeNav]);

  useEffect(() => {
    let updatedUsers = usuarios;

    if (searchEmail) {
      updatedUsers = updatedUsers.filter(user =>
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (filterRole) {
      updatedUsers = updatedUsers.filter(user => user.rol === filterRole);
    }

    setFilteredUsuarios(updatedUsers);
  }, [searchEmail, filterRole, usuarios]);

  const handleNavigation = (screenName) => {
    setActiveNav(screenName);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate("Login");
      console.log("Sesión de administrador cerrada");
    } catch (error) {
      console.error('No se pudo cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar la sesión. Por favor, intente de nuevo.');
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#f3f4f6' }}>
      <View style={{ width: 250, backgroundColor: '#ffffff' }}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#f87171' }}>Bites Administrador</Text>
        </View>
        <ScrollView style={{ marginTop: 16 }}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: activeNav === item.name ? '#fee2e2' : 'transparent',
              }}
              onPress={() => handleNavigation(item.name)}
            >
              <Icon name={item.icon} size={20} color={activeNav === item.name ? '#f87171' : '#374151'} />
              <Text style={{ marginLeft: 12, color: activeNav === item.name ? '#f87171' : '#374151', fontWeight: activeNav === item.name ? '600' : 'normal' }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#ffffff', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151' }}>{activeNav}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="bell" size={20} style={{ marginRight: 16 }} />
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="sign-out" size={20} color="#ffffff" />
              <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {activeNav === 'Dashboard' && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <View style={{ width: '30%', marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Productos Activos</Text>
                <Icon name="dropbox" size={24} color="#9ca3af" />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>45</Text>
              </View>
              <View style={{ width: '30%', marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Pedidos Pendientes</Text>
                <Icon name="credit-card" size={24} color="#9ca3af" />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>12</Text>
              </View>
              <View style={{ width: '30%', marginBottom: 16, padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Denuncias Recientes</Text>
                <Icon name="exclamation-triangle" size={24} color="#9ca3af" />
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>5</Text>
              </View>
            </View>
          )}
          {activeNav === 'Mostrar Usuarios' && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Lista de Usuarios</Text>
              <TextInput
                style={styles.input}
                placeholder="Buscar por correo..."
                value={searchEmail}
                onChangeText={(text) => setSearchEmail(text)}
              />
              <Picker
                selectedValue={filterRole}
                style={styles.picker}
                onValueChange={(itemValue) => setFilterRole(itemValue)}
              >
                <Picker.Item label="Todos los roles" value="" />
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Comercio" value="Comercio" />
                <Picker.Item label="Cliente" value="Cliente" />
              </Picker>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ff6347" />
                  <Text style={styles.loadingText}>Cargando usuarios...</Text>
                </View>
              ) : (
                <FlatList
                  data={filteredUsuarios}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Pressable style={styles.userContainer} onPress={() => navigation.navigate('DetalleUsuario', { user: item })}>
                      <Text style={styles.userText}>Correo: {item.email}</Text>
                      <Text style={styles.userText}>Rol: {item.rol}</Text>
                    </Pressable>
                  )}
                />
              )}
            </View>
          )}
          {activeNav === 'Productos' && (
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Lista de Productos</Text>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ff6347" />
                  <Text style={styles.loadingText}>Cargando productos...</Text>
                </View>
              ) : (
                <FlatList
                  data={productos}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.productContainer}>
                      <Text style={styles.productText}>Nombre: {item.nombre}</Text>
                      <Text style={styles.productText}>Precio: {item.precio}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  userContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f87171',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: '600',
  },
  productContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  productText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
