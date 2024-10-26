import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de tener esta librería instalada

const FloatingButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Icon name="add" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF6347',
    borderRadius: 50,
    height: 56,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
});

export default FloatingButton;
