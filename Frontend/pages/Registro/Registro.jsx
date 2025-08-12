import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";

import firebaseApp from "../../firebase_config";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import BotonVolver from "../../components/BotonVolver";
import { Feather } from '@expo/vector-icons';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const Registro = ({ navigation }) => {
  const [rol, setRol] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rolRegistrado, setRolRegistrado] = useState(null);

  const showModal = (message, type = "error") => {
    setModalMessage(message);
    setModalType(type);
    setModalVisible(true);
  };

  const handleCreateAccount = () => {
    if (!email || !password || !confirmPassword || !rol) {
      showModal("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Las contraseñas no coinciden.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("Cuenta creada");
        const docuRef = doc(firestore, `usuarios/${userCredential.user.uid}`);
        await setDoc(docuRef, {
          email: email,
          rol: rol,
          perfilCompleto: false,
          activo: true,
        });

        setRolRegistrado(rol); // guardamos el rol para usarlo después
        showModal(
          "Cuenta creada correctamente, completa los demás datos para usar Bites.",
          "success"
        );
      })
      .catch((error) => {
        console.log(error);
        showModal(error.message);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <BotonVolver styles={{ paddingTop: 15, alignSelf: 'flex-start' }} />
        <Text style={styles.title}>Registro</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@dominio.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Ingresa tu contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>
              {showPassword ? <Feather name={"eye-off"} size={20} color={"#878385"} /> : <Feather name={"eye"} size={20} color={"#878385"} />}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Repite tu contraseña"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text style={styles.showText}>
              {showConfirmPassword ? <Feather name={"eye-off"} size={20} color={"#878385"} /> : <Feather name={"eye"} size={20} color={"#878385"} />}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Elija uno de los siguientes roles: </Text>

        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.option, rol === "Cliente" && styles.selected]}
            onPress={() => setRol("Cliente")}
          >
            <Text style={[styles.submitButtonText, rol === "Cliente" && styles.textSelected]}>Cliente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, rol === "Comercio" && styles.selected]}
            onPress={() => setRol("Comercio")}
          >
            <Text style={[styles.submitButtonText, rol === "Comercio" && styles.textSelected]}>Comercio</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label1}>Cliente: Si deseas comprar productos o servicios.</Text>
        <Text style={styles.label1}>Comercio: Si eres un vendedor y quieres ofrecer productos o servicios.</Text>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.submitButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            modalType === "success" ? styles.modalSuccess : styles.modalError
          ]}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (modalType === "success") {
                  if (rolRegistrado === "Comercio") {
                    navigation.navigate("RegistroComercio");
                  } else {
                    navigation.navigate("RegistroCliente");
                  }
                }
              }}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    color: "#949494",
    marginBottom: 15,
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
  options: {
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
  selected: { backgroundColor: '#ff6347', borderColor: '#FFBF47', borderWidth: 5 },
  textSelected: {
    fontSize: 18,
    color: 'white',
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalError: {
    backgroundColor: "#ffe8e3",
  },
  modalSuccess: {
    backgroundColor: "white",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  modalButton: {
    backgroundColor: "#ff6347",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10
  },
  inputPassword: {
    flex: 1,
    height: 50,
    fontSize: 16
  },
  showText: {
    fontSize: 18,
    paddingHorizontal: 10
  }

});

export default Registro;
