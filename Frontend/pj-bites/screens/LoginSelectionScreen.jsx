import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function LoginSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccione una Opción</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Inicio Developer"
          onPress={() => navigation.navigate("Productos")}
          color="#01a3ff" // Color azul para el botón
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Inicio Developer Cliente"
          onPress={() => navigation.navigate("InterfazCliente")} // Cambiado a InterfazCliente
          color="#01a3ff" // Color azul para el botón
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Sesión"
          onPress={() => navigation.navigate("Login", { isRegistering: false })}
          color="#FF6347" // Color rojo para el botón
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrarse como Cliente"
          onPress={() => navigation.navigate("Login", { isRegistering: true })}
          color="#FF6347" // Color rojo para el botón
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Registrar como Comercio"
          onPress={() => navigation.navigate("ComercioProfile")}
          color="#FF6347" // Color rojo para el botón
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff", // Fondo blanco
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6347", // Tono rojo
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10, // Espacio entre los botones
    width: "100%", // Ocupa todo el ancho disponible
    borderRadius: 5,
    overflow: "hidden", // Para bordes redondeados
    elevation: 3, // Sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
