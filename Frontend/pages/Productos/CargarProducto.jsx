import React, { useState, useEffect } from "react";
import DatePickerController from "./components/DatePickerController";
import FormInputController from "./components/FormInputController";
import ImagePickerController from "./components/ImagePickerController";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SelectList } from "react-native-dropdown-select-list";
import formatDate from "./utilities/formatDate.utilities";
import BotonGenerico from "../../components/BotonGenerico";
import schema from "./utilities/schemaCargaProducto.utilities";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { postProducto } from "../../services/productos";

const categorias = [
  { value: "Comida Rápida", key: 1 },
  { value: "Saludable", key: 2 },
  { value: "Bebidas", key: 3 },
  { value: "Viandas", key: 4 },
  { value: "Postres", key: 5 },
];

const tipos = [
  { value: "Unidad", key: 1 },
  { value: "Bolson", key: 2 },
];

export default function CargarProducto({ route }) {
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
    //Por defecto las fechas son del dia actual
    setValue("fecha_produccion", new Date())
    setValue("fecha_vencimiento", new Date())
    setValue("tipo", "unidad");
    setValue("activo", 1);
  }, [setValue]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      tipo: selectedTipo,
      id_categoria: selectedCategories, // Añade las categorías seleccionadas
      fecha_produccion: formatDate(data.fecha_produccion), // Formatear fecha de producción
      fecha_vencimiento: formatDate(data.fecha_vencimiento), // Formatear fecha de vencimiento
    };

    console.log("Producto:", formData);

    try {
      //CrearProducto
      await postProducto(formData);
      setModalMessage("¡Producto cargado exitosamente!");
      setModalVisible(true);

      //Actualizar pantalla principal "Mis productos"
      if (route.params?.onProductAdded) {
        route.params.onProductAdded();
      }
    } catch (error) {
      setModalMessage(
        "Error al cargar el producto. Por favor, intente nuevamente."
      );
      setModalVisible(true);
    }
  };
  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cargar Producto</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
            <FormInputController
              control={control}
              name="nombre"
              placeholder="Nombre del producto"
              errors={errors}
              style={styles.input}
            />
            <FormInputController
              control={control}
              name="descripcion"
              placeholder="Descripción del producto"
              errors={errors}
              style={styles.input}
              multiline
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precios y Stock</Text>
            <FormInputController
              control={control}
              name="precio"
              placeholder="Precio"
              keyboardType="numeric"
              errors={errors}
              style={styles.input}
            />
            <FormInputController
              control={control}
              name="descuento"
              placeholder="Descuento"
              keyboardType="numeric"
              errors={errors}
              style={styles.input}
            />
            <FormInputController
              control={control}
              name="cantidad"
              placeholder="Stock disponible"
              keyboardType="numeric"
              errors={errors}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorización</Text>
            <SelectList
              setSelected={setSelectedCategories}
              data={categorias}
              save="key"
              placeholder="Seleccionar categoría"
              boxStyles={styles.selectBox}
              dropdownStyles={styles.dropdown}
              searchPlaceholder="Buscar categoría..."
            />
            <SelectList
              setSelected={setSelectedTipo}
              data={tipos}
              save="key"
              placeholder="Seleccionar tipo"
              boxStyles={styles.selectBox}
              dropdownStyles={styles.dropdown}
              searchPlaceholder="Buscar tipo..."
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fechas</Text>
            <DatePickerController
              control={control}
              name="fecha_produccion"
              title="Fecha de Producción"
              errors={errors}
            />
            <DatePickerController
              control={control}
              name="fecha_vencimiento"
              title="Fecha de Vencimiento"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Imágenes</Text>
            <ImagePickerController
              control={control}
              name="imagenes"
              title="Seleccionar imágenes"
              errors={errors}
            />
          </View>

          <View style={styles.buttonContainer}>
            <BotonGenerico
              title="Cancelar"
              onPress={() => navigation.goBack()}
              colorInicial="#f44336"
              colorPressed="#d32f2f"
            />
            <BotonGenerico
              title="Publicar Producto"
              onPress={handleSubmit(onSubmit)}
              colorInicial="#4CAF50"
              colorPressed="#45a049"
            />
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTexto}>{modalMessage}</Text>
            <BotonGenerico
              title="Cerrar"
              onPress={() => {
                cerrarModal();
                navigation.goBack();
              }}
              colorInicial="#4CAF50"
              colorPressed="#45a049"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ff6347",
  },
  header: {
    backgroundColor: "#ff6347",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 16,
  },
  backButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectBox: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTexto: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
});
