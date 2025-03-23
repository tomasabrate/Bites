import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function ComprobandoPago() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        //llamamos al backend para verificar el estado del pago
        const response = await fetch(`${API_URL_BACK}/pagos/:${payment_id}`);
        const result = await response.json();

        if (result.status === 'aprobado') {
          Alert.alert('Pago aprobado', 'El pago fue aprobado correctamente');
          navigation.navigate('MisCompras'); // Navega a la pantalla de pago aprobado

        }//Si el pago está pendiente, se vuelve a verificar después de 2 segundos
        else if (result.status === 'pendiente') {
          setTimeout(async () => {
            try {
              const response = await fetch(`${API_URL_BACK}/pagos/:${payment_id}`);
              const result = await response.json();
              if (result.status === 'aprobado') {
                navigation.navigate('PagoAprobado'); // Navega a la pantalla de pago aprobado
              } else {
                navigation.navigate('PagoRechazado'); // Navega a la pantalla de pago rechazado
              }
            } catch (error) {
              console.error('Error checking payment status on retry:', error);
              navigation.navigate('PagoRechazado'); // Navega a la pantalla de pago rechazado en caso de error
            }
          }, 2000);

        }
        else {
          navigation.navigate('PagoRechazado'); // Navega a la pantalla de pago rechazado
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Reintenta después de 2 segundos por si falla la primera vez
      }
    };

    const timer = setTimeout(checkPaymentStatus, 2500);

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Comprobando el pago...</Text>
      <ActivityIndicator size="large" color="#ff6347" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});