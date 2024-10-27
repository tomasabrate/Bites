import React, { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useCart } from "../../context/CartContext";
import Icon from "react-native-vector-icons/FontAwesome";
import BotonGenerico from "../../components/BotonGenerico";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const navigation = useNavigation();
  const {
    carrito,
    eliminarDelCarrito,
    agregarAlCarrito,
    vaciarCarrito,
    quitarDelCarrito,
  } = useCart();

  const productosAgrupados = useMemo(() => {
    const grupos = {};
    carrito.forEach((item) => {
      if (!grupos[item.id_producto]) {
        grupos[item.id_producto] = { ...item, cantidad: 0 };
      }
      grupos[item.id_producto].cantidad += 1;
    });
    return Object.values(grupos);
  }, [carrito]);

  const total = useMemo(() => {
    return carrito.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
  }, [productosAgrupados]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.productoNombre}>{item.nombre}</Text>
        <Text style={styles.productoPrecio}>${item.precio}</Text>
      </View>
      <View style={styles.itemActions}>
        <Pressable
          onPress={() =>
            quitarDelCarrito(item.id_producto) && console.log(carrito)
          }
          style={styles.quantityButton}
        >
          <Icon name="minus" size={16} color="#fff" />
        </Pressable>
        <Text style={styles.cantidad}>{item.cantidad}</Text>
        <Pressable
          onPress={() => agregarAlCarrito(item) && console.log(carrito)}
          style={styles.quantityButton}
        >
          <Icon name="plus" size={16} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => eliminarDelCarrito(item.id_producto)}
          style={styles.deleteButton}
        >
          <Icon name="trash" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrito de Comrpas</Text>
      </View>
      {productosAgrupados.length === 0 ? (
        <View style={styles.emptyCart}>
          <Icon name="shopping-cart" size={50} color="#ccc" />
          <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={carrito}
            keyExtractor={(item) => item.id_producto}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <BotonGenerico
              title="Volver a Comprar"
              onPress={() => navigation.goBack()}
            />
            <BotonGenerico
              title="Vaciar carrito"
              onPress={vaciarCarrito}
              style={styles.vaciarButton}
            />
            <BotonGenerico
              title="Proceder al pago"
              onPress={() => navigation.navigate("ResumenCompra")}
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
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
    color: "black",
  },

  listContent: {
    flexGrow: 1,
  },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  productoPrecio: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cantidad: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  vaciarButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#f44336",
  },
  checkoutButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: "#4CAF50",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    color: "#666",
    marginVertical: 20,
    height: 20,
  },
});

export default Cart;
