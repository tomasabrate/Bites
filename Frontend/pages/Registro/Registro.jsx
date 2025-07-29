import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import firebaseApp from "../../firebase_config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import BotonVolverSimple from "../../components/BotonVolverSimple";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const Registro = ({ navigation }) => {
  const [rol, setRol] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tipo = [{ value: "Cliente" }, { value: "Comercio" }];

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("Cuenta creada");
        const docuRef = doc(firestore, `usuarios/${userCredential.user.uid}`);
        await setDoc(docuRef, {
          email: email,
          rol: rol,
          perfilCompleto: false,
          activo: true,
        }); // guarda el mail y rol
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <BotonVolverSimple styles={{ paddingTop: 15, alignSelf: 'flex-start' }} />
        <Text style={styles.title}>Inicio de Sesion</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label1}>Elija uno de los siguientes roles: </Text>
        <Text style={styles.label}></Text>
        <Text style={styles.label}>Cliente: Si deseas comprar productos o servicios.</Text>
        <Text style={styles.label}>Comercio: Si eres un vendedor y quieres ofrecer productos o servicios.</Text>
        <View style={styles.options}>
          <TouchableOpacity style={[styles.option, rol === "Comercio" && styles.selected]} onPress={() => setRol("Cliente")}>
            <Text style={[styles.submitButtonText, rol === "Cliente" && styles.textSelected]}>Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.option, rol === "Cliente" && styles.selected]} onPress={() => setRol("Comercio")}>
            <Text style={[styles.submitButtonText, rol === "Comercio" && styles.textSelected]}>Comercio</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton]}
          onPress={handleCreateAccount}
        >
          <Text style={styles.submitButtonText}>Registrarse</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  label1: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
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
  options:
  {
    flexDirection: 'row',
    justifyContent: "center",
    padding: 16,
    gap: 10,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 5,
    backgroundColor: '#ff6347',
    borderColor: '#ff6347',
    paddingVertical: 15
  },
  selected: { backgroundColor: '#ccc', borderColor: '#ccc' },
  textSelected: {
    fontSize: 18,
    color: 'white',
    fontWeight: "bold",
  },
});

export default Registro;
