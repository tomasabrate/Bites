import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

export default function ProductoForm({ onSubmit }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = () => {
    const newProduct = { nombre, tipo, precio: parseFloat(precio) };
    onSubmit(newProduct);
    // Limpiar el formulario si es necesario
    setNombre("");
    setTipo("");
    setPrecio("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <TextInput
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
        style={styles.input}
      />
      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Agregar Producto" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
