import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useCart } from "../../context/CartContext";
import CalcularDescuento from "../Productos/utilities/calcularDescuento.utilities";
import { postVenta } from "../../services/ventas";
import { useAuth } from "../../context/AuthContext";
import { generarCodigoDeRetiro } from "../../utils/generarCodigoDeRetiro";

export default function ResumenCompra({ navigation }) {
  const { carrito, vaciarCarrito } = useCart();
  const { user } = useAuth();
  const uid_cliente = user.uid;

  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [metodoEnvio, setMetodoEnvio] = useState("pickup");

  const { subtotal, descuento, total, cantidadProductos } = useMemo(() => {
    const costoEnvio = metodoEnvio === "delivery" ? 200 : 0;
    const subtotal = carrito.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
    const subTotalConDescuento = carrito.reduce(
      (acc, producto) =>
        acc +
        CalcularDescuento(producto.precio, producto.descuento) *
          producto.cantidad,
      0
    );
    const descuento = subtotal - subTotalConDescuento;
    const total = subTotalConDescuento + costoEnvio;
    const cantidadProductos = carrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    );
    return { subtotal, total, cantidadProductos, descuento };
  }, [carrito, metodoEnvio]);

  const HandleCompra = async () => {
    const codigo_retiro = generarCodigoDeRetiro();
    try {
      await postVenta({
        carrito,
        total,
        metodoPago,
        metodoEnvio,
        uid_cliente,
        codigo_retiro,
      });
      console.log("Compra confirmada: ", {
        carrito,
        total,
        metodoPago,
        metodoEnvio,
        uid_cliente,
        codigo_retiro,
      });
      vaciarCarrito();
      navigation.navigate("MisCompras");
    } catch (err) {
      console.error(err);
      alert("Error: " + err);
    }
  };

  const RadioButton = ({ value, label, selected, onSelect }) => (
    <TouchableOpacity
      style={styles.radioButton}
      onPress={() => onSelect(value)}
    >
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "right", "left"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resumen de Compra</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resumen del Pedido</Text>
            {carrito.map((producto) => (
              <View key={producto.id} style={styles.productRow}>
                <Text style={styles.productName}>{producto.nombre}</Text>
                <Text style={styles.productQuantity}>x{producto.cantidad}</Text>
                <Text style={styles.productPrice}>${producto.precio}</Text>
              </View>
            ))}
            <View style={styles.row}>
              <Text>Total de carrito:</Text>
              <Text style={styles.bold}>{cantidadProductos}</Text>
            </View>
            <View style={styles.row}>
              <Text>Subtotal:</Text>
              <Text style={styles.bold}>${subtotal}</Text>
            </View>
            <View style={styles.row}>
              <Text>Descuento:</Text>
              <Text style={styles.bold}>-${descuento.toFixed(2)}</Text>
            </View>
            {metodoEnvio === "delivery" && (
              <View style={styles.row}>
                <Text>Envío:</Text>
                <Text style={styles.bold}>$200</Text>
              </View>
            )}
            <View style={[styles.row, styles.totalRow]}>
              <Text style={styles.bold}>Total:</Text>
              <Text style={styles.bold}>${total}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Método de Pago</Text>
            <RadioButton
              value="credit-card"
              label="Tarjeta de Crédito"
              selected={metodoPago === "credit-card"}
              onSelect={setMetodoPago}
            />
            <RadioButton
              value="debit-card"
              label="Tarjeta de Débito"
              selected={metodoPago === "debit-card"}
              onSelect={setMetodoPago}
            />
            <RadioButton
              value="mercado-pago"
              label="Mercado Pago"
              selected={metodoPago === "mercado-pago"}
              onSelect={setMetodoPago}
            />
            <RadioButton
              value="efectivo"
              label="Efectivo"
              selected={metodoPago === "efectivo"}
              onSelect={setMetodoPago}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Detalles de Envío</Text>
            {/* <RadioButton
              value="delivery"
              label="Envío Estándar"
              selected={metodoEnvio === "delivery"}
              onSelect={setMetodoEnvio}
            /> */}
            {metodoEnvio === "delivery" && (
              <Text style={styles.smallText}>Entrega en 3-5 días hábiles</Text>
            )}
            <RadioButton
              value="pickup"
              label="Retiro por local"
              selected={metodoEnvio === "pickup"}
              onSelect={setMetodoEnvio}
            />
            {metodoEnvio === "pickup" && (
              <Text style={styles.smallText}>Sin costo adicional</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dirección de Envío</Text>
            <TouchableOpacity style={styles.select}>
              <Text>
                {metodoEnvio === "delivery"
                  ? "Seleccionar dirección"
                  : "Seleccionar local de retiro"}
              </Text>
              <Icon name="chevron-down" size={24} color="#888" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={HandleCompra}>
            <Text style={styles.confirmButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  productName: {
    flex: 2,
  },
  productQuantity: {
    flex: 1,
    textAlign: "center",
  },
  productPrice: {
    flex: 1,
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
    marginTop: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ff6347",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#ff6347",
  },
  radioLabel: {
    fontSize: 16,
  },
  smallText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 30,
    marginBottom: 12,
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
