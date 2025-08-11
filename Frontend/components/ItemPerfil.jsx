import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const ItemPerfil = ({ title, icon, onPress, color, direccion }) => {
  if (color === undefined) {
    color = '#333';
  }

  if (direccion === undefined) {
    direccion = true;
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <Feather name={icon} size={20} color={color} style={styles.icon} />
        <Text style={[styles.text, { color: color }]}>{title}</Text>
        {direccion &&
          <Feather name="chevron-right" size={20} color="black" style={styles.arrow} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    color: '#333',
  },
});

export default ItemPerfil;
