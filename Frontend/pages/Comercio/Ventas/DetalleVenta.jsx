import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDetallesByIdVenta } from '../../../services/detallesVenta';

const DetalleVenta = () => {
  const [ventaCompleta, setVentaCompleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { ventaId, venta } = route.params;

  useEffect(() => {
    const fetchVentaDetails = async () => {
      try {
        console.log(ventaId)
        const data = await getDetallesByIdVenta(ventaId);
        console.log(data);
        setVentaCompleta(data);
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

  if (!ventaCompleta) {
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
            <Text style={styles.infoText}>Venta #{ventaId}</Text>
            <Text style={styles.infoText}>Fecha: {new Date(venta.fecha_venta).toLocaleString()}</Text>
            <Text style={styles.infoText}>Total: ${venta.total}</Text>
            <Text style={styles.infoText}>Método de Pago: {venta.metodo_pago}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.infoText}>ID Cliente: {venta.uid_cliente}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos</Text>
            {ventaCompleta.detalles.map((detalle, index) => (
              <View key={index} style={styles.productoItem}>
                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre}>{detalle.nombre_producto}</Text>
                  <Text style={styles.productoCantidad}>Cantidad: {detalle.cantidad}</Text>
                  <Text style={styles.productoPrecio}>
                    Precio unitario: ${detalle.precio_unitario}
                  </Text>
                  <Text style={styles.productoSubtotal}>
                    Subtotal: ${detalle.subtotal}
                  </Text>
                </View>
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
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  productoImagen: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productoInfo: {
    flex: 1,
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
  productoSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
  },
});

export default DetalleVenta;