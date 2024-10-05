import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ZorritoSelector from './zorritoSelector'; // Asegúrate de ajustar la ruta

const categories = ['Postres', 'Comida Saludable', 'Bebidas', 'Viandas', 'Comida Rápida'];

const ZorritoForm = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedZorrito, setSelectedZorrito] = useState(null); // Estado para el zorrito seleccionado

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = () => {
    // Validación de campos
    if (!fullName || !email || !phoneNumber || !address || !selectedZorrito) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const formData = {
      fullName,
      email,
      phoneNumber,
      address,
      birthDate: birthDate.toLocaleDateString(),
      preferences: selectedCategories,
      profilePicture: selectedZorrito, // Añade el zorrito seleccionado al formulario
    };
    
    onSubmit(formData);
    Alert.alert('Formulario Enviado', JSON.stringify(formData));
    
    // Reiniciar el formulario
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setAddress('');
    setSelectedCategories([]);
    setSelectedZorrito(null); // Reiniciar la imagen seleccionada
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || birthDate;
      setBirthDate(currentDate);
    }
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Completa tu Perfil!</Text>

      <ZorritoSelector onSelect={setSelectedZorrito} /> {/* Componente ZorritoSelector */}

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Juan Pérez"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. correo@dominio.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Número de Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 555-1234567"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Text style={styles.label}>Domicilio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Calle 123, Ciudad"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Fecha de Nacimiento</Text>
      <TouchableOpacity style={styles.input} onPress={showDatePickerModal}>
        <Text style={styles.dateText}>{birthDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      <Text style={styles.label}>Preferencias Alimentarias</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category) && styles.selectedCategory,
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    minHeight: 600,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 50,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
    width: '45%',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#ff6347',
  },
  categoryText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ZorritoForm;
