import React from "react";
import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  // Función para obtener productos del backend
  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/productos"); //Aqui tiene que ir el dominio o puerto donde tengas corriendo el back.
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Ejecutar la función para obtener productos al cargar la pantalla
  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffeae6",
      }}
    >
      <Text>Productos!</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id_producto.toString()}
        renderItem={({ item }) => <Text>{item.nombre}{}</Text>}
      />
    </View>
  );
}
