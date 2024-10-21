// pages/Cart.jsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useCart } from '../context/CartContext'; // Asegúrate de que la ruta es correcta
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener este import

const Cart = () => {
  const { carrito, eliminarDelCarrito } = useCart(); // Obtener el carrito y la función para eliminar productos

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos en el Carrito:</Text>
      {carrito.length === 0 ? ( // Mensaje si el carrito está vacío
        <Text>No hay productos en el carrito.</Text>
      ) : (
        <FlatList
          data={carrito}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.productoNombre}>{item.nombre}</Text>
              <Text>Precio: ${item.precio}</Text>
              <Pressable onPress={() => eliminarDelCarrito(item.id_producto)}>
                <Icon name="trash" size={24} color="red" />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productoNombre: {
    fontSize: 18,
  },
});

export default Cart;
