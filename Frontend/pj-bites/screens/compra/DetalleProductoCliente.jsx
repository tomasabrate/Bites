// DetalleProductoCliente.js
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";

export default function DetalleProductoCliente({ route, navigation }) {
  const { producto } = route.params; // Recibe el producto desde la navegación
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

  // Funciones para aumentar y disminuir la cantidad
  const aumentarCantidad = () => {
    if (cantidad < producto.cantidad) {
      setCantidad(cantidad + 1);
    } else {
      alert("No puedes pedir más de la cantidad disponible.");
    }
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>{producto.nombre}</Text>
        <Text style={styles.texto}>Precio: ${producto.precio}</Text>
        <Text style={styles.texto}>Tipo: {producto.tipo}</Text>
        
        <Text style={styles.texto}>Cantidad disponible: {producto.cantidad}</Text> 
        
        <Text style={styles.texto}>Cantidad a comprar:</Text>
        <View style={styles.cantidadContainer}>
          <Button title="-" onPress={disminuirCantidad} color="#ff6f61" />
          <TextInput
            value={String(cantidad)}
            onChangeText={setCantidad}
            keyboardType="numeric"
            style={styles.input}
            editable={false} // Hacer el input no editable, solo mostrará el número
          />
          <Button title="+" onPress={aumentarCantidad} color="#ff6f61" />
        </View>
        
        <Button title="Confirmar Compra" onPress={handleCompra} color="#ff6f61" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffeae6', // Fondo salmón claro
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: '100%',
    padding: 20,
    backgroundColor: '#ffffff', // Fondo blanco
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff4500", // Color rojo
    marginBottom: 10,
  },
  texto: {
    fontSize: 18,
    marginVertical: 5,
    color: "#333", // Color gris oscuro
  },
  input: {
    height: 40,
    borderColor: "#ff6f61", // Color salmón
    borderWidth: 2,
    borderRadius: 5,
    width: "20%",
    textAlign: 'center', // Centrar el texto en el input
    marginHorizontal: 10,
  },
  cantidadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
