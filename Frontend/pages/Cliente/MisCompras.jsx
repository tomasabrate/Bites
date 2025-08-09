import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { getComprasByCliente } from "../../services/compras";
import { useAuth } from "../../context/AuthContext";
import { actualizarEstadoVenta } from "../../services/ventas";
import { getComercioById } from "../../services/comercios";


const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroActual, setFiltroActual] = useState("todos");
  const navigation = useNavigation();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [cargandoCancelacion, setCargandoCancelacion] = useState(false);
  const [modalMensaje, setModalMensaje] = useState(null);
  const [modalTipo, setModalTipo] = useState("info");

  const fetchCompras = useCallback(async () => {
    if (!user?.uid) {
      Alert.alert("Error", "No se pudo identificar al usuario.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const comprasData = await getComprasByCliente(user.uid);

      const comprasConImagenes = await Promise.all(
        comprasData.map(async (compra) => {
          try {
            const comercio = await getComercioById(compra.uid_comercio);
            return {
              ...compra,
              comercio_imagen: comercio?.foto_perfil || null,
              nombre_comercio: comercio?.nombre_comercio || "Comercio desconocido",
            };
          } catch (error) {
            console.error("Error cargando comercio:", error);
            return {
              ...compra,
              comercio_imagen: null,
              nombre_comercio: "Comercio desconocido",
            };
          }
        })
      );

      const comprasOrdenadas = comprasConImagenes.sort(
        (a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta)
      );
      setCompras(comprasOrdenadas);
    } catch (error) {
      console.error("Error fetching compras:", error);
      Alert.alert("Error", "No se pudieron cargar las compras.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);


  useFocusEffect(
    useCallback(() => {
      fetchCompras();
    }, [fetchCompras])
  );

  const getComprasFiltradas = () => {
    switch (filtroActual) {
      case "entregados":
        return compras.filter((compra) => compra.estado === "ENTREGADO");
      case "cancelados":
        return compras.filter((compra) => compra.estado === "CANCELADO");
      case "en curso":
        return compras.filter((compra) => compra.estado === "EN CURSO");
      default:
        return compras;
    }
  };

  const abrirModalCancelacion = (venta) => {
    setVentaSeleccionada(venta);
    setModalVisible(true);
  };

  const confirmarCancelacion = async () => {
    if (!ventaSeleccionada) return;

    setCargandoCancelacion(true);

    try {
      await actualizarEstadoVenta(ventaSeleccionada.id_venta, "CANCELADO");
      setModalMensaje("La compra fue cancelada con éxito.");
      setModalTipo("exito");
      fetchCompras();
    } catch (error) {
      setModalMensaje("No se pudo cancelar la compra. Intenta nuevamente.");
      setModalTipo("error");
    } finally {
      setCargandoCancelacion(false);
      setModalVisible(false);
      setVentaSeleccionada(null);
    }
  };


  const renderCompraItem = ({ item }) => {

    {
      item.estado === "EN CURSO" && (
        <TouchableOpacity
          style={[styles.accionButton, { marginLeft: "auto" }]}
          onPress={() => abrirModalCancelacion(item)}
        >
          <Icon name="x-circle" size={16} color="#dc2626" />
          <Text style={[styles.accionText, { color: "#dc2626" }]}>Cancelar</Text>
        </TouchableOpacity>
      )
    }

    return (
      <TouchableOpacity
        style={styles.compraItem}
        onPress={() => navigation.navigate("DetalleCompra", { compra: item })}
      >
        <View style={styles.compraContent}>
          <Image
            source={{
              uri: item.comercio_imagen || "/placeholder.svg?height=60&width=60",
            }}
            style={styles.comercioImagen}
          />

          <View style={styles.compraInfo}>
            <View style={styles.compraHeader}>
              <Text
                style={[
                  styles.estadoCompra,
                  {
                    color:
                      item.estado === "CANCELADO"
                        ? "#dc2626"
                        : item.estado === "EN CURSO"
                          ? "#FFA500"
                          : "#4CAF50",
                  },
                ]}
              >
                {item.estado} • {new Date(item.fecha_venta).toLocaleDateString()}{" "}
                •{" "}
                {new Date(item.fecha_venta).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              </Text>
            </View>
            <Text style={styles.comercioNombre}>{item.nombre_comercio}</Text>
            <Text style={styles.compraDetalles}>
              ${item.total} • {item.cantidad_productos} productos
            </Text>

            <View style={styles.compraAcciones}>
              <TouchableOpacity style={styles.accionButton}>
                <Icon name="star" size={16} color="#888" />
                <Text style={styles.accionText}>Opinar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.accionButton}>
                <Icon name="refresh-ccw" size={16} color="#888" />
                <Text style={styles.accionText}>Repetir</Text>
              </TouchableOpacity>

              {item.estado === "EN CURSO" && (
                <TouchableOpacity
                  style={[styles.accionButton, { marginLeft: "auto" }]}
                  onPress={() => abrirModalCancelacion(item)}
                >
                  <Icon name="x-circle" size={16} color="#dc2626" />
                  <Text style={[styles.accionText, { color: "#dc2626" }]}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Cancelar compra</Text>
            <Text style={styles.modalMensaje}>
              ¿Estás seguro de que querés cancelar esta compra?
            </Text>
            <Text style={styles.modalMensaje}>
              Si fue pagada con Mercado Pago, el reembolso se procesará según las políticas de Mercado Pago.
            </Text>
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.modalBoton, { backgroundColor: "#ccc" }]}
                onPress={() => setModalVisible(false)}
                disabled={cargandoCancelacion}
              >
                <Text style={styles.modalBotonTexto}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBoton, { backgroundColor: "#dc2626" }]}
                onPress={confirmarCancelacion}
                disabled={cargandoCancelacion}
              >
                <Text style={[styles.modalBotonTexto, { color: "#fff" }]}>
                  {cargandoCancelacion ? "Cancelando..." : "Sí, cancelar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.filtros}>
        <TouchableOpacity style={styles.filtroButton}>
          <Icon name="sliders" size={20} color="#333" />
          <Text style={styles.filtroButtonText}>Filtros</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filtroTab,
            filtroActual === "entregados" && styles.filtroTabActivo,
          ]}
          onPress={() =>
            setFiltroActual(
              filtroActual === "entregados" ? "todos" : "entregados"
            )
          }
        >
          <Text style={styles.filtroTabText}>Entregados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filtroTab,
            filtroActual === "cancelados" && styles.filtroTabActivo,
          ]}
          onPress={() =>
            setFiltroActual(
              filtroActual === "cancelados" ? "todos" : "cancelados"
            )
          }
        >
          <Text style={styles.filtroTabText}>Cancelados</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filtroTab,
            filtroActual === "en curso" && styles.filtroTabActivo,
          ]}
          onPress={() =>
            setFiltroActual(
              filtroActual === "en curso" ? "todos" : "en curso"
            )
          }
        >
          <Text style={styles.filtroTabText}>En Curso</Text>
        </TouchableOpacity>
      </View>

      {getComprasFiltradas().length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="shopping-bag" size={50} color="#888" />
          <Text style={styles.emptyStateText}>
            No hay compras para mostrar
          </Text>
        </View>
      ) : (
        <FlatList
          data={getComprasFiltradas()}
          renderItem={renderCompraItem}
          keyExtractor={(item) => item.id_venta.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchCompras}
            />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalMensaje !== null}
        onRequestClose={() => setModalMensaje(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={[styles.modalTitulo, {
              color: modalTipo === "error" ? "#dc2626" : "#4CAF50"
            }]}>
              {modalTipo === "error" ? "Error" : "Éxito"}
            </Text>
            <Text style={styles.modalMensaje}>{modalMensaje}</Text>
            <TouchableOpacity
              style={[styles.modalBoton, { backgroundColor: "#ff6347", width: "100%" }]}
              onPress={() => setModalMensaje(null)}
            >
              <Text style={[styles.modalBotonTexto, { color: "#fff" }]}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  filtros: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filtroButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  filtroButtonText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#333",
  },
  filtroTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },
  filtroTabActivo: {
    backgroundColor: "#ff6347",
  },
  filtroTabText: {
    color: "#333",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  compraItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  compraContent: {
    flexDirection: "row",
    padding: 16,
  },
  comercioImagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  compraInfo: {
    flex: 1,
  },
  compraHeader: {
    marginBottom: 4,
  },
  estadoCompra: {
    fontSize: 14,
    fontWeight: "500",
  },
  comercioNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  compraDetalles: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  compraAcciones: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
    paddingTop: 8,
  },
  accionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  accionText: {
    marginLeft: 8,
    color: "#888",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMensaje: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalBoton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  modalBotonTexto: {
    fontSize: 16,
    fontWeight: "bold",
  },

});

export default MisCompras;
