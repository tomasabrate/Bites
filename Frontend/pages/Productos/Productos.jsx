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
  useWindowDimensions,
} from "react-native";
import Producto from "./components/Producto";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getProductos } from "../../services/productos";

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

export default function Productos() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 4 : width >= 768 ? 3 : width >= 480 ? 2 : 1;
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const obtenerProductos = async () => {
    try {
      //Obtener productos
      const data = await getProductos();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (error) {
      setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  //Cada vez que se inicia la pantalla se cargan los productos
  useEffect(() => {
    obtenerProductos();
  }, []);

  //Cada vez que cambien estas variables se aplican los filtros.
  useEffect(() => {
    aplicarFiltros();
  }, [precioMin, precioMax, categoriaSeleccionada, productos, busqueda]);

  //Función para aplicar los filtros a los productos.
  const aplicarFiltros = () => {
    let resultado = productos;

    // Filtro por precio mínimo
    if (precioMin !== "") {
      resultado = resultado.filter(
        (producto) => producto.precio >= parseFloat(precioMin)
      );
    }

    // Filtro por precio máximo
    if (precioMax !== "") {
      resultado = resultado.filter(
        (producto) => producto.precio <= parseFloat(precioMax)
      );
    }

    // Filtro por categoría
    if (categoriaSeleccionada) {
      resultado = resultado.filter(
        (producto) => producto.id_categoria === categoriaSeleccionada
      );
    }

    // Filtro por búsqueda en el nombre del producto
    if (busqueda !== "") {
      resultado = resultado.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro por cantidad disponible
    resultado = resultado.filter((producto) => producto.cantidad > 0);

    setProductosFiltrados(resultado);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersWrapper}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar locales o productos..."
            placeholderTextColor="#888"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        <View style={styles.priceFilterContainer}>
          <View style={styles.priceInputWrapper}>
            <Text style={styles.priceCurrency}>$</Text>
            <TextInput
              style={styles.priceInputInner}
              placeholder="Min"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={precioMin}
              onChangeText={setPrecioMin}
            />
          </View>
          <Text style={styles.priceSeparator}>—</Text>
          <View style={styles.priceInputWrapper}>
            <Text style={styles.priceCurrency}>$</Text>
            <TextInput
              style={styles.priceInputInner}
              placeholder="Max"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={precioMax}
              onChangeText={setPrecioMax}
            />
          </View>
        </View>
      </View>

      <View>
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.key.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.categoriaContainer,
            width >= 768 && { flexGrow: 1, justifyContent: "center" }
          ]}
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
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <Producto
              imagenes={item.imagenes}
              id_producto={item.id_producto}
              nombre={item.nombre}
              precio={item.precio}
              descuento={item.descuento}
              nombre_comercio={item.nombre_comercio}
              foto_perfil={item.foto_perfil}
              uid_comercio={item.uid_comercio}
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
  filtersWrapper: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  priceInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  priceCurrency: {
    fontSize: 16,
    color: "#A0AEC0",
    marginRight: 4,
    fontWeight: "bold",
  },
  priceInputInner: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#4A5568",
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 18,
    color: "#A0AEC0",
    fontWeight: "bold",
  },
  categoriaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  categoriaButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FED7D7",
    marginRight: 10,
    minWidth: 80,
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
