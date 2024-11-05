import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MenuDesplegable from "./MenuDeslizanteC";
import Icon from "react-native-vector-icons/Ionicons";
import BotonGenerico from "../../components/BotonGenerico";
import calcularDescuento from "../Productos/utilities/calcularDescuento.utilities";
import { deleteProducto, getProductos } from "../../services/productos";

export default function InterfazComerciante() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
  const [cambios, setCambios] = useState(false); // Nuevo estado para detectar cambios
  const navigation = useNavigation();

  const obtenerProductos = async () => {
    setCargando(true); // Asegúrate de mostrar el indicador de carga
    try {
      //Obtener productos
      const data = await getProductos();
      setProductos(data);
      setError(null); // Reiniciar el error si la obtención fue exitosa
    } catch (error) {
      setError("Error al obtener productos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, [cambios]); // Escucha cambios en el nuevo estado

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const eliminarProducto = async (id) => {
    try {
      //Eliminar producto
      await deleteProducto(id);
      setCambios((prev) => !prev); // Actualiza la lista de productos
    } catch (error) {
      setError("Error al eliminar el producto. El producto ya fue vendido.");
      setModalVisible(true); // Mostrar el modal en caso de error
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const setPaginaActual = (pagina) => {
    switch (pagina) {
      case "Dashboard":
        navigation.navigate("Dashboard");
        break;
      case "Reportes":
        navigation.navigate("Reportes");
        break;
      case "MisPedidosCo":
        navigation.navigate("MisPedidosCo");
        break;
      default:
        break;
    }
    setMenuVisible(false);
  };

  const navegarModificarProducto = (id) => {
    navigation.navigate("ModificarProducto", {
      productoId: id,
      actualizarProductos: obtenerProductos, // Pasa la función para actualizar productos
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.producto}>
      <View style={styles.productoInfo}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.precioOriginal}>${item.precio}</Text>
          <Text style={styles.precioDescuento}>
            ${calcularDescuento(item.precio, item.descuento)}
          </Text>
        </View>
        <Text style={styles.tipo}>Tipo: {item.tipo}</Text>
        <Text style={styles.tipo}>Cantidad: {item.cantidad}</Text>
      </View>
      <View style={styles.botonesContainer}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() => navegarModificarProducto(item.id_producto)}
        >
          <Icon name="create-outline" size={20} color="#fff" />
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => eliminarProducto(item.id_producto)}
        >
          <Icon name="trash-outline" size={20} color="#fff" />
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu} style={styles.botonMenu}>
            <Icon name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Mis Productos</Text>
        </View>

        {menuVisible && <MenuDesplegable setPaginaActual={setPaginaActual} />}

        {cargando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff6347" />
          </View>
        ) : (
          <FlatList
            data={productos}
            keyExtractor={(item) => item.id_producto.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        <View style={styles.agregarProductoContainer}>
          <BotonGenerico
            title="Agregar Producto"
            onPress={() => navigation.navigate("CargarProducto", { onProductAdded: () => setCambios((prev) => !prev) })}
            colorInicial="#4CAF50"
            colorPressed="#45a049"
          />
        </View>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTexto}>{error}</Text>
              <BotonGenerico
                title="Cerrar"
                onPress={cerrarModal}
                colorInicial="#f44336"
                colorPressed="#d32f2f"
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ff6347",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#ff6347",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 16,
  },
  botonMenu: {
    padding: 8,
    marginRight: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  producto: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productoInfo: {
    marginBottom: 12,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  precioOriginal: {
    fontSize: 16,
    color: "#718096",
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  precioDescuento: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E53E3E",
  },
  tipo: {
    fontSize: 14,
    color: "#888",
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  botonAccion: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  botonEditar: {
    backgroundColor: "#4CAF50",
  },
  botonEliminar: {
    backgroundColor: "#f44336",
  },
  botonTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTexto: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  agregarProductoContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "android" ? 16 : 0,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
});
