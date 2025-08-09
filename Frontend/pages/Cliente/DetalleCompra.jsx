import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ActivityIndicator,
  Alert,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDetallesByIdVenta } from "../../services/detallesVenta";
import { getComercioById } from "../../services/comercios";
import { actualizarEstadoVenta } from "../../services/ventas";

const DetalleCompra = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { compra } = route.params;

  // Estado local para poder actualizar la compra y que el UI refresque
  const [compraLocal, setCompraLocal] = useState(compra);
  const [detalleCompra, setDetalleCompra] = useState({ detalles: [] });
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cargandoCancelacion, setCargandoCancelacion] = useState(false);

  const fetchDatosCompra = async () => {
    setLoading(true);
    try {
      const dataComercio = await getComercioById(compraLocal.uid_comercio);
      setComercio(dataComercio);

      const data = await getDetallesByIdVenta(compraLocal.id_venta);
      setDetalleCompra(data);
    } catch (error) {
      console.error("Error al obtener detalles de la compra:", error);
      Alert.alert("Error", "No se pudieron cargar los detalles de la compra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatosCompra();
  }, [compraLocal.id_venta]);

  const confirmarCancelacion = async () => {
    setCargandoCancelacion(true);
    try {
      await actualizarEstadoVenta(compraLocal.id_venta, "CANCELADO");
      Alert.alert("Éxito", "La compra fue cancelada con éxito.");
      setModalVisible(false);

      // Actualizo el estado local para reflejar el cambio inmediatamente
      setCompraLocal(prev => ({ ...prev, estado: "CANCELADO" }));

      // Refresco los detalles por si hay cambios también
      await fetchDatosCompra();
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar la compra. Intenta nuevamente.");
    } finally {
      setCargandoCancelacion(false);
    }
  };

  const abrirModalCancelacion = () => {
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  if (!detalleCompra.detalles || detalleCompra.detalles.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se encontraron detalles de la compra
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#fff" }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={{
            uri: comercio?.foto_perfil || "https://via.placeholder.com/400x200",
          }}
          style={styles.banner}
        >
          <View style={styles.bannerOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bannerTextContainer}>
            <TouchableOpacity
              style={styles.verRestaurante}
              onPress={() =>
                navigation.navigate("InfoPerfilComercio", {
                  uid_comercio: comercio.uid_comercio,
                })
              }
            >
              <Text style={styles.comercioNombre}>
                {comercio?.nombre_comercio}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.estadoContainer}>
          <TouchableOpacity
            style={styles.estadoButton}
            activeOpacity={0.7}
            onPress={() => console.log("Estado:", compraLocal.estado)}
          >
            <Icon
              name={
                compraLocal.estado === "ENTREGADO"
                  ? "check-circle"
                  : compraLocal.estado === "EN CURSO"
                    ? "clock"
                    : "x-circle"
              }
              size={20}
              color={
                compraLocal.estado === "ENTREGADO"
                  ? "#4CAF50"
                  : compraLocal.estado === "EN CURSO"
                    ? "#FFA500"
                    : "#dc2626"
              }
              style={{ marginRight: 6 }}
            />
            <Text style={styles.estadoText}>{compraLocal.estado}</Text>
          </TouchableOpacity>

          {compraLocal.estado !== "CANCELADO" && (
            <View style={styles.estadoRight}>
              <Text style={styles.codigoRetiroLabel}>Código de Retiro:</Text>
              <Text style={styles.codigoRetiroText}>{compraLocal.codigo_retiro}</Text>
            </View>
          )}
        </View>

        <View style={styles.estadoFecha}>
          <Text style={styles.fechaText}>
            {new Date(compraLocal.fecha_venta).toLocaleDateString("es-AR", {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {compraLocal.estado === "EN CURSO" && (
          <TouchableOpacity
            style={styles.cancelarButton}
            activeOpacity={0.8}
            onPress={abrirModalCancelacion}
          >
            <Text style={styles.cancelarButtonText}>Cancelar pedido</Text>
          </TouchableOpacity>
        )}

        <View style={styles.detalleContainer}>
          <Text style={styles.seccionTitulo}>Tu pedido</Text>
          {detalleCompra.detalles.map((producto, index) => (
            <View key={index} style={styles.productoItem}>
              <Image
                source={{
                  uri:
                    producto.imagen_producto ||
                    "https://via.placeholder.com/60",
                }}
                style={styles.productoImagen}
              />
              <View style={styles.productoTexto}>
                <Text style={styles.productoNombre}>
                  {producto.nombre_producto}
                </Text>
              </View>
              <View style={styles.productoPrecio}>
                <Text style={styles.cantidadText}>{producto.cantidad}x</Text>
                <Text style={styles.precioText}>
                  ${producto.precio_unitario}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPrecio}>${compraLocal.total}</Text>
          </View>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  errorText: { fontSize: 16, color: "#ff6347", textAlign: "center", marginBottom: 20 },
  banner: { height: 200, justifyContent: "space-between", padding: 16 },
  bannerOverlay: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center", alignItems: "center",
  },
  bannerTextContainer: {
    marginTop: 40,
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 8,
    borderRadius: 10,
  },
  comercioNombre: {
    color: "white", fontSize: 24, fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.85)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  verRestaurante: { alignSelf: "flex-start" },
  estadoContainer: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 16, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "white"
  },
  estadoFecha: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#eee",
    paddingLeft: 24, paddingBottom: 16,
  },
  estadoRight: { alignItems: "flex-end" },
  codigoRetiroLabel: { fontSize: 17, color: "#666" },
  codigoRetiroText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  estadoText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  fechaText: { fontSize: 14, color: "#666" },
  detalleContainer: { padding: 16 },
  seccionTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#333" },
  productoItem: {
    marginBottom: 16, borderBottomWidth: 1,
    borderBottomColor: "#eee", paddingBottom: 16,
    flexDirection: "row", alignItems: "center",
  },
  productoImagen: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#f5f5f5" },
  productoTexto: { flex: 1, marginLeft: 12 },
  productoNombre: { fontSize: 16, fontWeight: "600", color: "#333" },
  productoPrecio: { alignItems: "flex-end" },
  cantidadText: { fontSize: 16, fontWeight: "500", color: "#333" },
  precioText: { fontSize: 16, fontWeight: "600", color: "#333", marginTop: 4 },
  totalContainer: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginTop: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: "#eee",
  },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalPrecio: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
  estadoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelarButton: {
    marginTop: 12,
    alignSelf: "center",
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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

export default DetalleCompra;
