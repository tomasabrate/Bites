import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import ZorritoSelector from '../Registro/ZorritoSelector';
import FormInputController from "../Productos/components/FormInputController";
import DatePickerController from "../Productos/components/DatePickerController";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schemaClientes from "../Registro/utilities/schemaRegistroCliente.utilities";
import schemaComercios from "../Registro/utilities/schemaRegistroComercio.utilities";
import { useNavigation, useRoute } from '@react-navigation/native';
import { getClienteById, putCliente } from "../../services/clientes";
import { getComercioById, putComercio } from "../../services/comercios";
import { createTheme, TextField } from '@mui/material';
import BotonGenerico from "../../components/BotonGenerico";
import formatDate from "../Productos/utilities/formatDate.utilities";
import { SelectList } from "react-native-dropdown-select-list";
import { getCategoriasComercio, getCategoriaComercioById } from "../../services/categoriasComercio";


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
  const [user, setUser] = useState(null);
  const [activo, setActivo] = useState(null);
  const [categoriasComercio, setCategoriasComercio] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [idCategoriaActual, setIdCategoriaActual] = useState(null);
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [horarioApertura, setHorarioApertura] = useState(null);
  const [horarioCierre, setHorarioCierre] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await getCategoriasComercio();
        setCategoriasComercio(categorias.map((categoria, index) => ({
          value: categoria.nombre,
          key: index + 1
        })));
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchCategoriaActual = async () => {
      try {
        const categoriaActual = await getCategoriaComercioById(idCategoriaActual);
        setCategoriaActual({ key: categoriaActual.id_categoria, value: categoriaActual.nombre });
      } catch (error) {
        console.error("Error al obtener la categoría actual:", error);
      }
    };

    fetchCategoriaActual();
  }, [idCategoriaActual]);



  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      rol === "Cliente" ? schemaClientes : schemaComercios
    ),
  });

  useEffect(() => {
    setLoading(true);
    const obtenerUsuario = async () => {

      if (!uid) {
        console.log("No se encuentra usuario");
        return;
      }

      try {
        let data;

        if (rol === "Cliente") {
          data = await getClienteById(uid);
          console.log("Datos del cliente obtenido:", data);

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
        } else if (rol === "Comercio") {
          data = await getComercioById(uid);
          console.log("Datos del comercio obtenido:", data);

          setValue("uid_comercio", data.uid_comercio);
          setValue("mail", data.mail);
          setValue("nombre_comercio", data.nombre_comercio);
          setValue("id_categoria", data.id_categoria);
          setValue("descripcion", data.descripcion);
          setValue("direccion", data.direccion);
          setValue("telefono", data.telefono);
          setValue("horario_apertura", data.horario_apertura);
          setValue("horario_cierre", data.horario_cierre);
          setValue("zonas_entrega", data.zonas_entrega);
          setValue("costo_entrega", data.costo_entrega);
          setValue("metodos_pago", data.metodos_pago);
          setValue("imagenes", data.imagenes);
          setValue("activo", data.activo);

          setActivo(data.activo);
          setIdCategoriaActual(data.id_categoria);
          setHorarioApertura(data.horario_apertura);
          setHorarioCierre(data.horario_cierre);
        }

        setUser(data);
      } catch (error) {
        console.log("No se pudo cargar al usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuario();
  }, [uid, setValue]);

  const onSubmitCliente = async (data) => {
    const formData = {
      ...data,
      activo: activo,
      fecha_nacimiento: formatDate(data.fecha_nacimiento),
    };

    try {
      await putCliente(uid, formData);
      navigation.goBack();

    } catch (error) {
      console.log("Error al modificar el cliente:", error);
    }
  };

  const onSubmitComercio = async (data) => {
    console.log("Submit comercio")
    const formData = {
      ...data,
      activo: activo,
      id_categoria: selectedCategory,
    };

    console.log("Data Comercio:", formData);

    try {
      await putComercio(uid, formData);
      navigation.goBack();

    } catch (error) {
      console.log("Error al modificar el comercio:", error);
    }
  };

  if (loading) {
          return (
              <SafeAreaView style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ff6347" />
              </SafeAreaView>
          );
      }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
              {/* Cliente */}
              {rol === "Cliente" ? (
                <>
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
                </>


                // Comercio

              ) : rol === "Comercio" ? (
                <>
                  <View style={styles.section}>
                    <Text style={styles.label}>Nombre del Comercio</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Nombre del comercio"
                      placeholderTextColor="#888"
                      name="nombre_comercio"
                      errors={errors}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Categoria del Comercio</Text>
                    <SelectList
                      setSelected={(val) => {
                        console.log("Categoría seleccionada:", val);
                        setSelectedCategory(val);
                      }}
                      control={control}
                      data={categoriasComercio}
                      save="key"
                      placeholder={categoriaActual?.value || " Sin categoria"}
                      boxStyles={styles.selectBox}
                      dropdownStyles={styles.dropdown}
                      searchPlaceholder="Buscar categoría..."
                      errors={errors}
                      defaultOption={categoriaActual} // Usa el objeto con { key, value }
                    />

                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Descripción</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Descripción"
                      placeholderTextColor="#888"
                      name="descripcion"
                      errors={errors}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Dirección</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Dirección"
                      placeholderTextColor="#888"
                      name="direccion"
                      errors={errors}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Teléfono</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Teléfono"
                      placeholderTextColor="#888"
                      keyboardType="phone-pad"
                      name="telefono"
                      errors={errors}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Horario</Text>
                    <View style={styles.row}>
                      <Controller
                        control={control}
                        name="horario_apertura"
                        rules={{ required: "El horario de apertura es obligatorio" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <View style={styles.sectionHorario}>
                            <TextField
                              id="horario_apertura"
                              type="time"
                              defaultValue={horarioApertura}
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                              style={styles.inputHorario}
                              InputLabelProps={{
                                style: { color: '#888' },
                              }}
                              inputProps={{
                                style: { fontSize: 16 },
                              }}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </View>
                        )}
                      />
                      <Controller
                        control={control}
                        name="horario_cierre"
                        rules={{ required: "El horario de apertura es obligatorio" }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                          <View style={styles.sectionHorario}>
                            <TextField
                              id="horario_cierre"
                              type="time"
                              defaultValue={horarioCierre}
                              value={value}
                              onChange={(e) => onChange(e.target.value)}
                              style={styles.inputHorario}
                              InputLabelProps={{
                                style: { color: '#888' },
                              }}
                              inputProps={{
                                style: { fontSize: 16 },
                              }}
                              error={!!error}
                              helperText={error?.message}
                            />
                          </View>
                        )}
                      />
                    </View>
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Zonas de Entrega</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Zonas de entrega"
                      placeholderTextColor="#888"
                      name="zonas_entrega"
                      errors={errors}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Costo de Entrega</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Costo de entrega"
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      name="costo_entrega"
                      errors={errors}
                    />
                  </View>

                  <View style={styles.section}>
                    <Text style={styles.label}>Métodos de Pago</Text>
                    <FormInputController
                      control={control}
                      style={styles.input}
                      placeholder="Métodos de pago"
                      placeholderTextColor="#888"
                      name="metodos_pago"
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

                </>
              ) : null}

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
                  onPress={handleSubmit(rol === "Cliente" ? onSubmitCliente : onSubmitComercio)}
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
  submitButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionHorario: {
    flex: 1,
    marginHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegistroCliente;
