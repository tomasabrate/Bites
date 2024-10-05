import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Producto from "../components/Producto";

export default function Productos({ navigation }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

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
              onPress={() => navigation.navigate("DetalleProducto", { producto: item })}
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
});
