import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Modal,
  Platform
} from "react-native";
import { validate as validateEmail } from 'email-validator';
import CustomModal from "../../components/CustomModal";
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from 'react-native-svg';
import Divider from 'react-native-divider';
import LoadingScreen from "../../components/LoadingScreen";
import useLogout from "../../utils/logout";
import BotonGenerico from '../../components/BotonGenerico';
import Inicio from "../InicioApp/Inicio";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

import firebaseApp from "../../firebase_config";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  browserLocalPersistence,
  setPersistence,
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
const firestore = getFirestore(firebaseApp);

let auth;
if (Platform.OS !== 'web') {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(firebaseApp);
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log("Persistencia activada en web");
    })
    .catch((error) => {
      console.error("Error con la persistencia en web:", error);
    });
}

const Login = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showInicio, setShowInicio] = useState(true);

  const handleLogout = useLogout();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
  // widht min: 820

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "450223259168-tsl71mm95565km09onfvn7fe0r01o48n.apps.googleusercontent.com",
    androidClientId: "450223259168-iec5tvfuilstub7o2kqt4ta5mrqer1gl.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    responseType: "id_token"
  })

  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleSignIn();
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    if (response?.type === "success") {
      try {
        const { id_token } = response.params;

        if (!id_token) {
          console.error("Error: No se recibió id_token");
          return;
        }

        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        console.log("Usuario autenticado con Google:", user);

        await verificarCuentaFirestore(user);
        await redirigirSegunRol(user);
      } catch (error) {
        console.error("Error en la autenticación con Google:", error);
      }
    }
  };

  useEffect(() => {
    const iniciarSesion = async () => {
      try {
        // timepo de Inicio
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Obtiene usuario local de AsyncStorage
        const userJSON = await AsyncStorage.getItem("@user");
        const localUser = userJSON ? JSON.parse(userJSON) : null;

        if (localUser) {
          console.log("Usuario recuperado desde AsyncStorage:", localUser);
          setUser(localUser);
          await verificarCuentaFirestore(localUser);
          await redirigirSegunRol(localUser);
          return;
        }

        // Verifica autenticación con Firebase, si no hay usuario local
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            console.log("Usuario autenticado en Firebase:", firebaseUser);
            await AsyncStorage.setItem("@user", JSON.stringify(firebaseUser));
            setUser(firebaseUser);
            await verificarCuentaFirestore(firebaseUser);
            await redirigirSegunRol(firebaseUser);
          } else {
            console.log("No hay sesión iniciada");
            setShowInicio(false);
          }
        });

        // Si no se redirige en 5 seg mostrar Login
        setTimeout(() => {
          setShowInicio(false);
          unsubscribe();
        }, 5000);
      } catch (error) {
        console.error("Error en la autenticación automática:", error);
        setShowInicio(false);
      }
    };

    iniciarSesion();
  }, []);


  const redirigirSegunRol = async (user) => {
    try {
      const rol = await getRol(user.uid);
      const perfilCompleto = await getPerfilCompleto(user.uid);
      const activo = await getActivo(user.uid);

      if (!activo) {
        setTextModal(
          "Lo sentimos, la cuenta ha sido desactivada. Contacte con soporte para más información. Correo: bitesgrupo1@gmail.com"
        );
        setModalVisible(true);
        return setShowInicio(false);
      }

      if (screenWidth < 820 && rol === "Admin") {
        setTextModal(
          "Lo sentimos, el dispositivo no es compatible para el rol de administrador. Pruebe con otro dispositivo con mayor resolución."
        );
        setModalVisible(true);
        return setShowInicio(false);
      }

      if (perfilCompleto) {
        if (rol === "Admin") {
          navigation.navigate("InterfazAdministrador");
        } else if (rol === "Cliente") {
          navigation.navigate("InterfazCliente");
        } else if (rol === "Comercio") {
          navigation.navigate("InterfazComerciante");
        }
      } else {
        if (rol === "Cliente") {
          navigation.navigate("RegistroCliente");
        } else if (rol === "Comercio") {
          navigation.navigate("RegistroComercio");
        }
      }
    } catch (error) {
      console.error("Error al redirigir según el rol:", error);
    } finally {
      setTimeout(() => setShowInicio(false), 1000);
    }
  };

  const getRol = async (uid) => {
    try {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);

      if (docuCifrada.exists()) {
        return docuCifrada.data().rol;
      } else {
        console.warn('Documento no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener rol:', error.message);
      return null;
    }
  };

  const getPerfilCompleto = async (uid) => {
    try {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);

      if (docuCifrada.exists()) {
        return docuCifrada.data().perfilCompleto;
      } else {
        console.warn('Documento no encontrado para el usuario', uid);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener si el perfil esta completo', error);
      return null;
    }
  };

  const getActivo = async (uid) => {
    try {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);

      if (docuCifrada.exists()) {
        return docuCifrada.data().activo;
      } else {
        console.warn('Documento no encontrado');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener estado activo:', error.message);
      return null;
    }
  };

  const verificarCuentaFirestore = async (user) => {
    if (!user) return;

    try {
      const docuRef = doc(firestore, `usuarios/${user.uid}`);
      const docSnap = await getDoc(docuRef);

      if (!docSnap.exists()) {
        navigation.navigate("RegistroGoogle", { userInfo: user });
      } else {
        console.log("Usuario ya existe en Firestore, no se crea otro documento");
      }
    } catch (error) {
      console.error("Error al obtener cuenta de Firestore:", error);
    }
  };


  //Sign in con email

  const handleSignIn = async () => {
    if (!validateEmail(email)) {
      setError(true);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sesión iniciada");

      const user = userCredential.user;
      setUser(user);

      await AsyncStorage.setItem("@user", JSON.stringify(user));
      await verificarCuentaFirestore(user);
      await redirigirSegunRol(user);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      showModal();
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  if (showInicio) {
    return (
      <Inicio />
    );
  }

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Elige como quieres ingresar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError(false); // Reinicia el error si se modifica el texto
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError(false);
          }}
        />


        <TouchableOpacity style={[styles.submitButton]} onPress={handleSignIn}>
          <Text style={styles.submitButtonText}>Iniciar Sesion</Text>
        </TouchableOpacity>

        <Divider borderColor="#ccc" orientation="center">
          <Text style={{ color: '#555' }}>O</Text>
        </Divider>


        <TouchableOpacity style={styles.button} disabled={!request} onPress={() => { promptAsync(); }}>
          <View style={styles.iconContainer}>
            <Svg width={24} height={24} viewBox="0 0 48 48">
              <Path fill="#EA4335" d="M24 9.5c3.2 0 6 1.1 8.2 3.2l6.1-6.1C34.3 3 29.5 1 24 1 14.8 1 7 6.8 3.5 14.5l7.5 5.8C13.2 14 18.2 9.5 24 9.5z" />
              <Path fill="#34A853" d="M46.5 24.6c0-1.5-.1-2.9-.4-4.3H24v8.1h12.8c-.6 3.4-2.4 6.3-5.1 8.1l7.5 5.8c4.4-4.1 7.3-10.1 7.3-17.7z" />
              <Path fill="#4A90E2" d="M10.8 28.9c-1.1-3.2-1.1-6.6 0-9.7L3.3 14C.3 19.4.3 25.6 3.3 31l7.5-5.8z" />
              <Path fill="#FBBC05" d="M24 47c6.5 0 11.8-2.1 15.7-5.7l-7.5-5.8c-2.2 1.5-5 2.3-8.2 2.3-5.8 0-10.8-3.8-12.7-9.1L3.5 31C7 38.8 14.8 47 24 47z" />
            </Svg>
          </View>
          <Text style={styles.text}>Continuar con Google</Text>
        </TouchableOpacity>


        <Text style={styles.PreLinkText}>¿No tienes una cuenta?</Text>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Registro")}
        >
          Regístrate como Cliente o Comercio
        </Text>
        <CustomModal visible={isModalVisible} onClose={hideModal} errorMessage="El correo o la contraseña son incorrectos." />
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTexto}>{textModal}</Text>
              <View style={styles.modalBotones}>
                <BotonGenerico
                  title="Salir"
                  onPress={async () => {
                    try {
                      cerrarModal();
                      handleLogout();
                    } catch (error) {
                      console.error('No se pudo cerrar sesión:', error);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe8e3",
  },
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    marginTop: 20,
    maxWidth: 500,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 25,
  },
  picker: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  PreLinkText: {
    color: "#333",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
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
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});

export default Login;
