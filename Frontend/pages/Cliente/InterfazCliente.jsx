import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, useWindowDimensions } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar
} from "react-native";
import MenuDesplegable from "../../pages/Cliente/MenuDesplegable";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useRoute } from "@react-navigation/native";
import InicioCliente from "./InicioCliente";
import Mapa from "./Mapa";
import MisCompras from "./MisCompras";
import Carrito from "./Cart";

const InterfazCliente = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [menuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Inicio');

  useEffect(() => {
    if (route.params?.initialScreen) {
      setCurrentScreen(route.params.initialScreen);
    }
  }, [route.params?.initialScreen]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingBottom: isDesktop ? 0 : 60 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Icon name="bars" size={24} color="#FF6347" />
        </TouchableOpacity>
        
        {isDesktop && (
          <View style={styles.desktopNav}>
            <TouchableOpacity style={styles.desktopNavButton} onPress={() => setCurrentScreen("Inicio")}>
              <Icon name="home" size={20} color="#FF6347" />
              <Text style={[styles.desktopNavText, currentScreen === 'Inicio' && styles.activeNavText]}>Inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopNavButton} onPress={() => setCurrentScreen("Maps")}>
              <Icon name="map-marker" size={20} color="#FF6347" />
              <Text style={[styles.desktopNavText, currentScreen === 'Maps' && styles.activeNavText]}>Mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopNavButton} onPress={() => setCurrentScreen("MisCompras")}>
              <Icon name="list" size={20} color="#FF6347" />
              <Text style={[styles.desktopNavText, currentScreen === 'MisCompras' && styles.activeNavText]}>Pedidos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.desktopNavButton} onPress={() => setCurrentScreen("Carrito")}>
              <Icon name="shopping-cart" size={20} color="#FF6347" />
              <Text style={[styles.desktopNavText, currentScreen === 'Carrito' && styles.activeNavText]}>Carrito</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ width: 40 }} /> 
      </View>

      {menuVisible && <MenuDesplegable />}

      <View style={styles.content}>
        {currentScreen === 'Inicio' ? (
          <InicioCliente />
        ) : currentScreen === 'Maps' ? (
          <Mapa />
        ) : currentScreen === 'MisCompras' ? (
          <MisCompras />
        ) : currentScreen === 'Carrito' ? (
          <Carrito />
        ) : null}
      </View>

      {!isDesktop && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setCurrentScreen("Inicio")}
          >
            <Icon name="home" size={24} color={currentScreen === 'Inicio' ? "#E53E3E" : "#FF6347"} />
            <Text style={[styles.footerButtonText, currentScreen === 'Inicio' && styles.activeFooterText]}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setCurrentScreen("Maps")}
          >
            <Icon name="map-marker" size={24} color={currentScreen === 'Maps' ? "#E53E3E" : "#FF6347"} />
            <Text style={[styles.footerButtonText, currentScreen === 'Maps' && styles.activeFooterText]}>Mapa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setCurrentScreen("MisCompras")}
          >
            <Icon name="list" size={24} color={currentScreen === 'MisCompras' ? "#E53E3E" : "#FF6347"} />
            <Text style={[styles.footerButtonText, currentScreen === 'MisCompras' && styles.activeFooterText]}>Pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => setCurrentScreen("Carrito")}
          >
            <Icon name="shopping-cart" size={24} color={currentScreen === 'Carrito' ? "#E53E3E" : "#FF6347"} />
            <Text style={[styles.footerButtonText, currentScreen === 'Carrito' && styles.activeFooterText]}>Carrito</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
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
    backgroundColor: "#FFFFFF",
  },
  menuButton: {
    padding: 8,
  },
  desktopNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  desktopNavButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  desktopNavText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
  activeNavText: {
    color: "#E53E3E",
    fontWeight: "bold",
  },
  cartButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: "#666666",
  },
  activeFooterText: {
    color: "#E53E3E",
    fontWeight: "bold",
  },
});

export default InterfazCliente;