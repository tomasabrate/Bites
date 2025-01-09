import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useCart } from "../../context/CartContext";
import formatDate from "./utilities/formatDate.utilities";
import imagenDefault from "./utilities/imagenDefault.utilities";
import CalcularDescuento from "./utilities/calcularDescuento.utilities";
import BotonGenerico from "../../components/BotonGenerico";

export default function DetalleProducto({ navigation, route }) {
  const producto = route.params.producto;
  const { agregarAlCarrito, carrito } = useCart();

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto);
    console.log(carrito);
    console.log("Agregado");
    Alert.alert(
      "Producto añadido",
      `${producto.nombre} ha sido añadido al carrito.`,
      [
        {
          text: "Ir al Carrito",
          onPress: () => navigation.navigate("Carrito"),
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const tipoProducto = (tipo) =>{
    if(tipo === 1){
      return "Unidad"
    }else{
      return "Bolson"
    }
  }

  const imagen = imagenDefault(producto);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.nombre}>{producto.nombre_comercio}</Text>

          <View style={styles.imageContainer}>
            <Image source={imagen} style={styles.imagen} resizeMode="cover" />
          </View>

          <View style={styles.card}>
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Detalles del Producto</Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Nombre: </Text>
                {producto.nombre}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Descripción: </Text>
                {producto.descripcion}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Tipo: </Text>
                {tipoProducto(producto.tipo)}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Cantidad disponible: </Text>
                {producto.cantidad}
              </Text>
            </View>

            <View style={styles.priceSection}>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Descuento: </Text>
                {producto.descuento}%
              </Text>
              <Text style={styles.originalPrice}>
                Precio original: ${producto.precio}
              </Text>
              <Text style={styles.finalPrice}>
                Precio final: $
                {CalcularDescuento(producto.precio, producto.descuento)}
              </Text>
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Fecha de producción: </Text>
                {formatDate(producto.fecha_produccion)}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Fecha de vencimiento: </Text>
                {formatDate(producto.fecha_vencimiento)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <BotonGenerico
          title="Volver"
          onPress={() => navigation.goBack()}
          colorInicial="#f44336"
          colorPressed="#d32f2f"
        />
        <BotonGenerico
          title="Añadir al Carrito"
          onPress={handleAgregarAlCarrito}
          colorInicial="#4CAF50"
          colorPressed="#45a049"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagen: {
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  priceSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  dateSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  label: {
    fontWeight: "600",
    color: "#666",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: "#666",
    textDecorationLine: "line-through",
    marginBottom: 4,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 8,
  },
});
