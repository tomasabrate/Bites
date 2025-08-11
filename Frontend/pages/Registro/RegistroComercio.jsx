import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import ComercioTermsModal from '../TerminosyCond/TermComercio';
import { useAuth } from '../../context/AuthContext';
import FormInputController from "../Productos/components/FormInputController";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schemaComercios from "./utilities/schemaRegistroComercio.utilities";
import BotonGenerico from "../../components/BotonGenerico";
import { useNavigation } from '@react-navigation/native';
import { postComercio } from "../../services/comercios";
import { SelectList } from "react-native-dropdown-select-list";
import { getCategoriasComercio } from "../../services/categoriasComercio";
import SelectorImagenPerfil from "../../components/SelectorImagenPerfil";
import { CargaDeImagenPerfil } from "../../utils/cargaDeImagenPerfil";
import ModalCerrarSesion from '../../components/ModalCerrarSesion';

import firebaseApp from '../../firebase_config';
import { getFirestore, doc, updateDoc } from "firebase/firestore";


const RegistroComercio = () => {
  const navigation = useNavigation();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [textModal, setTextModal] = useState("Continuar")
  const [envio, setEnvio] = useState(false)
  const [categoriasComercio, setCategoriasComercio] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [modalCSVisible, setModalCSVisible] = useState(false);


  const { user, logout } = useAuth();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaComercios) });

  console.log("Errores del formulario:", errors);

  useEffect(() => {
    if (user) {
      setValue("uid_comercio", user.uid);
      setValue("mail", user.email);
    }
  }, [setValue, user]);

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

  const onSubmit = async (data) => {
    console.log("Entró a onSubmit");
    const firestore = getFirestore(firebaseApp);
    const userDocRef = doc(firestore, "usuarios", user.uid);

    const imagenFinal = await CargaDeImagenPerfil(imageUri);

    const formData = {
      ...data,
      id_categoria: selectedCategory,
      foto_perfil: imagenFinal,
    };

    console.log("Comercio:", formData);
    console.log("Categoría seleccionada:", selectedCategory);

    try {
      console.log("Intentando enviar datos...");
      await postComercio(formData);

      console.log("Datos enviados correctamente");

      await updateDoc(userDocRef, {
        perfilCompleto: true,
      });

      setModalMessage("Perfil cargado, ya puede utilizar Bites");
      setModalVisible(true);
      setIsProfileLoaded(true);
    } catch (error) {
      console.error("Error al cargar perfil o actualizar Firestore:", error);
      setModalMessage("Error al cargar perfil, inténtelo de nuevo más tarde");
      setModalVisible(true);
      setIsProfileLoaded(false);
    }
  };

  const cerrarModal = () => {
    if (isProfileLoaded) {
      setModalVisible(false);
      navigation.navigate("InterfazComerciante");
    } else {
      setTextModal("Intentar nuevamente");
      setModalVisible(false);
    }
  };

  const toggleEnvio = () => {
    setEnvio(!envio);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Completa el perfil de tu Comercio</Text>

          <SelectorImagenPerfil onImageSelected={setImageUri} />

          <View style={styles.section}>
            <Text style={styles.label}>Nombre del Comercio</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Mi Tienda"
              placeholderTextColor="#888"
              name="nombre_comercio"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoria del Comercio</Text>
            <SelectList
              setSelected={(val) => {
                console.log("Categoría seleccionada:", val); // Depuración
                setSelectedCategory(val);
              }}
              control={control}
              data={categoriasComercio}
              save="key"
              placeholder="Seleccionar categoría"
              boxStyles={styles.selectBox}
              dropdownStyles={styles.dropdown}
              searchPlaceholder="Buscar categoría..."
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Descripcion del Comercio</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Describe tu negocio"
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
              placeholder="Calle 123, Ciudad"
              placeholderTextColor="#888"
              name="direccion"
              errors={errors}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Número de teléfono</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="555-1234567"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              name="telefono"
            />
          </View>

          <View style={styles.container2}>
            <Text style={styles.label}>Horario</Text>
            <View style={styles.row}>
              <Controller
                control={control}
                name="horario_apertura"
                rules={{ required: "El horario de apertura es obligatorio" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View style={styles.sectionHorario}>
                    <Text>Seccion horario apertura</Text>
                  </View>
                )}
              />
              <Controller
                control={control}
                name="horario_cierre"
                rules={{ required: "El horario de apertura es obligatorio" }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <View style={styles.sectionHorario}>
                    <Text>Seccion horario cierre</Text>
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.container2}>
            <BotonGenerico onPress={toggleEnvio} title={envio ? 'Con envio' : 'Sin envio'} colorInicial={envio ? '#088304' : '#aa0e0e'} />
            {envio && (
              <View>
                <View style={styles.section}>
                  <Text style={styles.label}>Costo de entrega</Text>
                  <FormInputController
                    control={control}
                    style={styles.input}
                    placeholder="$1000"
                    placeholderTextColor="#888"
                    name="costo_entrega"
                    errors={errors}
                  />
                  <Text>¡Atención! $0 es considerado envio gratis</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Zona de entrega</Text>
                  <FormInputController
                    control={control}
                    style={styles.input}
                    placeholder="Ciudad"
                    placeholderTextColor="#888"
                    name="zonas_entrega"
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity onPress={() => setShowTermsModal(true)}>
              <Text style={styles.termsText}>Leer Términos y Condiciones</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkedCheckbox]} />
              <Text style={styles.checkboxText}>He leído y acepto los términos y condiciones</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, !termsAccepted && styles.disabledButton]}
            onPress={termsAccepted ? () => {
              console.log("Botón presionado");
              handleSubmit(onSubmit)();
            } : null}
            disabled={!termsAccepted}
          >
            <Text style={styles.submitButtonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cerrarSesionButtom}
            onPress={() => setModalCSVisible(true)}
          >
            <Text style={styles.cerrarSesionButtonText}>
              Cerrar Sesión, completar perfil más tarde
            </Text>
          </TouchableOpacity>
        </View>

        <ComercioTermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
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
              title={textModal}
              onPress={cerrarModal}
            />
          </View>
        </View>
      </Modal>

      <ModalCerrarSesion
        visible={modalCSVisible}
        onClose={() => setModalCSVisible(false)}
      />
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
  container2: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    marginTop: 20,
  }
  ,
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
  inputHorario: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 15,
  },
});

export default RegistroComercio;
