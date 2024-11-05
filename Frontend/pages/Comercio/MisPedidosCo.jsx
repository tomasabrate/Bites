import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const MisPedidosCo = ({ navigation }) => {
  const [pedidos, setPedidos] = useState([]);
  const [codigo, setCodigo] = useState(""); // Estado para almacenar el código ingresado

  useEffect(() => {
    // Simulación de fetch
    const fetchedPedidos = [
      { id: 1, estado: "pendiente de entrega" },
      { id: 2, estado: "pedido retirado" },
      { id: 3, estado: "pedido entregado" },
    ];
    setPedidos(fetchedPedidos);
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pedido retirado":
        return "#4caf50";
      case "pedido entregado":
        return "#ff6347";
      case "pendiente de entrega":
        return "#ffcc00"; // Color que pega más con tu app
      default:
        return "#ccc";
    }
  };

  const getIconoEstado = (estado) => {
    switch (estado) {
      case "pendiente de entrega":
        return <Icon name="hourglass-empty" size={20} color="#ffcc00" />;
      case "pedido retirado":
        return <Icon name="done" size={20} color="#4caf50" />;
      case "pedido entregado":
        return <Icon name="lock" size={20} color="#ff6347" />;
      default:
        return <Icon name="help-outline" size={20} color="#ccc" />;
    }
  };

  const marcarComoEntregado = (id) => {
    // Lógica para marcar como entregado con el código ingresado
    if (!codigo) {
      Alert.alert("Error", "Por favor ingresa el código.");
      return;
    }
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.id === id ? { ...pedido, estado: "pedido entregado" } : pedido
      )
    );
    Alert.alert("Éxito", `El pedido ${id} ha sido marcado como entregado.`);
    setCodigo(""); // Limpiar el código después de marcar
  };

  const confirmarCambioEstado = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas pasar este pedido a estado 'pedido retirado'?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            setPedidos((prevPedidos) =>
              prevPedidos.map((pedido) =>
                pedido.id === id
                  ? { ...pedido, estado: "pedido retirado" }
                  : pedido
              )
            );
            Alert.alert(
              "Éxito",
              `El pedido ${id} ha sido pasado a estado 'pedido retirado'.`
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pedido}>
            <Text>Pedido ID: {item.id}</Text>
            <View style={styles.estadoContainer}>
              {getIconoEstado(item.estado)}
              <Text
                style={[
                  styles.estadoText,
                  { backgroundColor: getEstadoColor(item.estado) },
                ]}
              >
                {item.estado}
              </Text>
            </View>
            {item.estado === "pedido retirado" ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa el código"
                  value={codigo}
                  onChangeText={setCodigo}
                />
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => marcarComoEntregado(item.id)}
                >
                  <Text style={styles.botonTexto}>Marcar como Entregado</Text>
                </TouchableOpacity>
              </View>
            ) : item.estado === "pendiente de entrega" ? (
              <TouchableOpacity
                style={styles.boton}
                onPress={() => confirmarCambioEstado(item.id)}
              >
                <Text style={styles.botonTexto}>Pasar a Pedido Retirado</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      />
      <View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6347",
    marginBottom: 20,
  },
  pedido: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
    flexDirection: "column",
  },
  estadoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  estadoText: {
    marginLeft: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  boton: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
  },
  botonTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: 120,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
  inputContainer: {
    marginTop: 10,
    flexDirection: "column",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default MisPedidosCo;
