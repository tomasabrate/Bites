import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreenComponent from '../components/SplashScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginSelectionScreen from '../screens/LoginSelectionScreen';
import ClienteLogin from '../screens/ClienteLogin'; // Crea este componente para el inicio de sesión de clientes
import ComercioLogin from '../screens/ComercioLogin'; // Crea este componente para el inicio de sesión de comercios
import TabNavigator from './TabNavigator'; // Nuestro TabNavigator principal

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen name="SplashScreen" component={SplashScreenComponent} options={{ headerShown: false }} />
      <Stack.Screen name="IntroScreen" component={IntroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginSelection" component={LoginSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClienteLogin" component={ClienteLogin} options={{ title: 'Inicio de Sesión Cliente' }} />
      <Stack.Screen name="ComercioLogin" component={ComercioLogin} options={{ title: 'Inicio de Sesión Comercio' }} />
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
