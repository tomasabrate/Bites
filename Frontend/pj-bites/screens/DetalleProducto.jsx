import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DetalleProducto({ route }) {
  const { producto } = route.params; // Asegúrate de que estás recibiendo el parámetro correctamente

  return (
    <View style={styles.container}>
      <Text>Nombre: {producto.nombre}</Text>
      <Text>Precio: {producto.precio}</Text>
      <Text>Tipo: {producto.tipo}</Text>
      {/* Agrega más detalles del producto según sea necesario */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
