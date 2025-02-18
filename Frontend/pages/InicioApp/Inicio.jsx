import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';


export default function Inicio({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6347',
  },
  zorritoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
});
