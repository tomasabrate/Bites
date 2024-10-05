import React, { useState } from 'react';
import { View, Image, FlatList, TouchableOpacity, StyleSheet, Text } from 'react-native';

// Importa tus imágenes de zorritos
const zorritos = [
  require('../assets/zorritos/zorrito1.jpg'),
  require('../assets/zorritos/zorrito2.jpg'),
  require('../assets/zorritos/zorrito3.jpg'),
  // Agrega más zorritos según sea necesario
];

const ZorritoSelector = ({ onSelect }) => {
  const [selectedZorrito, setSelectedZorrito] = useState(null);

  const handleSelect = (zorrito) => {
    setSelectedZorrito(zorrito);
    onSelect(zorrito); // Llama a la función onSelect con el zorrito seleccionado
  };

  const renderZorritoItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Image
        source={item}
        style={[
          styles.zorritoImage,
          selectedZorrito === item && styles.selectedImage,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona tu zorrito:</Text>
      <FlatList
        data={zorritos}
        renderItem={renderZorritoItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  flatListContainer: {
    paddingHorizontal: 10, // Espaciado horizontal
  },
  zorritoImage: {
    width: 100,
    height: 100,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent', // Sin borde por defecto
  },
  selectedImage: {
    borderColor: 'blue', // Color del borde para la imagen seleccionada
  },
});

export default ZorritoSelector;
