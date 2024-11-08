import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

export default function LoginSelectionScreen() {
  const navigation = useNavigation();
  // Referencias para las animaciones
  const scale = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.95, // Escalar hacia abajo
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1, // Regresar al tamaño original
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateTo = (screen, params) => {
    animateButton();
    navigation.navigate(screen, params);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ventana de Administracion y Pruebas</Text>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("InterfazComerciante")}
        >
          <Text style={styles.buttonText}>Inicio Developer Comercio</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("InterfazCliente")}
        >
          <Text style={styles.buttonText}>Inicio Developer Cliente</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("Login")} // Asegúrate de que "Login" sea el nombre correcto
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("ZorritoForm")} // Cambiado a "cliente"
        >
          <Text style={styles.buttonText}>Registrarse como Cliente</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("ComercioProfile")}
        >
          <Text style={styles.buttonText}>Registrar como Comercio</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("ComercioLayout")}
        >
          <Text style={styles.buttonText}>Interfaz Admin</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9", // Fondo gris suave
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#333",
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FF6347",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: "100%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
