import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet, Button } from "react-native";

const CustomModal = ({ visible, onClose, errorMessage }) => {
    // Usamos Animated para mover el modal desde la parte superior
    const [animation] = useState(new Animated.Value(-300)); // Valor inicial fuera de la pantalla
  
    // Iniciar la animación cuando el modal se muestra
    useEffect(() => {
        if (visible) {
          // Animar desde arriba a la posición original
          Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: true, // Usar el driver nativo para mejor rendimiento
          }).start();
    
          // Cerrar el modal automáticamente después de 2 segundos
          const timeout = setTimeout(() => {
            onClose(); // Cerrar el modal después de 2 segundos
          }, 2500);
    
          // Limpiar el timeout cuando el componente se desmonte o el modal cambie a invisible
          return () => clearTimeout(timeout);
        } else {
          // Si se cierra el modal, lo movemos fuera de la pantalla
          Animated.spring(animation, {
            toValue: -300,
            useNativeDriver: true,
          }).start();
        }
      }, [visible]);
  
    return (
      <Modal transparent={true} visible={visible} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: animation }] }]}>
            <Text style={styles.modalText}>{errorMessage}</Text>
          </Animated.View>
        </View>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-start", // Para alinear el modal desde la parte superior
      alignItems: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      backgroundColor: "#aa0e0e",
      padding: 10,
      borderRadius: 5,
      width: "50%",
      marginTop: 150, // Ajusta la posición inicial para que no toque el borde superior
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 0,
      textAlign: "center",
      color: "white",
    },
    closeButton: {
      backgroundColor: "#ff6347",
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
  });
  
  export default CustomModal;