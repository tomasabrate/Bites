import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import ZorritoSelector from '../Registro/ZorritoSelector';
import FormInputController from "../Productos/components/FormInputController";
import DatePickerController from "../Productos/components/DatePickerController";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schemaClientes from "../Registro/utilities/schemaRegistroCliente.utilities";
import schemaComercios from "../Registro/utilities/schemaRegistroComercio.utilities";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getClienteById, putCliente } from "../../services/clientes";
import { createTheme, TextField } from '@mui/material';
import BotonGenerico from "../../components/BotonGenerico";
import formatDate from "../Productos/utilities/formatDate.utilities";


const categories = ['Postres', 'Comida Saludable', 'Bebidas', 'Viandas', 'Comida Rápida'];

const theme = createTheme({
  palette: {
    customGris: {
      main: '#ded8cd',
      contrastText: '#fff',
    },
  },
});

const RegistroCliente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { uid, rol } = route.params;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedZorrito, setSelectedZorrito] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [user, setUser] = useState(null);
  const [activo, setActivo] = useState(null);

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaClientes) });

  useEffect(() => {
    const obtenerUsuario = async () => {

      if (!uid) {
        console.log("No se encuentra usuario");
        setCargando(false);
        return;
      }

      try {
        const data = await getClienteById(uid);
        setUser(data);
        console.log("Datos del usuario obtenido:", data);
        console.log(data.nombre)

        setValue("uid_cliente", data.uid_cliente);
        setValue("mail", data.mail);
        setValue("nombre", data.nombre);
        setValue("apellido", data.apellido);
        setValue("fecha_nacimiento", data.fecha_nacimiento);
        setValue("domicilio", data.domicilio);
        setValue("telefono", data.telefono);
        setValue("preferencias_alimentarias", data.preferencias_alimentarias);
        setValue("foto_perfil", data.foto_perfil);
        setValue("activo", data.activo);

        setActivo(data.activo);

      } catch (error) {
        console.log("No se pudo cargar al usuario:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerUsuario();
  }, [uid, setValue]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      activo: activo,
      fecha_nacimiento: formatDate(data.fecha_nacimiento),
    };

    try {
      await putCliente(uid, formData);
      navigation.goBack();

    } catch (error) {
      console.log("Error al modificar el usuario:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>

          <ZorritoSelector onSelect={setSelectedZorrito} />

          <View style={styles.section}>
            <Text style={styles.label}>Nombre</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#888"
              name="nombre"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Apellido</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor="#888"
              name="apellido"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Fecha de Nacimiento</Text>
            <DatePickerController
              control={control}
              name="fecha_nacimiento"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Domicilio</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Domicilio"
              placeholderTextColor="#888"
              name="domicilio"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Número de Teléfono</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Nro de teléfono"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              name="telefono"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Estado de cuenta</Text>
            <View style={styles.options}>
              <TouchableOpacity
                style={[styles.option, activo === 1 && styles.selected]}
                onPress={() => setActivo(1)}
              >
                <Text style={[styles.text, activo === 1 && styles.textSelected]}>Activo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.option, activo === 0 && styles.selected]}
                onPress={() => setActivo(0)}
              >
                <Text style={[styles.text, activo === 0 && styles.textSelected]}>No Activo</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Preferencias Alimentarias</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategories.includes(category) && styles.selectedCategory,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.modalBotones}>
            <BotonGenerico
              title="Cancelar"
              onPress={() => navigation.goBack()}
              colorInicial="#7a7878"
              colorPressed="#c4c4c4"
            />

            <BotonGenerico
              style={styles.submitButton}
              title="Guardar cambios"
              onPress={handleSubmit(onSubmit)}
              colorInicial="#f44336"
              colorPressed="#d32f2f"
            />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333'
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 50,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: '45%',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#ff6347',
  },
  categoryText: {
    color: '#333',
    fontSize: 16,
  },
  termsContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  termsText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#4caf50', // Color cuando está seleccionado
  },
  checkboxText: {
    marginLeft: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cerrarSesionButtom: {
    backgroundColor: '#aa0e0e',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  cerrarSesionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    padding: 5,
    marginTop: 2,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'nowrap',
    gap: 8,
  },
  options: { flexDirection: 'row' },
  option: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 5,
  },
  selected: { backgroundColor: '#f44336', borderColor: '#f77c72' },
  text: { fontSize: 16 },
  textSelected: { fontSize: 16, color: 'white' },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default RegistroCliente;
