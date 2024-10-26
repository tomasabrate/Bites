import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation
import Carrusel from '../../pages/Cliente/Carrusel'; // Carrusel de imágenes
import MenuDesplegable from '../../pages/Cliente/MenuDesplegable'; // Menú lateral desplegable
import Producto from '../Productos/Productos'; // Componente para mostrar los productos
import Icon from 'react-native-vector-icons/FontAwesome'; // Para añadir iconos

const InterfazCliente = () => {
  const navigation = useNavigation(); // Obtén acceso a la navegación
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [categorias, setCategorias] = useState([
    { nombre: 'Postres', imagen: require('../../assets/categorias/postres.jpg') },
    { nombre: 'Comida Saludable', imagen: require('../../assets/categorias/comida_saludable.jpg') },
    { nombre: 'Bebidas', imagen: require('../../assets/categorias/bebidas.jpg') },
    { nombre: 'Viandas', imagen: require('../../assets/categorias/viandas.jpg') },
    { nombre: 'Comida Rápida', imagen: require('../../assets/categorias/comida_rapida.jpg') },
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

  const filtrarPorPrecio = (producto) => {
    if (precioMin && producto.precio < parseFloat(precioMin)) return false;
    if (precioMax && producto.precio > parseFloat(precioMax)) return false;
    return true;
  };

  const productosFiltrados = useMemo(() => {
    return productos
      .filter(producto => categoriaSeleccionada ? producto.tipo === categoriaSeleccionada : true)
      .filter(producto => producto.nombre.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [productos, categoriaSeleccionada, searchQuery]);

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

      {/* Filtros por precio */}
      <View style={styles.priceFilterContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Precio mínimo"
          keyboardType="numeric"
          value={precioMin}
          onChangeText={setPrecioMin}
        />
        <TextInput
          style={styles.priceInput}
          placeholder="Precio máximo"
          keyboardType="numeric"
          value={precioMax}
          onChangeText={setPrecioMax}
        />
      </View>

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
        <ActivityIndicator size="large" color="#ff6347" />
      ) : error ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: "red" }}>{error}</Text>
          <TouchableOpacity onPress={obtenerProductos}>
            <Text style={{ color: "red", marginTop: 10 }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={productosFiltrados.filter(filtrarPorPrecio)}
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

      {/* Barra de navegación inferior con íconos */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
          <Icon name="map" size={20} color="red" />
          <Text style={styles.footerButton}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MisPedidos')}>
          <Icon name="list" size={20} color="red" />
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
  priceFilterContainer: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16 },
  priceInput: { flex: 1, marginHorizontal: 4, borderWidth: 1, borderRadius: 8, padding: 8 },
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
  footerButton: { fontSize: 16, color: 'red' },
});

export default InterfazCliente;
