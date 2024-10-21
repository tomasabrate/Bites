import React, { useState, useEffect } from "react";
import DatePickerController from "./components/DatePickerController";
import FormInputController from "./components/FormInputController";
import ImagePickerController from "./components/ImagePickerController";
import { View, StyleSheet, Button, FlatList } from "react-native";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const schema = yup.object({
  nombre: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres.")
    .required("El nombre del producto es obligatorio"),
  descripcion: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres."),
  precio: yup.number().required("El precio del producto es obligatorio"),
  descuento: yup.number().required("El descuento del producto es obligatorio"),
  cantidad: yup.number().required("La cantidad del producto es obligatoria"),
  fecha_produccion: yup.date().required("La fecha de produccion es obligatoria"),
  fecha_vencimiento: yup.date().required("La fecha de vencimiento es obligatoria"),
  imagenes: yup.array().required("Minimo 1 imagen"),
});

const items = [
  { value: 1, label: "Comida Rápida" , key: 1},
  { value: 2, label: "Saludable", key: 1 },
];

export default function CargarProducto() {
  const [selectedCategories, setSelectedCategories] = useState([]); // Estado para las categorías
  const mostrar = false;

  const {
    handleSubmit,
    control,
    setValue, // Agregar setValue para asignar el id_vendedor
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Asignar el id_vendedor cuando el componente se monte
  useEffect(() => {
    setValue("id_vendedor", 1); // Valor defecto hasta tener funcionalidad de perfiles
    //setValue("descuento", 0); // Por defecto al cargar
    setValue("tipo", "unidad");
    setValue("activo", 1);
  }, [setValue]);

  const showAlert = () => {
    Alert.alert("Alerta de publicacion.", "Producto publicado con exito!", [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
  };

  //Transforma formato de fecha para que no tenga hora
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Sumar 1 porque los meses son 0-indexados
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      categorias: selectedCategories, // Añade las categorías seleccionadas
      fecha_produccion: formatDate(data.fecha_produccion), // Formatear fecha de producción
      fecha_vencimiento: formatDate(data.fecha_vencimiento), // Formatear fecha de vencimiento
    };
  
    console.log("Producto:", formData);
  
    try {
      const response = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convierte los datos a formato JSON
      });
  
      if (response.ok) {
        showAlert();
      } else {
        const errorData = await response.json();
        console.error("Error en la respuesta:", errorData);
        Alert.alert("Error", "Hubo un error al cargar el producto.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <FlatList
  data={[{}]} // Agrega un elemento para renderizar el FlatList
  keyExtractor={(item, index) => index.toString()}
  renderItem={() => (
    <View style={styles.container}>
      {mostrar && (
        <FormInputController
          control={control}
          name={"id_vendedor"}
          errors={errors}
        />
      )}
      <FormInputController
        control={control}
        name={"nombre"}
        placeholder={"Nombre del producto..."}
        errors={errors}
      />
      <FormInputController
        control={control}
        name={"descripcion"}
        placeholder={"Descripcion del producto..."}
        errors={errors}
      />
      <View style={styles.rowContainer}>
        <FormInputController
          control={control}
          name={"precio"}
          placeholder={"Precio del producto..."}
          keyboardType="numeric"
          errors={errors}
          style={styles.inputHalf}
        />
        <FormInputController
          control={control}
          name={"descuento"}
          placeholder={"Descuento..."}
          keyboardType="numeric"
          errors={errors}
          style={styles.inputHalf} 
        />
      </View>
      <FormInputController
        control={control}
        name={"cantidad"}
        placeholder={"Stock..."}
        keyboardType="numeric"
        errors={errors}
      />
      <MultipleSelectList
        setSelected={setSelectedCategories}
        label="Categorias..."
        data={items}
        styles={styles.picker}
        save="key"
      />
      <DatePickerController
        control={control}
        name={"fecha_produccion"}
        label={"Fecha Produccion(*)"}
        errors={errors}
      />
      <DatePickerController
        control={control}
        name={"fecha_vencimiento"}
        label={"Fecha Vencimiento(*)"}
        errors={errors}
      />
      <ImagePickerController
        control={control}
        name={"imagenes"}
        title="Seleccionar imagenes"
        errors={errors}
      />
      {mostrar && (
        <FormInputController
          name={"tipo"}
        />
      )}
      {mostrar && (
        <FormInputController
          name={"activo"}
        />
      )}
      <Button title="Publicar Producto!" onPress={handleSubmit(onSubmit)} color={'#ff6347'} />
    </View>
  )}
/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    width: "100%",
    padding: 15,
  },
  rowContainer: {
    flexDirection: 'row', // Para alinear los inputs en fila
    justifyContent: 'space-between', // Espacio entre los inputs
    width: '100%',
    marginBottom: 10,
  },
  inputHalf: {
    width: '48%', 
  },
  picker: {
    height: 35,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    width: "100%",
  },
});