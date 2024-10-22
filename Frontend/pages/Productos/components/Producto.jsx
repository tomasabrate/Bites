import * as React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import imagenDefault from "../utilities/imagenDefault.utilities"
import CalcularDescuento from "../utilities/calcularDescuento.utilities";



export default function Producto(props) {
  const imagen = imagenDefault(props)

  const precioFinal = CalcularDescuento(props.precio, props.descuento)

  return (
    <Pressable onPress={props.onPress} style={styles.card}>
      <View style={styles.content}>
        <Image
          source={imagen} // Pasar la variable imagen directamente
          style={styles.imagen}
        />
        <View>
          <Text style={styles.nombre}>{props.nombre}</Text>
          <Text>{props.tipo}</Text>
          <Text style={styles.precio}>Precio: ${props.precio}</Text>
          <Text style={styles.precio}>Con descuento: ${precioFinal}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffc4ad",
    borderRadius: 10,
    width: "90%",
    marginVertical: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: "row", // Hace que los elementos se coloquen en fila
    alignItems: "center", // Centra verticalmente la imagen y el texto
  },
  imagen: {
    width: 80, // Ajustar el tamaño de la imagen
    height: 80,
    marginRight: 10, // Espacio entre la imagen y el texto
    resizeMode: "cover",
  },
  // info: {
  //   padding: 5,
  //   borderRadius:5,
  //   width:"95%",
  //   backgroundColor: "#FFF5EE",
  //   // flex: 1, // Para que el texto ocupe todo el espacio restante
  // },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  precio: {
    fontSize: 16,
    color: "#FF6347",
    marginTop: 5,
  },
});