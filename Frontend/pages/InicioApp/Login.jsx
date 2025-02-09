import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Button
} from "react-native";
import { validate as validateEmail } from 'email-validator';
import { createTheme, TextField } from '@mui/material';
import CustomModal from "../../components/CustomModal";
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path } from 'react-native-svg';
import Divider from 'react-native-divider';
import LoadingScreen from "../../components/LoadingScreen";
import { useAuth } from '../../context/AuthContext';
import useLogout from "../../utils/logout";

WebBrowser.maybeCompleteAuthSession();

import firebaseApp from "../../firebase_config";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const theme = createTheme({
  palette: {
    customGris: {
      main: '#ded8cd',
      contrastText: '#fff',
    },
  },
});

const Login = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = useLogout();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "450223259168-tsl71mm95565km09onfvn7fe0r01o48n.apps.googleusercontent.com",
    androidClientId: "450223259168-rfhmemkmk1k8sppunio88bl2l2rqqqv6.apps.googleusercontent.com",
    scopes: ["profile", "email"],
    responseType: "id_token"
  })

  useEffect(() => {
    handleGoogleSignIn();
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

      } catch (error) {
        console.error("Error en la autenticación con Google:", error);
      }
    }
  };

  useEffect(() => {
    getLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem("@user", JSON.stringify(user));
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
        await verificarCuentaFirestore(user);
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

  const verificarCuentaFirestore = async (user) => {
    if (!user) return;

    try {
      setLoading(true);
      const docuRef = doc(firestore, `usuarios/${user.uid}`);
      const docSnap = await getDoc(docuRef);

      if (!docSnap.exists()) {
        navigation.navigate("RegistroGoogle", { userInfo: user });
      } else {
        console.log("Usuario ya existe en Firestore, no se crea otro documento");
      }
    } catch (error) {
      console.error("Error al obtener cuenta de Firestore:", error);
    }finally {
      setLoading(false);
    }
  };



  //---

  const handleSingIn = () => {
    if (!validateEmail(email)) {
      setError(true);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Sesion iniciada");
        setIsAuthenticated(true); // cambia el estado para indicar que el usuario se autentico
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        showModal();
      });
  };

  const handleChangeMail = (event) => {
    setEmail(event.target.value);
    setError(false); // Reset error on change
  };

  const handleChangePass = (event) => {
    setPassword(event.target.value);
    setError(false); // Reset error on change
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Elige como quieres ingresar sesión</Text>

        <TextField
          id="email-field"
          label="Correo electrónico"
          variant="outlined"
          color="customGris"
          value={email}
          onChange={handleChangeMail}
          error={error} // Cambia el estado visual a error si es true
          helperText={error ? "Por favor ingresa un correo válido" : ""}
          fullWidth
          sx={{
            marginBottom: 2,
          }}
        />

        <TextField
          id="password-field"
          label="Contraseña"
          type="password"
          variant="outlined"
          color="customGris"
          value={password}
          onChange={handleChangePass}
          fullWidth
        />

        <TouchableOpacity style={[styles.submitButton]} onPress={handleSingIn}>
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
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
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
});

export default Login;
