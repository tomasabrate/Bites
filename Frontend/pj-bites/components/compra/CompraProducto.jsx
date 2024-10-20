// CompraProducto.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";

export default function CompraProducto({ route, navigation }) {
  const { producto } = route.params; // Recibe el producto seleccionado
  const [cantidad, setCantidad] = useState(1); // Estado para la cantidad

  const handleCompra = async () => {
    // Aquí puedes hacer la lógica para procesar la compra
    try {
      const response = await fetch("http://localhost:3000/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: producto.id_producto,
          cantidad: cantidad,
        }),
      });

      if (response.ok) {
        // Manejar la respuesta (por ejemplo, mostrar un mensaje de éxito)
        alert("Compra realizada con éxito!");
        navigation.goBack(); // Regresa a la pantalla anterior
      } else {
        alert("Error al realizar la compra. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error en la compra:", error);
      alert("Error en la compra. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Producto: {producto.nombre}</Text>
      <Text>Precio: ${producto.precio}</Text>
      <Text>Cantidad:</Text>
      <TextInput
        value={String(cantidad)}
        onChangeText={setCantidad}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Confirmar Compra" onPress={handleCompra} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: "100%",
  },
});
