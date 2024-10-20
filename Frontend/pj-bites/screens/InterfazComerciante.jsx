// InterfazComerciante.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function InterfazComerciante() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Función para obtener las publicaciones del comerciante
  const obtenerPublicaciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/publicaciones"); // Cambia esto por tu endpoint
      const data = await response.json();
      setPublicaciones(data);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      setError("Error al obtener publicaciones. Inténtalo de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Mis Publicaciones</Text>
      {cargando ? (
        <Text>Cargando publicaciones...</Text>
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={publicaciones}
          keyExtractor={(item) => item.id_producto.toString()}
          renderItem={({ item }) => (
            <View style={styles.publicacion}>
              <Text>{item.nombre}</Text>
              <Text>Precio: ${item.precio}</Text>
              <Text>Tipo: {item.tipo}</Text>
              {/* Agrega más información si es necesario */}
            </View>
          )}
        />
      )}
      <Button
        title="Agregar Producto"
        onPress={() => navigation.navigate("CargarProducto")} // Navega a la pantalla de agregar producto
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  publicacion: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 5,
    width: "100%",
  },
});
