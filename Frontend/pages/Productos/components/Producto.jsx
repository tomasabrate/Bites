import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import imagenDefault from "../utilities/imagenDefault.utilities";
import CalcularDescuento from "../utilities/calcularDescuento.utilities";

const { width } = Dimensions.get("window");

export default function Producto(props) {
  // Verificamos si props.imagenes es un array y tiene elementos
  const imagen = (props.imagenes != null) ? props.imagenes : imagenDefault;

  const precioFinal = CalcularDescuento(props.precio, props.descuento);
  return (
    <Pressable onPress={props.onPress} style={styles.card}>
      <Image source={imagen} style={styles.imagen} />
      <View style={styles.content}>
        <Text style={styles.nombre}>
          {props.nombre} - {props.nombre_comercio}
        </Text>
        <Text style={styles.tipo}>{props.tipo}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.precioOriginal}>${props.precio}</Text>
          <Text style={styles.precioDescuento}>${precioFinal}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    width: width * 0.9, // Cambia a un 90% del ancho de la pantalla para que no ocupe todo el espacio
    marginVertical: 8,
    marginHorizontal: 16,
    alignSelf: "center", // Centra el producto en la pantalla
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  imagen: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  tipo: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 8,
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
});
