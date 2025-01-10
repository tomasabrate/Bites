import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import firebaseApp from "../../firebase_config";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export default function SplashScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
            }
          } else {
            console.warn("El rol o perfil no está definido para el usuario.");
          }
        } else {
          setUser(null);
          const timer = setTimeout(() => {
            navigation.navigate('IntroScreen'); // Cambia 'Intro' al nombre de la pantalla a la que quieras navegar
          }, 1000); // 2000 ms = 2 segundos
      
          return () => clearTimeout(timer);
        }
      });
  
      return () => unsubscribe();
    }, [isAuthenticated]);

    

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bites</Text>
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
});
