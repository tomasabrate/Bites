import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker'; // Importa el Picker
import DateTimePicker from '@react-native-community/datetimepicker'; // Importa DateTimePicker

export default function ProductoForm({ onSubmit }) {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("Postres"); // Establece un valor por defecto
  const [precio, setPrecio] = useState("");
  const [fechaProduccion, setFechaProduccion] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [cantidad, setCantidad] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [showFechaProduccion, setShowFechaProduccion] = useState(false);
  const [showFechaVencimiento, setShowFechaVencimiento] = useState(false);

  const handleSubmit = () => {
    const newProduct = { 
      nombre, 
      tipo, 
      precio: parseFloat(precio), 
      fecha_produccion: fechaProduccion,
      fecha_vencimiento: fechaVencimiento,
      cantidad: parseInt(cantidad),
      imagenes 
    };
    onSubmit(newProduct);
    
    // Limpiar el formulario si es necesario
    setNombre("");
    setTipo("Postres");
    setPrecio("");
    setFechaProduccion(new Date());
    setFechaVencimiento(new Date());
    setCantidad("");
    setImagenes([]);
  };

  const handleImageUpload = () => {
    // Aquí puedes agregar la lógica para subir imágenes, por ejemplo, usando un selector de imágenes
    Alert.alert("Imagenes cargadas!"); // Mensaje de prueba
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />
      <Picker
        selectedValue={tipo}
        onValueChange={(itemValue) => setTipo(itemValue)} // Cambia el tipo según la selección
        style={styles.picker}
      >
        <Picker.Item label="Postres" value="Postres" />
        <Picker.Item label="Comida Saludable" value="Comida Saludable" />
        <Picker.Item label="Bebidas" value="Bebidas" />
        <Picker.Item label="Viandas" value="Viandas" />
        <Picker.Item label="Comida Rápida" value="Comida Rápida" />
      </Picker>
      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Seleccionar Fecha de Producción" onPress={() => setShowFechaProduccion(true)} />
      {showFechaProduccion && (
        <DateTimePicker
          value={fechaProduccion}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFechaProduccion(false);
            if (date) {
              setFechaProduccion(date);
            }
          }}
        />
      )}
      <TextInput
        placeholder="Fecha de Vencimiento (YYYY-MM-DD)"
        value={fechaVencimiento.toISOString().split('T')[0]} // Formato de fecha
        onFocus={() => setShowFechaVencimiento(true)}
        editable={false} // Desactivar la edición directa
        style={styles.input}
      />
      {showFechaVencimiento && (
        <DateTimePicker
          value={fechaVencimiento}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowFechaVencimiento(false);
            if (date) {
              setFechaVencimiento(date);
            }
          }}
        />
      )}
      <Button title="Cargar Imágenes" onPress={handleImageUpload} />
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
  picker: {
    height: 50,
    marginBottom: 20,
  },
});
