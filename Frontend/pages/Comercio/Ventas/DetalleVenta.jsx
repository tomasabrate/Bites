import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDetallesByIdVenta } from "../../../services/detallesVenta";
import BotonGenerico from "../../../components/BotonGenerico";
import { putVenta } from "../../../services/ventas";
import { verifyBeforeUpdateEmail } from "firebase/auth";

const DetalleVenta = () => {
  const [ventaCompleta, setVentaCompleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmarEntregaVisible, setConfirmarEntregaVisible] = useState(false);
  const [codigoRetiro, setCodigoRetiro] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { ventaId, venta } = route.params;

  useEffect(() => {
    const fetchVentaDetails = async () => {
      try {
        const data = await getDetallesByIdVenta(ventaId);
        setVentaCompleta(data);
        if (venta.estado === "EN CURSO") {
          setConfirmarEntregaVisible(true);
        }
      } catch (error) {
        console.error("Error fetching venta details:", error);
        Alert.alert("Error", "No se pudieron cargar los detalles de la venta.");
      } finally {
        setLoading(false);
      }
    };

    fetchVentaDetails();
  }, [ventaId]);

  const confirmarEntrega = async () => {
    if (!codigoRetiro.trim()) {
      Alert.alert("Error", "Por favor, ingresa un código de retiro válido.");
      return;
    }

    if (codigoRetiro === venta.codigo_retiro) {
      try {
        await putVenta(venta.id_venta, {estado: "ENTREGADO"});
        setConfirmarEntregaVisible(false);
        console.log("EXITO, VENTA CONFIRMADA", venta)
      } catch (e) {
        Alert.alert("Error al actualizar la venta");
        return;
      }
    }else{
      console.log("codigo de retiro no valido")
    }
    Alert.alert("Éxito", `Venta confirmada con el código: ${codigoRetiro}`);
    setModalVisible(false);
    setCodigoRetiro("");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  if (!ventaCompleta) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se pudo cargar los detalles de la venta.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Venta</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información General</Text>
            <Text style={styles.infoText}>Venta #{ventaId}</Text>
            <Text style={styles.infoText}>
              Fecha: {new Date(venta.fecha_venta).toLocaleString()}
            </Text>
            <Text style={styles.infoText}>Total: ${venta.total}</Text>
            <Text style={styles.infoText}>
              Método de Pago: {venta.metodo_pago}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.infoText}>ID Cliente: {venta.uid_cliente}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos</Text>
            {ventaCompleta.detalles.map((detalle, index) => (
              <View key={index} style={styles.productoItem}>
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre}>
                    {detalle.nombre_producto}
                  </Text>
                  <Text style={styles.productoCantidad}>
                    Cantidad: {detalle.cantidad}
                  </Text>
                  <Text style={styles.productoPrecio}>
                    Precio unitario: ${detalle.precio_unitario}
                  </Text>
                  <Text style={styles.productoSubtotal}>
                    Subtotal: ${detalle.subtotal}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {confirmarEntregaVisible && (
          <View style={styles.confirmarEntregaContainer}>
            <BotonGenerico
              title="Confirmar Entrega"
              onPress={() => setModalVisible(true)}
              colorInicial="#4CAF50"
              colorPressed="#45a049"
            />
          </View>
        )}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar Entrega</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingresa el código de retiro"
                value={codigoRetiro}
                onChangeText={setCodigoRetiro}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={confirmarEntrega}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

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
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
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
  errorText: {
    fontSize: 16,
    color: "#ff6347",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#555",
  },
  productoItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },
  productoImagen: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productoInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productoCantidad: {
    fontSize: 14,
    color: "#555",
  },
  productoPrecio: {
    fontSize: 14,
    color: "#4CAF50",
  },
  productoSubtotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
    marginTop: 4,
  },
  confirmarEntregaContainer: {
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#dc2626",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DetalleVenta;
