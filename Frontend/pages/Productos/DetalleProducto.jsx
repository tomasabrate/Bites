import * as React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useCart } from '../../context/CartContext'; // Asegúrate de que la ruta es correcta

export default function DetalleProducto({ navigation, route }) {
  const producto = route.params.producto;
  const { agregarAlCarrito } = useCart(); // Obtener la función de agregar al carrito

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito(producto);
    console.log('Agregado')
    Alert.alert("Producto añadido", `${producto.nombre} ha sido añadido al carrito.`, [
      { text: "Ir al Carrito", onPress: () => navigation.navigate("Carrito") },
      { text: "Cancelar", style: "cancel" },
    ]);
  };
  

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
          onPress={handleAgregarAlCarrito} // Cambié aquí
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
  },
  nombre: {
    fontSize: 24,
    fontWeight: "bold",
  },
  precio: {
    fontSize: 20,
    marginTop: 10,
  },
});
