import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getVentaById } from '../../../services/ventas';

const DetalleVenta = () => {
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { ventaId } = route.params;

  useEffect(() => {
    const fetchVentaDetails = async () => {
      try {
        const ventaData = await getVentaById(ventaId);
        setVenta(ventaData);
      } catch (error) {
        console.error('Error fetching venta details:', error);
        // You might want to show an error message to the user here
      } finally {
        setLoading(false);
      }
    };

    fetchVentaDetails();
  }, [ventaId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  if (!venta) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudo cargar los detalles de la venta.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Venta</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información General</Text>
            <Text style={styles.infoText}>Venta #{venta.id_venta}</Text>
            <Text style={styles.infoText}>Fecha: {new Date(venta.fecha_venta).toLocaleString()}</Text>
            <Text style={styles.infoText}>Total: ${venta.total}</Text>
            <Text style={styles.infoText}>Método de Pago: {venta.metodo_pago}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalles del Cliente</Text>
            <Text style={styles.infoText}>ID Cliente: {venta.uid_cliente}</Text>
            {/* Add more customer details if available */}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos</Text>
            {venta.productos && venta.productos.map((producto, index) => (
              <View key={index} style={styles.productoItem}>
                <Text style={styles.productoNombre}>{producto.nombre}</Text>
                <Text style={styles.productoCantidad}>Cantidad: {producto.cantidad}</Text>
                <Text style={styles.productoPrecio}>
                  Precio: ${typeof producto.precio === 'number' ? producto.precio.toFixed(2) : 'N/A'}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff6347',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ff6347',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff6347',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  productoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productoCantidad: {
    fontSize: 14,
    color: '#555',
  },
  productoPrecio: {
    fontSize: 14,
    color: '#4CAF50',
  },
});

export default DetalleVenta;