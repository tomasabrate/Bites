import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal } from 'react-native';
import firebaseApp from "../../firebase_config";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import BotonGenerico from "../../components/BotonGenerico";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
import { useAuth } from '../../context/AuthContext';

export default function SplashScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [textModal, setTextModal] = useState("")
  const [modalVisible, setModalVisible] = useState(false);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
  // widht min: 820

  const { logout } = useAuth();

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
          const userData = {
            uid: userCredential.uid,
            email: userCredential.email,
            rol: rol,
            perfilCompleto: perfilCompleto,
          };
          setUser(userData);

          if (screenWidth < 820 && rol === "Admin") {
            setTextModal("Lo sentimos. El dispositivo no es compatible para el rol de administrador. Pruebe con otro dispositivo con mayor resolución.");
            setModalVisible(true);
            return;
          }

          if (userData.perfilCompleto == true) {
            if (userData.rol === "Admin") {
              navigation.navigate("InterfazAdministrador");
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
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null && !isAuthenticated) {
      const timer = setTimeout(() => {
        navigation.navigate("IntroScreen");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const cerrarModal = () => {
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bites</Text>
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
                title="Cerrar sesion"
                onPress={async () => {
                  try {
                    await logout();
                    cerrarModal();
                    navigation.navigate("Login");
                    console.log("Sesión de administrador cerrada");
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6347',
  },
  zorritoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
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
  }
});
