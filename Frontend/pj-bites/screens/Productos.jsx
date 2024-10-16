import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import Producto from "../components/Producto";

export default function Productos({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  console.log("Navigation prop:", navigation);

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setError("Error al obtener productos. Inténtalo de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Agregar producto"
          onPress={() => navigation.navigate("ProductoForm")}
        />
      </View>
      <Text>Promociones del día!</Text>
      {cargando ? (
        <Text>Cargando productos...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <Producto
              id_producto={item.id_producto}
              nombre={item.nombre}
              tipo={item.tipo} // Asegúrate de que 'tipo' está disponible
              precio={item.precio}
              onPress={() => {console.log("Producto presionado:", item);
                navigation.navigate("DetalleProducto", { producto: item })}}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffeae6',
  },
  buttonContainer: {
    marginVertical: 10, // Espacio entre los botones
    borderRadius: 5,
    overflow: "hidden", // Para bordes redondeados
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});
