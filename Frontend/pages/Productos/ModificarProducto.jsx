import React, { useState, useEffect } from "react";
import DatePickerController from "./components/DatePickerController";
import FormInputController from "./components/FormInputController";
import ImagePickerController from "./components/ImagePickerController";
import { View, StyleSheet, FlatList, Alert, Text } from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SelectList } from "react-native-dropdown-select-list";
import formatDate from "./utilities/formatDate.utilities";
import BotonGenerico from "../../components/BotonGenerico";
import schema from "./utilities/schemaCargaProducto.utilities";
import { useNavigation, useRoute } from "@react-navigation/native";

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

export default function ModificarProducto() {
  const navigation = useNavigation();
  const route = useRoute();
  const productoId = route.params?.productoId; // ID del producto a modificar

  console.log("Producto ID:", productoId); // Verificar productoId

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [cargando, setCargando] = useState(true);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    // Función para obtener los datos del producto
    const obtenerProducto = async () => {
      if (!productoId) {
        console.log("Producto ID no válido"); // Verificación de productoId
        setCargando(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/productos/${productoId}`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();

        // Verifica que los datos sean válidos antes de prellenar los campos
        if (data) {
          console.log("Datos del producto obtenidos:", data); // Verificar datos del producto

          // Prellenar los campos con los datos obtenidos
          setValue("id_vendedor", data.id_vendedor);
          setValue("nombre", data.nombre);
          setValue("descripcion", data.descripcion);
          setValue("precio", data.precio.toString());
          setValue("descuento", data.descuento.toString());
          setValue("cantidad", data.cantidad.toString());
          setValue("fecha_produccion", data.fecha_produccion);
          setValue("fecha_vencimiento", data.fecha_vencimiento);
          setValue("activo", 1);
          setSelectedCategories(data.id_categoria);
          setSelectedTipo(data.tipo);
        } else {
          throw new Error("No se encontraron datos para el producto");
        }
      } catch (error) {
        console.error("Error al obtener producto:", error);
        Alert.alert("Error", "No se pudo cargar el producto.");
      } finally {
        setCargando(false);
      }
    };

    obtenerProducto();
  }, [productoId, setValue]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tipo: selectedTipo,
      activo:1,
      id_categoria: selectedCategories,
      fecha_produccion: formatDate(data.fecha_produccion),
      fecha_vencimiento: formatDate(data.fecha_vencimiento),
    };

    try {
      const response = await fetch(
        `http://localhost:3000/productos/${productoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Producto modificado",
          "El producto se ha modificado exitosamente."
        );

        // Aquí llamas a la función para actualizar la lista en InterfazComerciante
        const { actualizarProductos } = route.params; // Asegúrate de importar route si usas react-navigation
        actualizarProductos(); // Llama a la función para actualizar la lista

        navigation.goBack(); // Navegar de vuelta a la pantalla anterior
      } else {
        const errorData = await response.json();
        console.error("Error en la respuesta:", errorData);
        Alert.alert("Error", "Hubo un error al modificar el producto.");
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  if (cargando) return <Text>Cargando...</Text>; // Mostrar texto de carga

  return (
    <View style={styles.container}>
      <FlatList
        data={[{}]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => (
          <View style={styles.innerContainer}>
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
            <SelectList
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
            <View style={styles.buttonContainer}>
              <BotonGenerico
                title={"Cancelar"}
                color={"#ff0000"}
                onPress={() => navigation.goBack()}
              />
              <BotonGenerico
                title="Modificar Producto!"
                color={"#ff8566"}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        )}
      />
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
  innerContainer: {
    width: "100%",
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
});
//MODIFICARPRODUCTO.JSX
