import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useLogout from "../utils/logout";

export default function ModalCerrarSesion({ visible, onClose }) {
  const handleLogout = useLogout();

  const confirmLogout = () => {
    handleLogout(); // Cierra sesión y hace lo que ya tienes en useLogout
    onClose(); // Cierra el modal
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.text}>¿Seguro que quieres cerrar sesión?</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnConfirmar} onPress={confirmLogout}>
              <Text style={styles.btnText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnCancelar: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  btnConfirmar: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  btnText: {
    color: "white",
    textAlign: "center",
  },
});
