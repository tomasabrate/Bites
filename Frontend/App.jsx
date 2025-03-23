import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext';
import TabNavigator from './navigation/TabNavigator';
import { StatusBar } from 'react-native';
import 'react-native-reanimated';


import { Buffer } from 'buffer';
global.Buffer = Buffer;

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
          <TabNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}
