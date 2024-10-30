import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MenuDesplegable from "./MenuDeslizanteC";
import Icon from "react-native-vector-icons/Ionicons";

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
      const response = await fetch("http://localhost:3000/productos");
      const data = await response.json();
      setProductos(data);
      setError(null); // Reiniciar el error si la obtención fue exitosa
    } catch (error) {
      console.error("Error al obtener productos:", error);
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
      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(Error`${response.status}: ${response.statusText}`);
      }

      // Actualiza la lista de productos después de eliminar
      setCambios((prev) => !prev); // Cambia el estado para volver a obtener productos
    } catch (error) {
      console.error("Error al eliminar producto:", error);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.botonMenu}>
          <Icon name="menu" size={30} color="#FF6347" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Mis Productos</Text>
      </View>
      {menuVisible && <MenuDesplegable setPaginaActual={setPaginaActual} />}

      {cargando ? (
        <ActivityIndicator size="large" color="#FF6347" />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <View style={styles.producto}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.precio}>Precio: ${item.precio}</Text>
              <Text style={styles.tipo}>Tipo: {item.tipo}</Text>
              <View style={styles.botonContainer}>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => navegarModificarProducto(item.id_producto)}
                >
                  <Icon name="create-outline" size={16} color="#fff" />
                  <Text style={styles.botonTexto}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => eliminarProducto(item.id_producto)}
                >
                  <Icon name="trash-outline" size={16} color="#fff" />
                  <Text style={styles.botonTexto}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate("CargarProducto")}
      >
        <Text style={styles.botonTexto}>Agregar Producto</Text>
      </TouchableOpacity>

      {/* Modal para mostrar el error */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTexto}>{error}</Text>
            <TouchableOpacity style={styles.botonCerrar} onPress={cerrarModal}>
              <Text style={styles.botonTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  botonMenu: {
    padding: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6347",
    textAlign: "center",
    flex: 1,
  },
  producto: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  precio: {
    fontSize: 16,
    color: "#FF6347",
    marginTop: 5,
  },
  tipo: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTexto: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  botonCerrar: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  boton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  botonAgregar: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
});
