import React, { useState } from "react";
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
  nombreProducto: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres.")
    .required("El nombre del producto es obligatorio"),
  descripcion: yup
    .string()
    .min(3, "Minimo 3 caracteres")
    .max(250, "Maximo 250 caracteres."),
  precio: yup.number().required("El precio del producto es obligatorio"),
  cantidad: yup.number().required("La cantidad del producto es obligatoria"),
  descuento: yup.number().required("El descuento es obligatorio."),
  fechaProduccion: yup.date().required("La fecha de produccion es obligatoria"),
  fechaVencimiento: yup
    .date()
    .required("La fecha de vencimiento es obligatoria"),
  imagenes: yup.array().required("Minimo 1 imagen"),
});

const items = [
  { value: "Saludable", key: "saludable" },
  { value: "Integral", key: "integral" },
  { value: "Panaderia", key: "panaderia" },
  { value: "Restaurante", key: "restaurante" },
  { value: "Congelado", key: "congelado" },
];

export default function CargarProducto() {
  const [selectedCategories, setSelectedCategories] = useState([]); // Estado para las categorías
  const fechaProd = new Date();
  const fechaVenc = new Date();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const showAlert = () => {
    Alert.alert("Alerta de publicacion.", "Producto publicado con exito!", [
      {
        text: "OK",
        onPress: () => console.log("OK Pressed"),
      },
    ]);
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      categorias: selectedCategories, // Añade las categorías seleccionadas
    };
    console.log(formData);
    showAlert();
  };

  return (
    <FlatList
      data={[{}]} // Agrega un elemento para renderizar el FlatList
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => (
        <View style={styles.container}>
          <FormInputController
            control={control}
            name={"nombreProducto"}
            placeholder={"Nombre del producto..."}
            errors={errors}
          />
          <FormInputController
            control={control}
            name={"descripcion"}
            placeholder={"Descripcion del producto..."}
            errors={errors}
          />
          <FormInputController
            control={control}
            name={"precio"}
            placeholder={"Precio del producto..."}
            keyboardType="numeric"
            errors={errors}
          />
          <FormInputController
            control={control}
            name={"cantidad"}
            placeholder={"Stock..."}
            keyboardType="numeric"
            errors={errors}
          />
          <FormInputController
            control={control}
            name={"descuento"}
            placeholder={"Porcentaje de descuento..."}
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
            name={"fechaProduccion"}
            label={"Fecha Produccion(*)"}
            date={fechaProd}
            errors={errors}
          />
          <DatePickerController
            control={control}
            name={"fechaVencimiento"}
            label={"Fecha Vencimiento(*)"}
            date={fechaVenc}
            errors={errors}
          />
          <ImagePickerController
            control={control}
            name={"imagenes"}
            title="Seleccionar imagenes"
            errors={errors}
          />
          <Button title="Publicar Producto!" onPress={handleSubmit(onSubmit)} />
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
