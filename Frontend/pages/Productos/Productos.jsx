import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import Producto from "./components/Producto";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Productos() {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const categorias = [
    {
      value: "Comida Rápida",
      key: 1,
      imagen: require("../../assets/categorias/comida_rapida.jpg"),
    },
    {
      value: "Saludable",
      key: 2,
      imagen: require("../../assets/categorias/comida_saludable.jpg"),
    },
    {
      value: "Bebidas",
      key: 3,
      imagen: require("../../assets/categorias/bebidas.jpg"),
    },
    {
      value: "Viandas",
      key: 4,
      imagen: require("../../assets/categorias/viandas.jpg"),
    },
    {
      value: "Postres",
      key: 5,
      imagen: require("../../assets/categorias/postres.jpg"),
    },
  ];

  //Funciones para el manejo de la navegacion de la lista de productos
  // const scrollY = useRef(new Animated.Value(0)).current;
  // const headerHeight = 300;

  // const headerTranslateY = scrollY.interpolate({
  //   inputRange: [0, headerHeight],
  //   outputRange: [0, -headerHeight],
  //   extrapolate: "clamp",
  // });

  // const headerOpacity = scrollY.interpolate({
  //   inputRange: [0, headerHeight / 2, headerHeight],
  //   outputRange: [1, 0.5, 0],
  //   extrapolate: "clamp",
  // });

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/productos");
      const data = await response.json();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [precioMin, precioMax, categoriaSeleccionada, productos]);

  const aplicarFiltros = () => {
    let resultado = productos;

    if (precioMin !== "") {
      resultado = resultado.filter(
        (producto) => producto.precio >= parseFloat(precioMin)
      );
    }

    if (precioMax !== "") {
      resultado = resultado.filter(
        (producto) => producto.precio <= parseFloat(precioMax)
      );
    }

    if (categoriaSeleccionada) {
      resultado = resultado.filter(
        (producto) => producto.id_categoria === categoriaSeleccionada
      );
    }

    setProductosFiltrados(resultado);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Locales y productos"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View>
        <View style={styles.priceFilterContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Precio mínimo"
            placeholderTextColor="#A0AEC0"
            keyboardType="numeric"
            value={precioMin}
            onChangeText={setPrecioMin}
          />
          <TextInput
            style={styles.priceInput}
            placeholder="Precio máximo"
            placeholderTextColor="#A0AEC0"
            keyboardType="numeric"
            value={precioMax}
            onChangeText={setPrecioMax}
          />
        </View>

        <FlatList
          data={categorias}
          keyExtractor={(item) => item.key.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriaContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoriaButton,
                categoriaSeleccionada === item.key && styles.categoriaSelected,
              ]}
              onPress={() =>
                setCategoriaSeleccionada(
                  categoriaSeleccionada === item.key ? null : item.key
                )
              }
            >
              <Image source={item.imagen} style={styles.categoriaImage} />
              <Text style={styles.categoriaText}>{item.value}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={styles.title}>Promociones del día!</Text>
      {cargando ? (
        <ActivityIndicator size="large" color="#E53E3E" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          style={styles.flatList}
          data={productosFiltrados}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <Producto
              imagenes={item.imagenes}
              id_producto={item.id_producto}
              nombre={item.nombre}
              precio={item.precio}
              descuento={item.descuento}
              onPress={() =>
                navigation.navigate("DetalleProducto", { producto: item })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333333",
  },
  priceFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  priceInput: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E53E3E",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#4A5568",
    backgroundColor: "#FFF",
  },
  categoriaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  categoriaButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#FED7D7",
    marginRight: 12,
    width: 80,
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriaSelected: {
    backgroundColor: "#FEB2B2",
    borderWidth: 2,
    borderColor: "#E53E3E",
  },
  categoriaImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  categoriaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A5568",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E53E3E",
    textAlign: "center",
    marginVertical: 16,
  },
  flatList: {
    width: "100%",
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: "#E53E3E",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
