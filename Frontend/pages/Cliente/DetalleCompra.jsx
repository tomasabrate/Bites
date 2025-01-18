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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getDetallesByIdVenta } from "../../services/detallesVenta";
import { getComercioById } from "../../services/comercios";

const DetalleCompra = () => {
  const [detalleCompra, setDetalleCompra] = useState([]);
  const [comercio, setComercio] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { compra } = route.params;
  console.log(compra);

  useEffect(() => {
    const fetchDatosCompra = async () => {
      try {
        const dataComercio = await getComercioById(compra.uid_comercio);
        setComercio(dataComercio);

        const data = await getDetallesByIdVenta(compra.id_venta);
        setDetalleCompra(data);
      } catch (error) {
        console.error("Error al obtener detalles de la compra:", error);
        Alert.alert("Error", "No se pudieron cargar los detalles de la compra");
      } finally {
        setLoading(false);
      }
    };

    fetchDatosCompra();
  }, [compra.id_venta]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  if (detalleCompra.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No se encontraron detalles de la compra
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <ImageBackground
          source={{
            uri: comercio?.imagenes || "https://via.placeholder.com/400x200",
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
          <Text style={styles.comercioNombre}>{comercio?.nombre_comercio}</Text>
          <TouchableOpacity style={styles.verRestaurante}>
            <Text style={styles.verRestauranteText}>Ver restaurante</Text>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.estadoContainer}>
          <View>
            <Icon
              name={
                compra.estado === "ENTREGADO"
                  ? "check-circle"
                  : compra.estado === "EN CURSO"
                  ? "clock"
                  : "x-circle"
              }
              size={24}
              color={
                compra.estado === "ENTREGADO"
                  ? "#4CAF50"
                  : compra.estado === "EN CURSO"
                  ? "#FFA500"
                  : "#dc2626"
              }
            />
            <View>
              <Text style={styles.estadoText}>{compra.estado}</Text>

              <Text style={styles.fechaText}>
                {new Date(compra.fecha_venta).toLocaleDateString("es-AR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.estadoRight}>
            <Text style={styles.codigoRetiroLabel}>Código de Retiro:</Text>
            <Text style={styles.codigoRetiroText}>{compra.codigo_retiro}</Text>
          </View>
        </View>

        <View style={styles.detalleContainer}>
          <Text style={styles.seccionTitulo}>Tu pedido</Text>
          {detalleCompra.detalles.map((producto, index) => (
            <View key={index} style={styles.productoItem}>
              <Image
                source={{
                  uri: producto.imagen || "https://via.placeholder.com/60x60",
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
            <Text style={styles.totalPrecio}>${compra.total}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
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
    marginBottom: 20,
  },
  banner: {
    height: 200,
    justifyContent: "space-between",
    padding: 16,
  },
  bannerOverlay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  helpButtonText: {
    marginLeft: 8,
    fontWeight: "500",
    color: "#333",
  },
  comercioNombre: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  verRestaurante: {
    alignSelf: "flex-start",
  },
  verRestauranteText: {
    color: "white",
    fontSize: 16,
    textDecorationLine: "underline",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  estadoIconContainer: {
    marginRight: 16,
  },
  estadoRight: {
    alignItems: "flex-end",
  },
  codigoRetiroLabel: {
    paddingTop:15,
    fontSize: 17,
    underline: true,
    color: "#666",
  },
  codigoRetiroText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  estadoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  fechaText: {
    fontSize: 14,
    color: "#666",
  },
  detalleContainer: {
    padding: 16,
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  productoItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 16,
  },
  productoInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productoImagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  productoTexto: {
    flex: 1,
    marginLeft: 12,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productoDescripcion: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  productoPrecio: {
    alignItems: "flex-end",
  },
  cantidadText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  precioText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrecio: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  notasContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  notasTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  notasTexto: {
    fontSize: 14,
    color: "#666",
  },
});

export default DetalleCompra;
