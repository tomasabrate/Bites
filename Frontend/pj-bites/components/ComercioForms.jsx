import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import TermsModal from '../components/TermsModal'; // Asegúrate de importar el modal

const categories = ['Restaurante', 'Panadería', 'Supermercado', 'Otros'];

const ComercioForm = ({ onSubmit }) => {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [deliveryAreas, setDeliveryAreas] = useState('');
  const [deliveryCost, setDeliveryCost] = useState('');
  const [paymentMethods, setPaymentMethods] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = () => {
    if (!businessName || !category.length || !description || !address || !email || !phone) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    const formData = {
      businessName,
      category,
      description,
      address,
      email,
      phone,
      openingHours,
      deliveryAreas,
      deliveryCost,
      paymentMethods,
      termsAccepted,
    };

    onSubmit(formData);
    Alert.alert('Registro Completado', JSON.stringify(formData));

    resetForm();
  };

  const resetForm = () => {
    setBusinessName('');
    setCategory([]);
    setDescription('');
    setAddress('');
    setEmail('');
    setPhone('');
    setOpeningHours('');
    setDeliveryAreas('');
    setDeliveryCost('');
    setPaymentMethods('');
    setTermsAccepted(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Comercio</Text>

        {/* Nombre del Comercio */}
        <Text style={styles.label}>Nombre del Comercio</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Mi Tienda"
          value={businessName}
          onChangeText={setBusinessName}
        />

        {/* Categoría del Comercio */}
        <Text style={styles.label}>Categoría del Comercio</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category.includes(cat) && styles.selectedCategory,
              ]}
              onPress={() => handleCategorySelect(cat)}
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Descripción del Comercio */}
        <Text style={styles.label}>Descripción del Comercio</Text>
        <TextInput
          style={styles.input}
          placeholder="Describe tu negocio..."
          value={description}
          onChangeText={setDescription}
        />

        {/* Dirección */}
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Calle 123, Ciudad"
          value={address}
          onChangeText={setAddress}
        />

        {/* Email */}
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. correo@dominio.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Teléfono */}
        <Text style={styles.label}>Número de Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 555-1234567"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* Horarios de Apertura */}
        <Text style={styles.label}>Horarios de Apertura</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 9:00 AM - 9:00 PM"
          value={openingHours}
          onChangeText={setOpeningHours}
        />

        {/* Zonas de Entrega */}
        <Text style={styles.label}>Zonas de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Ciudad, Zonas específicas"
          value={deliveryAreas}
          onChangeText={setDeliveryAreas}
        />

        {/* Costo de Entrega */}
        <Text style={styles.label}>Costo de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. $5.00"
          value={deliveryCost}
          onChangeText={setDeliveryCost}
        />

        {/* Métodos de Pago */}
        <Text style={styles.label}>Métodos de Pago Aceptados</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Tarjeta, Efectivo, Transferencia"
          value={paymentMethods}
          onChangeText={setPaymentMethods}
        />

        {/* Términos y Condiciones */}
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setShowTermsModal(true)}>
            <Text style={styles.termsText}>Leer Términos y Condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setTermsAccepted(!termsAccepted)} // Cambia el estado al hacer clic
          >
            <View style={[styles.checkbox, termsAccepted && styles.checkedCheckbox]} />
            <Text style={styles.checkboxText}>He leído y acepto los términos y condiciones</Text>
          </TouchableOpacity>
        </View>

        {/* Botón para Crear Cuenta */}
        <TouchableOpacity
          style={[styles.submitButton, !termsAccepted && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!termsAccepted}
        >
          <Text style={styles.submitButtonText}>Crear Cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de términos y condiciones */}
      <TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Asegúrate de que esto esté correcto
    marginTop: 20,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
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
  termsContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  termsText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#4caf50', // Color cuando está seleccionado
  },
  checkboxText: {
    marginLeft: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ComercioForm;
