import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ClientTermsModal from '../TerminosyCond/TermCliente';
import { useAuth } from '../../context/AuthContext';
import FormInputController from '../Productos/components/FormInputController';
import DatePickerController from '../Productos/components/DatePickerController';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import schemaClientes from './utilities/schemaRegistroCliente.utilities';
import formatDate from '../Productos/utilities/formatDate.utilities';
import BotonGenerico from '../../components/BotonGenerico';
import { useNavigation, useRoute } from '@react-navigation/native';
import { postCliente } from '../../services/clientes';
import SelectorImagenPerfil from "../../components/SelectorImagenPerfil";
import { CargaDeImagenPerfil } from "../../utils/cargaDeImagenPerfil";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import firebaseApp from "../../firebase_config";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
const auth = getAuth(firebaseApp);

const categories = [
  'Postres',
  'Comida Saludable',
  'Bebidas',
  'Viandas',
  'Comida Rápida',
];

const RegistroCliente = () => {
  const navigation = useNavigation();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [textModal, setTextModal] = useState('Continuar');
  const [imageUri, setImageUri] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagenGoogle, setImagenGoogle] = useState(null);

  const { user, logout } = useAuth();

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
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
    if (user) {
      setValue('uid_cliente', user.uid);
      setValue('mail', user.email);
    }
  }, [setValue, user]);

  const onSubmit = async (data) => {
    const firestore = getFirestore(firebaseApp);
    const userDocRef = doc(firestore, 'usuarios', user.uid);

    let imagenFinal = null;

    if (imageUri) {
        imagenFinal = await CargaDeImagenPerfil(imageUri);  
    } else if (imagenGoogle) {  
        imagenFinal = imagenGoogle;  
    }

    const formData = {
      ...data,
      fecha_nacimiento: formatDate(data.fecha_nacimiento),
      foto_perfil: imagenFinal,
    };

    console.log("userInfo: ", userInfo);
    console.log('Cliente:', formData);

    try {
      await postCliente(formData);

      await updateDoc(userDocRef, {
        perfilCompleto: true,
      });

      setModalMessage('Perfil cargado, ya puede utilizar Bites');
      setModalVisible(true);
      setIsProfileLoaded(true);
    } catch (error) {
      console.error('Error al cargar perfil o actualizar Firestore:', error);
      setModalMessage('Error al cargar perfil, inténtelo de nuevo más tarde');
      setModalVisible(true);
      setIsProfileLoaded(false);
    }
  };

  const cerrarModal = () => {
    if (isProfileLoaded) {
      setModalVisible(false);
      navigation.navigate('InterfazCliente');
    } else {
      setTextModal('Intentar nuevamente');
      setModalVisible(false);
    }
  };

  useEffect(() => {
    getLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
      } else {
        console.log("Usuario no autenticado");
      }
    });
    return () => unsub();
  }, []);

  const getLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (e) {
      console.log(e, "Error al obtener usuario local");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      const fullName = userInfo.displayName || "";
      const nameParts = fullName.split(" ");

      const firstName = nameParts.length > 0 ? nameParts[0] : "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      setValue("nombre", firstName);
      setValue("apellido", lastName);
      setValue("telefono", userInfo.phoneNumber || "");
      setImagenGoogle(userInfo.photoURL);
    }
  }, [userInfo, setValue]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>¡Completa tu Perfil!</Text>

          <SelectorImagenPerfil initialImage={userInfo ? userInfo.photoURL : null} onImageSelected={setImageUri} />

          <View style={styles.section}>
            <Text style={styles.label}>Nombre</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="Juan"
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
              placeholder="Pérez"
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
              placeholder="Calle 123, Ciudad"
              placeholderTextColor="#888"
              name="domicilio"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Número de Teléfono</Text>
            <FormInputController
              control={control}
              style={styles.input}
              placeholder="555-1234567"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              name="telefono"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Preferencias Alimentarias</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategories.includes(category) &&
                    styles.selectedCategory,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity onPress={() => setShowTermsModal(true)}>
              <Text style={styles.termsText}>Leer Términos y Condiciones</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View
                style={[
                  styles.checkbox,
                  termsAccepted && styles.checkedCheckbox,
                ]}
              />
              <Text style={styles.checkboxText}>
                He leído y acepto los términos y condiciones
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              !termsAccepted && styles.disabledButton,
            ]}
            onPress={termsAccepted ? handleSubmit(onSubmit) : null}
            disabled={!termsAccepted}
          >
            <Text style={styles.submitButtonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cerrarSesionButtom}
            onPress={async () => {
              try {
                await logout();
                navigation.navigate('Login');
                console.log('Sesión cerrada');
              } catch (error) {
                console.error('No se pudo cerrar sesión:', error);
              }
            }}
          >
            <Text style={styles.cerrarSesionButtonText}>
              Cerrar Sesión, completar perfil más tarde
            </Text>
          </TouchableOpacity>
        </View>

        <ClientTermsModal
          visible={showTermsModal}
          onClose={() => setShowTermsModal(false)}
        />
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
            <BotonGenerico title={textModal} onPress={cerrarModal} />
          </View>
        </View>
      </Modal>
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
    color: '#333',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
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
    textAlign: 'center',
    color: '#333',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 5,
    marginTop: 2,
  },
});

export default RegistroCliente;
