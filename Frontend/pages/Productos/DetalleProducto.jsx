import * as React from "react";
import { View, Text, StyleSheet, Pressable, Alert, Image } from "react-native";
import { useCart } from "../../context/CartContext"; // Asegúrate de que la ruta es correcta
import formatDate from "./utilities/formatDate.utilities";
import imagenDefault from "./utilities/imagenDefault.utilities";
import CalcularDescuento from "./utilities/calcularDescuento.utilities";
import BotonGenerico from "../../components/BotonGenerico";
export default function DetalleProducto({ navigation, route }) {
  const producto = route.params.producto;
  const { agregarAlCarrito } = useCart(); // Obtener la función de agregar al carrito

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto);
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

  const imagen = imagenDefault(producto);

  return (
    <View style={styles.container}>
      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Image
        source={imagen} // Pasar la variable imagen directamente
        style={styles.imagen}
        resizeMode="cover"
      />
      <Text style={styles.descripcion}>
        Descripción: {producto.descripcion}
      </Text>
      <Text style={styles.tipo}>Tipo: {producto.tipo}</Text>
      <Text style={styles.tipo}>Descuento: {producto.descuento}</Text>
      <Text style={styles.tipo}>Precio original: ${producto.precio}</Text>
      <Text style={styles.precio}>
        Precio final: ${CalcularDescuento(producto.precio, producto.descuento)}
      </Text>
      <Text style={styles.fecha}>
        Fecha de producción: {formatDate(producto.fecha_produccion)}
      </Text>
      <Text style={styles.fecha}>
        Fecha de vencimiento: {formatDate(producto.fecha_vencimiento)}
      </Text>
      <View style={styles.buttonContainer}>
        <BotonGenerico
          title={"Vovler"}
          onPress={() => navigation.navigate("Productos")}
        />

        <BotonGenerico
          title={"Añadir al Carrito"}
          onPress={handleAgregarAlCarrito}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9", // Color de fondo
  },
  imagen: {
    width: "100%", // Ocupa el ancho completo
    height: 200, // Altura fija, ajusta según sea necesario
    borderRadius: 10, // Bordes redondeados
    marginBottom: 15, // Espacio debajo de la imagen
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  nombre: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333", // Color del texto
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  tipo: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  precio: {
    fontSize: 24,
    marginTop: 10,
    fontWeight: "bold",
    color: "#2e8b57", // Color verde para el precio
  },
  fecha: {
    fontSize: 14,
    color: "#777",
    marginBottom: 5,
  },
  button: {
    borderRadius: 5,
    padding: 12,
    flex: 1, // Para que los botones ocupen el mismo espacio
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
