import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
import Reseña from '../screens/reseña_denuncia/Review'; // Asegúrate de ajustar la ruta
import Denuncia from '../screens/reseña_denuncia/Denuncia'; // Asegúrate de ajustar la ruta

const pedidosEnCurso = [
  { id: '1', nombre: 'Producto A', estado: 'En proceso' },
  { id: '2', nombre: 'Producto B', estado: 'En proceso' },
];

const pedidosRealizados = [
  { id: '3', nombre: 'Producto C', estado: 'Entregado' },
  { id: '4', nombre: 'Producto D', estado: 'Entregado' },
];

const MisPedidos = () => {
  const [modalResenaVisible, setModalResenaVisible] = useState(false);
  const [modalDenunciaVisible, setModalDenunciaVisible] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null); // Estado para el pedido seleccionado

  const handleResenaSubmit = (data) => {
    console.log('Reseña enviada:', data);
    setModalResenaVisible(false);
    Alert.alert('Gracias', 'Tu reseña ha sido enviada.');
  };

  const handleDenunciaSubmit = (data) => {
    console.log('Denuncia enviada:', data);
    setModalDenunciaVisible(false);
    Alert.alert('Gracias', 'Tu denuncia ha sido enviada.');
  };

  const renderPedidoEnCurso = ({ item }) => (
    <View style={styles.pedidoContainer}>
      <Text style={styles.pedidoTexto}>{item.nombre} - {item.estado}</Text>
    </View>
  );

  const renderPedidoRealizado = ({ item }) => (
    <View style={styles.pedidoContainer}>
      <Text style={styles.pedidoTexto}>{item.nombre} - {item.estado}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setPedidoSeleccionado(item);
          setModalResenaVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Dejar Reseña</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setPedidoSeleccionado(item);
          setModalDenunciaVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Realizar Denuncia</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Pedidos</Text>

      <Text style={styles.subtitulo}>Pedidos en Curso</Text>
      <FlatList
        data={pedidosEnCurso}
        renderItem={renderPedidoEnCurso}
        keyExtractor={item => item.id}
      />

      <Text style={styles.subtitulo}>Pedidos Realizados</Text>
      <FlatList
        data={pedidosRealizados}
        renderItem={renderPedidoRealizado}
        keyExtractor={item => item.id}
      />

      {/* Modal de Reseña */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalResenaVisible}
        onRequestClose={() => setModalResenaVisible(false)}
      >
        <Reseña onSubmit={handleResenaSubmit} onCancel={() => setModalResenaVisible(false)} />
      </Modal>

      {/* Modal de Denuncia */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalDenunciaVisible}
        onRequestClose={() => setModalDenunciaVisible(false)}
      >
        <Denuncia onSubmit={handleDenunciaSubmit} onCancel={() => setModalDenunciaVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffeae6', // Fondo salmón claro
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff4500", // Color rojo
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ff6f61", // Color salmón
    marginTop: 20,
    marginBottom: 10,
  },
  pedidoContainer: {
    backgroundColor: '#ffffff', // Fondo blanco
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, // Para Android
  },
  pedidoTexto: {
    fontSize: 18,
    color: "#333", // Color gris oscuro
  },
  button: {
    backgroundColor: '#ffcccb', // Color salmón claro
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Color del texto
  },
});

export default MisPedidos;
