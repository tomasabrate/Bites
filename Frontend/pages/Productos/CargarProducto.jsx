import React, { useState, useEffect } from "react";
import DatePickerController from "./components/DatePickerController";
import FormInputController from "./components/FormInputController";
import ImagePickerController from "./components/ImagePickerController";
import { View, StyleSheet, FlatList, Modal, TouchableOpacity, Text } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import formatDate from "./utilities/formatDate.utilities";
import BotonGenerico from "../../components/BotonGenerico";
import schema from "./utilities/schemaCargaProducto.utilities";
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState([]); // Estado para las categorías
  const [selectedTipo, setSelectedTipo] = useState(""); //
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
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
        console.log("Producto cargado");
        setModalMessage("Producto cargado!"); //error -> mensaje
        setModalVisible(true); // Mostrar el modal en caso de error
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setModalMessage("Error al eliminar el producto. El producto ya fue vendido.");
      setModalVisible(true); // Mostrar el modal en caso de error
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
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
            <View style={styles.buttonContainer}>
              <BotonGenerico
                title={"Cancelar"}
                color={"#ff0000"}
                onPress={() => navigation.goBack()}
              />
              <BotonGenerico
                title="Publicar Producto!"
                color={"#ff8566"}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        )}
      />
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTexto}>{modalMessage}</Text>
            <TouchableOpacity style={styles.botonCerrar} onPress={() => {
              cerrarModal();
              navigation.goBack(); 
            }}>
              <Text style={styles.botonTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTexto: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  botonCerrar: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
