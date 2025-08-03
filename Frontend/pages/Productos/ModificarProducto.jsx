import React, { useState, useEffect, useCallback } from "react";
import DatePickerController from "./components/DatePickerController";
import FormInputController from "./components/FormInputController";
import ImagePickerController from "./components/ImagePickerController";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  SafeAreaView,
} from "react-native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SelectList } from "react-native-dropdown-select-list";
import formatDate from "./utilities/formatDate.utilities";
import BotonGenerico from "../../components/BotonGenerico";
import schema from "./utilities/schemaCargaProducto.utilities";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getProductoById, putProducto } from "../../services/productos";
import { CargaDeImagenes } from "../../utils/cargaDeImagenes";



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
  const { productoId, actualizarProductos } = route.params;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [producto, setProducto] = useState(null);
  const [cambioImg, setCambioImg] = useState(false);

  const [guardando, setGuardando] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const obtenerProducto = useCallback(async () => {
    if (!productoId) {
      console.log("Producto ID no válido");
      setCargando(false);
      return;
    }

    try {
      const data = await getProductoById(productoId);
      setProducto(data);
      console.log("Datos del producto obtenidos:", data);

      setValue("uid_comercio", data.uid_comercio);
      setValue("nombre", data.nombre);
      setValue("descripcion", data.descripcion);
      setValue("precio", data.precio);
      setValue("descuento", data.descuento);
      setValue("cantidad", data.cantidad);
      setValue("fecha_produccion", data.fecha_produccion);
      setValue("fecha_vencimiento", data.fecha_vencimiento);
      setValue("activo", 1);
      setValue("imagenes", data.imagenes);
      setSelectedCategories(data.id_categoria);
      setSelectedTipo(data.tipo);
      console.log(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el producto.");
    } finally {
      setCargando(false);
    }
  }, [productoId, setValue]);

  useEffect(() => {
    obtenerProducto();
  }, [obtenerProducto]);

  const onSubmit = async (data) => {
    let imagenesFinales = await CargaDeImagenes(data);

    // Si no se eligieron nuevas imágenes, conservar las actuales
    if (!imagenesFinales || imagenesFinales.length === 0) {
      imagenesFinales = producto.imagenes?.split(";") || [];
    }

    const formData = {
      ...data,
      tipo: selectedTipo,
      activo: 1,
      id_categoria: selectedCategories,
      fecha_produccion: formatDate(data.fecha_produccion),
      fecha_vencimiento: formatDate(data.fecha_vencimiento),
      imagenes: imagenesFinales,
    };

    try {
      setGuardando(true);
      await putProducto(productoId, formData);
      setGuardando(false);
      Alert.alert(
        "Producto modificado",
        "El producto se ha modificado exitosamente."
      );
      actualizarProductos();
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }


    
  };

  if (guardando) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Guardando cambios...</Text>
      </View>
    );
  }

  if (cargando || !producto) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Modificar Producto</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
              imagenesIniciales={producto.imagenes?.split(";") || []}
              setValue={setValue}
            />
          </View>

          <View style={styles.buttonContainer}>
            <BotonGenerico
              title="Cancelar"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              textStyle={styles.buttonText}
              colorInicial="#f44336"
              colorPressed="#d32f2f"
            />
            <BotonGenerico
              title="Guardar Cambios"
              onPress={handleSubmit(onSubmit)}
              style={styles.saveButton}
              textStyle={styles.buttonText}
              colorInicial="#4CAF50"
              colorPressed="#45a049"
            />
          </View>
        </View>
      </ScrollView>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: "#28a745",
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});
