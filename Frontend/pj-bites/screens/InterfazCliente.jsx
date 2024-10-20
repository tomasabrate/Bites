import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import Carrusel from '../components/Carrusel'; // Carrusel de imágenes
import MenuDesplegable from '../components/MenuDesplegable'; // Menú lateral desplegable
import Producto from '../components/Producto'; // Componente para mostrar los productos

const InterfazCliente = () => {
  const navigation = useNavigation(); // Obtén acceso a la navegación
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([
    { nombre: 'Postres', imagen: require('../assets/categorias/postres.jpg') },
    { nombre: 'Comida Saludable', imagen: require('../assets/categorias/comida_saludable.jpg') },
    { nombre: 'Bebidas', imagen: require('../assets/categorias/bebidas.jpg') },
    { nombre: 'Viandas', imagen: require('../assets/categorias/viandas.jpg') },
    { nombre: 'Comida Rápida', imagen: require('../assets/categorias/comida_rapida.jpg') },
  ]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/productos");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  const filtrarProductosPorCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header con el ícono de menú */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mis Productos</Text>
      </View>

      {/* Menú desplegable */}
      {menuVisible && <MenuDesplegable />}

      {/* Carrusel de imágenes */}
      <Carrusel />

      {/* Buscador */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar producto..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Categorías usando FlatList */}
      <FlatList
        data={categorias}
        keyExtractor={(item) => item.nombre}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaButton,
              categoriaSeleccionada === item.nombre && styles.categoriaSelected,
            ]}
            onPress={() => filtrarProductosPorCategoria(item.nombre)}
          >
            <Image source={item.imagen} style={styles.categoriaImage} />
            <Text style={styles.categoriaText}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoriaContainer}
        showsHorizontalScrollIndicator={false}
      />

      {/* Lista de productos */}
      {cargando ? (
        <Text>Cargando productos...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={productos.filter(producto => {
            if (categoriaSeleccionada) {
              return producto.tipo === categoriaSeleccionada;
            }
            return true;
          }).filter(producto => {
            return producto.nombre.toLowerCase().includes(searchQuery.toLowerCase());
          })}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <Producto
              id_producto={item.id_producto}
              nombre={item.nombre}
              tipo={item.tipo}
              precio={item.precio}
              onPress={() => {
                navigation.navigate("DetalleProductoCliente", { producto: item });
              }}
            />
          )}
        />
      )}

      {/* Barra de navegación inferior */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
          <Text style={styles.footerButton}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Mis Pedidos')}>
          <Text style={styles.footerButton}>Mis Pedidos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  menuIcon: { fontSize: 24 },
  title: { fontSize: 20, fontWeight: 'bold' },
  searchInput: { margin: 16, borderWidth: 1, borderRadius: 8, padding: 8 },
  categoriaContainer: { paddingHorizontal: 8 }, // Añadido espaciado horizontal
  categoriaButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginRight: 10, // Espaciado entre las categorías
  },
  categoriaSelected: {
    backgroundColor: '#ffcccb',
  },
  categoriaImage: { width: 80, height: 80, marginBottom: 8 }, // Tamaño ajustado
  categoriaText: {
    fontSize: 16, // Ajustado para pantallas más pequeñas
    fontWeight: 'bold',
  },
  footer: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  footerButton: { fontSize: 16, color: 'blue' },
});

export default InterfazCliente;
