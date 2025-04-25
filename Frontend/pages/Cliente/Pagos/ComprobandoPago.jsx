import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL_BACK } from "../../../services/api_back";

export default function ComprobandoPago() {
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extraer parámetros del deep link
  const { payment_id, status, collection_id, preference_id, merchant_order_id } = route.params || {};

  console.log('Parámetros recibidos en ComprobandoPago:', route.params);

  useEffect(() => {
    // Si no hay payment_id, intentamos usar collection_id o merchant_order_id
    const paymentIdentifier = payment_id || collection_id || merchant_order_id || preference_id;

    if (!paymentIdentifier) {
      setError('No se recibió identificador de pago');
      Alert.alert(
        'Error',
        'No se pudo identificar el pago. Por favor, contacta a soporte.',
        [{ text: 'OK', onPress: () => navigation.navigate('InterfazCliente') }]
      );
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        console.log(`Verificando pago con ID: ${paymentIdentifier}`);

        // Llamamos al backend para verificar el estado del pago
        const response = await fetch(`${API_URL_BACK}/pagos/${paymentIdentifier}`);

        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const result = await response.json();
        console.log('Resultado de verificación:', result);

        // Normalizar el estado para manejar diferentes formatos
        const paymentStatus = result.status?.toLowerCase() || 'desconocido';

        if (paymentStatus === 'aprobado' || paymentStatus === 'approved') {
          Alert.alert(
            'Pago aprobado',
            'El pago fue aprobado correctamente',
            [{ text: 'OK', onPress: () => navigation.navigate('MisCompras') }]
          );
        }
        else if (paymentStatus === 'pendiente' || paymentStatus === 'pending' || paymentStatus === 'in_process') {
          // Reintentamos después de 2 segundos para pagos pendientes
          setTimeout(async () => {
            try {
              const retryResponse = await fetch(`${API_URL_BACK}/pagos/${paymentIdentifier}`);

              if (!retryResponse.ok) {
                throw new Error(`Error en la respuesta: ${retryResponse.status}`);
              }

              const retryResult = await retryResponse.json();
              const retryStatus = retryResult.status?.toLowerCase() || 'desconocido';

              if (retryStatus === 'aprobado' || retryStatus === 'approved') {
                Alert.alert(
                  'Pago aprobado',
                  'El pago fue aprobado correctamente',
                  [{ text: 'OK', onPress: () => navigation.navigate('MisCompras') }]
                );
              } else {
                Alert.alert(
                  'Pago en proceso',
                  'Tu pago está siendo procesado. Podrás ver el estado en tu historial de compras.',
                  [{ text: 'OK', onPress: () => navigation.navigate('InterfazCliente') }]
                );
              }
            } catch (retryError) {
              console.error('Error al reintentar verificación:', retryError);
              Alert.alert(
                'Error de verificación',
                'No pudimos verificar el estado de tu pago. Por favor, revisa tu historial de compras más tarde.',
                [{ text: 'OK', onPress: () => navigation.navigate('InterfazCliente') }]
              );
            } finally {
              setIsLoading(false);
            }
          }, 2000);
        }
        else {
          // Para pagos rechazados o con otro estado
          Alert.alert(
            'Pago no completado',
            'El pago no pudo ser completado. Por favor, intenta nuevamente.',
            [{ text: 'OK', onPress: () => navigation.navigate('InterfazCliente') }]
          );
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error al verificar estado del pago:', error);
        setError(error.message);

        // Si hay un error en la verificación, mostramos un mensaje y redirigimos
        Alert.alert(
          'Error de verificación',
          'Hubo un problema al verificar tu pago. Por favor, contacta a soporte.',
          [{ text: 'OK', onPress: () => navigation.navigate('InterfazCliente') }]
        );
        setIsLoading(false);
      }
    };

    // Pequeño retraso antes de verificar para asegurar que el backend esté actualizado
    const timer = setTimeout(checkPaymentStatus, 1500);

    return () => clearTimeout(timer);
  }, [payment_id, collection_id, preference_id, merchant_order_id, status]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Procesando tu pago</Text>
      <Text style={styles.text}>Estamos verificando el estado de tu transacción...</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#ff6347" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
      <Text style={styles.infoText}>
        No cierres esta pantalla. Serás redirigido automáticamente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginVertical: 20,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    marginTop: 20,
    textAlign: "center",
  },
});