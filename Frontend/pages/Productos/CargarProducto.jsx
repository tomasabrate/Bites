import React, { useState, useEffect } from "react";
import DatePickerController from "./components/DatePickerController";
import FormInputController from "./components/FormInputController";
import ImagePickerController from "./components/ImagePickerController";
import { View, StyleSheet, FlatList } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert } from "react-native";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import formatDate from "./utilities/formatDate.utilities";
import BotonGenerico from "../../components/BotonGenerico";
import schema from "./utilities/schemaCargaProducto.utilities";
import { Button } from "react-native-web";
import { Pressable } from "react-native-gesture-handler";

const categorias = [
  { value: "Comida Rápida", key: 1 },
  { value: "Saludable", key: 2 },
  { value: "Bebidas", key: 3 },
  { value: "Viandas", key: 4 },
  { value: "Postres", key: 5 },
];

const tipos = [
  { value: "Unidad", key: "1" },
  { value: "Bolson", key: "2" },
];

export default function CargarProducto() {
  const [selectedCategories, setSelectedCategories] = useState([]); // Estado para las categorías
  const [selectedTipo, setSelectedTipo] = useState(""); //
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

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tipo: selectedTipo,
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
          <FormInputController
            control={control}
            name={"precio"}
            placeholder={"Precio del producto..."}
            keyboardType="numeric"
            errors={errors}
          />
          <FormInputController
            control={control}
            name={"descuento"}
            placeholder={"Descuento..."}
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
          <MultipleSelectList
            setSelected={setSelectedCategories}
            label="Categorias..."
            data={categorias}
            styles={styles.picker}
            save="key"
          />
          <SelectList
            setSelected={setSelectedTipo}
            label="Tipo..."
            data={tipos}
            styles={styles.picker}
            save="key"
          />
          <DatePickerController
            control={control}
            name={"fecha_produccion"}
            title={"Fecha Produccion"}
            errors={errors}
          />
          <DatePickerController
            control={control}
            name={"fecha_vencimiento"}
            title={"Fecha Vencimiento"}
            errors={errors}
          />
          <ImagePickerController
            control={control}
            name={"imagenes"}
            title="Seleccionar imagenes"
            errors={errors}
          />
          {mostrar && <FormInputController name={"tipo"} />}
          {mostrar && <FormInputController name={"activo"} />}
          <BotonGenerico
            title="Publicar Producto!"
            color={"#ff8566"}
            onPress={handleSubmit(onSubmit)}
          />
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
    flexDirection: "row", // Para alinear los inputs en fila
    justifyContent: "space-between", // Espacio entre los inputs
    width: "100%",
    marginBottom: 10,
  },
  inputHalf: {
    width: "48%",
  },
  picker: {
    height: 35,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    padding: 10,
    minWidth: "100%",
  },
});
