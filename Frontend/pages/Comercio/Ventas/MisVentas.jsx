import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { getVentasByComercio } from "../../../services/ventas";
import { useAuth } from "../../../context/AuthContext";

const MisVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { user } = useAuth();

  const fetchVentas = useCallback(async () => {
    if (!user || !user.uid) {
      Alert.alert("Error", "No se pudo identificar al usuario.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const ventasData = await getVentasByComercio(user.uid);
      const sortedVentas = ventasData.sort(
        (a, b) => new Date(b.fecha_venta) - new Date(a.fecha_venta)
      );
      setVentas(sortedVentas);
    } catch (error) {
      console.error("Error fetching ventas:", error);
      Alert.alert(
        "Error",
        "No se pudieron cargar las ventas. Por favor, intente de nuevo."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVentas();
  }, [fetchVentas]);

  const renderVentaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ventaItem}
      onPress={() =>
        navigation.navigate("DetalleVenta", {
          ventaId: item.id_venta,
          venta: item,
        })
      }
    >
      <View style={styles.ventaHeader}>
        <Text style={styles.ventaId}>Venta #{item.id_venta}</Text>
        <Text
          style={[
            styles.estadoCompra,
            {
              color:
                item.estado === "CANCELADO"
                  ? "#dc2626"
                  : item.estado === "EN CURSO"
                  ? "#FFA500"
                  : "#4CAF50",
            },
          ]}
        >
          ({item.estado})
        </Text>
        <Text style={styles.ventaFecha}>
          {new Date(item.fecha_venta).toLocaleString()}
        </Text>
      </View>
      <View style={styles.ventaBody}>
        <Text style={styles.ventaTotal}>Total: ${item.total}</Text>
        <Text style={styles.ventaMetodoPago}>
          Método de pago: {item.metodo_pago}
        </Text>
      </View>
      <Icon
        name="chevron-right"
        size={24}
        color="#888"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mis Ventas</Text>
        </View>

        {ventas.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="inbox" size={50} color="#888" />
            <Text style={styles.emptyStateText}>No hay ventas realizadas</Text>
          </View>
        ) : (
          <FlatList
            data={ventas}
            renderItem={renderVentaItem}
            keyExtractor={(item) => item.id_venta.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ff6347",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#ff6347",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 18,
    color: "#888",
  },
  ventaItem: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ventaHeader: {
    flex: 1,
  },
  ventaId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ventaFecha: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  ventaBody: {
    flex: 1,
    alignItems: "flex-end",
  },
  ventaTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  ventaMetodoPago: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  chevron: {
    marginLeft: 8,
  },
});

export default MisVentas;
