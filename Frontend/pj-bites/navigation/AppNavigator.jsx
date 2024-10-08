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
      <Stack.Screen name="LoginSelection" component={LoginSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ClienteProfile" component={ClienteProfile} />
      <Stack.Screen name="ComercioProfile" component={ComercioProfile} />
      <Stack.Screen name="Perfil" component={Perfil} />
      <Stack.Screen
        name="Locales"
        component={Locales} // Agrega esta línea
      />
    </Stack.Navigator>
  );
}
