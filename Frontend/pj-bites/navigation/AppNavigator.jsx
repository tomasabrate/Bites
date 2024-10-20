import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import IntroScreen from "../screens/IntroScreen";
import LoginSelectionScreen from "../screens/LoginSelectionScreen";
import LoginScreen from "../screens/LoginScreen";
import ClienteProfile from "../screens/ClienteProfile";
import ComercioProfile from "../screens/ComercioProfile";
import Perfil from "../screens/Perfil";
import Productos from "../screens/Productos";
import Locales from "../screens/LocalesScreen"; // Asegúrate de importar la nueva pantalla
import CargarProducto from "../screens/CargarProducto";
import InterfazCliente from "../screens/InterfazCliente";
import Mapa from "../screens/MapaScreen"; 
import DetalleProducto from "../screens/DetalleProducto"; // Importa el componente
import DetalleProductoCliente from "../screens/compra/DetalleProductoCliente";
import InterfazComerciante from "../screens/InterfazComerciante"; // Importa la nueva pantalla
import MisPedidos from '../screens/MisPedidos'; // Asegúrate de importar tu componente


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Productos" component={Productos} />
      <Stack.Screen name="DetalleProducto" component={DetalleProducto} />
      <Stack.Screen name="DetalleProductoCliente" component={DetalleProductoCliente} /> 
      <Stack.Screen name="CargarProducto" component={CargarProducto} />
      <Stack.Screen name="LoginSelection" component={LoginSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClienteProfile" component={ClienteProfile} />
      <Stack.Screen name="ComercioProfile" component={ComercioProfile} />
      <Stack.Screen name="InterfazComerciante" component={InterfazComerciante} />
      <Stack.Screen
        name="InterfazCliente"
        component={InterfazCliente}
        options={{ headerShown: false }} // Oculta el encabezado para esta pantalla
      />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen name="Mis Pedidos" component={MisPedidos} />
      <Stack.Screen name="Locales" component={Locales} />
      <Stack.Screen name="Mapa" component={Mapa} options={{ headerShown: false }} /> 
    </Stack.Navigator>
  );
}
