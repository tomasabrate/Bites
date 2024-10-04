import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function DetalleProducto({ navigation, route }) {
  const producto = route.params.producto;
  return (
    <View style={styles.container}>
      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Text>Tipo: {producto.tipo}</Text>
      <Text style={styles.precio}>Precio: ${producto.precio}</Text>
      <Text>Fecha de produccion: {producto.fecha_produccion}</Text>
      <Text>Fecha de vencimiento: {producto.fecha_vencimiento}</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            {
              borderRadius: 5,
              padding: 10,
              backgroundColor: pressed ? "#ff8566" : "#ff6347",
            },
          ]}
          onPress={() => navigation.navigate("Productos")}
        >
          <Text>Volver</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            {
              borderRadius: 5,
              padding: 10,
              backgroundColor: pressed ? "#ff8566" : "#ff6347",
            },
          ]}
        >
          <Text>Añadir al Carrito</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    // imagenContainer
  },
  // imagen: {
  //   width: '100%',
  //   height: 250,
  //   resizeMode: 'cover',
  //   marginBottom: 20,
  // },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
  },
  precio: {
    fontSize: 20,
    marginTop: 10,
  },
});
