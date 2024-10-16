import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Producto(props) {
  return (
    <Pressable onPress={props.onPress} style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nombre}>{props.nombre}</Text>
        <Text>{props.tipo}</Text>
        <Text style={styles.precio}>Precio: ${props.precio}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFA07A", // Salmón claro para la tarjeta
    borderRadius: 10,
    width: "90%",
    marginVertical: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5, // Sombra en Android
  },
  // imagen: {
  //   width: '100%',
  //   height: 150,
  //   resizeMode: 'cover',
  // },
  info: {
    padding: 10,
    backgroundColor: "#FFF5EE", // Fondo más suave para la información
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333", // Texto oscuro
  },
  precio: {
    fontSize: 16,
    color: "#FF6347", // Salmón intenso para destacar el precio
    marginTop: 5,
  },
});
