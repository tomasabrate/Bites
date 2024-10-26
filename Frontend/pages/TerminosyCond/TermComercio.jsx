// components/TermsModal.js
import React from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView } from 'react-native';

const TermsModal = ({ visible, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Términos y Condiciones</Text>
          <ScrollView>
            <Text style={styles.termsText}>
              Bienvenido a Bites. Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones:
            </Text>

            <Text style={styles.sectionTitle}>1. Aceptación de Términos</Text>
            <Text style={styles.termsText}>
              Al registrarte y utilizar nuestros servicios, aceptas cumplir con estos términos y condiciones.
            </Text>

            <Text style={styles.sectionTitle}>2. Registro de Comercio</Text>
            <Text style={styles.termsText}>
              Para registrarte como comercio, debes proporcionar información veraz y actualizada. Eres responsable de mantener la confidencialidad de tu información de acceso.
            </Text>

            <Text style={styles.sectionTitle}>3. Responsabilidad</Text>
            <Text style={styles.termsText}>
              Bites no se hace responsable por la calidad de los productos ofrecidos por los comercios ni por la entrega de los mismos.
            </Text>

            <Text style={styles.sectionTitle}>4. Cumplimiento Legal</Text>
            <Text style={styles.termsText}>
              Los comercios deben cumplir con todas las leyes y regulaciones aplicables en Argentina, incluyendo pero no limitándose a las leyes de protección al consumidor, comercio electrónico y derechos de autor.
            </Text>

            <Text style={styles.sectionTitle}>5. Modificaciones</Text>
            <Text style={styles.termsText}>
              Bites se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor al ser publicadas en la plataforma.
            </Text>

            <Text style={styles.sectionTitle}>6. Aceptación de Términos</Text>
            <Text style={styles.termsText}>
              Al aceptar estos términos y condiciones, confirmas que has leído y comprendido la información presentada.
            </Text>

            <Text style={styles.legalText}>
              Estos términos son parte integral del acuerdo entre Bites y el comercio. Para más información, consulta la legislación argentina correspondiente.
            </Text>
          </ScrollView>

          <Button title="Aceptar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  termsText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#ff6347',
  },
  legalText: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default TermsModal;
