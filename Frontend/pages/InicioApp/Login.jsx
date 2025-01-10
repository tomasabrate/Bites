import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { validate as validateEmail } from 'email-validator';
import { createTheme, ThemeProvider, TextField } from '@mui/material';
import CustomModal from "../../components/CustomModal";

import firebaseApp from "../../firebase_config";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true); // Estado de carga
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Temporizador de carga de 1 segundo
    const timer = setTimeout(() => {
      setLoading(false); // Cambia el estado después de 1 segundo
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  const getRol = async (uid) => {
    try {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);

      if (docuCifrada.exists()) {
        return docuCifrada.data().rol;
      } else {
        console.warn("Documento no encontrado");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener rol:", error.message);
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
        console.warn("Documento no encontrado para el usuario", uid);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener si el perfil esta completo", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      if (userCredential) {
        const rol = await getRol(userCredential.uid);
        const perfilCompleto = await getPerfilCompleto(userCredential.uid);
        console.log("Perfil completo: " + perfilCompleto);

        if (rol) {
          // Solo continúa si `rol` no es nulo
          const userData = {
            uid: userCredential.uid,
            email: userCredential.email,
            rol: rol,
            perfilCompleto: perfilCompleto,
          };
          setUser(userData);
          console.log("Info Usuario Final: ", userData);

          // Redirige basado en el rol del usuario
          if (userData.perfilCompleto == true) {
            if (userData.rol === "Admin") {
              navigation.navigate("LoginSelection");
            } else if (userData.rol === "Cliente") {
              navigation.navigate("InterfazCliente");
            } else if (userData.rol === "Comercio") {
              navigation.navigate("InterfazComerciante");
            }
          } else {
            if (userData.rol === "Cliente") {
              navigation.navigate("RegistroCliente");
            } else if (userData.rol === "Comercio") {
              navigation.navigate("RegistroComercio");
            }
          }
        } else {
          console.warn("El rol o perfil no está definido para el usuario.");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("Cuenta creada");
        const docuRef = doc(firestore, `usuarios/${userCredential.user.uid}`);
        await setDoc(docuRef, { email: email, rol: rol }); // guarda el mail y rol
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  if (loading) {
    // Pantalla de carga
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Inicio de Sesion</Text>

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
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe8e3", // Fondo mientras carga
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
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
    marginTop: 16,
    fontSize: 16,
  },
});

export default Login;
