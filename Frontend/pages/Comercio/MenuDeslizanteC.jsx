import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MenuDesplegable({ setPaginaActual }) {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => setPaginaActual("Dashboard")}>
        <Text style={styles.menuItem}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setPaginaActual("Reportes")}>
        <Text style={styles.menuItem}>Reportes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setPaginaActual("MisPedidosCo")}>
        <Text style={styles.menuItem}>Mis Pedidos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: 50,
    left: 10, // Cambiado de right a left
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5, // Para Android
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
    color: "#FF6347",
  },
});
