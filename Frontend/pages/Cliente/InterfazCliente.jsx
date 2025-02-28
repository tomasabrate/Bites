import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  FlatList
} from "react-native";
import Carrusel from "../../pages/Cliente/Carrusel";
import MenuDesplegable from "../../pages/Cliente/MenuDesplegable";
import Productos from "../Productos/Productos";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const InterfazCliente = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Función para renderizar los componentes dentro del FlatList
  const renderItem = ({ item }) => {
    if (item.type === 'carrusel') {
      return <Carrusel />;
    } else if (item.type === 'productos') {
      return <Productos />;
    }
    return null;
  };

  // Datos para renderizar el FlatList
  const data = [
    { type: 'carrusel' },
    { type: 'productos' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Icon name="bars" size={24} color="#FF6347" />
        </TouchableOpacity>
        <Text style={styles.title}></Text>
      </View>

      {menuVisible && <MenuDesplegable />}

      {/* Utilizamos FlatList para manejar el scroll y ambos componentes */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.footer}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.navigate("Mapa")}
            >
              <Icon name="map-marker" size={24} color="#FF6347" />
              <Text style={styles.footerButtonText}>Mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.navigate("MisCompras")}
            >
              <Icon name="list" size={24} color="#FF6347" />
              <Text style={styles.footerButtonText}>Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => navigation.navigate("Carrito")}
            >
              <Icon name="shopping-cart" size={24} color="#FF6347" />
              <Text style={styles.footerButtonText}>Carrito</Text>
            </TouchableOpacity>
          </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  menuButton: {
    padding: 8,
  },
  cartButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666666",
  },
});

export default InterfazCliente;
